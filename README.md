# Opsgenie MCP Server

[![npm version](https://badge.fury.io/js/opsgenie-mcp-server.svg)](https://badge.fury.io/js/opsgenie-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides comprehensive Opsgenie alert management capabilities.

## Features

- **Complete Alert Management**: List, create, acknowledge, and close alerts
- **Alert Notes**: Add and retrieve notes for alerts
- **Alert Logs**: View alert activity logs
- **Custom Details**: Add custom properties to alerts
- **Multiple Transport Support**: stdio, HTTP, and Server-Sent Events (SSE)
- Built with TypeScript and the official MCP SDK

## Installation

### From npm (recommended)

```bash
npm install -g opsgenie-mcp-server
```

Or add to your project:

```bash
npm install opsgenie-mcp-server
```

### From source

```bash
git clone https://github.com/burakdirin/opsgenie-mcp-server.git
cd opsgenie-mcp-server
npm install
npm run build
```

## Usage

### Transport Options

The server supports multiple transport protocols with flexible API key configuration:

#### 1. Stdio Transport (Default) - For Desktop Integration

**With Environment Variable:**
```bash
export OPSGENIE_API_KEY="your-api-key-here"
npm run start:stdio
# or
node build/index.js --transport stdio
```

**With CLI Argument:**
```bash
node build/index.js --transport stdio --api-key "your-api-key-here"
```

#### 2. HTTP Transport - For Web Applications and Hosted Deployment

**Basic HTTP Server:**
```bash
# Start HTTP server (API key provided per-request)
npm run start:http
# or
node build/index.js --transport http --port 3000
```

**With Environment Variable:**
```bash
export OPSGENIE_API_KEY="your-api-key-here"
node build/index.js --transport http --port 3000
```

**HTTP API Key Configuration:**

When using HTTP transport, clients can provide API keys through multiple methods:

- **Environment Variable**: `OPSGENIE_API_KEY=your-key`
- **Custom Header**: `X-Opsgenie-API-Key: your-key`
- **Authorization Header**: `Authorization: Bearer your-key`
- **Query Parameter**: `?apiKey=your-key`

HTTP endpoints:

- **Modern clients**: `POST http://localhost:3000/mcp`
- **Legacy clients**: `GET http://localhost:3000/sse` (Server-Sent Events)

#### 3. Custom Port

```bash
node build/index.js --transport http --port 8080 --api-key "your-api-key-here"
```

### Command Line Options

```bash
opsgenie-mcp-server [options]

Options:
  -V, --version           output the version number
  -t, --transport <type>  transport type (stdio|http) (default: "stdio")
  -p, --port <number>     port number for HTTP transport (default: "3000")
  -a, --api-key <key>     Opsgenie API key (can also use OPSGENIE_API_KEY env var)
  -h, --help              display help for command
```

### Authentication

The Opsgenie MCP server supports multiple ways to provide your API key for authentication:

#### Option 1: Environment Variable (Recommended)
```bash
export OPSGENIE_API_KEY="your-api-key-here"
opsgenie-mcp-server --transport stdio
```

#### Option 2: CLI Argument
```bash
opsgenie-mcp-server --transport stdio --api-key "your-api-key-here"
```

#### Option 3: Per-tool Parameter (Backwards Compatible)
When using tools directly, you can still provide the API key as a parameter:
```
opsgenie_list_alerts: {"apiKey": "your-api-key-here"}
```

All Opsgenie API operations require an API key. You can obtain one from your Opsgenie account:

1. Go to Opsgenie Settings → API Key Management
2. Create a new API key with appropriate permissions
3. Use this key in the `apiKey` parameter for all tool calls

#### Getting Your Opsgenie API Key

1. **Login to Opsgenie**: Go to [app.opsgenie.com](https://app.opsgenie.com)
2. **Navigate to Settings**: Click on your profile icon → Settings
3. **API Key Management**: Go to "API Key Management" section
4. **Create New Key**: Click "Create API Key"
5. **Set Permissions**: Grant the following permissions:
   - Configuration Access: Read, Create, Update, Delete
   - Alert: Read, Create, Update, Delete
   - Incident: Read, Create, Update, Delete
6. **Copy the Key**: Save the generated API key securely

#### Using the API Key

With the improved API key handling, you now have several options:

**Option 1: Set globally via environment variable (Recommended)**
```bash
export OPSGENIE_API_KEY="genie-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
Then use tools without specifying the API key:
- "List my recent Opsgenie alerts"
- "Create a high priority alert for database connection failure"
- "Add a note to alert 12345 saying 'Investigating database connection issue'"

**Option 2: Provide API key per tool (Backwards compatible)**
- "List alerts using API key genie-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
- "Create alert with API key genie-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

**Option 3: Using hosted server (Users provide their own keys)**
Users configure their client with their API key, and all tools work seamlessly:
- "List my recent Opsgenie alerts" (API key from client configuration)
- "Create a new high priority alert" (API key from client configuration)

#### Security Best Practices

- Never commit API keys to version control
- Store API keys securely (use environment variables or secure vaults)
- Rotate API keys periodically
- Use API keys with minimal required permissions
- Monitor API key usage in Opsgenie logs

### Security

- All requests use HTTPS when connecting to Opsgenie API
- API keys should be stored securely and not exposed in logs
- Rate limiting is handled by the Opsgenie API

## Available Tools

1. **opsgenie_list_alerts**: List alerts from Opsgenie with filtering options
2. **opsgenie_create_alert**: Create a new alert in Opsgenie
3. **opsgenie_acknowledge_alert**: Acknowledge an existing alert
4. **opsgenie_close_alert**: Close an alert
5. **opsgenie_list_alert_notes**: List notes for a specific alert
6. **opsgenie_add_note**: Add a note to an alert
7. **opsgenie_list_alert_logs**: List activity logs for an alert
8. **opsgenie_add_details**: Add custom details/properties to an alert

All tools require an Opsgenie API key for authentication.

## Integration with Cursor IDE

To use this MCP server with Cursor IDE, you can configure it locally or connect to a hosted instance:

### Local Installation Configuration

#### Method 1: Using Environment Variable (Recommended)

1. Set your API key as an environment variable:
   ```bash
   export OPSGENIE_API_KEY="your-api-key-here"
   ```

2. Configure in Cursor settings:
   ```json
   {
     "mcpServers": {
       "opsgenie-mcp-server": {
         "command": "npx",
         "args": ["-y", "opsgenie-mcp-server", "--transport", "stdio"],
         "env": {
           "OPSGENIE_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

#### Method 2: Using CLI Argument

```json
{
  "mcpServers": {
    "opsgenie-mcp-server": {
      "command": "npx",
      "args": [
        "-y", 
        "opsgenie-mcp-server", 
        "--transport", "stdio",
        "--api-key", "your-api-key-here"
      ]
    }
  }
}
```

### Hosted Server Configuration

When connecting to a hosted MCP server (HTTP transport), you can provide your API key through various methods:

#### Option 1: Environment Variables
```json
{
  "mcpServers": {
    "opsgenie-hosted": {
      "url": "https://your-server.com/mcp",
      "env": {
        "OPSGENIE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Option 2: Custom Headers
```json
{
  "mcpServers": {
    "opsgenie-hosted": {
      "url": "https://your-server.com/mcp",
      "headers": {
        "X-Opsgenie-API-Key": "your-api-key-here"
      }
    }
  }
}
```

#### Option 3: Authorization Header
```json
{
  "mcpServers": {
    "opsgenie-hosted": {
      "url": "https://your-server.com/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key-here"
      }
    }
  }
}
```

#### Option 4: Query Parameter
```json
{
  "mcpServers": {
    "opsgenie-hosted": {
      "url": "https://your-server.com/mcp?apiKey=your-api-key-here"
    }
  }
}
```

### Configuration File Locations

**macOS/Linux**: `~/.cursor/mcp.json`
**Windows**: `%USERPROFILE%\.cursor\mcp.json`

### Verification

After configuration:
1. Restart Cursor IDE
2. The MCP server should appear in the MCP tab of Cursor Settings
3. You can verify it's working by asking Cursor's AI assistant to list Opsgenie alerts

**Example prompts to test:**
- "List my recent Opsgenie alerts"
- "Create a new alert in Opsgenie for database connection failure"
- "Show me notes for alert ID 12345"

## Deploying as a Hosted Service

You can deploy this MCP server as a hosted service to allow multiple users to connect with their own Opsgenie API keys:

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "build/index.js", "--transport", "http", "--port", "3000"]
```

```bash
docker build -t opsgenie-mcp-server .
docker run -p 3000:3000 opsgenie-mcp-server
```

### Vercel Deployment

Create a `vercel.json` file:

```json
{
  "functions": {
    "api/mcp.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/mcp",
      "dest": "/api/mcp.js"
    }
  ]
}
```

Deploy:
```bash
vercel deploy
```

### Railway Deployment

Create a `railway.toml` file:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Client Configuration for Hosted Servers

Once deployed, users can connect to your hosted server by configuring their MCP client:

**Claude Desktop Configuration:**
```json
{
  "mcpServers": {
    "opsgenie": {
      "url": "https://your-domain.com/mcp",
      "headers": {
        "X-Opsgenie-API-Key": "user-specific-api-key"
      }
    }
  }
}
```

**Cursor IDE Configuration:**
```json
{
  "mcpServers": {
    "opsgenie": {
      "url": "https://your-domain.com/mcp",
      "env": {
        "OPSGENIE_API_KEY": "user-specific-api-key"
      }
    }
  }
}
```

This approach allows you to host a single instance that multiple users can connect to, each with their own Opsgenie credentials.

## Development

- Built with TypeScript
- Uses the official MCP SDK
- Supports modern ES modules

## Links

- [GitHub Issues](https://github.com/burakdirin/opsgenie-mcp-server/issues)
- [OpsGenie Documentation](https://docs.opsgenie.com/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
