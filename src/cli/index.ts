#!/usr/bin/env node
import { Command } from 'commander';
import { createServer } from '../server/setup.js';
import { startHttpTransport } from '../transports/http.js';
import { startStdioTransport } from '../transports/stdio.js';

export async function runCLI() {
  const program = new Command();

  program
    .name('opsgenie-mcp-server')
    .description('Opsgenie MCP Server with multiple transport options')
    .version('1.2.0')
    .option('-t, --transport <type>', 'transport type (stdio|http)', 'stdio')
    .option('-p, --port <number>', 'port number for HTTP transport', '3000')
    .option(
      '-a, --api-key <key>',
      'Opsgenie API key (can also use OPSGENIE_API_KEY env var)'
    );

  program.parse();
  const options = program.opts();

  if (options.apiKey) {
    process.env.OPSGENIE_API_KEY = options.apiKey;
  }

  if (options.transport === 'stdio' && !process.env.OPSGENIE_API_KEY) {
    console.error('Error: Opsgenie API key is required for stdio transport.');
    console.error('Provide it via:');
    console.error('  --api-key <key>              CLI argument');
    console.error('  OPSGENIE_API_KEY=<key>      Environment variable');
    process.exit(1);
  }

  const port = Number.parseInt(options.port, 10);

  switch (options.transport.toLowerCase()) {
    case 'stdio': {
      const server = createServer();
      await startStdioTransport(server);
      break;
    }
    case 'http':
      await startHttpTransport(port);
      break;
    default:
      console.error(`Unknown transport: ${options.transport}`);
      console.error('Supported transports: stdio, http');
      process.exit(1);
  }
}
