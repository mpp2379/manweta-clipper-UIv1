import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import models
from ..config import OUTPUTS_DIR, TMP_DIR, UPLOADS_DIR, settings
from ..database import SessionLocal
from . import openai_service, render_service

DEFAULT_STYLE_CONFIG = {
    "captionStyle": "hormozi",
    "aspectRatio": "9:16",
    "framing": "smart_speaker",
    "fontSize": "lg",
    "fontFamily": "display",
    "textColor": "#FFFFFF",
    "highlightColor": "#00FF85",
    "showEmojis": True,
    "position": "middle",
    "musicTrack": "none",
    "musicVolume": 0,
    "showBrandLogo": False,
    "brandName": "",
    "autoReOffsetTimestamps": True,
}

DEFAULT_THUMBNAIL = (
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _iso(dt: datetime | None) -> str | None:
    if dt is None:
        return None
    return dt.astimezone(timezone.utc).isoformat()


def add_log(db: Session, job_id: str, service: str, level: str, message: str) -> None:
    db.add(models.JobLog(job_id=job_id, service=service, level=level, message=message))
    db.commit()


def to_response(job: models.Job) -> dict:
    return {
        "id": job.id,
        "title": job.title,
        "sourceType": job.source_type,
        "sourceUrl": job.source_url,
        "sourceFileName": job.source_file_name,
        "fileSizeMb": job.file_size_mb,
        "durationSeconds": job.duration_seconds,
        "resolution": job.resolution,
        "fps": job.fps,
        "thumbnailUrl": job.thumbnail_url or DEFAULT_THUMBNAIL,
        "status": job.status,
        "currentStep": job.current_step,
        "progressPercent": job.progress_percent,
        "transcriptText": job.transcript_text,
        "words": job.words,
        "highlights": job.highlights,
        "selectedHighlightId": job.selected_highlight_id,
        "customClipRange": job.custom_clip_range or [0, min(30, job.duration_seconds or 30)],
        "styleConfig": job.style_config or DEFAULT_STYLE_CONFIG,
        "createdAt": _iso(job.created_at),
        "completedAt": _iso(job.completed_at),
        "syncState": "synced",
        "backendLogs": [
            {
                "id": log.id,
                "timestamp": _iso(log.created_at) or "",
                "service": log.service,
                "level": log.level,
                "message": log.message,
            }
            for log in sorted(job.logs, key=lambda l: l.created_at)
        ],
        "errorMessage": job.error_message,
        "renderedVideoUrl": job.rendered_video_url,
        "downloadUrl": job.download_url,
    }


def get_owned_job(db: Session, job_id: str, user: models.User) -> models.Job:
    job = db.get(models.Job, job_id)
    if not job or job.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


def list_jobs(db: Session, user: models.User) -> list[models.Job]:
    return (
        db.query(models.Job)
        .filter_by(user_id=user.id)
        .order_by(models.Job.created_at.desc())
        .all()
    )


# ---------------------------------------------------------------------------
# Upload -> create job -> kick off background pipeline
# ---------------------------------------------------------------------------


def _save_upload(job_id: str, upload: UploadFile) -> tuple[str, int]:
    job_dir = UPLOADS_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    safe_name = Path(upload.filename or "upload.mp4").name
    dest_path = job_dir / safe_name

    size = 0
    max_bytes = settings.max_upload_bytes
    with dest_path.open("wb") as out:
        while True:
            chunk = upload.file.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > max_bytes:
                out.close()
                dest_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File exceeds MAX_UPLOAD_MB ({settings.MAX_UPLOAD_MB} MB) limit.",
                )
            out.write(chunk)

    return str(dest_path), size


def create_job(db: Session, user: models.User, upload: UploadFile, title: str | None) -> models.Job:
    job = models.Job(
        user_id=user.id,
        title=title or (upload.filename or "Untitled clip"),
        source_type="upload",
        source_file_name=upload.filename,
        status="queued",
        current_step=1,
        progress_percent=5,
        thumbnail_url=DEFAULT_THUMBNAIL,
        style_config=DEFAULT_STYLE_CONFIG,
        custom_clip_range=[0, 30],
    )
    db.add(job)
    db.flush()  # assigns job.id

    file_path, size_bytes = _save_upload(job.id, upload)
    job.source_file_path = file_path
    job.file_size_mb = round(size_bytes / (1024 * 1024), 2)

    try:
        meta = render_service.probe(file_path)
        job.duration_seconds = meta["duration_seconds"]
        job.resolution = meta["resolution"]
        job.fps = meta["fps"]
        job.custom_clip_range = [0, min(30, job.duration_seconds or 30)]
    except render_service.FFmpegError as e:
        job.error_message = f"Could not probe uploaded file: {e}"

    db.commit()
    db.refresh(job)
    add_log(db, job.id, "Upload", "success", f"Received {job.source_file_name} ({job.file_size_mb} MB)")

    thread = threading.Thread(target=_run_transcription_pipeline, args=(job.id,), daemon=True)
    thread.start()

    return job


# ---------------------------------------------------------------------------
# Background pipeline: transcription + highlight scoring
# ---------------------------------------------------------------------------


def _run_transcription_pipeline(job_id: str) -> None:
    db = SessionLocal()
    try:
        job = db.get(models.Job, job_id)
        if not job:
            return

        job.status = "transcribing"
        job.progress_percent = 15
        db.commit()
        add_log(db, job_id, "Whisper", "info", "Extracting audio track for transcription…")

        audio_path = str(TMP_DIR / f"{job_id}.mp3")
        render_service.extract_audio(job.source_file_path, audio_path)

        add_log(db, job_id, "Whisper", "info", "Transcribing audio with whisper-1…")
        transcript = openai_service.transcribe_audio(audio_path)
        job.transcript_text = transcript["text"]
        job.words = transcript["words"]
        job.progress_percent = 30
        db.commit()
        add_log(
            db, job_id, "Whisper", "success",
            "Decoded speech audio stream and aligned word timestamps",
        )

        job.status = "analyzing"
        db.commit()
        add_log(db, job_id, "GPT-4o-mini", "info", "Scoring highlight-worthy moments…")

        highlights = openai_service.analyze_highlights(
            job.transcript_text or "", job.words or [], job.duration_seconds
        )
        job.highlights = highlights
        if highlights:
            job.selected_highlight_id = highlights[0]["id"]
            job.custom_clip_range = [highlights[0]["startTime"], highlights[0]["endTime"]]
        job.status = "awaiting_selection"
        job.current_step = 2
        job.progress_percent = 40
        db.commit()
        add_log(
            db, job_id, "GPT-4o-mini", "success",
            f"Found {len(highlights)} highlight-worthy moment(s)",
        )
    except Exception as e:  # noqa: BLE001 - surface any pipeline failure to the job record
        job = db.get(models.Job, job_id)
        if job:
            job.status = "failed"
            job.error_message = str(e)
            db.commit()
        add_log(db, job_id, "pipeline", "error", f"Processing failed: {e}")
    finally:
        db.close()
        Path(TMP_DIR / f"{job_id}.mp3").unlink(missing_ok=True)


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------


def _resolve_clip_range(job: models.Job, selection: dict) -> tuple[float, float]:
    custom_range = selection.get("customRange")
    if custom_range and len(custom_range) == 2:
        return float(custom_range[0]), float(custom_range[1])

    highlight_id = selection.get("highlightId")
    if highlight_id and job.highlights:
        for h in job.highlights:
            if h.get("id") == highlight_id:
                return float(h["startTime"]), float(h["endTime"])

    if job.custom_clip_range and len(job.custom_clip_range) == 2:
        return float(job.custom_clip_range[0]), float(job.custom_clip_range[1])

    return 0.0, min(30.0, job.duration_seconds or 30.0)


def start_render(db: Session, job: models.Job, selection: dict, style_config: dict) -> None:
    if job.status not in ("awaiting_selection", "done", "failed"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Job is not ready to render (status={job.status}).",
        )

    job.style_config = style_config
    job.status = "rendering"
    job.progress_percent = 70
    db.commit()
    add_log(db, job.id, "FFmpeg", "info", "Render queued")

    thread = threading.Thread(
        target=_run_render_pipeline, args=(job.id, selection, style_config), daemon=True
    )
    thread.start()


def _run_render_pipeline(job_id: str, selection: dict, style_config: dict) -> None:
    db = SessionLocal()
    ass_path = str(TMP_DIR / f"{job_id}_{uuid.uuid4().hex[:8]}.ass")
    try:
        job = db.get(models.Job, job_id)
        if not job:
            return

        start, end = _resolve_clip_range(job, selection)
        aspect_ratio = style_config.get("aspectRatio", "9:16")
        width, height = render_service.ASPECT_DIMENSIONS.get(
            aspect_ratio, render_service.ASPECT_DIMENSIONS["9:16"]
        )

        add_log(db, job_id, "FFmpeg", "info", "Generating burned-in captions…")
        render_service.build_ass_captions(
            job.words or [], start, end, style_config, width, height, ass_path
        )

        output_filename = f"{job.id}.mp4"
        output_path = OUTPUTS_DIR / output_filename

        add_log(db, job_id, "FFmpeg", "info", f"Rendering {aspect_ratio} clip ({end - start:.1f}s)…")
        render_service.render_clip(job.source_file_path, str(output_path), start, end, aspect_ratio, ass_path)

        job.rendered_video_path = str(output_path)
        job.rendered_video_url = f"/media/outputs/{output_filename}"
        job.download_url = job.rendered_video_url
        job.status = "done"
        job.current_step = 7
        job.progress_percent = 100
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
        add_log(db, job_id, "FFmpeg", "success", "Render complete")
    except Exception as e:  # noqa: BLE001
        job = db.get(models.Job, job_id)
        if job:
            job.status = "failed"
            job.error_message = str(e)
            db.commit()
        add_log(db, job_id, "FFmpeg", "error", f"Render failed: {e}")
    finally:
        db.close()
        Path(ass_path).unlink(missing_ok=True)
