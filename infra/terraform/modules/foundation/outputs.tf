output "api_url" { value = "http://${aws_lb.api.dns_name}" }
output "api_repository_url" { value = aws_ecr_repository.api.repository_url }
output "web_bucket" { value = aws_s3_bucket.web.id }
output "web_url" { value = "https://${aws_cloudfront_distribution.web.domain_name}" }
output "document_bucket" { value = aws_s3_bucket.documents.id }
output "job_queue_url" { value = aws_sqs_queue.jobs.url }
