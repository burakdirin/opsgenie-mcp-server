import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { type Express, type Request, type Response } from 'express';
import { createServer } from '../server/setup.js';

function methodNotAllowed(res: Response): void {
  res.status(405).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not allowed.',
    },
    id: null,
  });
}

export function createHttpApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_req, res) => {
    res.json({
      name: 'opsgenie-mcp-server',
      status: 'ok',
      transport: 'streamable-http',
      endpoint: '/mcp',
    });
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/mcp', async (req: Request, res: Response) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    let closed = false;
    const close = async (): Promise<void> => {
      if (closed) return;
      closed = true;
      await transport.close();
      await server.close();
    };

    res.once('close', () => {
      void close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling MCP request:', error);

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

      await close();
    }
  });

  app.get('/mcp', (_req, res) => {
    methodNotAllowed(res);
  });

  app.delete('/mcp', (_req, res) => {
    methodNotAllowed(res);
  });

  return app;
}

export async function startHttpTransport(port: number = 3000): Promise<void> {
  const app = createHttpApp();

  app.listen(port, () => {
    console.error(`Opsgenie MCP Server running at http://localhost:${port}/mcp`);
    console.error('Set OPSGENIE_API_KEY in the environment before calling tools.');
  });
}
