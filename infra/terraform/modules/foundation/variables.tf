variable "project" { type = string }
variable "environment" { type = string }
variable "region" { type = string }
variable "api_image" { type = string }
variable "clerk_issuer" { type = string }
variable "clerk_audience" {
  type    = string
  default = ""
}
variable "web_origin" { type = string }
variable "database_instance_class" {
  type    = string
  default = "db.t4g.micro"
}
variable "database_multi_az" {
  type    = bool
  default = false
}
variable "deletion_protection" {
  type    = bool
  default = false
}
variable "api_min_tasks" {
  type    = number
  default = 1
}
variable "api_max_tasks" {
  type    = number
  default = 4
}
