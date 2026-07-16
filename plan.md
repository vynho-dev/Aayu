# Aayu MVP Implementation Plan

Source of truth: [`PRD.md`](PRD.md) (functional requirements FR-1–FR-21, Section 7; locked MVP spec, Section 11). This plan sequences everything needed to go from the current codebase to that locked spec. LLM provider: **OpenAI** (`text-embedding-3-small` for retrieval, a GPT-4o-class model for the AI heads — see `docs/architecture.md`).

## 1. Feature inventory

| FR | Feature | Status |
|----|---------|--------|
| FR-1 | Email/password auth (Clerk) | **Done** |
| FR-2 | Caregiver creates/selects Patient | **Done** |
| FR-3 | All data scoped to Patient owned by User | **Done** |
| FR-4 | Multiple caregivers, patient self-access, OTP | Future |
| FR-5 | Upload PDF/image documents | **Done** |
| FR-6 | Scanned photos, multi-page PDFs, encrypted storage | **Done** |
| FR-7 | AI extraction into Health Graph object | Not started — Workstream B |
| FR-8 | ABDM/ABHA fetch, email-forwarding ingestion | Future |
| FR-9 | Upload rejection letter/policy/bills for analysis | Not started — Workstream C |
| FR-10 | Denial-reason + contestability assessment | Not started — Workstream C |
| FR-11 | Clause-cited appeal letter (PDF) | Not started — Workstream C |
| FR-12 | "Explain my policy" Q&A | **Done** — `POST /v1/patients/{id}/documents/{id}/policy-chat` |
| FR-13 | Pre-claim check | Future |
| FR-14 | Claim status tracking, Ombudsman escalation, success-fee billing | Future |
| FR-15 | Vault auto-populates from claim-flow documents | Not started — Workstream D |
| FR-16 | Vault: conditions/medications/allergies/timeline | Not started — Workstream D |
| FR-17 | AI trend detection, drug interactions, manual entry, sharing | Future |
| FR-18 | Scheme Advisor: ≥1 relevant scheme, rule-based match | Not started — Workstream E |
| FR-19 | Full eligibility engine, application submission | Future |
| FR-20 | Consent screen before first upload | **Done** |
| FR-21 | Graceful handling of AI failure / low confidence | Not started — Workstream F |

Done items: `apps/backend/src/aayu/modules/{patients,consents,documents}.py`. Not-started items have DB models (`Claim`, `HealthRecord`, `SchemeMatch` in `models.py`) but no worker, no AI integration, no endpoints — that gap is the bulk of this plan.

Knowledge base for grounding the Claims head (FR-10, FR-11, FR-12) is **already built and indexed**: `apps/backend/grounding/irdai/` holds all 16 curated IRDAI/CIO sources (metadata in `apps/backend/src/aayu/claim_references.py`), extracted to plain text, chunked (856 chunks), embedded, and live in a local FAISS index at `apps/backend/grounding/index/` (gitignored — rebuild via `scripts/build_knowledge_index.py` whenever a source changes). Verified end-to-end: `aayu.grounding.retrieve("insurer rejected my claim citing a pre-existing disease exclusion clause", k=3)` correctly surfaces the pre-existing-disease waiting-period clauses from the master circular and product regulations. See `docs/architecture.md` → "Knowledge sources".

**`POST /v1/claim-support/ask`** (auth required) is live: takes a free-text question, retrieves grounding chunks, and returns a cited answer via `aayu.grounding.answer_question`. This is a general knowledge-base Q&A over the whole 16-document corpus — not yet scoped to a specific patient's rejection case. That personalization is deferred: **agentic RAG**, where an agent picks what to query based on the specific extracted claim fields (insurer, cited clause, condition) instead of the user's raw question, is future work layered on top of this same `retrieve`/`answer_question` primitives once Workstream B (extraction) exists to feed it.

## 2. Workstream A — AI worker infrastructure (foundational, blocks B–E)

Nothing currently reads off SQS — `apps/backend/src/aayu/queue.py` only publishes. Per `docs/architecture.md`'s "Shape" section, the worker is a second entry point in the same package.

Build:
- Worker entrypoint (e.g. `aayu.worker.main`) that long-polls SQS, loads the `ProcessingJob` row, dispatches by a `job_type` field, and marks the job `completed`/`failed` idempotently (re-processing a completed job is a no-op).
- One module per AI head under `aayu/ai/` (`extraction.py`, `claims.py`, `policy_qa.py`, `entitlements.py`): each defines a prompt template + a Pydantic output schema, and is called by the dispatcher — mirrors PRD §10's "one shared AI engine with heads."
- A single fallback path in the dispatcher (not per-head) for OpenAI errors / low-confidence output → sets the job/claim to a `needs_review` state the frontend can render as "we couldn't process this, try re-uploading" (FR-21).
- `openai` SDK client wrapper — already added to `pyproject.toml`.

## 3. Workstream B — Document extraction (FR-7)

`extraction` head takes an uploaded document (image or PDF, GPT-4o-class vision), returns structured fields into `HealthRecord.data`: conditions, medications, allergies, timeline entries, plus the claim-specific fields from the research doc's "Recommended Extraction Fields" (insurer, policy number, claim number, claimed/approved/rejected amounts, rejection reason + cited clause, hospital/admission/discharge dates, diagnosis).

## 4. Workstream C — Insurance Claim Advisor (FR-9–12, hero feature)

- `claims` head: consumes Workstream B's extracted fields + `aayu.grounding.retrieve()` results (topic-matched via the rejection reason/clause) to produce a denial assessment (reason + contestability) and a clause-cited appeal letter. Bake in the research doc's guardrails directly into the prompt/output schema: "claim assistance" framing (not legal advice), a source-confidence section citing the policy clause + the specific IRDAI/CIO rule from `grounding.retrieve()`, and "ask for missing documents" when confidence is low.
- `policy_qa` head — **done**, shipped ahead of the rest of this workstream: `aayu/policy_chat.py` + `POST /v1/patients/{id}/documents/{id}/policy-chat`. The per-document FAISS index is built as a `BackgroundTasks` job triggered from `POST /documents/{id}/complete` right after upload (only for `kind="policy"` documents, only if not already built) — not on first question. `ask()` still lazily builds on demand as a self-healing fallback if the background build hasn't finished or failed. Persisted to object storage keyed by `patients/{patient_id}/documents/{document_id}/policy-index/` — S3 in production, local dev-fallback otherwise, never local container disk since ECS tasks are stateless. Answers are grounded **only** in that document's own text — no leakage from the shared IRDAI/CIO knowledge base or other users' policies. Index is immutable-cached (source document never changes after upload).
- New endpoints still needed: `POST /v1/patients/{id}/claims`, `GET /v1/patients/{id}/claims/{claim_id}` (the denial-assessment + appeal-letter half of this workstream).
- Appeal letter PDF: render `Claim.appeal_text` server-side (reuse `reportlab` or similar — check before adding a new dependency).

## 5. Workstream D — Medical Records Vault (FR-15–16)

Read-only endpoints over `HealthRecord` rows already populated by Workstream B: `GET /v1/patients/{id}/vault` (conditions/medications/allergies) and `GET /v1/patients/{id}/vault/timeline`. No new AI logic — this is the cheapest workstream once B ships.

## 6. Workstream E — Government Scheme Advisor (FR-18)

A small curated static scheme list (same pattern as `claim_references.py` — a frozen dataclass tuple, not a DB table) + a rule-based matcher over fields already captured in `HealthRecord` (age, income bracket if present, condition). One endpoint: `GET /v1/patients/{id}/scheme-matches`. Empty-state response when nothing matches. Explicitly not an eligibility engine (FR-19 is future).

## 7. Workstream F — Cross-cutting (FR-21)

Covered by Workstream A's shared dispatcher fallback — no separate work item.

## 8. Frontend — 9 locked MVP screens (PRD §11)

| Screen | Status |
|---|---|
| Landing, Auth, Patient selector/create, Consent, Upload | Partially built in `apps/web/src/features/claim/HeroFlow.tsx` — verify each step is complete |
| Claim result (assessment + appeal download) | Missing — depends on Workstream C |
| Policy Q&A | Missing — depends on Workstream C |
| Vault | Missing — depends on Workstream D |
| Scheme match | Missing — depends on Workstream E |

## 9. Sequencing

**A → B → C → {D, E in parallel} → ship.** F is folded into A. Given the PRD's 4-day build constraint, C (the hero feature) is the priority; if time runs short, D and E are the first things to cut — the PRD's own acceptance criteria (AC-1 to AC-9) weight the hero claim flow over Vault/Scheme completeness.

## 10. Future roadmap (traceability only, no implementation detail here)

FR-4 (multi-caregiver/OTP), FR-8 (ABDM/ABHA, email ingestion), FR-13 (pre-claim check), FR-14 (claim tracking, Ombudsman escalation, success-fee billing), FR-17 (AI trend/drug-interaction/sharing), FR-19 (full eligibility engine, application submission) — map to PRD §16 Phases 1–3. The Ombudsman-scoped half of the knowledge base (`cio-*` entries, `scope="ombudsman"`) is already fetched and indexed for when FR-14's escalation workflow is built.
