"""
Centralized configuration. Everything is loaded from environment variables
(see ../../.env.example at the repo root). Nothing here should be hardcoded
secrets — the settings object just reads and validates what's in the env.
"""
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BACKEND_DIR / "static"
UPLOADS_DIR = STATIC_DIR / "uploads"
OUTPUTS_DIR = STATIC_DIR / "outputs"
TMP_DIR = STATIC_DIR / "tmp"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Core ---
    SECRET_KEY: str = "dev-insecure-secret-change-me"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/manweta_clipper"
    APP_URL: str = "http://127.0.0.1:5000"
    FRONTEND_URL: str = "http://localhost:3000"
    COOKIE_SECURE: bool = False
    COOKIE_DOMAIN: str | None = None
    MAX_UPLOAD_MB: int = 500

    # --- OpenAI ---
    OPENAI_API_KEY: str = ""
    WHISPER_MODEL: str = "whisper-1"
    HIGHLIGHT_MODEL: str = "gpt-4o-mini"

    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://127.0.0.1:5000/auth/google/callback"

    # --- Auth session ---
    JWT_ALGORITHM: str = "HS256"
    SESSION_TTL_DAYS: int = 30
    SESSION_COOKIE_NAME: str = "manweta_session"

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_MB * 1024 * 1024


settings = Settings()

for d in (UPLOADS_DIR, OUTPUTS_DIR, TMP_DIR):
    d.mkdir(parents=True, exist_ok=True)
