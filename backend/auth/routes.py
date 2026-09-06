import os
import re
import secrets
from typing import Optional, Tuple
from urllib.parse import quote

import jwt
import requests
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from auth.service import (
    add_identity,
    create_access_token,
    create_otp,
    create_session,
    create_user,
    get_identity,
    get_user_by_email,
    get_user_by_id,
    get_user_by_phone,
    revoke_all_sessions,
    revoke_session,
    rotate_refresh_token,
    validate_session,
    verify_otp,
)

auth_router = APIRouter()

OTP_COOLDOWN = int(os.getenv("OTP_RESEND_SECONDS", "60"))
E164_RE = re.compile(r"^\+[1-9]\d{7,14}$")


def normalize_phone(phone):
    value = (phone or "").strip().replace(" ", "").replace("-", "")
    return value


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    secure = os.getenv("COOKIE_SECURE", "false").lower() == "true"
    samesite = os.getenv("COOKIE_SAMESITE", "Lax").lower()
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=int(os.getenv("JWT_ACCESS_MINUTES", "15")) * 60,
        path="/",
    )
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=secure,
        samesite=samesite,
        max_age=int(os.getenv("REFRESH_TOKEN_DAYS", "30")) * 86400,
        path="/auth",
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/auth")


def issue_session_response(user, session_id, refresh_token, status_code=200):
    access_token = create_access_token(user["id"], session_id)
    response = JSONResponse(
        {
            "message": "Authentication successful",
            "user": public_user(user),
            "session_id": session_id,
        },
        status_code=status_code,
    )
    set_auth_cookies(response, access_token, refresh_token)
    return response


def public_user(user):
    return {
        "id": str(user["id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "phone_number": user.get("phone_number"),
        "profile_image": user.get("profile_image"),
        "phone_verified": user.get("phone_verified", False),
        "email_verified": user.get("email_verified", False),
    }


def get_bearer_token(request: Request) -> Optional[str]:
    auth = request.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return request.cookies.get("access_token")


def get_current_identity(request: Request) -> Optional[Tuple[dict, str]]:
    token = get_bearer_token(request)
    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            os.environ["SECRET_KEY"],
            algorithms=["HS256"],
            options={"require": ["sub", "sid", "exp", "iat"]},
        )
        if payload.get("type") != "access":
            return None
        user_id = payload["sub"]
        session_id = payload["sid"]
        if not validate_session(session_id, user_id):
            return None
        user = get_user_by_id(user_id)
        if not user or not user["is_active"]:
            return None
        return user, session_id
    except (jwt.InvalidTokenError, ValueError, TypeError, KeyError):
        return None


def require_login(identity=Depends(get_current_identity)):
    """FastAPI dependency equivalent of the old @login_required decorator."""
    if not identity:
        raise HTTPException(status_code=401, detail="Authentication required")
    return identity


def send_sms(phone_number, otp):
    # Development mode lets you test the complete UI without an SMS vendor.
    if os.getenv("DEV_OTP_MODE", "true").lower() == "true":
        print(f"[DEV OTP] {phone_number}: {otp}", flush=True)
        return {"dev_otp": otp}

    sid = os.getenv("TWILIO_ACCOUNT_SID")
    token = os.getenv("TWILIO_AUTH_TOKEN")
    service = os.getenv("TWILIO_VERIFY_SERVICE_SID")
    if not all([sid, token, service]):
        raise RuntimeError(
            "Twilio Verify is not configured. Set TWILIO_ACCOUNT_SID, "
            "TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID."
        )

    response = requests.post(
        f"https://verify.twilio.com/v2/Services/{service}/Verifications",
        auth=(sid, token),
        data={"To": phone_number, "Channel": "sms"},
        timeout=20,
    )
    response.raise_for_status()
    return {"status": response.json().get("status")}


async def _parse_body(request: Request) -> dict:
    """Accepts JSON or form-encoded bodies, mirroring the old Flask handlers."""
    try:
        data = await request.json()
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    form = await request.form()
    return dict(form)


@auth_router.get("/login")
async def login_page():
    # The React SPA owns the login UI (AuthModal). We just bounce back to it.
    return RedirectResponse(url="/")


@auth_router.post("/auth/send-otp")
async def send_otp(request: Request):
    data = await _parse_body(request)
    phone = normalize_phone(data.get("phone"))
    if not E164_RE.match(phone):
        raise HTTPException(status_code=400, detail="Enter a valid phone number in E.164 format, e.g. +919876543210")

    otp = create_otp(phone)
    result = send_sms(phone, otp)
    payload = {"message": "OTP sent"}
    if os.getenv("DEV_OTP_MODE", "true").lower() == "true":
        payload["dev_otp"] = result["dev_otp"]
    return payload


@auth_router.post("/auth/verify-otp")
async def verify_otp_route(request: Request):
    data = await _parse_body(request)
    phone = normalize_phone(data.get("phone"))
    otp = (data.get("otp") or "").strip()

    if not E164_RE.match(phone) or not otp.isdigit():
        raise HTTPException(status_code=400, detail="Invalid phone number or OTP")

    ok, message = verify_otp(phone, otp)
    if not ok:
        raise HTTPException(status_code=401, detail=message)

    user = get_user_by_phone(phone)
    if not user:
        user = create_user(phone_number=phone)

    if not user["phone_verified"]:
        # create_user sets it true; existing unverified accounts are upgraded here.
        from auth.service import get_conn
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE users SET phone_verified = TRUE, updated_at = NOW() WHERE id = %s",
                    (user["id"],),
                )
        user = get_user_by_id(user["id"])

    session_id, refresh_token = create_session(
        user["id"],
        request.headers.get("User-Agent"),
        request.client.host if request.client else None,
    )
    return issue_session_response(user, session_id, refresh_token)


@auth_router.get("/auth/google")
async def google_login(request: Request):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Google OAuth is not configured",
                "configure": ".env GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET",
            },
        )

    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI") or str(request.url_for("google_callback"))
    scope = "openid email profile"
    state = secrets.token_urlsafe(32)
    # State is kept in a short-lived cookie for CSRF protection.
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={client_id}"
        "&response_type=code"
        f"&redirect_uri={quote(redirect_uri, safe='')}"
        f"&scope={quote(scope, safe='')}"
        "&access_type=offline"
        "&prompt=select_account"
        f"&state={state}"
    )
    response = RedirectResponse(url=auth_url)
    response.set_cookie(
        "oauth_state", state, httponly=True, secure=os.getenv("COOKIE_SECURE", "false").lower() == "true",
        samesite=os.getenv("COOKIE_SAMESITE", "Lax").lower(), max_age=600, path="/"
    )
    return response


@auth_router.get("/auth/google/callback", name="google_callback")
async def google_callback(request: Request):
    error = request.query_params.get("error")
    if error:
        return RedirectResponse(url=f"/login?error={quote(error)}")

    state = request.query_params.get("state")
    if not state or state != request.cookies.get("oauth_state"):
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing Google authorization code")

    client_id = os.environ["GOOGLE_CLIENT_ID"]
    client_secret = os.environ["GOOGLE_CLIENT_SECRET"]
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI") or str(request.url_for("google_callback"))

    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=20,
    )
    token_response.raise_for_status()
    tokens = token_response.json()

    info = id_token.verify_oauth2_token(
        tokens["id_token"],
        google_requests.Request(),
        client_id,
    )

    google_sub = info["sub"]
    email = info.get("email")
    name = info.get("name")
    picture = info.get("picture")

    user = get_identity("google", google_sub)
    if not user and email:
        user = get_user_by_email(email)

    if not user:
        user = create_user(name=name, email=email, profile_image=picture)

    add_identity(user["id"], "google", google_sub)

    if email:
        from auth.service import update_user_from_google
        update_user_from_google(user["id"], name, email, picture)
        user = get_user_by_id(user["id"])

    session_id, refresh_token = create_session(
        user["id"],
        request.headers.get("User-Agent"),
        request.client.host if request.client else None,
    )
    access_token = create_access_token(user["id"], session_id)
    frontend_url = os.getenv("FRONTEND_URL", "/")
    response = RedirectResponse(url=frontend_url)
    set_auth_cookies(response, access_token, refresh_token)
    response.delete_cookie("oauth_state", path="/")
    return response


@auth_router.post("/auth/refresh")
async def refresh(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    # Session ID is not trusted from the client; it is bound to the signed access
    # token while it is valid. For an expired access token, we need the sid claim
    # without accepting any unsigned user identity data.
    try:
        payload = jwt.decode(
            request.cookies.get("access_token", ""),
            os.environ["SECRET_KEY"],
            algorithms=["HS256"],
            options={"verify_exp": False, "require": ["sub", "sid", "iat"]},
        )
        session_id = payload["sid"]
        user_id = payload["sub"]
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Refresh requires the previous access token cookie")

    new_refresh = rotate_refresh_token(session_id, refresh_token)
    if not new_refresh:
        response = JSONResponse({"error": "Invalid or revoked refresh token"}, status_code=401)
        clear_auth_cookies(response)
        return response

    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token(user["id"], session_id)
    response = JSONResponse({"message": "Token refreshed", "user": public_user(user)})
    set_auth_cookies(response, new_access, new_refresh)
    return response


@auth_router.post("/auth/logout")
async def logout(identity=Depends(get_current_identity)):
    response = JSONResponse({"message": "Logged out"})
    if identity:
        _, session_id = identity
        revoke_session(session_id)
    clear_auth_cookies(response)
    return response


@auth_router.post("/auth/logout-all")
async def logout_all(identity=Depends(require_login)):
    user, _ = identity
    revoke_all_sessions(user["id"])
    response = JSONResponse({"message": "All sessions revoked"})
    clear_auth_cookies(response)
    return response


@auth_router.get("/auth/me")
async def me(identity=Depends(get_current_identity)):
    if not identity:
        return JSONResponse({"authenticated": False}, status_code=401)
    user, session_id = identity
    return {"authenticated": True, "user": public_user(user), "session_id": session_id}
