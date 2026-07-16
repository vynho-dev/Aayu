import json

from aayu import grounding
from aayu.claim_references import ClaimReferenceDocument


def test_chunk_text_splits_with_overlap() -> None:
    text = "abcdefghij" * 5  # 50 chars
    chunks = grounding.chunk_text(text, size=20, overlap=5)

    assert chunks[0] == text[0:20]
    assert chunks[1] == text[15:35]
    assert all(chunks)


def test_chunk_text_blank_input_returns_no_chunks() -> None:
    assert grounding.chunk_text("   \n\n  ") == []


class _FakeEmbeddings:
    def __init__(self, vector_for_text):
        self._vector_for_text = vector_for_text

    def create(self, model: str, input: list[str]):
        data = [type("Item", (), {"embedding": self._vector_for_text(text)}) for text in input]
        return type("Response", (), {"data": data})


class _FakeOpenAI:
    """Deterministic stand-in for openai.OpenAI() - no network, no API key."""

    def __init__(self, vector_for_text):
        self.embeddings = _FakeEmbeddings(vector_for_text)


def _keyword_vector(text: str) -> list[float]:
    lowered = text.lower()
    return [1.0 if "apple" in lowered else 0.0, 1.0 if "zebra" in lowered else 0.0]


def test_build_index_and_retrieve_round_trip(tmp_path, monkeypatch) -> None:
    grounding_dir = tmp_path / "irdai"
    grounding_dir.mkdir()
    (grounding_dir / "doc-a.md").write_text("Apple content about apples.")
    (grounding_dir / "doc-b.md").write_text("Zebra content about zebras.")
    manifest = {
        "doc-a": {"source_path": "doc-a.md", "format": "web-text"},
        "doc-b": {"source_path": "doc-b.md", "format": "web-text"},
    }
    (grounding_dir / "manifest.json").write_text(json.dumps(manifest))

    fake_docs = (
        ClaimReferenceDocument(
            id="doc-a",
            title="Doc A",
            publisher="Test",
            document_format="Web page",
            official_url="https://example.com/a",
            scope="mvp",
            topics=("apple",),
            use_in_aayu="test fixture",
        ),
        ClaimReferenceDocument(
            id="doc-b",
            title="Doc B",
            publisher="Test",
            document_format="Web page",
            official_url="https://example.com/b",
            scope="mvp",
            topics=("zebra",),
            use_in_aayu="test fixture",
        ),
    )
    monkeypatch.setattr(grounding, "CLAIM_REFERENCE_DOCUMENTS", fake_docs)
    monkeypatch.setattr(grounding, "GROUNDING_DIR", grounding_dir)
    monkeypatch.setattr(grounding, "MANIFEST_PATH", grounding_dir / "manifest.json")
    monkeypatch.setattr(grounding, "INDEX_DIR", tmp_path / "index")

    grounding.build_index(_FakeOpenAI(_keyword_vector))
    results = grounding.retrieve(
        "tell me about apples", k=1, client=_FakeOpenAI(_keyword_vector)
    )

    assert results[0].document_id == "doc-a"
    assert results[0].official_url == "https://example.com/a"
