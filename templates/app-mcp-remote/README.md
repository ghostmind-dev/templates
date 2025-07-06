# MCP Server Template

A simple **Model Context Protocol (MCP) Server** template implementation that demonstrates how to create custom MCP servers. This template provides a foundation for building MCP servers that can be easily modified and extended.

## What is This?

This is a **template** for creating MCP servers. It currently includes:

- ✅ **One tool**: Temperature lookup for countries
- ✅ **Modular architecture**: Easy to modify and extend
- ✅ **Complete example**: Ready to run and customize
- ✅ **Documentation**: Clear setup and usage instructions

## Application Structure

```
app/
├── server.ts               # Main MCP server implementation
├── tools/                  # Directory containing all available tools
│   └── temperature.ts      # Temperature lookup tool (example)
├── deno.json              # Deno configuration and dependencies
└── README.md              # This documentation
```

## Quick Start

### 1. Environment Setup

```bash
export SERVER_TOKEN=your-mcp-server-secret-token
export PORT=3008
```

### 2. Start the Server

```bash
cd app
deno run --allow-net --allow-env server.ts
```

## Current Tool

The template currently includes **one tool** for demonstration:

### Temperature Tool

- **`get_temperature`**: Get the current temperature for a specific country
  - **Input**: Country name (e.g., "United States", "Canada", "France")
  - **Output**: Temperature in both Fahrenheit and Celsius
  - **Coverage**: 100+ countries worldwide

**Example Usage:**

```bash
# Get temperature for United States
curl -X POST http://localhost:3008/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-mcp-server-secret-token" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"tools/call",
    "params":{
      "name":"get_temperature",
      "arguments":{"country":"United States"}
    }
  }'
```

## How to Customize This Template

### 1. **Modify the Existing Tool**

Edit `tools/temperature.ts` to change the temperature tool:

- Update the temperature data for different countries
- Change the response format
- Add new functionality like historical data or weather forecasts

### 2. **Add New Tools**

Create new tool files in the `tools/` directory:

```typescript
// tools/my-new-tool.ts
export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export const tools: Tool[] = [
  {
    name: 'my_new_tool',
    description: 'Description of my new tool',
    inputSchema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Input parameter description',
        },
      },
      required: ['input'],
    },
  },
];

export const toolExecutors: Record<string, (args: any) => Promise<any>> = {
  my_new_tool: async (args: any) => {
    // Implement your tool logic here
    return {
      content: [
        {
          type: 'text',
          text: `Tool result: ${args.input}`,
        },
      ],
    };
  },
};
```

Then update `server.ts` to import from your new tool file instead of `temperature.ts`.

### 3. **Replace the Temperature Tool Entirely**

- Delete `tools/temperature.ts`
- Create your own tool files
- Update the import in `server.ts`
- Update environment variables as needed

## Testing Your MCP Server

### Test Available Tools

```bash
curl -X POST http://localhost:3008/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-mcp-server-secret-token" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Test Temperature Tool

```bash
curl -X POST http://localhost:3008/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-mcp-server-secret-token" \
  -d '{
    "jsonrpc":"2.0",
    "id":2,
    "method":"tools/call",
    "params":{
      "name":"get_temperature",
      "arguments":{"country":"Canada"}
    }
  }'
```

## Environment Variables

| Variable       | Description                                | Required |
| -------------- | ------------------------------------------ | -------- |
| `SERVER_TOKEN` | Bearer token for MCP server authentication | Yes      |
| `PORT`         | Server port (default: 3008)                | No       |

## Template Features

### 🔧 **Easy to Modify**

- Simple, well-documented code structure
- Modular tool architecture
- Clear separation of concerns

### 🛠️ **Complete Example**

- Working temperature lookup tool
- Authentication handling
- Error handling
- API testing examples

### 📚 **Educational**

- Demonstrates MCP protocol implementation
- Shows how to structure tools
- Includes comprehensive documentation

### 🚀 **Production Ready**

- Proper error handling
- Security considerations
- Environment variable management
- HTTP server implementation

## Next Steps

1. **Explore the Code**: Look at `server.ts` and `tools/temperature.ts` to understand the structure
2. **Test the Current Tool**: Use the API examples to test the temperature functionality
3. **Customize**: Modify the existing tool or add new ones based on your needs
4. **Deploy**: Use this template as a foundation for your production MCP server

## MCP Protocol Implementation

This template implements the MCP (Model Context Protocol) specification:

- **JSON-RPC 2.0** over HTTP
- **Tool discovery** via `tools/list`
- **Tool execution** via `tools/call`
- **Authentication** with Bearer tokens
- **Error handling** with proper JSON-RPC error responses

## Example Tool Output

When you call the temperature tool for "United States", you'll get:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "🌡️ Current temperature in United States:\n\n🇺🇸 **72°F** (22°C)\n\n📍 Country: United States\n🌡️ Temperature: 72°F / 22°C\n📊 Status: Warm"
      }
    ]
  }
}
```

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Deno Documentation](https://deno.land/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

---

**Ready to build your own MCP server?** Start by exploring the code and then modify it to suit your needs!
