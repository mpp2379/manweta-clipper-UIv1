from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from . import models
from .config import settings
from .database import get_db
from .security import decode_access_token


def get_current_session_row(request: Request, db: Session = Depends(get_db)) -> models.UserSession | None:
    token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        return None

    session_row = db.get(models.UserSession, payload.get("sid"))
    if not session_row or session_row.revoked_at is not None:
        return None
    if session_row.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return None
    return session_row


def get_optional_user(
    session_row: models.UserSession | None = Depends(get_current_session_row),
    db: Session = Depends(get_db),
) -> models.User | None:
    if session_row is None:
        return None
    return db.get(models.User, session_row.user_id)


def get_current_user(user: models.User | None = Depends(get_optional_user)) -> models.User:
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user
