import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerOpsgenieTools } from '../opsgenie/tools.js';

export function createServer(): McpServer {
  // Create server instance
  const server = new McpServer({
    name: 'opsgenie-mcp-server',
    version: '1.0.0',
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Register all tools
  registerOpsgenieTools(server);

  return server;
}
