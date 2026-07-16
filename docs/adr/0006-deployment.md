# ADR 0006: Managed container deployment

The MVP uses CloudFront/S3 for the web application, ECS Fargate for FastAPI and a managed event-driven worker. EKS is deferred until workload or organization requirements justify Kubernetes. Runtime code remains containerized and stateless to preserve portability.
