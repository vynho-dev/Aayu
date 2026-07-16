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
    }

    other_user = await client.put(
        f"/v1/patients/{created.json()['id']}",
        headers={"X-Dev-User": "other_user"},
        json={"name": "Changed", "relationship": "other", "date_of_birth": None},
    )
    assert other_user.status_code == 404


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
