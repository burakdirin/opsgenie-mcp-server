import { Command } from 'commander';
import { createServer } from '../server/setup.js';
import { startHttpTransport } from '../transports/http.js';
import { startStdioTransport } from '../transports/stdio.js';

export async function runCLI() {
  const program = new Command();

  program
    .name('opsgenie-mcp-server')
    .description('Opsgenie MCP Server with multiple transport options')
    .version('1.0.0')
    .option('-t, --transport <type>', 'transport type (stdio|http)', 'stdio')
    .option('-p, --port <number>', 'port number for HTTP transport', '3000');

  program.parse();
  const options = program.opts();

  const port = parseInt(options.port);
  const server = createServer();

  switch (options.transport.toLowerCase()) {
    case 'stdio':
      await startStdioTransport(server);
      break;
    case 'http':
      await startHttpTransport(server, port);
      break;
    default:
      console.error(`Unknown transport: ${options.transport}`);
      console.error('Supported transports: stdio, http');
      process.exit(1);
  }
}
