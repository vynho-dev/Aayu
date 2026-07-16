import uuid

import pytest
from httpx import AsyncClient

from aayu import policy_chat, storage


class _FakeEmbeddings:
    def __init__(self, vector_for_text):
        self._vector_for_text = vector_for_text

    def create(self, model: str, input: list[str]):
        data = [type("Item", (), {"embedding": self._vector_for_text(t)}) for t in input]
        return type("Response", (), {"data": data})


class _FakeChatCompletions:
    def __init__(self, reply: str):
        self._reply = reply

    def create(self, model: str, messages: list[dict]):
        message = type("Message", (), {"content": self._reply})
        choice = type("Choice", (), {"message": message})
        return type("Response", (), {"choices": [choice]})


class _FakeOpenAI:
    """Deterministic stand-in for openai.OpenAI() - no network, no API key."""

    def __init__(self, vector_for_text, reply: str = "Here is your answer."):
        self.embeddings = _FakeEmbeddings(vector_for_text)
        self.chat = type("Chat", (), {"completions": _FakeChatCompletions(reply)})()


def _keyword_vector(text: str) -> list[float]:
    lowered = text.lower()
    return [1.0 if "room rent" in lowered else 0.0, 1.0 if "waiting period" in lowered else 0.0]


@pytest.fixture
def fake_object_store(monkeypatch: pytest.MonkeyPatch) -> dict[str, bytes]:
    store: dict[str, bytes] = {}

    def _read(key: str) -> bytes:
        if key not in store:
            raise FileNotFoundError(key)
        return store[key]

    def _write(key: str, body: bytes) -> None:
        store[key] = body

    def _exists(key: str) -> bool:
        return key in store

    monkeypatch.setattr(storage, "read_bytes", _read)
    monkeypatch.setattr(storage, "write_bytes", _write)
    monkeypatch.setattr(storage, "upload_exists", _exists)
    return store


def test_ask_builds_index_on_first_question_then_reuses_it(
    fake_object_store: dict[str, bytes],
) -> None:
    patient_id = uuid.uuid4()
    document_id = uuid.uuid4()
    object_key = f"patients/{patient_id}/documents/{document_id}.txt"
    fake_object_store[object_key] = (
        b"Room rent is capped at 1% of the sum insured per day. "
        b"There is a two-year waiting period for cataract surgery."
    )
    client = _FakeOpenAI(_keyword_vector, reply="Room rent is capped at 1% of sum insured.")

    assert not policy_chat.index_exists(patient_id, document_id)
    result = policy_chat.ask(
        patient_id, document_id, object_key, "What is the room rent limit?", client=client
    )

    assert result.answer == "Room rent is capped at 1% of sum insured."
    assert result.excerpts
    assert policy_chat.index_exists(patient_id, document_id)

    keys_after_build = set(fake_object_store)
    result2 = policy_chat.ask(
        patient_id, document_id, object_key, "What is the cataract waiting period?", client=client
    )
    assert set(fake_object_store) == keys_after_build  # reused, not rebuilt
    assert result2.excerpts


def test_ask_raises_on_document_with_no_extractable_text(
    fake_object_store: dict[str, bytes],
) -> None:
    patient_id = uuid.uuid4()
    document_id = uuid.uuid4()
    object_key = f"patients/{patient_id}/documents/{document_id}.txt"
    fake_object_store[object_key] = b"   "

    with pytest.raises(ValueError):
        policy_chat.ask(
            patient_id, document_id, object_key, "What is covered?", client=_FakeOpenAI(_keyword_vector)
        )


@pytest.mark.asyncio
async def test_complete_upload_triggers_policy_index_build_in_background(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    calls: list[tuple] = []
    monkeypatch.setattr(
        policy_chat,
        "build_policy_index",
        lambda patient_id, document_id, object_key, client=None: calls.append(
            (patient_id, document_id, object_key)
        ),
    )

    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})
    patient_id = patient.json()["id"]
    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={"filename": "policy.pdf", "content_type": "application/pdf", "kind": "policy"},
    )
    upload = intent.json()
    await client.put(
        upload["upload_url"],
        content=b"%PDF-1.4 test",
        headers={**upload["headers"], "X-Dev-User": "test_user"},
    )

    completed = await client.post(f"/v1/documents/{upload['document_id']}/complete")

    assert completed.status_code == 202
    assert len(calls) == 1
    assert calls[0][2] == f"patients/{patient_id}/documents/{upload['document_id']}.pdf"


@pytest.mark.asyncio
async def test_complete_upload_skips_non_policy_documents(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    calls: list[tuple] = []
    monkeypatch.setattr(
        policy_chat,
        "build_policy_index",
        lambda patient_id, document_id, object_key, client=None: calls.append(True),
    )

    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})
    patient_id = patient.json()["id"]
    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={"filename": "bill.pdf", "content_type": "application/pdf", "kind": "bill"},
    )
    upload = intent.json()
    await client.put(
        upload["upload_url"],
        content=b"%PDF-1.4 test",
        headers={**upload["headers"], "X-Dev-User": "test_user"},
    )

    completed = await client.post(f"/v1/documents/{upload['document_id']}/complete")

    assert completed.status_code == 202
    assert calls == []


@pytest.mark.asyncio
async def test_policy_chat_rejects_non_policy_document(client: AsyncClient) -> None:
    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})
    patient_id = patient.json()["id"]
    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={"filename": "bill.pdf", "content_type": "application/pdf", "kind": "bill"},
    )
    document_id = intent.json()["document_id"]

    response = await client.post(
        f"/v1/patients/{patient_id}/documents/{document_id}/policy-chat",
        json={"question": "What does this cover?"},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_policy_chat_requires_upload_to_complete(client: AsyncClient) -> None:
    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})
    patient_id = patient.json()["id"]
    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={"filename": "policy.pdf", "content_type": "application/pdf", "kind": "policy"},
    )
    document_id = intent.json()["document_id"]

    response = await client.post(
        f"/v1/patients/{patient_id}/documents/{document_id}/policy-chat",
        json={"question": "What is covered?"},
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_policy_chat_answers_once_uploaded(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    patient = await client.post("/v1/patients", json={"name": "Appa", "relationship": "father"})
    patient_id = patient.json()["id"]
    await client.post(f"/v1/patients/{patient_id}/consent", json={"accepted": True})
    intent = await client.post(
        f"/v1/patients/{patient_id}/documents/upload-intent",
        json={"filename": "policy.pdf", "content_type": "application/pdf", "kind": "policy"},
    )
    upload = intent.json()
    put_response = await client.put(
        upload["upload_url"],
        content=b"%PDF-1.4 test",
        headers={**upload["headers"], "X-Dev-User": "test_user"},
    )
    assert put_response.status_code == 204

    fake_result = policy_chat.PolicyAnswer(
        answer="Your policy covers hospitalization up to 5 lakh.",
        excerpts=["Sum insured: Rs. 5,00,000"],
    )
    monkeypatch.setattr(policy_chat, "ask", lambda *args, **kwargs: fake_result)

    response = await client.post(
        f"/v1/patients/{patient_id}/documents/{upload['document_id']}/policy-chat",
        json={"question": "What is my sum insured?"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == fake_result.answer
    assert body["excerpts"] == fake_result.excerpts
