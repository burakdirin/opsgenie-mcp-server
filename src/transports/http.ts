import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { randomUUID } from 'node:crypto';

// Store transports by session ID
const transports: Record<string, StreamableHTTPServerTransport> = {};

export async function startHttpTransport(
  server: McpServer,
  port: number = 3000
) {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // Check if request is an initialize request
  const isInitializeRequest = (body: unknown): boolean => {
    return (body as { method?: string })?.method === 'initialize';
  };

  // Middleware to extract API key from various sources
  const extractApiKey = (req: express.Request): string | undefined => {
    // Try different sources for API key
    return (
      (req.headers['x-opsgenie-api-key'] as string) ||
      req.headers['authorization']?.replace('Bearer ', '') ||
      (req.query.apiKey as string) ||
      process.env.OPSGENIE_API_KEY
    );
  };

  app.all('/mcp', async (req, res) => {
    // Extract API key for this request
    const apiKey = extractApiKey(req);

    // Set API key in environment for this request context
    if (apiKey) {
      process.env.OPSGENIE_API_KEY = apiKey;
    }

    // Check for existing session ID
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId: string) => {
          // Store the transport by session ID
          transports[sessionId] = transport;
        },
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports[transport.sessionId];
        }
      };

      // Connect to the MCP server
      await server.connect(transport);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    try {
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  app.listen(port, () => {
    console.error(`Opsgenie MCP Server running on HTTP port ${port}`);
    console.error('API Key can be provided via:');
    console.error('  - OPSGENIE_API_KEY environment variable');
    console.error('  - X-Opsgenie-API-Key header');
    console.error('  - Authorization: Bearer <key> header');
    console.error('  - ?apiKey=<key> query parameter');
  });
}
