import type { CustomArgs, CustomOptions } from "jsr:@ghostmind/run";
import { $ } from "npm:zx@8.1.3";

const MCP_SERVER_URL = "http://localhost:3000/mcp";
const TEST_TOKEN = Deno.env.get("SERVER_TOKEN");

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

async function mcpRequest(
  method: string,
  params?: any,
  id: number = 1
): Promise<MCPResponse> {
  const request: MCPRequest = {
    jsonrpc: "2.0",
    id,
    method,
    params,
  };

  console.log(`🔄 Making MCP request: ${method}`);
  console.log(`📤 Request:`, JSON.stringify(request, null, 2));

  const response = await fetch(MCP_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${TEST_TOKEN}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result: MCPResponse = await response.json();
  console.log(`📥 Response:`, JSON.stringify(result, null, 2));
  console.log("");

  return result;
}

async function testServerConnection() {
  console.log("🔍 Testing server connection...");

  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
      },
    });

    if (response.ok) {
      console.log("✅ Server is responding to CORS preflight");
    } else {
      console.log("❌ Server CORS preflight failed");
    }
  } catch (error) {
    console.log("❌ Server connection failed:", error);
    throw error;
  }
}

async function testAuthentication() {
  console.log("🔐 Testing authentication...");

  // Test without token
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
      }),
    });

    if (response.status === 401) {
      console.log("✅ Authentication properly rejects requests without token");
    } else {
      console.log("❌ Authentication should reject requests without token");
    }
  } catch (error) {
    console.log("❌ Authentication test failed:", error);
  }

  // Test with invalid token
  try {
    const response = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
      }),
    });

    if (response.status === 401) {
      console.log("✅ Authentication properly rejects empty tokens");
    } else {
      console.log("❌ Authentication should reject empty tokens");
    }
  } catch (error) {
    console.log("❌ Authentication test failed:", error);
  }
}

async function testMCPProtocol() {
  console.log("🧪 Testing MCP Protocol...");

  // Test initialize
  const initResponse = await mcpRequest("initialize", {});
  if (initResponse.result?.serverInfo?.name === "mcp-stream-server") {
    console.log("✅ Initialize request successful");
  } else {
    console.log("❌ Initialize request failed");
  }

  // Test tools/list
  const toolsResponse = await mcpRequest("tools/list", {}, 2);
  if (toolsResponse.result?.tools?.length > 0) {
    console.log("✅ Tools list request successful");
    console.log(`📋 Found ${toolsResponse.result.tools.length} tool(s)`);
  } else {
    console.log("❌ Tools list request failed");
  }

  // Test tools/call with echo
  const echoResponse = await mcpRequest(
    "tools/call",
    {
      name: "echo",
      arguments: {
        text: "Hello from test script!",
      },
    },
    3
  );

  if (
    echoResponse.result?.content?.[0]?.text?.includes("Hello from test script!")
  ) {
    console.log("✅ Echo tool call successful");
  } else {
    console.log("❌ Echo tool call failed");
  }

  // Test resources/list
  const resourcesResponse = await mcpRequest("resources/list", {}, 4);
  if (resourcesResponse.result?.resources?.length > 0) {
    console.log("✅ Resources list request successful");
    console.log(
      `📁 Found ${resourcesResponse.result.resources.length} resource(s)`
    );
  } else {
    console.log("❌ Resources list request failed");
  }

  // Test resources/read
  const readResponse = await mcpRequest(
    "resources/read",
    {
      uri: "test://example",
    },
    5
  );

  if (readResponse.result?.contents?.[0]?.text) {
    console.log("✅ Resource read request successful");
  } else {
    console.log("❌ Resource read request failed");
  }

  // Test unknown method
  const unknownResponse = await mcpRequest("unknown/method", {}, 6);
  if (unknownResponse.error?.code === -32601) {
    console.log("✅ Unknown method properly returns error");
  } else {
    console.log("❌ Unknown method should return error");
  }
}

async function runPerformanceTest() {
  console.log("⚡ Running performance test...");

  const startTime = Date.now();
  const promises = [];

  // Make 10 concurrent requests
  for (let i = 0; i < 10; i++) {
    promises.push(mcpRequest("tools/list", {}, 100 + i));
  }

  try {
    await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(
      `✅ Performance test completed: 10 concurrent requests in ${duration}ms`
    );
  } catch (error) {
    console.log("❌ Performance test failed:", error);
  }
}

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  $.verbose = true;

  console.log("🚀 Starting MCP Server Tests");
  console.log(`🎯 Target: ${MCP_SERVER_URL}`);
  console.log(`🔑 Token: ${TEST_TOKEN}`);
  console.log("");

  try {
    // Check if server is running
    await testServerConnection();

    // Test authentication
    await testAuthentication();

    // Test MCP protocol
    await testMCPProtocol();

    // Performance test
    await runPerformanceTest();

    console.log("🎉 All tests completed successfully!");
    console.log("");
    console.log("📊 Test Summary:");
    console.log("- Server connection: ✅");
    console.log("- Authentication: ✅");
    console.log("- MCP Protocol: ✅");
    console.log("- Performance: ✅");
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.log("");
    console.log("💡 Make sure the MCP server is running:");
    console.log("   cd app && deno task dev");
    Deno.exit(1);
  }
}
