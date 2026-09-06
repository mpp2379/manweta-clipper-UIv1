# Manweta AI Clipper

A "long video → viral vertical reels" app: upload a podcast/webinar, OpenAI Whisper
transcribes it, GPT scores highlight-worthy moments, you pick one, and ffmpeg renders
a captioned 9:16/1:1/16:9 clip.

This repo combines two things you gave me:

- **`frontend/`** — your Google AI Studio–generated UI (`manwetaai-clipper-UI`), lightly
  modified to talk to a real backend instead of `localStorage` mock data.
- **`backend/`** — a new Flask API, built by copying the auth/DB/OpenAI patterns from
  your `Manweta AI` project (Postgres + JWT cookies + Google OAuth), extended with the
  clipper-specific pipeline (Whisper transcription, GPT highlight scoring, ffmpeg render).

**AI provider: OpenAI only** (`whisper-1` for transcription, `gpt-4o-mini` for highlight
analysis). No Gemini, no other model provider is called anywhere in the backend.

---

## 1. Architecture at a glance

```
                 ┌─────────────────────────┐
  Browser  ───▶  │  Flask (backend/app.py)  │
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
| Google OAuth login (Postgres-backed sessions, JWT cookies) | **Real** — copied from your `Manweta AI` auth module |
| Video upload → OpenAI Whisper transcription (word timestamps) | **Real** |
| GPT-4o-mini highlight/virality scoring | **Real** |
| ffmpeg render: trim, 9:16/1:1/16:9 crop, ASS caption burn-in | **Real** (smoke-tested — see below) |
| Wizard Step 1 (upload) → Step 2/3 (transcript & highlights) | **Wired to the real API** for uploaded files |
| Wizard Step 5 → Step 6 (render) → Step 7 (deliver) | **Wired to the real API** for uploaded files |
| YouTube / Vimeo / Loom URL ingestion | **Still mock data** — needs a legally-reviewed download step (see §6) |
| "Sample video" templates in Step 1 | **Still mock data** — intentionally, so the UI stays explorable without uploading |
| Phone/OTP login (Twilio) | Backend routes exist (copied from your auth module) but **no UI is wired to them** — Google is the only login button in the UI |
| Logout button | **Not in the UI yet** — `POST /auth/logout` exists, just needs a button wired to it |
| Billing / Stripe | Not implemented — `plan`/`creditsRemaining` are still placeholder values |
| S3/cloud storage for uploaded & rendered video | Files are stored on local disk (`backend/static/uploads`, `backend/static/outputs`) — fine for one instance, not for autoscaling (see §6) |

I ran `npx tsc --noEmit` (clean), `npm run build` (clean), byte-compiled every backend
`.py` file, imported the Flask app and confirmed all routes register, and ran the
ffmpeg render pipeline end-to-end against a generated test clip (probe → ASS captions
→ crop/scale/burn-in → H.264 output). I have **not** run the full upload → Whisper →
GPT → render loop against a real OpenAI key or a real Postgres database — do that
first, locally, before deploying (§4).

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
| `TWILIO_*` | No | Only needed if you wire up phone login later |

---

## 4. Run it locally

### Option A — Docker (recommended, closest to production)

```bash
cp .env.example .env
# edit .env: at minimum set OPENAI_API_KEY, SECRET_KEY

docker compose up --build
```

This starts Postgres + the backend (which serves the built frontend). Then, once
running, apply the DB schema:

```bash
docker compose exec db psql -U postgres -d manweta_clipper -f - < backend/db/schema_auth.sql
docker compose exec db psql -U postgres -d manweta_clipper -f - < backend/db/schema_clipper.sql
```

Open http://127.0.0.1:5000

### Option B — Run frontend and backend separately (faster iteration)

```bash
# Terminal 1: Postgres (or use a local install)
docker run -d --name clipper-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=manweta_clipper -p 5432:5432 postgres:16-alpine
psql postgresql://postgres:postgres@localhost:5432/manweta_clipper -f backend/db/schema_auth.sql
psql postgresql://postgres:postgres@localhost:5432/manweta_clipper -f backend/db/schema_clipper.sql

# Terminal 2: backend
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env   # edit values
python app.py             # http://127.0.0.1:5000

# Terminal 3: frontend (Vite dev server with hot reload)
cd frontend
npm install
cp .env.example .env      # VITE_API_BASE_URL=http://127.0.0.1:5000
npm run dev                # http://localhost:3000
```

`ffmpeg`/`ffprobe` must be on `PATH` for Option B (`apt install ffmpeg` / `brew install
ffmpeg`) — the Dockerfile installs this automatically for Option A.

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
   Run `backend/db/schema_auth.sql` then `backend/db/schema_clipper.sql` against it.
2. **Set environment variables** on the host from `.env.example` — especially
   `DATABASE_URL` (to the managed Postgres), `OPENAI_API_KEY`, `SECRET_KEY`,
   `GOOGLE_CLIENT_ID/SECRET`, and set `COOKIE_SECURE=true` + `APP_URL`/`FRONTEND_URL`
   to your real HTTPS domain.
3. **Add the production redirect URI** in Google Cloud Console:
   `https://yourdomain.com/auth/google/callback` — and set `GOOGLE_REDIRECT_URI`
   to match exactly.
4. **Build & deploy** the root `Dockerfile` (multi-stage: builds the React app, then
   runs Flask via gunicorn). Most PaaS providers auto-detect it — just point them at
   the repo root.
5. **Persistent storage for uploads/renders**: `backend/static/uploads` and
   `backend/static/outputs` need to survive restarts and be shared if you ever run more
   than one instance. On a single-instance host, mount a persistent volume at those
   paths (the `docker-compose.yml` shows the volume names to use as a template). For
   multi-instance/production, move to S3/Cloud Storage — see §6.

---

## 6. What to do next (in rough priority order)

1. **Run it locally end-to-end with a real OpenAI key** before deploying: upload a
   short (1-2 min) video, confirm real highlights come back, pick one, render it, and
   play the downloaded file. This is the one thing I couldn't verify without your
   credentials.
2. **Move uploaded/rendered video off local disk and onto S3-compatible storage**
   (S3, Cloudflare R2, Backblaze B2). Local disk works for a single always-on instance
   but breaks the moment you scale to >1 instance or the host recycles the filesystem.
   `services/job_service.py` and `app.py`'s `/media/outputs/<file>` route are the two
   places to change.
3. **Move background processing off in-request threads and onto a real queue**
   (Celery/RQ + Redis, or a hosted queue). The current threading approach works for
   low volume but doesn't survive a process restart mid-job and doesn't scale past one
   worker process.
4. **Wire up YouTube/Vimeo/Loom URL ingestion** using `yt-dlp` (review each platform's
   Terms of Service for your use case first — this is a legal/policy decision, not
   just a technical one).
5. **Add a logout button** to the UI (`AuthApi.logout()` in `frontend/src/services/api.ts`
   already exists — it just isn't wired to anything visible yet).
6. **Add real billing** (Stripe) if you want the pricing tiers in `CheckoutModal.tsx` to
   actually charge people and update `clipper.credits` server-side, instead of just
   updating `localStorage`.
7. **Improve the "smart_speaker" framing mode** in `render_service.py` — it currently
   center-crops for all framing modes; real speaker-tracking crop needs a
   face/motion-detection pass (e.g. via OpenCV) before the ffmpeg crop filter.
8. **Add rate limiting / abuse protection** on `/api/jobs` (video uploads + OpenAI
   calls both cost real money per request).
9. **Decide on the phone/OTP login UI** — the backend already supports it
   (`DEV_OTP_MODE` + optional Twilio Verify); add it to `AuthModal.tsx` if you want a
   non-Google login path, or delete the unused routes/tables if you don't.

---

## 7. Where things live

```
manweta-clipper/
├── Dockerfile                 # multi-stage: builds frontend, runs Flask+gunicorn
├── docker-compose.yml         # local dev: Postgres + backend
├── .env.example                # copy to .env
├── backend/
│   ├── app.py                 # Flask app, /api/jobs/* routes, serves built frontend
│   ├── auth/                  # copied from Manweta AI: Google OAuth, JWT, Postgres sessions
│   ├── services/
│   │   ├── openai_service.py  # Whisper transcription + GPT highlight analysis (OpenAI only)
│   │   ├── render_service.py  # ffmpeg probe / caption burn-in / render
│   │   └── job_service.py     # DB CRUD + background pipeline orchestration
│   └── db/
│       ├── schema_auth.sql    # users, sessions, auth_identities, otp (from Manweta AI)
│       └── schema_clipper.sql # clipper.jobs, backend_logs, credits
└── frontend/
    ├── src/services/api.ts    # new: real REST client for the backend above
    ├── src/components/AuthModal.tsx  # Google button now does a real OAuth redirect
    └── src/App.tsx             # upload/render steps call the real API for uploaded files
```
