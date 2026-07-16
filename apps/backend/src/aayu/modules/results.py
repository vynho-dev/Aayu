"""Read endpoints for the outputs of document processing: claim, health record, scheme matches."""

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from aayu import policy_chat
from aayu.auth import get_current_user
from aayu.database import get_session
from aayu.models import Claim, Document, HealthRecord, SchemeMatch, User
from aayu.modules.patients import owned_patient
from aayu.schemas import (
    ClaimView,
    DocumentSummaryView,
    HealthRecordView,
    PolicyDocumentView,
    SchemeMatchView,
)

router = APIRouter(tags=["results"])


@router.get("/patients/{patient_id}/claim", response_model=ClaimView)
async def get_claim(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Claim:
    await owned_patient(patient_id, user, session)
    claim = await session.scalar(
        select(Claim).where(Claim.patient_id == patient_id).order_by(Claim.created_at.desc())
    )
    if claim is None:
        raise HTTPException(status_code=404, detail="No claim assessment yet")
    return claim


@router.get("/patients/{patient_id}/health", response_model=HealthRecordView)
async def get_health(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> HealthRecord | HealthRecordView:
    await owned_patient(patient_id, user, session)
    record = await session.scalar(
        select(HealthRecord).where(HealthRecord.patient_id == patient_id)
    )
    if record is None:
        return HealthRecordView(data={}, updated_at=None)
    return record


@router.get("/patients/{patient_id}/schemes", response_model=list[SchemeMatchView])
async def list_schemes(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> list[SchemeMatch]:
    await owned_patient(patient_id, user, session)
    rows = await session.scalars(
        select(SchemeMatch)
        .where(SchemeMatch.patient_id == patient_id)
        .order_by(SchemeMatch.created_at)
    )
    return list(rows)


@router.get("/patients/{patient_id}/documents", response_model=list[DocumentSummaryView])
async def list_documents(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> list[Document]:
    await owned_patient(patient_id, user, session)
    rows = await session.scalars(
        select(Document)
        .where(Document.patient_id == patient_id)
        .order_by(Document.created_at.desc())
    )
    return list(rows)


@router.get("/patients/{patient_id}/policy-document", response_model=PolicyDocumentView)
async def get_policy_document(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> PolicyDocumentView:
    """The patient's most recent policy document + whether its Q&A index is ready."""
    await owned_patient(patient_id, user, session)
    document = await session.scalar(
        select(Document)
        .where(Document.patient_id == patient_id, Document.kind == "policy")
        .order_by(Document.created_at.desc())
    )
    if document is None:
        raise HTTPException(status_code=404, detail="No policy document uploaded yet")
    return PolicyDocumentView(
        document_id=document.id,
        status=document.status,
        index_ready=policy_chat.index_exists(patient_id, document.id),
    )
