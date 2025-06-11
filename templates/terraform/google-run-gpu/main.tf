provider "google" {
  project = var.GCP_PROJECT_ID
}



resource "google_cloud_run_v2_service" "default" {
  provider = google-beta
  name     = "${var.PROJECT}-${var.ENVIRONMENT}-${var.APP}"
  location = "us-central1"

  deletion_protection = false

  template {
    gpu_zonal_redundancy_disabled = true # Turn off zonal redundancy for lower GPU cost

    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }



    containers {
      image = var.IMAGE_DIGEST_DEFAULT

      resources {
        limits = {
          cpu              = "4000m" # Minimum 4 CPU, recommended 8 CPU for GPU
          memory           = "16Gi"  # Minimum 16Gi, recommended 32Gi for GPU
          "nvidia.com/gpu" = "1"     # 1 NVIDIA L4 GPU
        }

        cpu_idle          = false # CPU throttling must be disabled for GPU
        startup_cpu_boost = false
      }

      ports {
        container_port = var.PORT
      }

      ##########################################
      # DYNAMIC ENV START
      ##########################################

      dynamic "env" {
        for_each = local.env_vars
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      ##########################################
      # DYNAMIC ENV END
      ##########################################
    }

    # GPU node selector - specifies NVIDIA L4 GPU
    node_selector {
      accelerator = "nvidia-l4"
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_v2_service.default.location
  project  = google_cloud_run_v2_service.default.project
  service  = google_cloud_run_v2_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
