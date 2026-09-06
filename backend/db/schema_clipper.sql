-- PostgreSQL schema for the Manweta AI Clipper domain.
-- Run this AFTER db/schema_auth.sql (it references auth.users).

CREATE SCHEMA IF NOT EXISTS clipper;

CREATE TABLE IF NOT EXISTS clipper.jobs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    source_type VARCHAR(20) NOT NULL DEFAULT 'upload', -- upload | youtube | vimeo | loom | sample
    source_url TEXT,
    source_filename TEXT,
    stored_path TEXT,                 -- path/key of the original uploaded video
    file_size_mb NUMERIC(10, 2),
    duration_seconds NUMERIC(10, 2),
    resolution VARCHAR(20),
    fps INTEGER,
    thumbnail_url TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'queued',
    -- queued | transcribing | analyzing | awaiting_selection | rendering | done | failed
    current_step INTEGER NOT NULL DEFAULT 1,
    progress_percent INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,

    transcript_text TEXT,
    words JSONB NOT NULL DEFAULT '[]'::jsonb,        -- word-level timestamps from Whisper
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,    -- highlight candidates from GPT analysis
    selected_highlight_id VARCHAR(64),
    custom_clip_range NUMERIC[2],

    style_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    rendered_path TEXT,
    render_duration_sec NUMERIC(10, 2),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_clipper_jobs_user_id
    ON clipper.jobs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS clipper.backend_logs (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES clipper.jobs(id) ON DELETE CASCADE,
    service VARCHAR(30) NOT NULL,   -- Whisper | LLM_Analyzer | FFmpeg | Queue
    level VARCHAR(10) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clipper_logs_job_id
    ON clipper.backend_logs(job_id, created_at);

CREATE TABLE IF NOT EXISTS clipper.credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',
    minutes_remaining NUMERIC(10, 2) NOT NULL DEFAULT 60,
    minutes_total NUMERIC(10, 2) NOT NULL DEFAULT 60,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
