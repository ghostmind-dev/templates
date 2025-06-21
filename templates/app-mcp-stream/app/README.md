# MCP Stream Server

A Model Context Protocol (MCP) server implementation using Deno 2.0 with OAuth 2.0 Protected Resource Metadata (RFC 9728).

## Features

- **OAuth 2.0 Protected Resource Metadata**: Implements RFC 9728 for proper OAuth discovery
- **Scope-based Authorization**: Fine-grained access control with scopes (`mcp:read`, `mcp:write`, `mcp:tools`, `mcp:resources`)
- **Tools**: Temperature tool for testing
- **Resources**: Test resource for demonstration
- **CORS Support**: Cross-origin requests enabled
- **JSON-RPC 2.0**: Standard MCP protocol implementation
- **OAuth Metadata Discovery**: `/.well-known/oauth-protected-resource` endpoint

## Quick Start

1. **Run the server**:
   ```bash
   deno task dev
   ```

2. **Check OAuth metadata**:
   ```bash
   curl http://localhost:3000/.well-known/oauth-protected-resource
   ```

3. **Test with curl** (using development token):
   ```bash
   # Initialize connection
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer dev-token" \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

   # List available tools
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer dev-token" \
     -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

   # Call temperature tool
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer dev-token" \
     -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_temperature","arguments":{"country":"France"}}}'
   ```

## Available Scripts

- `deno task dev` - Run the server in development mode
- `deno task start` - Run the server in production mode

## OAuth 2.0 Authentication

The server implements OAuth 2.0 Protected Resource Metadata (RFC 9728) and acts as a protected resource, not an authorization server.

### Environment Variables

- `SERVER_URL` - Base URL of this server (default: `http://localhost:3000`)
- `AUTHORIZATION_SERVERS` - Comma-separated list of OAuth authorization servers
- `EXPECTED_AUDIENCE` - Expected audience in JWT tokens (default: SERVER_URL)
- `PORT` - Server port (default: 3000)

### Development Token

For development and testing, use the built-in token:
```
Authorization: Bearer dev-token
```

This token has all scopes: `mcp:read mcp:write mcp:tools mcp:resources`

### Production Tokens

In production, the server expects JWT tokens from configured authorization servers with:
- Valid signature (verified against JWKS)
- Correct audience (`aud` claim)
- Required scopes for the operation

## API Endpoints

- `POST /mcp` - Main MCP endpoint for JSON-RPC requests
- `GET /.well-known/oauth-protected-resource` - OAuth metadata discovery
- `GET /docs` - Documentation page
- `OPTIONS /mcp` - CORS preflight support

## OAuth Scopes

- `mcp:read` - Read access to tools and resources
- `mcp:write` - Write access (tool execution)
- `mcp:tools` - Specific tool access
- `mcp:resources` - Specific resource access

## Available Tools

### get_temperature
Returns a random temperature for a given country.

**Required Scopes:** `mcp:tools` or `mcp:write`

**Parameters:**
- `country` (string, required): Name of the country

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_temperature",
    "arguments": {
      "country": "France"
    }
  }
}
```

## Available Resources

### test://example
A simple test resource that returns static content.

**Required Scopes:** `mcp:resources` or `mcp:read`

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "test://example"
  }
}
```

## OAuth Protected Resource Metadata

The server provides OAuth metadata at `/.well-known/oauth-protected-resource`:

```json
{
  "resource": "http://localhost:3000",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["mcp:read", "mcp:write", "mcp:tools", "mcp:resources"],
  "bearer_methods_supported": ["header"],
  "resource_name": "MCP Stream Server",
  "resource_documentation": "http://localhost:3000/docs"
}
```

## Error Handling

### 401 Unauthorized

When authentication fails, the server returns a `401` status with a `WWW-Authenticate` header pointing to the OAuth metadata:

```
WWW-Authenticate: Bearer resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource"
```

### Insufficient Scope

When a token lacks required scopes, the server returns an MCP error:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Insufficient scope for tools access"
  }
}
```

## Development

The server is designed to work with MCP clients that support OAuth 2.0 Protected Resource Metadata discovery. For clients that don't support this yet, you can still use the development token for testing.

## Production Deployment

1. Set proper environment variables:
   ```bash
   export SERVER_URL="https://your-domain.com"
   export AUTHORIZATION_SERVERS="https://your-auth-server.com"
   export EXPECTED_AUDIENCE="https://your-domain.com"
   ```

2. Implement proper JWT validation in `validateBearerToken()` function
3. Add HTTPS support
4. Configure your OAuth authorization server to issue tokens for this resource

## Next Steps

1. Implement proper JWT signature validation
2. Add more tools and resources
3. Add comprehensive logging and monitoring
4. Add rate limiting and security headers
5. Implement token introspection for opaque tokens 