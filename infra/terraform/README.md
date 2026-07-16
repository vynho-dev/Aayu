# Aayu AWS foundation

The reusable `foundation` module creates the minimal managed deployment: CloudFront/private S3 web hosting, private document storage, encrypted SQS/DLQ, ECR, ECS Fargate API, RDS PostgreSQL through RDS Proxy, Secrets Manager and CloudWatch logs.

Only development is instantiated. Add staging and production wrappers after their AWS accounts, state backends, domains, certificates, retention and sizing are approved. Production must add HTTPS on the API load balancer before receiving user traffic.

```sh
cd infra/terraform/environments/dev
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```

Terraform state contains generated database credentials. Use an encrypted, locked remote backend before applying outside an isolated development account.
