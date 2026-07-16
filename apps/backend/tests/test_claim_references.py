import pytest
from httpx import AsyncClient

from aayu import grounding
from aayu.grounding import AnsweredQuestion, RetrievedChunk


@pytest.mark.asyncio
async def test_claim_reference_documents_are_available(client: AsyncClient) -> None:
    response = await client.get("/v1/claim-support/reference-documents")

    assert response.status_code == 200
    documents = response.json()
    assert len(documents) == 16
    assert {document["publisher"] for document in documents} == {
        "Council for Insurance Ombudsmen",
        "Insurance Regulatory and Development Authority of India",
    }
    assert all(document["official_url"].startswith("https://") for document in documents)


@pytest.mark.asyncio
async def test_claim_reference_documents_can_be_filtered_by_scope(client: AsyncClient) -> None:
    response = await client.get("/v1/claim-support/reference-documents?scope=ombudsman")

    assert response.status_code == 200
    documents = response.json()
    assert documents
    assert all(document["scope"] in {"ombudsman", "both"} for document in documents)
    assert any(document["id"] == "cio-ombudsman-rules-2017-amended-2023" for document in documents)


@pytest.mark.asyncio
async def test_ask_question_returns_grounded_answer(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    fake_answer = AnsweredQuestion(
        answer="You can contest this by citing the master circular's grievance timelines.",
        sources=[
            RetrievedChunk(
                document_id="irdai-protection-of-policyholders-2024",
                title="Master Circular on Protection of Policyholders' Interests, 2024",
                official_url="https://irdai.gov.in/documents/example.pdf",
                text="insurers must respond within two weeks",
                score=0.87,
            )
        ],
    )
    monkeypatch.setattr(grounding, "answer_question", lambda question, k=5: fake_answer)

    response = await client.post(
        "/v1/claim-support/ask",
        json={"question": "Can I contest a pre-existing disease rejection?"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == fake_answer.answer
    assert body["sources"] == [
        {
            "document_id": "irdai-protection-of-policyholders-2024",
            "title": "Master Circular on Protection of Policyholders' Interests, 2024",
            "official_url": "https://irdai.gov.in/documents/example.pdf",
        }
    ]


@pytest.mark.asyncio
async def test_ask_question_returns_503_when_index_missing(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    def _raise_missing_index(question: str, k: int = 5):
        raise FileNotFoundError

    monkeypatch.setattr(grounding, "answer_question", _raise_missing_index)

    response = await client.post(
        "/v1/claim-support/ask",
        json={"question": "What is the Ombudsman filing deadline?"},
    )

    assert response.status_code == 503


@pytest.mark.asyncio
async def test_ask_question_rejects_too_short_question(client: AsyncClient) -> None:
    response = await client.post("/v1/claim-support/ask", json={"question": "hi"})

    assert response.status_code == 422
