# variables.tf

variable "PROJECT" {}
variable "APP" {}
variable "PORT" {}
variable "SERVER_TOKEN" {}
variable "ENVIRONMENT" {}
variable "SERVER_URL" {}
variable "IMAGE_DIGEST_DEFAULT" {}
variable "GCP_PROJECT_ID" {}


locals {
  env_vars = [
    {
      name  = "PROJECT"
      value = var.PROJECT
    },
    {
      name  = "APP"
      value = var.APP
    },
    {
      name  = "SERVER_TOKEN"
      value = var.SERVER_TOKEN
    },
    {
      name  = "ENVIRONMENT"
      value = var.ENVIRONMENT
    },
    {
      name  = "SERVER_URL"
      value = var.SERVER_URL
    },
    {
      name  = "IMAGE_DIGEST_DEFAULT"
      value = var.IMAGE_DIGEST_DEFAULT
    },
    {
      name  = "GCP_PROJECT_ID"
      value = var.GCP_PROJECT_ID
    }
  ]
}

  
