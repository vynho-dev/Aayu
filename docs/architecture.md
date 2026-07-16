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

## Environments

Development, staging and production use separate configuration and data. Production secrets live in Secrets Manager. Production must reject development authentication. Database changes use forward-only Alembic migrations run once before application rollout.

## EKS trigger

Stay on managed ECS/Lambda until Aayu has multiple independently scaled services, specialized scheduling, or a team owning Kubernetes operations. Container images, health checks, environment contracts and stateless processes preserve a low-rework path to EKS Auto Mode.
