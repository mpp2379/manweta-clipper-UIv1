import json
import os
import threading
import traceback
import uuid
from datetime import datetime, timezone

from auth.service import get_conn
from services import openai_service, render_service

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "static", "outputs")
TMP_DIR = os.path.join(BASE_DIR, "static", "tmp")
for d in (UPLOAD_DIR, OUTPUT_DIR, TMP_DIR):
    os.makedirs(d, exist_ok=True)


def _now():
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------- DB helpers

def create_job(user_id, title, source_type, source_url=None, source_filename=None,
               stored_path=None, file_size_mb=None):
    job_id = uuid.uuid4()
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO clipper.jobs
                    (id, user_id, title, source_type, source_url,
                     source_filename, stored_path, file_size_mb, status, current_step)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'queued', 1)
                RETURNING *
                """,
                (job_id, user_id, title, source_type, source_url,
                 source_filename, stored_path, file_size_mb),
            )
            return cur.fetchone()


def get_job(job_id, user_id=None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            if user_id:
                cur.execute(
                    "SELECT * FROM clipper.jobs WHERE id = %s AND user_id = %s",
                    (job_id, user_id),
                )
            else:
                cur.execute("SELECT * FROM clipper.jobs WHERE id = %s", (job_id,))
            return cur.fetchone()


def list_jobs(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM clipper.jobs WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,),
            )
            return cur.fetchall()


def delete_job(job_id, user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM clipper.jobs WHERE id = %s AND user_id = %s",
                (job_id, user_id),
            )


def update_job(job_id, **fields):
    if not fields:
        return
    set_clauses = []
    values = []
    for key, value in fields.items():
        set_clauses.append(f"{key} = %s")
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        values.append(value)
    set_clauses.append("updated_at = NOW()")
    values.append(job_id)

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE clipper.jobs SET {', '.join(set_clauses)} WHERE id = %s",
                values,
            )


def add_log(job_id, service, message, level="info", details=None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO clipper.backend_logs (id, job_id, service, level, message, details)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (uuid.uuid4(), job_id, service, level, message,
                 json.dumps(details) if details else None),
            )


def get_logs(job_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM clipper.backend_logs WHERE job_id = %s ORDER BY created_at",
                (job_id,),
            )
            return cur.fetchall()


# ---------------------------------------------------------- Pipeline (async)

def start_ingest_pipeline(job_id):
    thread = threading.Thread(target=_run_ingest_pipeline, args=(job_id,), daemon=True)
    thread.start()


def _run_ingest_pipeline(job_id):
    job = get_job(job_id)
    if not job:
        return
    video_path = job["stored_path"]

    try:
        # 1. Probe
        add_log(job_id, "ffprobe", "Reading source video metadata")
        info = render_service.probe_video(video_path)
        update_job(
            job_id,
            duration_seconds=info["duration_seconds"],
            resolution=info["resolution"],
            fps=info["fps"],
            status="transcribing",
            current_step=2,
            progress_percent=15,
        )

        thumb_path = os.path.join(OUTPUT_DIR, f"{job_id}_thumb.jpg")
        try:
            render_service.generate_thumbnail(video_path, thumb_path, at_seconds=min(1.0, info["duration_seconds"] / 2))
            update_job(job_id, thumbnail_url=f"/media/outputs/{job_id}_thumb.jpg")
        except Exception:
            pass  # thumbnail is best-effort

        # 2. Extract audio + transcribe via OpenAI Whisper
        audio_path = os.path.join(TMP_DIR, f"{job_id}.mp3")
        add_log(job_id, "FFmpeg", "Extracting audio track for transcription")
        render_service.extract_audio(video_path, audio_path)

        add_log(job_id, "Whisper", "Transcribing audio with OpenAI (word timestamps)")
        transcript = openai_service.transcribe_audio(audio_path)
        update_job(
            job_id,
            transcript_text=transcript["text"],
            words=transcript["words"],
            status="analyzing",
            current_step=3,
            progress_percent=55,
        )

        # 3. Highlight analysis via OpenAI GPT
        add_log(job_id, "LLM_Analyzer", "Scoring transcript for viral highlight candidates")
        raw_highlights = openai_service.analyze_highlights(transcript["text"], transcript["words"])

        highlights = []
        for i, h in enumerate(raw_highlights):
            start_t = float(h.get("startTime", 0))
            end_t = float(h.get("endTime", start_t + 30))
            highlights.append({
                "id": f"hl_{job_id}_{i}",
                "title": h.get("title", f"Highlight {i + 1}"),
                "hook": h.get("hook", ""),
                "summary": h.get("summary", ""),
                "score": int(h.get("score", 70)),
                "startTime": start_t,
                "endTime": end_t,
                "duration": round(end_t - start_t, 2),
                "viralityGrade": h.get("viralityGrade", "B+"),
                "category": h.get("category", "Insight"),
                "pacingScore": int(h.get("pacingScore", 70)),
                "hookStrength": int(h.get("hookStrength", 70)),
                "audioEnergy": [],
                "tags": h.get("tags", []),
            })

        update_job(
            job_id,
            highlights=highlights,
            status="awaiting_selection",
            current_step=4,
            progress_percent=80,
        )
        add_log(job_id, "Queue", f"Found {len(highlights)} highlight candidates", level="success")

        try:
            os.remove(audio_path)
        except OSError:
            pass

    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        update_job(job_id, status="failed", error_message=str(exc))
        add_log(job_id, "Queue", f"Pipeline failed: {exc}", level="error")


def start_render_pipeline(job_id, start, end, style_config):
    thread = threading.Thread(
        target=_run_render_pipeline, args=(job_id, start, end, style_config), daemon=True
    )
    thread.start()


def _run_render_pipeline(job_id, start, end, style_config):
    job = get_job(job_id)
    if not job:
        return

    try:
        update_job(job_id, status="rendering", current_step=6, progress_percent=85,
                    style_config=style_config)
        add_log(job_id, "FFmpeg", f"Rendering clip {start:.1f}s -> {end:.1f}s")

        aspect_ratio = style_config.get("aspectRatio", "9:16")
        target_dims = render_service.ASPECT_DIMENSIONS.get(aspect_ratio, (1080, 1920))

        ass_path = None
        words = job["words"] or []
        if isinstance(words, str):
            words = json.loads(words)
        if words:
            ass_path = os.path.join(TMP_DIR, f"{job_id}_captions.ass")
            render_service.build_ass_subtitles(
                words, start, end, style_config, ass_path, target_dims[0], target_dims[1]
            )

        output_path = os.path.join(OUTPUT_DIR, f"{job_id}_render.mp4")
        render_service.render_clip(
            job["stored_path"], output_path, start, end,
            aspect_ratio, style_config.get("framing", "center"), ass_path,
        )

        update_job(
            job_id,
            status="done",
            current_step=7,
            progress_percent=100,
            rendered_path=f"/media/outputs/{job_id}_render.mp4",
            render_duration_sec=round(end - start, 2),
            completed_at=_now(),
        )
        add_log(job_id, "FFmpeg", "Render complete", level="success")

    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        update_job(job_id, status="failed", error_message=str(exc))
        add_log(job_id, "FFmpeg", f"Render failed: {exc}", level="error")
