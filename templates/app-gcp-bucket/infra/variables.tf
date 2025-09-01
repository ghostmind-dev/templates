# variables.tf

variable "PROJECT" {
  type      = string
  sensitive = true
}

variable "APP" {
  type      = string
  sensitive = true
}

variable "ENVIRONMENT" {
  type      = string
  sensitive = true
}

variable "GCP_PROJECT_ID" {
  type      = string
  sensitive = true
}


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
      name  = "ENVIRONMENT"
      value = var.ENVIRONMENT
    },
    {
      name  = "GCP_PROJECT_ID"
      value = var.GCP_PROJECT_ID
    }
  ]
}

  
