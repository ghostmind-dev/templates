// Simple MCP Server with Bearer Token Authentication
// This is a basic implementation that handles MCP protocol manually

import {
  tools as temperatureTools,
  toolExecutors as temperatureExecutors,
} from './tools/temperature.ts';

// Combine all tools
const tools = [...temperatureTools];

// Combine all tool executors
const toolExecutors = {
  ...temperatureExecutors,
};

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Get the expected server token from environment
const SERVER_TOKEN = Deno.env.get('SERVER_TOKEN');

if (!SERVER_TOKEN) {
  console.error('❌ SERVER_TOKEN environment variable is required but not set');
  console.error('   Please set SERVER_TOKEN before starting the server');
  console.error('   Example: export SERVER_TOKEN=your-secret-token');
  Deno.exit(1);
}

// Token authentication middleware following MCP authorization spec
function authenticateRequest(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');

  console.log('=== AUTHENTICATION DEBUG ===');
  console.log('Received Authorization header:', authHeader);
  console.log('============================');

  if (!authHeader) {
    console.log('❌ Missing Authorization header');
    return false;
  }

  // Check for Bearer token format as per MCP spec
  if (!authHeader.startsWith('Bearer ')) {
    console.log('❌ Authorization header must use Bearer token format');
    console.log('   Expected format: Bearer <token>');
    console.log('   Received:', authHeader);
    return false;
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.substring(7); // Remove "Bearer " prefix

  // Validate against the expected server token
  if (token !== SERVER_TOKEN) {
    console.log('❌ Invalid bearer token provided');
    console.log('   Expected token:', SERVER_TOKEN);
    console.log('   Received token:', token);
    return false;
  }

  console.log('✅ Bearer token authentication successful');
  return true;
}

// Handle MCP requests
async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  console.log('Handling MCP request:', request.method);

  switch (request.method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {},
          },
          serverInfo: {
            name: 'mcp-stream-server',
            version: '1.0.0',
          },
        },
      };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: tools,
        },
      };

    case 'tools/call': {
      const toolName = request.params?.name;
      const toolArgs = request.params?.arguments;

      // Check if tool exists and execute it
      const executor = toolExecutors[toolName];
      if (executor) {
        try {
          const result = await executor(toolArgs);
          return {
            jsonrpc: '2.0',
            id: request.id,
            result: result,
          };
        } catch (error) {
          return {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32602,
              message:
                error instanceof Error
                  ? error.message
                  : 'Tool execution failed',
            },
          };
        }
      }

      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Unknown tool: ${toolName}`,
        },
      };
    }

    case 'resources/list':
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          resources: [
            {
              uri: 'test://example',
              name: 'Test Resource',
              description: 'A test resource',
              mimeType: 'text/plain',
            },
          ],
        },
      };

    case 'resources/read': {
      const resourceUri = request.params?.uri;

      if (resourceUri === 'test://example') {
        console.log('Test resource accessed');
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            contents: [
              {
                uri: 'test://example',
                mimeType: 'text/plain',
                text: 'This is a test resource content',
              },
            ],
          },
        };
      }

      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Unknown resource: ${resourceUri}`,
        },
      };
    }

    default:
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`,
        },
      };
  }
}

// Start the HTTP server
Deno.serve(
  {
    port: Number(Deno.env.get('PORT')),
    hostname: '0.0.0.0',
  },
  async (req: Request) => {
    console.log(`${req.method} ${req.url}`);

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Handle different endpoints
    const url = new URL(req.url);

    // OAuth 2.0 Protected Resource Metadata endpoint (RFC 9728)
    if (url.pathname === '/.well-known/oauth-protected-resource') {
      return new Response(
        JSON.stringify({
          resource: `${url.origin}/mcp`,
          authorization_servers: [`${url.origin}`],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // OAuth 2.0 Authorization Server Metadata endpoint (RFC 8414)
    if (url.pathname === '/.well-known/oauth-authorization-server') {
      return new Response(
        JSON.stringify({
          issuer: url.origin,
          authorization_endpoint: `${url.origin}/oauth/authorize`,
          token_endpoint: `${url.origin}/oauth/token`,
          response_types_supported: ['code'],
          grant_types_supported: ['authorization_code'],
          code_challenge_methods_supported: ['S256'],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Only handle /mcp endpoint for MCP requests
    if (url.pathname !== '/mcp') {
      return new Response('Not Found', { status: 404 });
    }

    // Authenticate the request
    if (!authenticateRequest(req)) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'WWW-Authenticate':
            'Bearer realm="MCP Server", error="invalid_token"',
        },
      });
    }

    // Handle POST requests with JSON-RPC
    if (req.method === 'POST') {
      try {
        const body = await req.text();
        console.log('Request body:', body);

        const mcpRequest: MCPRequest = JSON.parse(body);
        const mcpResponse = await handleMCPRequest(mcpRequest);

        return new Response(JSON.stringify(mcpResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Parse error',
            },
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
);

console.log('🚀 MCP Server starting on http://localhost:3008/mcp');
console.log('🔐 Server token loaded from SERVER_TOKEN environment variable');
console.log(
  '📝 Use Authorization: Bearer <your-token> header for authentication'
);
console.log(`🔧 Available tools: ${tools.map((tool) => tool.name).join(', ')}`);
console.log('📁 Available resources: test://example');
