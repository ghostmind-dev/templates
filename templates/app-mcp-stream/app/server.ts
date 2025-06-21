// Simple MCP Server with Bearer Token Authentication
// This is a basic implementation that handles MCP protocol manually

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

// Token authentication middleware
function authenticateRequest(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');

  console.log('=== AUTHENTICATION DEBUG ===');
  console.log('Expected SERVER_TOKEN:', SERVER_TOKEN);
  console.log('Received Authorization header:', authHeader);
  console.log('Header type:', typeof authHeader);
  console.log('Token type:', typeof SERVER_TOKEN);
  console.log('Are they equal?', authHeader === SERVER_TOKEN);
  console.log('============================');

  if (!authHeader) {
    console.log('❌ Missing Authorization header');
    return false;
  }

  // Validate against the expected server token
  if (authHeader !== SERVER_TOKEN) {
    console.log('❌ Invalid token provided');
    console.log('   Expected:', SERVER_TOKEN);
    console.log('   Received:', authHeader);
    return false;
  }

  console.log('✅ Authentication successful');
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
          tools: [
            {
              name: 'get_temperature',
              description: 'Get the current temperature for a country',
              inputSchema: {
                type: 'object',
                properties: {
                  country: {
                    type: 'string',
                    description: 'Name of the country to get temperature for',
                  },
                },
                required: ['country'],
              },
            },
          ],
        },
      };

    case 'tools/call': {
      const toolName = request.params?.name;
      const toolArgs = request.params?.arguments;

      if (toolName === 'get_temperature') {
        const country = toolArgs?.country;
        if (!country) {
          return {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32602,
              message: 'Country parameter is required',
            },
          };
        }

        // Generate a random temperature between -20°C and 40°C
        const temperature = Math.floor(Math.random() * 61) - 200;

        console.log(`Temperature requested for ${country}: ${temperature}°C`);
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: `The current temperature in ${country} is ${temperature}°C`,
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

    // Only handle /mcp endpoint
    const url = new URL(req.url);
    if (url.pathname !== '/mcp') {
      return new Response('Not Found', { status: 404 });
    }

    // Authenticate the request
    if (!authenticateRequest(req)) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
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

console.log('🚀 MCP Server starting on http://localhost:3000/mcp');
console.log('🔐 Server token loaded from SERVER_TOKEN environment variable');
console.log('📝 Use Authorization: <your-token> header for authentication');
console.log('🔧 Available tools: get_temperature');
console.log('📁 Available resources: test://example');
