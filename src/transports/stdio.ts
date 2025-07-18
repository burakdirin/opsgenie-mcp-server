import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export async function startStdioTransport(server: McpServer) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Opsgenie MCP Server running on stdio');
}
