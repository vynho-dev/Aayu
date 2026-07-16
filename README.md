# Aayu

Aayu is a patient-side health platform that helps Indian families understand rejected insurance claims, prepare clause-cited appeals, and build a structured health record from the same documents.

## Repository

- `apps/web` - React, TypeScript, Vite, Tailwind CSS, Clerk, Redux Toolkit and RTK Query.
- `apps/backend` - FastAPI, SQLAlchemy, Alembic and the API/worker entry points.
- `apps/backend/grounding` - local IRDAI/CIO knowledge-base sources and the FAISS index built from them.
- `design-system` - approved visual tokens, components and product screen references.
- `infra/terraform` - managed AWS infrastructure.
- `docs` - architecture and decision records. See `docs/architecture.md` and `plan.md` for the current implementation plan.

## Local development

1. Copy `.env.example` to `.env`.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173`; the API is available at `http://localhost:8000`.

Local development uses a non-production test identity. Set Clerk values and `AAYU_AUTH_MODE=clerk` to exercise real authentication.

## AI knowledge base and chat

Claim assistance is grounded in a local FAISS index over 16 official IRDAI/CIO sources (`apps/backend/grounding/irdai/`, metadata in `aayu/claim_references.py`). Two chat surfaces sit on top of it:

- `POST /v1/claim-support/ask` - general Q&A over the IRDAI/CIO regulatory corpus.
- `POST /v1/patients/{id}/documents/{id}/policy-chat` - Q&A scoped to one patient's own uploaded policy document only, never the shared regulatory corpus or another user's documents. Its per-document index is built automatically in the background right after upload completes (`POST /documents/{id}/complete`), with a lazy on-demand fallback if that hasn't finished yet.

Both need `OPENAI_API_KEY` set (`apps/backend/.env`, gitignored). Rebuild the shared knowledge index after changing a grounding source with:

```
cd apps/backend
python scripts/build_knowledge_index.py
```
