import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_patient_consent_upload_and_job(client: AsyncClient) -> None:
    patient_response = await client.post(
        "/v1/patients", json={"name": "Appa", "relationship": "father"}
    )
    assert patient_response.status_code == 201
    patient_id = patient_response.json()["id"]

    blocked = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={
            "filename": "claim.pdf",
            "content_type": "application/pdf",
            "kind": "rejection_letter",
        },
    )
    assert blocked.status_code == 409

    consent = await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    assert consent.status_code == 200

    consent_status = await client.get(f"/v1/patients/{patient_id}/consent-status")
    assert consent_status.json()["accepted"] is True

    withdrawn = await client.delete(f"/v1/patients/{patient_id}/consent")
    assert withdrawn.status_code == 204
    withdrawn_status = await client.get(f"/v1/patients/{patient_id}/consent-status")
    assert withdrawn_status.json()["accepted"] is False

    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})

    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={
            "filename": "claim.pdf",
            "content_type": "application/pdf",
            "kind": "rejection_letter",
        },
    )
    assert intent.status_code == 201
    upload = intent.json()

    uploaded = await client.put(
        upload["upload_url"],
        content=b"%PDF-1.4 test",
        headers={**upload["headers"], "X-Dev-User": "test_user"},
    )
    assert uploaded.status_code == 204

    completed = await client.post(f"/v1/documents/{upload['document_id']}/complete")
    assert completed.status_code == 202
    assert completed.json()["status"] == "queued"

    job = await client.get(f"/v1/jobs/{completed.json()['id']}")
    assert job.status_code == 200
    assert job.json()["document_id"] == upload["document_id"]


@pytest.mark.asyncio
async def test_patient_profile_can_be_updated_by_its_owner(client: AsyncClient) -> None:
    created = await client.post(
        "/v1/patients",
        json={"name": "Appa", "relationship": "father", "date_of_birth": "1962-04-12"},
    )
    assert created.status_code == 201

    updated = await client.put(
        f"/v1/patients/{created.json()['id']}",
        json={"name": "Raman Iyer", "relationship": "father", "date_of_birth": "1962-04-12"},
    )
    assert updated.status_code == 200
    assert updated.json() == {
        "id": created.json()["id"],
        "name": "Raman Iyer",
        "relationship": "father",
        "date_of_birth": "1962-04-12",
        "profile": {
            "gender": None,
            "state": None,
            "district": None,
            "pincode": None,
            "blood_group": None,
            "insurance_status": None,
            "insurance_provider": None,
            "insurance_policy_number": None,
            "insurance_policy_expiry": None,
            "medical_history": [],
            "allergies": [],
            "medications": [],
            "chronic_conditions": [],
            "consultation_history": [],
            "emergency_contact_name": None,
            "emergency_contact_relationship": None,
            "emergency_contact_phone": None,
            "preferred_hospital": None,
            "preferred_doctor": None,
            "abha_number": None,
            "ayushman_card_number": None,
            "monthly_household_income": None,
            "employment_type": None,
            "has_bpl_or_antyodaya_ration_card": False,
            "has_disability": False,
            "is_pregnant_or_recent_mother": False,
        },
    }

    other_user = await client.put(
        f"/v1/patients/{created.json()['id']}",
        headers={"X-Dev-User": "other_user"},
        json={"name": "Changed", "relationship": "other", "date_of_birth": None},
    )
    assert other_user.status_code == 404


@pytest.mark.asyncio
async def test_patient_profile_keeps_structured_care_and_insurance_details(
    client: AsyncClient,
) -> None:
    response = await client.post(
        "/v1/patients",
        json={
            "name": "Amma",
            "relationship": "mother",
            "profile": {
                "state": "Telangana",
                "district": "Hyderabad",
                "pincode": "500001",
                "blood_group": "O+",
                "insurance_status": "insured",
                "insurance_provider": "Aayu Health",
                "medical_history": ["Appendectomy, 2015"],
                "allergies": ["Penicillin"],
                "medications": ["Metformin 500 mg"],
                "chronic_conditions": ["Diabetes"],
                "consultation_history": ["2026-07-15 — Dr Rao — diabetes follow-up"],
                "emergency_contact_name": "Ravi",
                "preferred_hospital": "City Hospital",
                "abha_number": "12-3456-7890-1234",
                "monthly_household_income": 25000,
                "employment_type": "farmer",
                "has_bpl_or_antyodaya_ration_card": True,
            },
        },
    )

    assert response.status_code == 201
    profile = response.json()["profile"]
    assert profile["blood_group"] == "O+"
    assert profile["pincode"] == "500001"
    assert profile["allergies"] == ["Penicillin"]
    assert profile["preferred_hospital"] == "City Hospital"
    assert profile["monthly_household_income"] == 25000


@pytest.mark.asyncio
async def test_new_patient_has_an_empty_health_record(client: AsyncClient) -> None:
    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})

    health = await client.get(f"/v1/patients/{patient.json()['id']}/health")
    assert health.status_code == 200
    assert health.json() == {"data": {}, "updated_at": None}


@pytest.mark.asyncio
async def test_failed_document_can_be_requeued(client: AsyncClient) -> None:
    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})
    patient_id = patient.json()["id"]
    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={
            "filename": "claim.pdf",
            "content_type": "application/pdf",
            "kind": "rejection_letter",
        },
    )
    upload = intent.json()
    await client.put(
        upload["upload_url"],
        content=b"not a readable PDF",
        headers={**upload["headers"], "X-Dev-User": "test_user"},
    )
    first = await client.post(f"/v1/documents/{upload['document_id']}/complete")
    assert first.status_code == 202
    job = await client.get(f"/v1/jobs/{first.json()['id']}")
    assert job.json()["status"] == "failed"

    retry = await client.post(f"/v1/documents/{upload['document_id']}/complete")
    assert retry.status_code == 202
    assert retry.json()["id"] == first.json()["id"]
    assert retry.json()["status"] == "queued"
    retried_job = await client.get(f"/v1/jobs/{first.json()['id']}")
    assert retried_job.json()["status"] == "failed"


@pytest.mark.asyncio
async def test_delete_patient(client: AsyncClient) -> None:
    created = await client.post("/v1/patients", json={"name": "Amma", "relationship": "mother"})
    assert created.status_code == 201
    patient_id = created.json()["id"]

    listed = await client.get("/v1/patients")
    assert any(p["id"] == patient_id for p in listed.json())

    forbidden = await client.delete(
        f"/v1/patients/{patient_id}", headers={"X-Dev-User": "other_user"}
    )
    assert forbidden.status_code == 404

    deleted = await client.delete(f"/v1/patients/{patient_id}")
    assert deleted.status_code == 204

    listed_again = await client.get("/v1/patients")
    assert all(p["id"] != patient_id for p in listed_again.json())

    missing = await client.delete(f"/v1/patients/{patient_id}")
    assert missing.status_code == 404


@pytest.mark.asyncio
async def test_delete_patient_preflight_is_allowed(client: AsyncClient) -> None:
    response = await client.options(
        "/v1/patients/00000000-0000-0000-0000-000000000000",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "DELETE",
        },
    )

    assert response.status_code == 200
    assert "DELETE" in response.headers["access-control-allow-methods"]
