# ADR 0004: Private document storage

Medical documents use a private, encrypted S3 bucket separate from frontend assets. The API authorizes short-lived upload/download URLs after checking patient ownership. Object keys contain opaque identifiers, and raw document content is never logged.
