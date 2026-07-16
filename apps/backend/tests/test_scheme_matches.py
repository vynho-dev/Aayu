import pytest
from httpx import AsyncClient


async def _create_patient(client: AsyncClient, date_of_birth: str | None = None) -> str:
    body = {"name": "Appa", "relationship": "father"}
    if date_of_birth:
        body["date_of_birth"] = date_of_birth
    response = await client.post("/v1/patients", json=body)
    assert response.status_code == 201
    return response.json()["id"]


@pytest.mark.asyncio
async def test_no_profile_returns_empty_state(client: AsyncClient) -> None:
    patient_id = await _create_patient(client)

    response = await client.get(f"/v1/patients/{patient_id}/scheme-matches")

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_senior_citizen_matches_pmjay_regardless_of_income(client: AsyncClient) -> None:
    patient_id = await _create_patient(client, date_of_birth="1950-01-01")

    saved = await client.put(
        f"/v1/patients/{patient_id}/eligibility-profile",
        json={
            "monthly_household_income": 500_000,
            "employment_type": "government_employee_or_pensioner",
        },
    )
    assert saved.status_code == 204

    response = await client.get(f"/v1/patients/{patient_id}/scheme-matches")

    assert response.status_code == 200
    codes = {match["scheme_code"] for match in response.json()}
    assert "pmjay" in codes
    assert "cghs" in codes


@pytest.mark.asyncio
async def test_bpl_low_income_matches_pmjay_and_ran(client: AsyncClient) -> None:
    patient_id = await _create_patient(client, date_of_birth="1990-01-01")

    await client.put(
        f"/v1/patients/{patient_id}/eligibility-profile",
        json={
            "monthly_household_income": 8_000,
            "employment_type": "unorganized_sector_or_self_employed",
            "has_bpl_or_antyodaya_ration_card": True,
        },
    )

    response = await client.get(f"/v1/patients/{patient_id}/scheme-matches")

    codes = {match["scheme_code"] for match in response.json()}
    assert codes == {"pmjay", "ran"}


@pytest.mark.asyncio
async def test_esic_matches_low_income_organized_sector_employee(client: AsyncClient) -> None:
    patient_id = await _create_patient(client, date_of_birth="1990-01-01")

    await client.put(
        f"/v1/patients/{patient_id}/eligibility-profile",
        json={
            "monthly_household_income": 18_000,
            "employment_type": "organized_sector_employee",
        },
    )

    response = await client.get(f"/v1/patients/{patient_id}/scheme-matches")

    codes = {match["scheme_code"] for match in response.json()}
    assert codes == {"esic"}


@pytest.mark.asyncio
async def test_disability_and_pregnancy_match_niramaya_and_pmmvy(client: AsyncClient) -> None:
    patient_id = await _create_patient(client, date_of_birth="1995-01-01")

    await client.put(
        f"/v1/patients/{patient_id}/eligibility-profile",
        json={
            "monthly_household_income": 100_000,
            "employment_type": "unemployed",
            "has_disability": True,
            "is_pregnant_or_recent_mother": True,
        },
    )

    response = await client.get(f"/v1/patients/{patient_id}/scheme-matches")

    codes = {match["scheme_code"] for match in response.json()}
    assert codes == {"niramaya", "pmmvy"}


@pytest.mark.asyncio
async def test_high_income_no_special_status_matches_nothing(client: AsyncClient) -> None:
    patient_id = await _create_patient(client, date_of_birth="1990-01-01")

    await client.put(
        f"/v1/patients/{patient_id}/eligibility-profile",
        json={
            "monthly_household_income": 200_000,
            "employment_type": "unorganized_sector_or_self_employed",
        },
    )

    response = await client.get(f"/v1/patients/{patient_id}/scheme-matches")

    assert response.status_code == 200
    assert response.json() == []
