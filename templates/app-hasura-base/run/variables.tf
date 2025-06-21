# variables.tf

variable "PROJECT" {
  type      = string
  sensitive = true
}

variable "APP" {
  type      = string
  sensitive = true
}

variable "PORT" {
  type      = string
  sensitive = true
}

variable "PGHOST" {
  type      = string
  sensitive = true
}

variable "PGUSER" {
  type      = string
  sensitive = true
}

variable "PGPASSWORD" {
  type      = string
  sensitive = true
}

variable "DB_NAME" {
  type      = string
  sensitive = true
}

variable "HASURA_GRAPHQL_JWT_SECRET" {
  type      = string
  sensitive = true
}

variable "HASURA_GRAPHQL_METADATA_DATABASE_URL" {
  type      = string
  sensitive = true
}

variable "HASURA_GRAPHQL_DATABASE_URL" {
  type      = string
  sensitive = true
}

variable "HASURA_GRAPHQL_ADMIN_SECRET" {
  type      = string
  sensitive = true
}

variable "CLOUD_RUN_URL_BASE" {
  type      = string
  sensitive = true
}

variable "ENVIRONMENT" {
  type      = string
  sensitive = true
}

variable "HASURA_GRAPHQL_ENDPOINT" {
  type      = string
  sensitive = true
}

variable "IMAGE_DIGEST_DEFAULT" {
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
      name  = "PGHOST"
      value = var.PGHOST
    },
    {
      name  = "PGUSER"
      value = var.PGUSER
    },
    {
      name  = "PGPASSWORD"
      value = var.PGPASSWORD
    },
    {
      name  = "DB_NAME"
      value = var.DB_NAME
    },
    {
      name  = "HASURA_GRAPHQL_JWT_SECRET"
      value = var.HASURA_GRAPHQL_JWT_SECRET
    },
    {
      name  = "HASURA_GRAPHQL_METADATA_DATABASE_URL"
      value = var.HASURA_GRAPHQL_METADATA_DATABASE_URL
    },
    {
      name  = "HASURA_GRAPHQL_DATABASE_URL"
      value = var.HASURA_GRAPHQL_DATABASE_URL
    },
    {
      name  = "HASURA_GRAPHQL_ADMIN_SECRET"
      value = var.HASURA_GRAPHQL_ADMIN_SECRET
    },
    {
      name  = "CLOUD_RUN_URL_BASE"
      value = var.CLOUD_RUN_URL_BASE
    },
    {
      name  = "ENVIRONMENT"
      value = var.ENVIRONMENT
    },
    {
      name  = "HASURA_GRAPHQL_ENDPOINT"
      value = var.HASURA_GRAPHQL_ENDPOINT
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

  
