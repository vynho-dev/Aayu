import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from aayu.auth import get_current_user
from aayu.database import get_session
from aayu.models import Patient, User
from aayu.schemas import PatientCreate, PatientView

router = APIRouter(prefix="/patients", tags=["patients"])


async def owned_patient(patient_id: uuid.UUID, user: User, session: AsyncSession) -> Patient:
    patient = await session.scalar(
        select(Patient).where(Patient.id == patient_id, Patient.user_id == user.id)
    )
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("", response_model=list[PatientView])
async def list_patients(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> list[Patient]:
    result = await session.scalars(
        select(Patient).where(Patient.user_id == user.id).order_by(Patient.created_at)
    )
    return list(result)


@router.post("", response_model=PatientView, status_code=201)
async def create_patient(
    body: PatientCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Patient:
    values = body.model_dump()
    values["profile"] = body.profile.model_dump(mode="json")
    patient = Patient(user_id=user.id, **values)
    session.add(patient)
    await session.commit()
    await session.refresh(patient)
    return patient


@router.put("/{patient_id}", response_model=PatientView)
async def update_patient(
    patient_id: uuid.UUID,
    body: PatientCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Patient:
    patient = await owned_patient(patient_id, user, session)
    for field, value in body.model_dump().items():
        if field == "profile":
            value = body.profile.model_dump(mode="json")
        setattr(patient, field, value)
    await session.commit()
    await session.refresh(patient)
    return patient


@router.delete("/{patient_id}", status_code=204)
async def delete_patient(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    patient = await owned_patient(patient_id, user, session)
    await session.delete(patient)
    await session.commit()
