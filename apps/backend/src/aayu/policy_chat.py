"""Runtime, per-document FAISS index for the "explain my policy" chatbot (FR-12).

Each uploaded policy document gets its own index, built on first question and
cached from then on (the source document is immutable once uploaded - see
modules/documents.py - so there's nothing to invalidate). The index is keyed
by patient_id/document_id and persisted in the same object storage as the
source document (S3 in production, local dev-fallback otherwise), never on
local container disk - API/worker containers are stateless and replaceable
(see docs/architecture.md).

Unlike aayu.grounding (the shared IRDAI/CIO knowledge base), this index is
scoped to exactly one user's own policy text - answers must not draw on the
regulatory corpus or any other user's documents.
"""

from __future__ import annotations

import json
import logging
import tempfile
import uuid
from dataclasses import dataclass
from pathlib import Path

import numpy as np

from aayu import storage
from aayu.grounding import CHAT_MODEL, EMBEDDING_MODEL, chunk_text, extract_text, normalize_vectors

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = (
    "You are Aayu's policy explainer. Answer strictly from the provided excerpts of the "
    "user's own health insurance policy - if the excerpts don't cover the question, say so "
    "instead of guessing. This is plain-language explanation, not legal advice."
)


def _index_prefix(patient_id: uuid.UUID, document_id: uuid.UUID) -> str:
    return f"patients/{patient_id}/documents/{document_id}/policy-index"


@dataclass(frozen=True, slots=True)
class PolicyAnswer:
    answer: str
    excerpts: list[str]


def index_exists(patient_id: uuid.UUID, document_id: uuid.UUID) -> bool:
    return storage.upload_exists(f"{_index_prefix(patient_id, document_id)}/faiss.index")


def build_policy_index(
    patient_id: uuid.UUID, document_id: uuid.UUID, object_key: str, client=None
) -> None:
    """Download the source document, extract + chunk + embed it, and persist the index."""
    import faiss

    if client is None:
        from openai import OpenAI

        client = OpenAI()

    raw_bytes = storage.read_bytes(object_key)
    suffix = Path(object_key).suffix
    with tempfile.NamedTemporaryFile(suffix=suffix) as tmp_file:
        tmp_file.write(raw_bytes)
        tmp_file.flush()
        text = extract_text(Path(tmp_file.name))

    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("No extractable text in this document")

    embeddings = []
    batch_size = 100
    for start in range(0, len(chunks), batch_size):
        response = client.embeddings.create(
            model=EMBEDDING_MODEL, input=chunks[start : start + batch_size]
        )
        embeddings.extend(item.embedding for item in response.data)

    vectors = normalize_vectors(np.array(embeddings, dtype="float32"))
    index = faiss.IndexFlatIP(vectors.shape[1])
    index.add(vectors)

    prefix = _index_prefix(patient_id, document_id)
    index_bytes = faiss.serialize_index(index).tobytes()
    storage.write_bytes(f"{prefix}/faiss.index", index_bytes)
    storage.write_bytes(f"{prefix}/chunks.json", json.dumps(chunks).encode())


def build_policy_index_in_background(
    patient_id: uuid.UUID, document_id: uuid.UUID, object_key: str
) -> None:
    """Build-and-swallow variant for FastAPI BackgroundTasks - the response has already
    gone out, so there's no one to raise to. `ask()` falls back to a lazy build if this
    doesn't finish or fails, so a swallowed error here just costs the first question a
    few extra seconds rather than breaking the chat feature.
    """
    try:
        build_policy_index(patient_id, document_id, object_key)
    except Exception:
        logger.exception(
            "Background policy-index build failed for document %s (patient %s)",
            document_id,
            patient_id,
        )


def answer_policy_question(
    patient_id: uuid.UUID, document_id: uuid.UUID, question: str, k: int = 5, client=None
) -> PolicyAnswer:
    import faiss

    if client is None:
        from openai import OpenAI

        client = OpenAI()

    prefix = _index_prefix(patient_id, document_id)
    index_bytes = storage.read_bytes(f"{prefix}/faiss.index")
    chunks: list[str] = json.loads(storage.read_bytes(f"{prefix}/chunks.json"))

    index = faiss.deserialize_index(np.frombuffer(index_bytes, dtype="uint8"))
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=[question])
    query_vector = normalize_vectors(np.array([response.data[0].embedding], dtype="float32"))
    _, indices = index.search(query_vector, k)

    excerpts = [chunks[i] for i in indices[0] if i >= 0]
    if not excerpts:
        return PolicyAnswer(
            answer="I couldn't find anything relevant to that in this policy document.",
            excerpts=[],
        )

    context = "\n\n---\n\n".join(excerpts)
    completion = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": f"Question: {question}\n\nPolicy excerpts:\n{context}"},
        ],
    )
    return PolicyAnswer(answer=completion.choices[0].message.content or "", excerpts=excerpts)


def ask(
    patient_id: uuid.UUID,
    document_id: uuid.UUID,
    object_key: str,
    question: str,
    k: int = 5,
    client=None,
) -> PolicyAnswer:
    """Answer `question` against this document's policy index, building it on first use."""
    if client is None:
        from openai import OpenAI

        client = OpenAI()

    if not index_exists(patient_id, document_id):
        build_policy_index(patient_id, document_id, object_key, client)
    return answer_policy_question(patient_id, document_id, question, k=k, client=client)
