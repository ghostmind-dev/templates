# variables.tf

variable "PORT" {}
variable "GOOGLE_OAUTH_CLIENT_ID" {}
variable "GOOGLE_OAUTH_CLIENT_SECRET" {}
variable "DB_USERS_ENDPOINT" {}
variable "DB_USERS_SECRET" {}
variable "HASURA_GRAPHQL_JWT_SECRET" {}
variable "ENVIRONMENT" {}
variable "NEXTAUTH_URL" {}
variable "NEXTAUTH_SECRET" {}
variable "AUTH_TRUST_HOST" {}
variable "IMAGE_DIGEST_DEFAULT" {}
variable "PROJECT" {}
variable "APP" {}
variable "GCP_PROJECT_ID" {}


locals {
  env_vars = [
    {
      name  = "GOOGLE_OAUTH_CLIENT_ID"
      value = var.GOOGLE_OAUTH_CLIENT_ID
    },
    {
      name  = "GOOGLE_OAUTH_CLIENT_SECRET"
      value = var.GOOGLE_OAUTH_CLIENT_SECRET
    },
    {
      name  = "DB_USERS_ENDPOINT"
      value = var.DB_USERS_ENDPOINT
    },
    {
      name  = "DB_USERS_SECRET"
      value = var.DB_USERS_SECRET
    },
    {
      name  = "HASURA_GRAPHQL_JWT_SECRET"
      value = var.HASURA_GRAPHQL_JWT_SECRET
    },
    {
      name  = "ENVIRONMENT"
      value = var.ENVIRONMENT
    },
    {
      name  = "NEXTAUTH_URL"
      value = var.NEXTAUTH_URL
    },
    {
      name  = "NEXTAUTH_SECRET"
      value = var.NEXTAUTH_SECRET
    },
    {
      name  = "AUTH_TRUST_HOST"
      value = var.AUTH_TRUST_HOST
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
      name  = "APP"
      value = var.APP
    },
    {
      name  = "GCP_PROJECT_ID"
      value = var.GCP_PROJECT_ID
    }
  ]
}


