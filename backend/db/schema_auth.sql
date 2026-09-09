-- Reference only: the FastAPI app auto-creates these tables at startup via
-- SQLAlchemy's Base.metadata.create_all() (see app/main.py). This file exists
-- so the schema is easy to read/diff, and as a starting point if you switch
-- to Alembic migrations later. Running it by hand is optional.

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(48) PRIMARY KEY,
    email           VARCHAR(320) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL DEFAULT '',
    profile_image   TEXT,
    plan            VARCHAR(20) NOT NULL DEFAULT 'starter',
    credits_remaining INTEGER NOT NULL DEFAULT 100,
    credits_total   INTEGER NOT NULL DEFAULT 100,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_identities (
    id                  VARCHAR(48) PRIMARY KEY,
    user_id             VARCHAR(48) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider            VARCHAR(30) NOT NULL,
    provider_user_id    VARCHAR(255) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_identities_user_id ON auth_identities(user_id);

CREATE TABLE IF NOT EXISTS sessions (
    id          VARCHAR(48) PRIMARY KEY,
    user_id     VARCHAR(48) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
