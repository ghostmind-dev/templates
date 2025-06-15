# variables.tf

variable "ENVIRONMENT" {}
variable "APP" {}
variable "PORT" {}
variable "SERVER_TOKEN" {}
variable "IMAGE_DIGEST_DEFAULT" {}
variable "PROJECT" {}
variable "GCP_PROJECT_ID" {}


locals {
  env_vars = [
    {
      name  = "ENVIRONMENT"
      value = var.ENVIRONMENT
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
      name  = "IMAGE_DIGEST_DEFAULT"
      value = var.IMAGE_DIGEST_DEFAULT
    },
    {
      name  = "PROJECT"
      value = var.PROJECT
    },
    {
      name  = "GCP_PROJECT_ID"
      value = var.GCP_PROJECT_ID
    }
  ]
}

  
