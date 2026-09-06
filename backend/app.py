import json
import os
import re
import unicodedata
import uuid

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

load_dotenv()

from auth.routes import auth_router, require_login  # noqa: E402
from services import job_service  # noqa: E402

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "static", "outputs")
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend_dist")

MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "500"))
ALLOWED_EXTENSIONS = {"mp4", "mov", "webm", "mkv", "avi"}

for d in (UPLOAD_DIR, OUTPUT_DIR):
    os.makedirs(d, exist_ok=True)

app = FastAPI(title="Manweta AI Clipper API")

# Allow the Vite dev server (localhost:3000) to call the API with cookies
# during local development. In production the SPA is served from the same
# origin, so this is a no-op there.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


_FILENAME_STRIP_RE = re.compile(r"[^A-Za-z0-9_.-]")


def secure_filename(filename: str) -> str:
    """Minimal stand-in for werkzeug.utils.secure_filename (no Flask dependency)."""
    filename = unicodedata.normalize("NFKD", filename).encode("ascii", "ignore").decode("ascii")
    filename = filename.replace(os.sep, "_")
    if os.altsep:
        filename = filename.replace(os.altsep, "_")
    filename = _FILENAME_STRIP_RE.sub("", "_".join(filename.split())).strip("._")
    return filename or "file"


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def public_job(job):
    def as_json(v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return v
        return v

    # For "upload" jobs there's no source_url column value (that's only used
    # for pasted links) — instead the raw file lives in UPLOAD_DIR, served
    # below at /media/uploads/<filename>. Without this, the clip-selector
    # preview player has no working <video> source until the job is rendered.
    source_url = job.get("source_url")
    if not source_url and job.get("stored_path"):
        stored_name = os.path.basename(job["stored_path"])
        if os.path.isfile(os.path.join(UPLOAD_DIR, stored_name)):
            source_url = f"/media/uploads/{stored_name}"

    return {
        "id": str(job["id"]),
        "title": job["title"],
        "sourceType": job["source_type"],
        "sourceUrl": source_url,
        "sourceFileName": job.get("source_filename"),
        "fileSizeMb": float(job["file_size_mb"]) if job.get("file_size_mb") else 0,
        "durationSeconds": float(job["duration_seconds"]) if job.get("duration_seconds") else 0,
        "resolution": job.get("resolution") or "",
        "fps": job.get("fps") or 30,
        "thumbnailUrl": job.get("thumbnail_url") or "",
        "status": job["status"],
        "currentStep": job["current_step"],
        "progressPercent": job["progress_percent"],
        "errorMessage": job.get("error_message"),
        "transcriptText": job.get("transcript_text") or "",
        "words": as_json(job.get("words")) or [],
        "highlights": as_json(job.get("highlights")) or [],
        "selectedHighlightId": job.get("selected_highlight_id"),
        "styleConfig": as_json(job.get("style_config")) or {},
        "renderedVideoUrl": job.get("rendered_path"),
        "downloadUrl": job.get("rendered_path"),
        "renderDurationSec": float(job["render_duration_sec"]) if job.get("render_duration_sec") else None,
        "createdAt": job["created_at"].isoformat() if job.get("created_at") else None,
        "completedAt": job["completed_at"].isoformat() if job.get("completed_at") else None,
    }


def require_user(identity=Depends(require_login)):
    return identity[0]


# ============================================================
# CLIPPER API
# ============================================================

@app.get("/api/jobs")
async def api_list_jobs(user=Depends(require_user)):
    jobs = job_service.list_jobs(user["id"])
    return [public_job(j) for j in jobs]


@app.get("/api/jobs/{job_id}")
async def api_get_job(job_id: str, user=Depends(require_user)):
    job = job_service.get_job(job_id, user["id"])
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return public_job(job)


@app.post("/api/jobs", status_code=202)
async def api_create_job(
    file: UploadFile = File(...),
    title: str = Form(None),
    user=Depends(require_user),
):
    """
    Multipart upload: fields = title (optional), file (required for source_type=upload).
    Kicks off the async transcription + highlight pipeline immediately.
    """
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Unsupported or missing video file")

    contents = await file.read()
    size_mb = round(len(contents) / (1024 * 1024), 2)
    if size_mb > MAX_UPLOAD_MB:
        raise HTTPException(status_code=413, detail=f"File exceeds {MAX_UPLOAD_MB}MB limit")

    job_uuid = uuid.uuid4()
    safe_name = secure_filename(file.filename)
    stored_name = f"{job_uuid}_{safe_name}"
    stored_path = os.path.join(UPLOAD_DIR, stored_name)
    with open(stored_path, "wb") as f:
        f.write(contents)

    job_title = title or safe_name.rsplit(".", 1)[0]

    job = job_service.create_job(
        user_id=user["id"],
        title=job_title,
        source_type="upload",
        source_filename=safe_name,
        stored_path=stored_path,
        file_size_mb=size_mb,
    )

    job_service.start_ingest_pipeline(str(job["id"]))
    return public_job(job)


@app.delete("/api/jobs/{job_id}")
async def api_delete_job(job_id: str, user=Depends(require_user)):
    job_service.delete_job(job_id, user["id"])
    return {"message": "deleted"}


@app.post("/api/jobs/{job_id}/render", status_code=202)
async def api_render_job(job_id: str, request: Request, user=Depends(require_user)):
    """
    Body: { "highlightId": "...", "styleConfig": {...} }
      OR  { "customRange": [start, end], "styleConfig": {...} }
    """
    job = job_service.get_job(job_id, user["id"])
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    try:
        data = await request.json()
    except Exception:
        data = {}
    style_config = data.get("styleConfig", {})

    highlights = job.get("highlights") or []
    if isinstance(highlights, str):
        highlights = json.loads(highlights)

    start, end = None, None
    highlight_id = data.get("highlightId")
    if highlight_id:
        match = next((h for h in highlights if h["id"] == highlight_id), None)
        if not match:
            raise HTTPException(status_code=400, detail="Unknown highlightId")
        start, end = match["startTime"], match["endTime"]
        job_service.update_job(job_id, selected_highlight_id=highlight_id)
    elif data.get("customRange"):
        start, end = data["customRange"]
    else:
        raise HTTPException(status_code=400, detail="Provide highlightId or customRange")

    job_service.start_render_pipeline(job_id, float(start), float(end), style_config)
    return {"message": "Render started", "jobId": job_id}


@app.get("/api/jobs/{job_id}/logs")
async def api_job_logs(job_id: str, user=Depends(require_user)):
    job = job_service.get_job(job_id, user["id"])
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    logs = job_service.get_logs(job_id)
    return [
        {
            "id": str(l["id"]),
            "timestamp": l["created_at"].isoformat(),
            "service": l["service"],
            "level": l["level"],
            "message": l["message"],
            "details": l.get("details"),
        }
        for l in logs
    ]


# Serve uploaded/rendered media (in production, point this at S3/Cloud Storage instead).
app.mount("/media/outputs", StaticFiles(directory=OUTPUT_DIR), name="media-outputs")
app.mount("/media/uploads", StaticFiles(directory=UPLOAD_DIR), name="media-uploads")


# ============================================================
# FRONTEND (built React SPA)
# ============================================================

if os.path.isdir(FRONTEND_DIST):
    frontend_assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(frontend_assets_dir):
        app.mount("/assets", StaticFiles(directory=frontend_assets_dir), name="frontend-assets")


@app.get("/")
async def index_root():
    return _serve_spa("")


@app.get("/{path:path}")
async def index_catch_all(path: str):
    if path.startswith("api/") or path.startswith("auth/"):
        raise HTTPException(status_code=404)
    return _serve_spa(path)


def _serve_spa(path: str):
    if os.path.isdir(FRONTEND_DIST):
        full_path = os.path.join(FRONTEND_DIST, path)
        if path and os.path.isfile(full_path):
            return FileResponse(full_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
    return JSONResponse({
        "message": "Manweta AI Clipper API is running. Frontend build not found at frontend_dist/. "
                   "Run `npm run build` in /frontend and copy dist/ here (the Dockerfile does this for you)."
    })


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "5000"))
    reload_enabled = os.getenv("FASTAPI_RELOAD", "false").lower() == "true"
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=reload_enabled)