import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:24]}"


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Auth (users / sessions / OAuth identities)
# ---------------------------------------------------------------------------


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(48), primary_key=True, default=lambda: _id("usr"))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    profile_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    plan: Mapped[str] = mapped_column(String(20), nullable=False, default="starter")
    credits_remaining: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    credits_total: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    identities: Mapped[list["AuthIdentity"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    sessions: Mapped[list["UserSession"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    jobs: Mapped[list["Job"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class AuthIdentity(Base):
    """Links a third-party login (e.g. Google) to a local user."""

    __tablename__ = "auth_identities"

    id: Mapped[str] = mapped_column(String(48), primary_key=True, default=lambda: _id("ident"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(30), nullable=False)  # 'google'
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    user: Mapped["User"] = relationship(back_populates="identities")


class UserSession(Base):
    """A Postgres-backed session so JWTs can be revoked (logout / security)."""

    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String(48), primary_key=True, default=lambda: _id("ses"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="sessions")


# ---------------------------------------------------------------------------
# Clipper domain (jobs / logs)
# ---------------------------------------------------------------------------


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(48), primary_key=True, default=lambda: _id("job"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False, default="Untitled clip")
    source_type: Mapped[str] = mapped_column(String(20), nullable=False, default="upload")
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_file_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source_file_path: Mapped[str | None] = mapped_column(Text, nullable=True)

    file_size_mb: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    duration_seconds: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    resolution: Mapped[str | None] = mapped_column(String(20), nullable=True)
    fps: Mapped[float | None] = mapped_column(Float, nullable=True)
    thumbnail_url: Mapped[str] = mapped_column(Text, nullable=False, default="")

    status: Mapped[str] = mapped_column(String(30), nullable=False, default="queued")
    current_step: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    progress_percent: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    transcript_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    words: Mapped[list | None] = mapped_column(JSON, nullable=True)
    highlights: Mapped[list | None] = mapped_column(JSON, nullable=True)
    selected_highlight_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    custom_clip_range: Mapped[list | None] = mapped_column(JSON, nullable=True)
    style_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    rendered_video_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    rendered_video_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    download_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="jobs")
    logs: Mapped[list["JobLog"]] = relationship(back_populates="job", cascade="all, delete-orphan", order_by="JobLog.created_at")


class JobLog(Base):
    __tablename__ = "job_logs"

    id: Mapped[str] = mapped_column(String(48), primary_key=True, default=lambda: _id("log"))
    job_id: Mapped[str] = mapped_column(ForeignKey("jobs.id"), nullable=False, index=True)
    service: Mapped[str] = mapped_column(String(60), nullable=False, default="pipeline")
    level: Mapped[str] = mapped_column(String(10), nullable=False, default="info")  # info|success|warn|error
    message: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    job: Mapped["Job"] = relationship(back_populates="logs")
