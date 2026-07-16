terraform {
  required_version = ">= 1.9"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 6.0" }
    random = { source = "hashicorp/random", version = "~> 3.7" }
  }
}

provider "aws" { region = var.region }

module "foundation" {
  source       = "../../modules/foundation"
  project      = "aayu"
  environment  = "development"
  region       = var.region
  api_image    = var.api_image
  clerk_issuer = var.clerk_issuer
  web_origin   = var.web_origin
}

variable "region" {
  type    = string
  default = "ap-south-1"
}
variable "api_image" { type = string }
variable "clerk_issuer" { type = string }
variable "web_origin" { type = string }

output "api_url" { value = module.foundation.api_url }
output "web_url" { value = module.foundation.web_url }
output "api_repository_url" { value = module.foundation.api_repository_url }
