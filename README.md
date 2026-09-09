# Manweta AI Clipper

A "long video → viral vertical reels" app: upload a podcast/webinar, OpenAI Whisper
transcribes it, GPT scores highlight-worthy moments, you pick one, and ffmpeg renders
a captioned 9:16/1:1/16:9 clip.

This repo combines two things:

- **root (`src/`, `index.html`, `vite.config.ts`, …)** — the React/Vite frontend
  (`manwetaai-clipper-UI`), talking to a real backend via `src/services/api.ts`
  instead of the `localStorage` mock data in `src/services/mockData.ts`.
- **`backend/`** — a FastAPI API: Google OAuth + JWT cookies backed by Postgres
  sessions, plus the clipper-specific pipeline (Whisper transcription, GPT-4o-mini
  highlight scoring, ffmpeg render). Background jobs run on a plain Python thread
  per upload/render (no Celery/Redis needed for this MVP).

**AI provider: OpenAI only** (`whisper-1` for transcription, `gpt-4o-mini` for highlight
analysis). No Gemini, no other model provider is called anywhere in the backend.

---

## 1. Architecture at a glance

```
                 ┌───────────────────────────┐
  Browser  ───▶  │ FastAPI (backend/app/main)│
                 │  - serves built React SPA │
                 │  - /auth/*  (Google OAuth,│
                 │    JWT cookies, Postgres) │
                 │  - /api/jobs/* (clipper)  │
                 └─────────────┬─────────────┘
                                │
                 ┌──────────────┼───────────────┐
                 ▼              ▼               ▼
            PostgreSQL     OpenAI API        ffmpeg (local
         (users, sessions,  (Whisper +        subprocess:
          clipper jobs)      GPT-4o-mini)      trim/crop/
                                                caption burn-in)
```

Video processing runs in a background thread per job (no Celery/Redis needed for an
MVP). The upload endpoint returns immediately (202); the frontend polls
`GET /api/jobs/<id>` until the job's `status` reaches `awaiting_selection` (highlights
ready) or `done` (render ready).

---

## 2. What's real vs. what's still a stub

| Feature | Status |
|---|---|
| Google OAuth login (Postgres-backed sessions, JWT cookies) | **Real** — `backend/app/routers/auth.py` |
| Video upload → OpenAI Whisper transcription (word timestamps) | **Real** — `backend/app/services/openai_service.py` |
| GPT-4o-mini highlight/virality scoring | **Real** |
| ffmpeg render: trim, 9:16/1:1/16:9 crop, ASS caption burn-in | **Real** — end-to-end smoke-tested (see below) |
| Wizard Step 1 (upload) → Step 2/3 (transcript & highlights) | **Wired to the real API** for uploaded files |
| Wizard Step 5 → Step 6 (render) → Step 7 (deliver) | **Wired to the real API** for uploaded files |
| YouTube / Vimeo / Loom URL ingestion | **Still mock data** — needs a legally-reviewed download step (see §6) |
| "Sample video" templates in Step 1 | **Still mock data** — intentionally, so the UI stays explorable without uploading |
| Phone/OTP login (Twilio) | **Not implemented** in this backend — Google is the only login path for now |
| Logout button | **Not in the UI yet** — `POST /auth/logout` exists, just needs a button wired to it |
| Billing / Stripe | Not implemented — `plan`/`creditsRemaining` are still placeholder values |
| S3/cloud storage for uploaded & rendered video | Files are stored on local disk (`backend/static/uploads`, `backend/static/outputs`) — fine for one instance, not for autoscaling (see §6) |
| Speaker-tracking crop (`smart_speaker` framing) | **Stub** — all framing modes currently resolve to the same center-crop (see §6, item 7) |
| Background music mixing (`musicTrack`/`musicVolume`) | **Stub** — style fields are stored and returned, but no audio track is mixed in yet |

I ran `npx tsc --noEmit` (clean), `npm run build` (clean), byte-compiled every backend
`.py` file, and ran a full integration smoke test: real upload → real ffprobe →
mocked Whisper/GPT (no external API key available in this environment) → real
ffmpeg render with ASS caption burn-in → served the output back over HTTP. Auth
was exercised with a manually-seeded session (no real Google OAuth credentials
available here either). **Before deploying, run it once with real `OPENAI_API_KEY`
and `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`** to confirm those two integrations
end-to-end (§4).

---

## 3. Environment variables

Copy `.env.example` → `.env` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `SECRET_KEY` | Yes | `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/dbname` |
| `OPENAI_API_KEY` | Yes | https://platform.openai.com/api-keys |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Yes (for login) | https://console.cloud.google.com/apis/credentials |
| `GOOGLE_REDIRECT_URI` | Yes | Must exactly match the Google Console "Authorized redirect URI" |
| `APP_URL` / `FRONTEND_URL` | Yes | Your deployed domain in production |
| `COOKIE_SECURE` | Yes | `false` locally (HTTP), **`true` in production (HTTPS)** |
| `MAX_UPLOAD_MB` | No | Default 500 |

---

## 4. Run it locally

Tables are created automatically at startup (`Base.metadata.create_all` in
`backend/app/main.py`) — you do **not** need to run the `.sql` files by hand;
they're kept in `backend/db/` purely as human-readable schema documentation.

### Option A — Docker (recommended, closest to production)

```bash
cp .env.example .env
# edit .env: at minimum set OPENAI_API_KEY, SECRET_KEY

docker compose up --build
```

This starts Postgres + the backend (which serves the built frontend, and creates
its own tables on first boot). Open http://127.0.0.1:5000

### Option B — Run frontend and backend separately (faster iteration)

```bash
# Terminal 1: Postgres (or use a local install)
docker run -d --name clipper-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=manweta_clipper -p 5432:5432 postgres:16-alpine

# Terminal 2: backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # edit values (OPENAI_API_KEY, SECRET_KEY, GOOGLE_* etc.)
python run.py              # http://127.0.0.1:5000 (uvicorn --reload)

# Terminal 3: frontend (Vite dev server with hot reload)
npm install
npm run dev                # http://localhost:3000, proxies /auth and /api to :5000 in dev via VITE_API_URL
```

`ffmpeg`/`ffprobe` must be on `PATH` for Option B (`apt install ffmpeg` / `brew install
ffmpeg`) — the Dockerfile installs this automatically for Option A.

Interactive API docs are auto-generated by FastAPI at `/docs` (Swagger) and
`/redoc` once the backend is running.

### Configure Google OAuth for local dev

In Google Cloud Console → Credentials → OAuth 2.0 Client ID (Web application), add:

```
Authorized redirect URI: http://127.0.0.1:5000/auth/google/callback
```

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` in `.env` to match.

---

## 5. Deploy

Any host that can run a Docker container + a managed Postgres works (Render, Railway,
Fly.io, DigitalOcean App Platform, AWS/GCP/Azure). Steps are the same shape everywhere:

1. **Provision Postgres** (managed is easiest — Render/Railway/Neon/Supabase all work).
   No manual schema step needed — the backend creates its tables automatically on
   first boot (`backend/db/*.sql` are kept only as reference documentation).
2. **Set environment variables** on the host from `.env.example` — especially
   `DATABASE_URL` (to the managed Postgres), `OPENAI_API_KEY`, `SECRET_KEY`,
   `GOOGLE_CLIENT_ID/SECRET`, and set `COOKIE_SECURE=true` + `APP_URL`/`FRONTEND_URL`
   to your real HTTPS domain.
3. **Add the production redirect URI** in Google Cloud Console:
   `https://yourdomain.com/auth/google/callback` — and set `GOOGLE_REDIRECT_URI`
   to match exactly.
4. **Build & deploy** the root `Dockerfile` (multi-stage: builds the React app, then
   runs FastAPI via gunicorn + uvicorn workers). Most PaaS providers auto-detect it —
   just point them at the repo root.
5. **Persistent storage for uploads/renders**: `backend/static/uploads` and
   `backend/static/outputs` need to survive restarts and be shared if you ever run more
   than one instance. On a single-instance host, mount a persistent volume at those
   paths (the `docker-compose.yml` shows the volume names to use as a template). For
   multi-instance/production, move to S3/Cloud Storage — see §6.

---

## 6. What to do next (in rough priority order)

1. **Run it locally end-to-end with real credentials** before deploying: a real
   `OPENAI_API_KEY` (upload a short 1-2 min video, confirm real highlights come back,
   render one, play the downloaded file) and real `GOOGLE_CLIENT_ID`/`SECRET` (click
   through the login flow). These are the two integrations I couldn't verify without
   your credentials — everything else was exercised with a mocked/seeded equivalent.
2. **Move uploaded/rendered video off local disk and onto S3-compatible storage**
   (S3, Cloudflare R2, Backblaze B2). Local disk works for a single always-on instance
   but breaks the moment you scale to >1 instance or the host recycles the filesystem.
   `backend/app/services/job_service.py` (file save path) and `backend/app/main.py`'s
   `/media/outputs` mount are the two places to change.
3. **Move background processing off in-request threads and onto a real queue**
   (Celery/RQ + Redis, or a hosted queue). The current threading approach
   (`backend/app/services/job_service.py`) works for low volume but doesn't survive a
   process restart mid-job and doesn't scale past one worker process.
4. **Wire up YouTube/Vimeo/Loom URL ingestion** using `yt-dlp` (review each platform's
   Terms of Service for your use case first — this is a legal/policy decision, not
   just a technical one).
5. **Add a logout button** to the UI (`AuthApi.logout()` in `src/services/api.ts`
   already exists — it just isn't wired to anything visible yet).
6. **Add real billing** (Stripe) if you want the pricing tiers in `CheckoutModal.tsx` to
   actually charge people and update `clipper.credits` server-side, instead of just
   updating `localStorage`. `User.credits_remaining`/`credits_total` already exist as
   DB columns (`backend/app/models.py`) but aren't wired to anything yet.
7. **Improve the "smart_speaker" framing mode** in `backend/app/services/render_service.py`
   — it currently center-crops for all framing modes; real speaker-tracking crop needs a
   face/motion-detection pass (e.g. via OpenCV) before the ffmpeg crop filter.
8. **Mix in background music** (`styleConfig.musicTrack`/`musicVolume`) — currently
   stored but not applied during render; needs a small licensed-track library and an
   ffmpeg audio-mix step in `render_service.render_clip`.
9. **Add rate limiting / abuse protection** on `/api/jobs` (video uploads + OpenAI
   calls both cost real money per request).
10. **Add phone/OTP login** if you want a non-Google path — not implemented in this
    backend at all yet (no Twilio integration, no OTP tables).

---

## 7. Where things live

```
manweta-clipper-UIv1/
├── Dockerfile                  # multi-stage: builds the frontend, runs FastAPI+gunicorn
├── docker-compose.yml          # local dev: Postgres + backend
├── .env.example                 # copy to .env (also copied to backend/.env.example)
├── vite.config.ts               # dev-server proxy to backend (/auth, /api, /media)
├── src/                         # React/Vite frontend (this is the repo root app)
│   ├── services/api.ts          # REST client — the contract the backend below implements
│   ├── components/AuthModal.tsx # Google button does a real OAuth redirect
│   └── App.tsx                  # upload/render wizard steps call the real API
└── backend/
    ├── run.py                   # local dev entrypoint (uvicorn --reload)
    ├── requirements.txt
    ├── app/
    │   ├── main.py               # FastAPI app: CORS, static mounts, table creation, routers
    │   ├── config.py              # env-var settings
    │   ├── database.py            # SQLAlchemy engine/session
    │   ├── models.py              # User, AuthIdentity, UserSession, Job, JobLog
    │   ├── schemas.py             # Pydantic request/response shapes (mirrors src/types.ts)
    │   ├── security.py            # JWT + cookie helpers
    │   ├── deps.py                # current-user / current-session FastAPI dependencies
    │   ├── routers/
    │   │   ├── auth.py            # /auth/google, /auth/google/callback, /auth/me, /auth/logout
    │   │   └── jobs.py            # /api/jobs, /api/jobs/{id}, /{id}/logs, /{id}/render
    │   └── services/
    │       ├── openai_service.py  # Whisper transcription + GPT-4o-mini highlight scoring
    │       ├── render_service.py  # ffprobe / ASS caption generation / ffmpeg render
    │       └── job_service.py     # DB CRUD + background pipeline orchestration (threads)
    ├── db/
    │   ├── schema_auth.sql        # reference only — tables are auto-created by SQLAlchemy
    │   └── schema_clipper.sql     # reference only — same as above
    └── static/
        ├── uploads/               # raw uploaded video, per job_id
        ├── outputs/                # rendered clips, served at /media/outputs/<file>
        └── tmp/                    # scratch: extracted audio, .ass caption files
```
