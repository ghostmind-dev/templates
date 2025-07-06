# Templates

This is a collection of templates for different types of configured applications and infrastructure setups. Each template provides a foundation for quickly setting up specific types of projects with pre-configured tools, services, and deployment options.

## Available Templates

| Template Name          | Type           | Description                                                                                                                                                                                      |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **app-mcp-remote**     | Application    | MCP (Model Context Protocol) Server template with a temperature lookup tool. Includes modular architecture, authentication, and complete example implementation for building custom MCP servers. |
| **app-next-auth**      | Application    | Next.js UI application template with authentication integration. Includes Docker configuration, tunnel setup, and development routines for building modern web applications.                     |
| **app-hasura-base**    | Application    | Hasura GraphQL database API template. Provides a complete GraphQL API setup with database integration, admin console, and TypeScript client examples.                                            |
| **terraform-run-gpu**  | Infrastructure | Terraform template for deploying applications to Google Cloud Run with GPU support. Configured for NVIDIA L4 GPU with 4 CPU cores and 16GB memory.                                               |
| **terraform-run-base** | Infrastructure | Basic Terraform template for Google Cloud Run deployment without GPU. Includes standard configuration with 2 CPU cores and 4GB memory.                                                           |
| **custom-dev-base**    | Development    | Custom development base template with Docker Compose integration. Provides development workflow automation with build, tunnel, and container management.                                         |

## Usage

Each template directory contains:

- **meta.json**: Configuration metadata and template settings
- **README.md**: Specific setup and usage instructions
- **Template-specific files**: Application code, infrastructure definitions, or development scripts

Choose the template that best fits your project needs and follow the individual README instructions for setup and customization.
