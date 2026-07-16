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
