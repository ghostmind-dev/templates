# MCP Stream Server

A Model Context Protocol (MCP) server implementation using Deno 2.0 with Bearer token authentication.

## Features

- **Bearer Token Authentication**: Secure access with Authorization header
- **Tools**: Echo tool for testing
- **Resources**: Test resource for demonstration
- **CORS Support**: Cross-origin requests enabled
- **JSON-RPC 2.0**: Standard MCP protocol implementation

## Quick Start

1. **Run the server**:
   ```bash
   deno task dev
   ```

2. **Test with curl**:
   ```bash
   # Initialize connection
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-test-token" \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

   # List available tools
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-test-token" \
     -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

   # Call echo tool
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-test-token" \
     -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"echo","arguments":{"text":"Hello World"}}}'
   ```

## Available Scripts

- `deno task dev` - Run the simple server (recommended)
- `deno task start` - Run the simple server in production mode
- `deno task dev-sdk` - Run the SDK-based server (experimental)
- `deno task start-sdk` - Run the SDK-based server in production mode

## Authentication

The server requires a Bearer token in the Authorization header:

```
Authorization: Bearer your-token-here
```

For testing, any non-empty token will be accepted. In production, implement proper token validation in the `authenticateRequest` function.

## API Endpoints

- `POST /mcp` - Main MCP endpoint for JSON-RPC requests
- `OPTIONS /mcp` - CORS preflight support

## Available Tools

### echo
Echoes back the provided text.

**Parameters:**
- `text` (string, required): Text to echo back

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": {
      "text": "Hello World"
    }
  }
}
```

## Available Resources

### test://example
A simple test resource that returns static content.

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

## Server Configuration

- **Port**: 3000
- **Hostname**: 0.0.0.0 (all interfaces)
- **Protocol**: HTTP (add HTTPS in production)

## Development

The server includes two implementations:

1. **simple-server.ts** - Manual JSON-RPC implementation (recommended for testing)
2. **server.ts** - MCP SDK-based implementation (experimental)

Both servers provide the same functionality but use different approaches. The simple server is more reliable for initial testing.

## Session Management

Currently, the server doesn't implement session management for simplicity. Each request is handled independently. For production use with multiple concurrent clients, consider implementing proper session management as shown in the MCP SDK documentation.

## Next Steps

1. Add proper token validation
2. Implement session management
3. Add more tools and resources
4. Add HTTPS support
5. Add logging and monitoring 