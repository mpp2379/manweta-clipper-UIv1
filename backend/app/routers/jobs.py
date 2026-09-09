from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db
from ..deps import get_current_user
from ..schemas import ClipperJobOut, RenderAck, RenderRequest
from ..services import job_service

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.post("", response_model=ClipperJobOut, status_code=201)
async def create_job(
    file: UploadFile = File(...),
    title: str = Form(""),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    job = job_service.create_job(db, user, file, title)
    return job_service.to_response(job)


@router.get("", response_model=list[ClipperJobOut])
def list_jobs(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    jobs = job_service.list_jobs(db, user)
    return [job_service.to_response(j) for j in jobs]


@router.get("/{job_id}", response_model=ClipperJobOut)
def get_job(job_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = job_service.get_owned_job(db, job_id, user)
    return job_service.to_response(job)


@router.get("/{job_id}/logs")
def get_job_logs(job_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    job = job_service.get_owned_job(db, job_id, user)
    return job_service.to_response(job)["backendLogs"]


@router.post("/{job_id}/render", response_model=RenderAck)
def render_job(
    job_id: str,
    payload: RenderRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    job = job_service.get_owned_job(db, job_id, user)
    job_service.start_render(
        db, job, payload.selection.model_dump(), payload.styleConfig.model_dump()
    )
    return RenderAck(ok=True, jobId=job.id, message="Render started")
