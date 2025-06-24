# MCP Stream Server Application

## Overview

This is a **Model Context Protocol (MCP) Server** implementation that provides AI models with access to external tools and resources through a standardized protocol. The server acts as a bridge between AI systems and various tools, enabling secure and structured interactions.

## Application Structure

```
app/
├── server.ts          # Main MCP server implementation
├── tools/             # Directory containing all available tools
│   └── temperature.ts # Example tool for weather data
├── deno.json         # Deno configuration and dependencies
└── README.md         # Basic project information
```

## How It Works

### 1. **MCP Protocol Implementation**
- The server implements the MCP (Model Context Protocol) specification
- Handles JSON-RPC 2.0 requests over HTTP
- Provides standardized endpoints for tool discovery and execution

### 2. **Authentication & Security**
- Uses Bearer token authentication for secure access
- Validates tokens against the `SERVER_TOKEN` environment variable
- Implements CORS headers for web client compatibility

### 3. **Tool System**
- Tools are modular and stored in the `tools/` directory
- Each tool exports its definition and execution logic
- The server automatically registers and exposes all imported tools

### 4. **Core Endpoints**
- `/mcp` - Main MCP protocol endpoint
- `/.well-known/oauth-protected-resource` - OAuth 2.0 metadata
- `/.well-known/oauth-authorization-server` - OAuth 2.0 server metadata

## Available MCP Methods

| Method | Description |
|--------|-------------|
| `initialize` | Establishes connection and exchanges capabilities |
| `tools/list` | Returns all available tools |
| `tools/call` | Executes a specific tool with parameters |
| `resources/list` | Lists available resources |
| `resources/read` | Reads content from a resource |

## Adding New Tools - Developer Guide

### Step 1: Create Your Tool File

Create a new TypeScript file in the `tools/` directory:

```typescript
// tools/my-new-tool.ts

// Define your tool's interface
export interface MyToolParams {
  input: string;
  options?: {
    format?: 'json' | 'text';
  };
}

// Define the tool metadata
export const tools = [
  {
    name: 'my_new_tool',
    description: 'Description of what your tool does',
    inputSchema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Input parameter description'
        },
        options: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['json', 'text'],
              description: 'Output format'
            }
          }
        }
      },
      required: ['input']
    }
  }
];

// Implement the tool executor
async function executeMyTool(params: MyToolParams) {
  try {
    // Your tool logic here
    const result = processInput(params.input, params.options);
    
    return {
      content: [
        {
          type: 'text',
          text: `Tool executed successfully: ${result}`
        }
      ]
    };
  } catch (error) {
    throw new Error(`Tool execution failed: ${error.message}`);
  }
}

// Helper function (example)
function processInput(input: string, options?: MyToolParams['options']) {
  // Implement your business logic
  return `Processed: ${input}`;
}

// Export the tool executors
export const toolExecutors = {
  'my_new_tool': executeMyTool
};
```

### Step 2: Register Your Tool in the Server

Update `server.ts` to import and register your new tool:

```typescript
// Add import at the top
import {
  tools as myNewTools,
  toolExecutors as myNewExecutors,
} from './tools/my-new-tool.ts';

// Add to the tools array
const tools = [
  ...temperatureTools,
  ...myNewTools  // Add your tools here
];

// Add to the executors object
const toolExecutors = {
  ...temperatureExecutors,
  ...myNewExecutors  // Add your executors here
};
```

### Step 3: Test Your Tool

1. **Start the server:**
   ```bash
   export SERVER_TOKEN=your-secret-token
   deno run --allow-net --allow-env server.ts
   ```

2. **Test tool discovery:**
   ```bash
   curl -X POST http://localhost:3008/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-secret-token" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```

3. **Test tool execution:**
   ```bash
   curl -X POST http://localhost:3008/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-secret-token" \
     -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"my_new_tool","arguments":{"input":"test data"}}}'
   ```

## Best Practices for Tool Development

### 1. **Error Handling**
- Always wrap tool logic in try-catch blocks
- Provide meaningful error messages
- Use appropriate HTTP status codes

### 2. **Input Validation**
- Define comprehensive input schemas
- Validate parameters before processing
- Handle edge cases gracefully

### 3. **Response Format**
- Follow MCP response structure consistently
- Use appropriate content types (text, json, etc.)
- Include helpful metadata when relevant

### 4. **Async Operations**
- Use async/await for I/O operations
- Handle timeouts appropriately
- Consider rate limiting for external API calls

### 5. **Security Considerations**
- Validate and sanitize all inputs
- Avoid exposing sensitive information
- Implement proper authentication checks

## Example Tool Structure

Here's the current temperature tool as a reference:

```typescript
// tools/temperature.ts
export const tools = [
  {
    name: 'get_temperature',
    description: 'Get the current temperature for a country',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'Name of the country to get temperature for'
        }
      },
      required: ['country']
    }
  }
];

export const toolExecutors = {
  'get_temperature': async (params: { country: string }) => {
    // Implementation details...
  }
};
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SERVER_TOKEN` | Bearer token for authentication | Yes |
| `PORT` | Server port (default: 3008) | No |

## Deployment

The application can be deployed using:
- Docker containers (see `docker/` directory)
- Cloud platforms with Deno runtime support
- Local development with Deno

For production deployment, ensure:
- Secure token generation and management
- Proper CORS configuration
- SSL/TLS termination
- Monitoring and logging setup

## Contributing

When adding new tools:
1. Follow the established patterns
2. Include comprehensive documentation
3. Add appropriate tests
4. Update this documentation if needed

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Deno Documentation](https://deno.land/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification) 