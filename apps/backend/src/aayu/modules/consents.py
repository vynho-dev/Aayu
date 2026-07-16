import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from aayu.auth import get_current_user
from aayu.database import get_session
from aayu.models import Consent, User
from aayu.modules.patients import owned_patient
from aayu.schemas import ConsentCreate, ConsentStatusView, ConsentView

router = APIRouter(prefix="/patients", tags=["consent"])


@router.get("/{patient_id}/consent-status", response_model=ConsentStatusView)
async def consent_status(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ConsentStatusView:
    await owned_patient(patient_id, user, session)
    consent = await session.scalar(select(Consent).where(Consent.patient_id == patient_id))
    return ConsentStatusView(
        accepted=consent is not None,
        accepted_at=consent.accepted_at if consent is not None else None,
    )


@router.post("/{patient_id}/consent", response_model=ConsentView)
async def accept_consent(
    patient_id: uuid.UUID,
    body: ConsentCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Consent:
    await owned_patient(patient_id, user, session)
    consent = await session.scalar(select(Consent).where(Consent.patient_id == patient_id))
    if consent is None:
        consent = Consent(patient_id=patient_id, version=body.version)
        session.add(consent)
    else:
        consent.version = body.version
    await session.commit()
    await session.refresh(consent)
    return consent


@router.delete("/{patient_id}/consent", status_code=204)
async def withdraw_consent(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    await owned_patient(patient_id, user, session)
    consent = await session.scalar(select(Consent).where(Consent.patient_id == patient_id))
    if consent is not None:
        await session.delete(consent)
        await session.commit()
