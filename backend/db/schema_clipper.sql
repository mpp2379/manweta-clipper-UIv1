-- Reference only: see note at the top of schema_auth.sql.

CREATE TABLE IF NOT EXISTS jobs (
    id                      VARCHAR(48) PRIMARY KEY,
    user_id                 VARCHAR(48) NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title                   VARCHAR(255) NOT NULL DEFAULT 'Untitled clip',
    source_type             VARCHAR(20) NOT NULL DEFAULT 'upload',
    source_url              TEXT,
    source_file_name        VARCHAR(500),
    source_file_path        TEXT,

    file_size_mb            DOUBLE PRECISION NOT NULL DEFAULT 0,
    duration_seconds        DOUBLE PRECISION NOT NULL DEFAULT 0,
    resolution              VARCHAR(20),
    fps                     DOUBLE PRECISION,
    thumbnail_url           TEXT NOT NULL DEFAULT '',

    status                  VARCHAR(30) NOT NULL DEFAULT 'queued',
    current_step            INTEGER NOT NULL DEFAULT 1,
    progress_percent        INTEGER NOT NULL DEFAULT 0,
    error_message           TEXT,

    transcript_text         TEXT,
    words                   JSONB,
    highlights              JSONB,
    selected_highlight_id   VARCHAR(64),
    custom_clip_range       JSONB,
    style_config            JSONB,

    rendered_video_path     TEXT,
    rendered_video_url      TEXT,
    download_url            TEXT,

    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at            TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);

CREATE TABLE IF NOT EXISTS job_logs (
    id          VARCHAR(48) PRIMARY KEY,
    job_id      VARCHAR(48) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    service     VARCHAR(60) NOT NULL DEFAULT 'pipeline',
    level       VARCHAR(10) NOT NULL DEFAULT 'info',
    message     TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON job_logs(job_id);
