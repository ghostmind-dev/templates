# variables.tf

  variable "PROJECT" {}
variable "APP" {}
variable "PORT" {}
variable "PGHOST" {}
variable "PGUSER" {}
variable "PGPASSWORD" {}
variable "DB_NAME" {}
variable "HASURA_GRAPHQL_JWT_KEY" {}
variable "HASURA_GRAPHQL_JWT_SECRET" {}
variable "HASURA_GRAPHQL_METADATA_DATABASE_URL" {}
variable "HASURA_GRAPHQL_DATABASE_URL" {}
variable "HASURA_GRAPHQL_ADMIN_SECRET" {}
variable "CLOUD_RUN_URL_BASE" {}
variable "ENVIRONMENT" {}
variable "HASURA_GRAPHQL_ENDPOINT" {}
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
        name  = "HASURA_GRAPHQL_JWT_KEY"
        value = var.HASURA_GRAPHQL_JWT_KEY
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
  
  