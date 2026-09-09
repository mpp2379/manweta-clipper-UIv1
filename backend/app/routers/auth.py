from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from .. import models
from ..config import settings
from ..database import get_db
from ..deps import get_current_session_row, get_optional_user
from ..schemas import AuthMeResponse, AuthUser
from ..security import clear_session_cookie, create_access_token, set_session_cookie

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google")
def google_login():
    """Redirect the browser into Google's OAuth consent screen."""
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "online",
        "prompt": "select_account",
    }
    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/google/callback")
def google_callback(code: str | None = None, error: str | None = None, db: Session = Depends(get_db)):
    if error or not code:
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/?auth_error=1")

    # 1. Exchange the authorization code for tokens.
    with httpx.Client(timeout=15) as client:
        token_resp = client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/?auth_error=1")
        access_token = token_resp.json().get("access_token")

        # 2. Fetch the Google profile.
        profile_resp = client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if profile_resp.status_code != 200:
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/?auth_error=1")
        profile = profile_resp.json()

    google_sub = profile.get("sub")
    email = profile.get("email")
    name = profile.get("name") or (email.split("@")[0] if email else "Studio Creator")
    picture = profile.get("picture")

    # 3. Upsert the user + linked identity.
    identity = (
        db.query(models.AuthIdentity)
        .filter_by(provider="google", provider_user_id=google_sub)
        .one_or_none()
    )
    if identity:
        user = identity.user
        user.name = name or user.name
        user.profile_image = picture or user.profile_image
    else:
        user = db.query(models.User).filter_by(email=email).one_or_none()
        if not user:
            user = models.User(email=email, name=name, profile_image=picture)
            db.add(user)
            db.flush()
        db.add(models.AuthIdentity(user_id=user.id, provider="google", provider_user_id=google_sub))

    # 4. Create a DB-backed session + signed JWT cookie.
    session_row = models.UserSession(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.SESSION_TTL_DAYS),
    )
    db.add(session_row)
    db.commit()
    db.refresh(session_row)

    token = create_access_token(user_id=user.id, session_id=session_row.id)
    redirect = RedirectResponse(url=settings.FRONTEND_URL)
    set_session_cookie(redirect, token)
    return redirect


@router.get("/me", response_model=AuthMeResponse)
def me(user: models.User | None = Depends(get_optional_user)):
    if not user:
        return AuthMeResponse(authenticated=False, user=None)
    return AuthMeResponse(
        authenticated=True,
        user=AuthUser(id=user.id, name=user.name, email=user.email, profile_image=user.profile_image),
    )


@router.post("/logout")
def logout(
    response: Response,
    session_row: models.UserSession | None = Depends(get_current_session_row),
    db: Session = Depends(get_db),
):
    if session_row is not None:
        session_row.revoked_at = datetime.now(timezone.utc)
        db.add(session_row)
        db.commit()
    clear_session_cookie(response)
    return {"authenticated": False}
