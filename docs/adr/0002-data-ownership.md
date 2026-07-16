# ADR 0002: Caregiver and patient ownership

Every patient belongs to one caregiver in the MVP. Every document, claim, health record and scheme match belongs to a patient. Database foreign keys and API ownership checks enforce this invariant from the first migration.
