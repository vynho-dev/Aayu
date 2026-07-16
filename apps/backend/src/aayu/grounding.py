"""Local knowledge base over apps/backend/grounding/: extraction, chunking,
and FAISS-backed retrieval for the Claims AI head's prompt context.

Build the index once (needs OPENAI_API_KEY):
    python scripts/build_knowledge_index.py

Then at request time:
    from aayu.grounding import answer_question
    result = answer_question("Can I contest a pre-existing disease rejection?")
"""

from __future__ import annotations

import json
import re
import zipfile
from dataclasses import dataclass
from pathlib import Path
from xml.etree import ElementTree

import numpy as np

from aayu.claim_references import CLAIM_REFERENCE_DOCUMENTS

GROUNDING_DIR = Path(__file__).resolve().parents[2] / "grounding" / "irdai"
INDEX_DIR = GROUNDING_DIR.parent / "index"
MANIFEST_PATH = GROUNDING_DIR / "manifest.json"
EMBEDDING_MODEL = "text-embedding-3-small"
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 200

_DOCX_TEXT_TAG = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"


def _extract_docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as archive:
        xml_bytes = archive.read("word/document.xml")
    root = ElementTree.fromstring(xml_bytes)
    return "\n".join(node.text for node in root.iter(_DOCX_TEXT_TAG) if node.text)


def _ocr_page(path: Path, page_number: int) -> str:
    from pdf2image import convert_from_path
    from pytesseract import image_to_string

    images = convert_from_path(str(path), first_page=page_number, last_page=page_number)
    return image_to_string(images[0]) if images else ""


def _extract_pdf_text(path: Path) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    pages: list[str] = []
    for index, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        if not text:
            text = _ocr_page(path, index + 1)
        pages.append(text)
    return "\n\n".join(pages)


_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def _extract_image_text(path: Path) -> str:
    from PIL import Image
    from pytesseract import image_to_string

    with Image.open(path) as image:
        return image_to_string(image)


def extract_text(path: Path) -> str:
    """Extract plain text from a document. OCRs PDF pages with no text layer and images."""
    if path.suffix == ".pdf":
        return _extract_pdf_text(path)
    if path.suffix == ".docx":
        return _extract_docx_text(path)
    if path.suffix.lower() in _IMAGE_SUFFIXES:
        return _extract_image_text(path)
    return path.read_text(errors="ignore")


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Fixed-size character chunking with overlap. Good enough for a 16-document corpus."""
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end].strip())
        start = end - overlap
    return [chunk for chunk in chunks if chunk]


def load_manifest() -> dict[str, dict]:
    return json.loads(MANIFEST_PATH.read_text())


@dataclass(frozen=True, slots=True)
class RetrievedChunk:
    document_id: str
    title: str
    official_url: str
    text: str
    score: float


def normalize_vectors(vectors: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return vectors / norms


def extract_and_chunk_all() -> list[dict]:
    """Extract text for every manifest source, cache it under extracted/, and chunk it.

    No network access required - safe to run without an OpenAI key.
    """
    manifest = load_manifest()
    documents_by_id = {doc.id: doc for doc in CLAIM_REFERENCE_DOCUMENTS}

    records: list[dict] = []
    for document_id, entry in manifest.items():
        source_path = entry.get("source_path")
        if not source_path:
            continue
        doc = documents_by_id[document_id]
        text = extract_text(GROUNDING_DIR / source_path)
        (GROUNDING_DIR / "extracted").mkdir(exist_ok=True)
        (GROUNDING_DIR / "extracted" / f"{document_id}.txt").write_text(text)
        for chunk_index, chunk in enumerate(chunk_text(text)):
            records.append(
                {
                    "document_id": document_id,
                    "title": doc.title,
                    "official_url": doc.official_url,
                    "chunk_index": chunk_index,
                    "text": chunk,
                }
            )
    return records


def build_index(client) -> None:
    """One-time build: extract -> chunk -> embed -> write a local FAISS index.

    `client` is an `openai.OpenAI()` instance, passed in so callers/tests can
    swap in a fake embeddings client without a real API key.
    """
    import faiss

    records = extract_and_chunk_all()
    if not records:
        raise RuntimeError("No chunks produced - check the manifest and grounding sources.")

    embeddings = []
    batch_size = 100
    for start in range(0, len(records), batch_size):
        batch = [r["text"] for r in records[start : start + batch_size]]
        response = client.embeddings.create(model=EMBEDDING_MODEL, input=batch)
        embeddings.extend(item.embedding for item in response.data)

    vectors = normalize_vectors(np.array(embeddings, dtype="float32"))
    index = faiss.IndexFlatIP(vectors.shape[1])
    index.add(vectors)

    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(INDEX_DIR / "faiss.index"))
    (INDEX_DIR / "chunks.json").write_text(json.dumps(records))


CHAT_MODEL = "gpt-4o-mini"

_SYSTEM_PROMPT = (
    "You are Aayu's claim-assistance guide. Answer strictly from the provided IRDAI/CIO "
    "excerpts - if they don't cover the question, say so instead of guessing. This is "
    "claim assistance, not legal advice; say so when the question calls for a legal "
    "opinion. Cite which excerpt(s) you relied on by document title."
)


@dataclass(frozen=True, slots=True)
class AnsweredQuestion:
    answer: str
    sources: list[RetrievedChunk]


def answer_question(question: str, k: int = 5, client=None) -> AnsweredQuestion:
    """Retrieve grounding context for `question` and generate a cited answer."""
    if client is None:
        from openai import OpenAI

        client = OpenAI()

    sources = retrieve(question, k=k, client=client)
    if not sources:
        return AnsweredQuestion(
            answer="I couldn't find anything relevant in the IRDAI/CIO knowledge base for that.",
            sources=[],
        )

    context = "\n\n".join(f"[{source.title}]\n{source.text}" for source in sources)
    response = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": f"Question: {question}\n\nExcerpts:\n{context}"},
        ],
    )
    answer = response.choices[0].message.content or ""
    return AnsweredQuestion(answer=answer, sources=sources)


def retrieve(query: str, k: int = 5, client=None) -> list[RetrievedChunk]:
    """Embed `query` and return the k closest grounding chunks with their citation."""
    import faiss

    if client is None:
        from openai import OpenAI

        client = OpenAI()

    index = faiss.read_index(str(INDEX_DIR / "faiss.index"))
    records = json.loads((INDEX_DIR / "chunks.json").read_text())

    response = client.embeddings.create(model=EMBEDDING_MODEL, input=[query])
    query_vector = normalize_vectors(np.array([response.data[0].embedding], dtype="float32"))
    scores, indices = index.search(query_vector, k)

    results = []
    for score, position in zip(scores[0], indices[0], strict=True):
        if position < 0:
            continue
        record = records[position]
        results.append(
            RetrievedChunk(
                document_id=record["document_id"],
                title=record["title"],
                official_url=record["official_url"],
                text=record["text"],
                score=float(score),
            )
        )
    return results
