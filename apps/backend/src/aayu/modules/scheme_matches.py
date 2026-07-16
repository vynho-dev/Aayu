import uuid
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from aayu.auth import get_current_user
from aayu.database import get_session
from aayu.models import HealthRecord, SchemeMatch, User
from aayu.modules.patients import owned_patient
from aayu.schemas import EligibilityMatchView, EligibilityProfileInput
from aayu.schemes import EligibilityProfile, match_schemes

router = APIRouter(prefix="/patients", tags=["scheme matches"])


def _age(date_of_birth: date | None) -> int | None:
    if date_of_birth is None:
        return None
    today = date.today()
    years = today.year - date_of_birth.year
    if (today.month, today.day) < (date_of_birth.month, date_of_birth.day):
        years -= 1
    return years


@router.put("/{patient_id}/eligibility-profile", status_code=status.HTTP_204_NO_CONTENT)
async def save_eligibility_profile(
    patient_id: uuid.UUID,
    body: EligibilityProfileInput,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    await owned_patient(patient_id, user, session)
    record = await session.scalar(
        select(HealthRecord).where(HealthRecord.patient_id == patient_id)
    )
    if record is None:
        record = HealthRecord(patient_id=patient_id, data={})
        session.add(record)
    record.data = {**record.data, "eligibility_profile": body.model_dump()}
    await session.commit()


@router.get("/{patient_id}/scheme-matches", response_model=list[EligibilityMatchView])
async def list_scheme_matches(
    patient_id: uuid.UUID,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> list[EligibilityMatchView]:
    patient = await owned_patient(patient_id, user, session)
    record = await session.scalar(
        select(HealthRecord).where(HealthRecord.patient_id == patient_id)
    )
    profile_data = (record.data if record else {}).get("eligibility_profile")
    if profile_data is None:
        return []

    profile = EligibilityProfile(age=_age(patient.date_of_birth), **profile_data)
    matches = [result for result in match_schemes(profile) if result.matched]

    await session.execute(delete(SchemeMatch).where(SchemeMatch.patient_id == patient_id))
    session.add_all(
        SchemeMatch(
            patient_id=patient_id,
            scheme_code=result.scheme.code,
            explanation=result.explanation,
            matched=True,
        )
        for result in matches
    )
    await session.commit()

    return [
        EligibilityMatchView(
            scheme_code=result.scheme.code,
            name=result.scheme.name,
            authority=result.scheme.authority,
            benefit_summary=result.scheme.benefit_summary,
            official_url=result.scheme.official_url,
            explanation=result.explanation,
        )
        for result in matches
    ]
