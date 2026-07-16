# ADR 0001: Clerk identity, Aayu authorization

Clerk owns sign-in and session lifecycle. FastAPI verifies each token and maps immutable Clerk user IDs to internal users. Patient ownership, consent and access rules remain in PostgreSQL; Clerk metadata never becomes business-state storage.
