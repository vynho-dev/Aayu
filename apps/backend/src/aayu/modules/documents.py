import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from aayu.auth import get_current_user
from aayu.config import get_settings
from aayu.database import get_session
from aayu.models import (
    Consent,
    Document,
    DocumentStatus,
    JobStatus,
    Patient,
    ProcessingJob,
    User,
)
from aayu.modules.patients import owned_patient
from aayu.queue import publish_job
from aayu.schemas import JobView, UploadIntentCreate, UploadIntentView
from aayu.storage import upload_exists, upload_url, write_dev_upload

router = APIRouter(tags=["documents"])


async def owned_document(document_id: uuid.UUID, user: User, session: AsyncSession) -> Document:
    document = await session.scalar(
        select(Document)
        .join(Patient, Patient.id == Document.patient_id)
        .where(Document.id == document_id, Patient.user_id == user.id)
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.post(
    "/patients/{patient_id}/documents/upload-intent",
    response_model=UploadIntentView,
    status_code=201,
)
async def create_upload_intent(
    patient_id: uuid.UUID,
    body: UploadIntentCreate,
    request: Request,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> UploadIntentView:
    await owned_patient(patient_id, user, session)
    if not await session.scalar(select(Consent.id).where(Consent.patient_id == patient_id)):
        raise HTTPException(status_code=409, detail="Consent is required before upload")

    document_id = uuid.uuid4()
    suffix = body.filename.rsplit(".", 1)[-1].lower() if "." in body.filename else "bin"
    object_key = f"patients/{patient_id}/documents/{document_id}.{suffix}"
    document = Document(
        id=document_id,
        patient_id=patient_id,
        kind=body.kind,
        filename=body.filename,
        content_type=body.content_type,
        object_key=object_key,
    )
    session.add(document)
    await session.commit()
    fallback = str(request.url_for("put_dev_upload", document_id=document_id))
    return UploadIntentView(
        document_id=document_id,
        upload_url=upload_url(object_key, body.content_type, fallback),
        headers={"Content-Type": body.content_type},
    )


@router.put("/documents/{document_id}/content", name="put_dev_upload", status_code=204)
async def put_dev_upload(
    document_id: uuid.UUID,
    request: Request,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Response:
    if get_settings().document_bucket:
        raise HTTPException(status_code=404, detail="Not found")
    document = await owned_document(document_id, user, session)
    if request.headers.get("content-type") != document.content_type:
        raise HTTPException(status_code=415, detail="File type does not match upload intent")
    body = await request.body()
    if not body or len(body) > get_settings().max_upload_bytes:
        raise HTTPException(status_code=413, detail="File is empty or too large")
    write_dev_upload(document.object_key, body)
    document.status = DocumentStatus.uploaded.value
    await session.commit()
    return Response(status_code=204)


@router.post("/documents/{document_id}/complete", response_model=JobView, status_code=202)
async def complete_upload(
    document_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ProcessingJob:
    document = await owned_document(document_id, user, session)
    if not upload_exists(document.object_key):
        raise HTTPException(status_code=409, detail="Upload has not completed")
    existing = await session.scalar(
        select(ProcessingJob).where(ProcessingJob.document_id == document_id)
    )
    if existing is not None:
        if existing.status == JobStatus.pending_dispatch.value:
            try:
                publish_job(existing.id)
            except Exception as exc:
                raise HTTPException(
                    status_code=503, detail="Processing is temporarily unavailable"
                ) from exc
            existing.status = JobStatus.queued.value
            await session.commit()
            await session.refresh(existing)
        return existing

    document.status = DocumentStatus.uploaded.value
    job = ProcessingJob(document_id=document_id)
    session.add(job)
    await session.commit()
    await session.refresh(job)
    try:
        publish_job(job.id)
    except Exception as exc:
        raise HTTPException(
            status_code=503, detail="Processing is temporarily unavailable"
        ) from exc
    job.status = JobStatus.queued.value
    await session.commit()
    await session.refresh(job)
    return job


@router.get("/jobs/{job_id}", response_model=JobView)
async def get_job(
    job_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ProcessingJob:
    job = await session.scalar(
        select(ProcessingJob)
        .join(Document, Document.id == ProcessingJob.document_id)
        .join(Patient, Patient.id == Document.patient_id)
        .where(ProcessingJob.id == job_id, Patient.user_id == user.id)
    )
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
