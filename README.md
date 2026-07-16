# Aayu

Aayu is a patient-side health platform that helps Indian families understand rejected insurance claims, prepare clause-cited appeals, and build a structured health record from the same documents.

## Repository

- `apps/web` - React, TypeScript, Vite, Tailwind CSS, Clerk, Redux Toolkit and RTK Query.
- `apps/backend` - FastAPI, SQLAlchemy, Alembic and the API/worker entry points.
- `design-system` - approved visual tokens, components and product screen references.
- `infra/terraform` - managed AWS infrastructure.
- `docs` - architecture and decision records.

## Local development

1. Copy `.env.example` to `.env`.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173`; the API is available at `http://localhost:8000`.

Local development uses a non-production test identity. Set Clerk values and `AAYU_AUTH_MODE=clerk` to exercise real authentication.
