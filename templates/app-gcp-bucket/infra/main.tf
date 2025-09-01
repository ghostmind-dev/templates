provider "google" {
  project = var.GCP_PROJECT_ID
}

# Create the GCS bucket
resource "google_storage_bucket" "default" {
  name                        = "${var.PROJECT}-${var.ENVIRONMENT}-${var.APP}"
  location                    = "US"
  force_destroy               = true
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 3
    }
    action {
      type = "Delete"
    }
  }
}

# Create a service account for bucket management
resource "google_service_account" "bucket_manager" {
  account_id   = substr("${var.PROJECT}-${var.ENVIRONMENT}-${var.APP}-sa", 0, 30)
  display_name = "Service Account for ${var.PROJECT}-${var.ENVIRONMENT}-${var.APP} bucket"
  description  = "Service account to manage GCS bucket ${var.PROJECT}-${var.ENVIRONMENT}-${var.APP}"
}

# Grant the service account permissions to manage the bucket
resource "google_storage_bucket_iam_member" "bucket_admin" {
  bucket = google_storage_bucket.default.name
  role   = "roles/storage.admin"
  member = "serviceAccount:${google_service_account.bucket_manager.email}"
}

# Create a service account key for the bucket manager
resource "google_service_account_key" "bucket_manager_key" {
  service_account_id = google_service_account.bucket_manager.name
  key_algorithm      = "KEY_ALG_RSA_2048"
}

# Write the service account key to a local file
resource "local_file" "service_account_key" {
  content  = base64decode(google_service_account_key.bucket_manager_key.private_key)
  filename = "${path.module}/service-account-key.json"
  
  # Set file permissions to be readable only by owner
  file_permission = "0600"
}

# Output the bucket name
output "bucket_name" {
  value       = google_storage_bucket.default.name
  description = "The name of the created GCS bucket"
  sensitive   = true
}

# Output the bucket URL
output "bucket_url" {
  value       = google_storage_bucket.default.url
  description = "The URL of the created GCS bucket"
}

# Output the service account email
output "service_account_email" {
  value       = google_service_account.bucket_manager.email
  description = "The email of the service account that manages the bucket"
}

# Output the service account key (base64 encoded)
output "service_account_key_base64" {
  value       = google_service_account_key.bucket_manager_key.private_key
  sensitive   = true
  description = "The base64 encoded private key for the service account"
}

# Output the service account key as JSON (decoded)
output "service_account_key_json" {
  value       = base64decode(google_service_account_key.bucket_manager_key.private_key)
  sensitive   = true
  description = "The JSON private key for the service account"
}

# Output the path to the service account key file
output "service_account_key_file_path" {
  value       = local_file.service_account_key.filename
  description = "Path to the service account key JSON file"
}
