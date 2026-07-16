# ADR 0005: Durable asynchronous processing

PostgreSQL records job state and SQS transports job identifiers. Workers are idempotent and retries are bounded; exhausted jobs go to a dead-letter queue. Redis is not a queue or source of truth.
