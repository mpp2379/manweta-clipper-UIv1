from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from . import models  # noqa: F401 - ensures models are registered on Base before create_all
from .config import OUTPUTS_DIR, settings
from .database import Base, engine
from .routers import auth, jobs

app = FastAPI(title="Manweta AI Clipper API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rendered clips are served straight off disk. In production, swap this for
# S3/Cloud Storage + signed URLs (see README §6, item 2) — this local mount
# only works for a single always-on instance.
app.mount("/media/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="media-outputs")

app.include_router(auth.router)
app.include_router(jobs.router)

# In production the Dockerfile builds the React app into ../dist and this
# backend serves it directly (same-origin, no CORS needed there). Mounted
# last so it never shadows the /auth, /api, or /media routes above.
_frontend_dist = Path(__file__).resolve().parent.parent.parent / "dist"
if _frontend_dist.is_dir():
    app.mount("/", StaticFiles(directory=str(_frontend_dist), html=True), name="frontend")


# Arbitrary but fixed lock key — just needs to be unique to this app so it
# never collides with another app's advisory lock on the same Postgres server.
_STARTUP_LOCK_KEY = 727271_001


@app.on_event("startup")
def on_startup() -> None:
    """
    MVP-friendly: create tables directly from the SQLAlchemy models rather
    than requiring a manual `psql -f schema.sql` step. Swap for Alembic
    migrations once the schema needs to evolve without data loss.

    Gunicorn boots multiple worker processes, and each one runs this startup
    hook — without coordination, two workers racing to CREATE TABLE at the
    same instant can throw a duplicate-key error on Postgres's internal
    catalog (pg_type). A Postgres advisory lock serializes them: the first
    worker creates the tables while holding the lock, the rest wait, then
    find the tables already exist and no-op.
    """
    if engine.dialect.name == "postgresql":
        with engine.connect() as conn:
            conn.execute(text("SELECT pg_advisory_lock(:key)"), {"key": _STARTUP_LOCK_KEY})
            try:
                Base.metadata.create_all(bind=conn)
                conn.commit()
            finally:
                conn.execute(text("SELECT pg_advisory_unlock(:key)"), {"key": _STARTUP_LOCK_KEY})
    else:
        # e.g. sqlite in local/test runs — single file, no cross-process race.
        Base.metadata.create_all(bind=engine)


@app.get("/healthz")
def healthz():
    return {"ok": True}