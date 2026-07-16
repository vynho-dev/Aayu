# Aayu architecture

## Shape

Aayu is a modular monolith with two runtime entry points from one Python package:

- an HTTP API for authentication, patient data, consent and upload orchestration;
- an asynchronous worker for document extraction and claim analysis.

The React application is static and served by CloudFront. FastAPI runs as a container on ECS Fargate. PostgreSQL is the source of truth, SQS is the durable work queue, and private S3 stores uploaded documents. Redis is deferred until measured cache, distributed rate-limit or lock requirements exist.

## Ownership

`User -> Patient -> Document / Claim / HealthRecord / SchemeMatch` is fixed. Every patient-scoped query includes the owning user. Clerk proves identity; Aayu stores authorization and business data.

## Request flow

1. React obtains a short-lived Clerk session token.
2. FastAPI validates signature, issuer, expiry and authorized party.
3. The API resolves the internal user and enforces patient ownership.
4. The API authorizes and signs a direct S3 upload.
5. Upload completion creates a durable processing job and publishes its identifier to SQS.
6. The worker processes idempotently and persists status/results in PostgreSQL.
7. RTK Query polls job status and invalidates patient/claim data when complete.

## AI engine

One asynchronous worker (second entry point in the same package, see "Shape") dispatches SQS jobs to one module per AI capability — extraction, claims, policy Q&A, entitlements — each with its own versioned prompt template and a Pydantic-validated output schema. This mirrors the PRD's "one shared AI engine with heads" (§10). The provider is OpenAI: a GPT-4o-class model for extraction/claims/Q&A (multimodal, reads scanned documents directly) and `text-embedding-3-small` for knowledge-base retrieval (below).

Failure/low-confidence handling lives once in the dispatcher, not per head: a failed or low-confidence AI call sets the job/claim to a `needs_review` state rather than a bespoke fallback per capability.

## Knowledge sources

`apps/backend/grounding/irdai/` is a local, version-controlled snapshot of 16 official IRDAI and Council for Insurance Ombudsmen sources (regulations, grievance/ombudsman process pages, complaint forms) that ground the claims head's denial assessments and appeal letters. `apps/backend/src/aayu/claim_references.py` holds the citation metadata (title, publisher, official URL, topic tags); `manifest.json` in the same folder maps each source to its local file.

Retrieval is a small local FAISS index (`apps/backend/src/aayu/grounding.py`), not a hosted vector database — the corpus is 16 short documents (~850 text chunks), well within what `IndexFlatIP` handles in memory. `scripts/build_knowledge_index.py` is a one-time (re-run-on-change) job that extracts text from each source — PDF text layer via `pypdf`, OCR fallback via `pytesseract`/`pdf2image` for any page without one, `.docx` via stdlib `zipfile` — chunks it, embeds it with OpenAI, and writes the index (gitignored; rebuilt from source, not checked in). The claims head calls `aayu.grounding.retrieve(query, k)` at request time to pull cited, sourced context into its prompt; `POST /v1/claim-support/ask` exposes the same retrieval plus answer generation (`answer_question`) as a standalone endpoint today. Query selection is user-driven for now — an agent choosing what to retrieve based on a patient's specific extracted claim fields is future work, not yet built.

A second, separate index type exists per user document: `aayu/policy_chat.py` builds a runtime FAISS index scoped to one uploaded policy (keyed `patients/{patient_id}/documents/{document_id}/policy-index/`, persisted in object storage alongside the source document). It's built as a `BackgroundTasks` job off `POST /documents/{id}/complete` right after upload, not on first question, so it's normally ready before the user opens the chat; `ask()` also builds it lazily on demand as a fallback if that background job hasn't finished or failed - this is a stopgap until Workstream A's real SQS worker exists, at which point this becomes a proper queued job like extraction. It never mixes with the shared IRDAI/CIO index above — `POST /v1/patients/{id}/documents/{id}/policy-chat` answers only from that one document's own text.

## Environments

Development, staging and production use separate configuration and data. Production secrets live in Secrets Manager. Production must reject development authentication. Database changes use forward-only Alembic migrations run once before application rollout.

## EKS trigger

Stay on managed ECS/Lambda until Aayu has multiple independently scaled services, specialized scheduling, or a team owning Kubernetes operations. Container images, health checks, environment contracts and stateless processes preserve a low-rework path to EKS Auto Mode.
