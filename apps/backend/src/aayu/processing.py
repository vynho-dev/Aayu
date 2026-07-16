"""Document processing pipeline: extract text → health record + claim assessment + scheme match.

Runs as a FastAPI BackgroundTask in dev (no SQS worker) and is the same entrypoint a real
worker would call. Deterministic by default so it works with no API key; when OPENAI_API_KEY
is set it upgrades the denial assessment + appeal to an LLM, falling back safely on any error.
"""

from __future__ import annotations

import json
import logging
import os
import re
import tempfile
import uuid
from pathlib import Path

from sqlalchemy import delete, select

from aayu import storage
from aayu.database import SessionLocal
from aayu.grounding import CHAT_MODEL, extract_text
from aayu.models import (
    Claim,
    Document,
    DocumentStatus,
    HealthRecord,
    JobStatus,
    Patient,
    ProcessingJob,
    SchemeMatch,
)
from aayu.scheme_rules import MatchContext, match_schemes

logger = logging.getLogger(__name__)

_AMOUNT_RE = re.compile(r"(?:₹|Rs\.?|INR)\s?([\d,]+(?:\.\d{1,2})?)", re.IGNORECASE)


def parse_amounts(text: str) -> list[float]:
    """Every ₹/Rs/INR amount in the text, largest-first. Naive but real — from the actual doc."""
    values: list[float] = []
    for raw in _AMOUNT_RE.findall(text):
        try:
            values.append(float(raw.replace(",", "")))
        except ValueError:
            continue
    return sorted(values, reverse=True)


def _appeal_template(patient_name: str, recoverable: float) -> str:
    amount = f"₹{recoverable:,.0f}" if recoverable else "the denied amount"
    return (
        f"To the Claims Review Officer,\n\n"
        f"I am writing to formally appeal the denial of the health insurance claim for "
        f"{patient_name}. Based on the documents provided, I request a full review and "
        f"reversal of {amount}.\n\n"
        f"Please treat this as a formal grievance and confirm the next steps.\n\n"
        f"Sincerely,\n{patient_name}'s caregiver"
    )


def _deterministic_assessment(text: str, patient_name: str) -> tuple[dict, str]:
    amounts = parse_amounts(text)
    recoverable = amounts[0] if amounts else 0.0
    assessment = {
        "reason": (
            "Aayu read the rejection letter and flagged the denied amount below. A denial is "
            "often contestable — review it against your policy before deciding."
        ),
        "contestable": True,
        "recoverable_amount": recoverable,
        "documents_read": 1,
        "source": "heuristic",  # honest: no AI reasoning yet
    }
    return assessment, _appeal_template(patient_name, recoverable)


def _llm_assessment(text: str, patient_name: str) -> tuple[dict, str] | None:
    """LLM denial assessment + appeal. Returns None on any failure so the caller falls back.

    ponytail: guarded and untested until OPENAI_API_KEY is set; deterministic path is the default.
    """
    try:
        from openai import OpenAI

        client = OpenAI()
        prompt = (
            "You are Aayu's claim-assistance assistant (assistance, not legal advice). From this "
            "health-insurance rejection letter, return STRICT JSON with keys: reason (short plain "
            "explanation of why it was denied), contestable (boolean), recoverable_amount (number "
            "in INR, 0 if unknown), clause (policy section if named else null), and appeal (a "
            "clause-cited appeal letter addressed to the Claims Review Officer for "
            f"{patient_name}). Rejection letter:\n\n{text[:6000]}"
        )
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
        )
        data = json.loads(response.choices[0].message.content or "{}")
        appeal = str(data.pop("appeal", "") or _appeal_template(patient_name, 0))
        data["documents_read"] = 1
        data["source"] = "llm"
        return data, appeal
    except Exception:
        logger.exception("LLM assessment failed; using deterministic fallback")
        return None


async def process_document(document_id: uuid.UUID) -> None:
    """Extract text, build/refresh the patient's health record, claim, and scheme matches."""
    async with SessionLocal() as session:
        document = await session.get(Document, document_id)
        job = await session.scalar(
            select(ProcessingJob).where(ProcessingJob.document_id == document_id)
        )
        if document is None or job is None:
            return
        patient = await session.get(Patient, document.patient_id)
        if patient is None:
            return

        job.status = JobStatus.processing.value
        document.status = DocumentStatus.processing.value
        await session.commit()

        try:
            raw = storage.read_bytes(document.object_key)
            suffix = Path(document.filename).suffix or ".bin"
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
                tmp.write(raw)
                tmp.flush()
                text = extract_text(Path(tmp.name))

            await _upsert_health_record(session, patient.id, text)

            recoverable = 0.0
            if document.kind == "rejection_letter":
                recoverable = await _upsert_claim(session, patient, text)

            await _refresh_scheme_matches(
                session,
                patient.id,
                has_rejected_claim=document.kind == "rejection_letter" or recoverable > 0,
                recoverable=recoverable,
            )

            job.status = JobStatus.completed.value
            document.status = DocumentStatus.completed.value
            await session.commit()
        except Exception:
            logger.exception("Processing failed for document %s", document_id)
            await session.rollback()
            job = await session.scalar(
                select(ProcessingJob).where(ProcessingJob.document_id == document_id)
            )
            document = await session.get(Document, document_id)
            if job is not None:
                job.status = JobStatus.failed.value
                job.error_code = "processing_failed"
            if document is not None:
                document.status = DocumentStatus.failed.value
            await session.commit()


async def _upsert_health_record(session, patient_id: uuid.UUID, text: str) -> None:
    excerpt = text.strip()[:800]
    amounts = parse_amounts(text)
    record = await session.scalar(select(HealthRecord).where(HealthRecord.patient_id == patient_id))
    data = {"summary": excerpt, "amounts": amounts[:5], "extracted_chars": len(text)}
    if record is None:
        session.add(HealthRecord(patient_id=patient_id, data=data))
    else:
        record.data = data


async def _upsert_claim(session, patient: Patient, text: str) -> float:
    assessment, appeal = (
        _llm_assessment(text, patient.name) if os.environ.get("OPENAI_API_KEY") else None
    ) or _deterministic_assessment(text, patient.name)
    recoverable = float(assessment.get("recoverable_amount") or 0)
    claim = await session.scalar(select(Claim).where(Claim.patient_id == patient.id))
    if claim is None:
        session.add(
            Claim(
                patient_id=patient.id,
                status="assessed",
                assessment=assessment,
                appeal_text=appeal,
            )
        )
    else:
        claim.status = "assessed"
        claim.assessment = assessment
        claim.appeal_text = appeal
    return recoverable


async def _refresh_scheme_matches(
    session, patient_id: uuid.UUID, *, has_rejected_claim: bool, recoverable: float
) -> None:
    await session.execute(delete(SchemeMatch).where(SchemeMatch.patient_id == patient_id))
    context = MatchContext(has_rejected_claim=has_rejected_claim, recoverable_amount=recoverable)
    for candidate in match_schemes(context):
        session.add(
            SchemeMatch(
                patient_id=patient_id,
                scheme_code=candidate.code,
                explanation=candidate.explanation,
                matched=candidate.matched,
            )
        )


async def process_document_task(document_id: uuid.UUID) -> None:
    """BackgroundTask wrapper — swallow/log so a failure never bubbles to a closed response."""
    try:
        await process_document(document_id)
    except Exception:
        logger.exception("Background processing crashed for document %s", document_id)
