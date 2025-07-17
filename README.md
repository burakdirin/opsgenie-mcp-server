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

The server supports multiple transport protocols:

#### 1. Stdio Transport (Default)

```bash
# Default stdio transport for MCP clients
npm run start:stdio
# or
node build/index.js --transport stdio
```

#### 2. HTTP Transport

```bash
# HTTP transport for web applications and REST clients
npm run start:http
# or
node build/index.js --transport http --port 3000
```

HTTP endpoints:

- **Modern clients**: `POST http://localhost:3000/mcp`
- **Legacy clients**: `GET http://localhost:3000/sse` (Server-Sent Events)

#### 3. Custom Port

```bash
node build/index.js --transport http --port 8080
```

### Command Line Options

```bash
opsgenie-mcp-server [options]

Options:
  -V, --version           output the version number
  -t, --transport <type>  transport type (stdio|http) (default: "stdio")
  -p, --port <number>     port number for HTTP transport (default: "3000")
  -h, --help              display help for command
```

### Authentication

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

The API key must be provided with each tool call. Here are examples:

**Example 1: List Alerts**
```
Ask Cursor: "List my recent Opsgenie alerts"
When prompted for API key, provide: genie-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Example 2: Create Alert**
```
Ask Cursor: "Create a high priority alert for database connection failure with API key genie-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Example 3: Add Note to Alert**
```
Ask Cursor: "Add a note to alert 12345 saying 'Investigating database connection issue' using API key genie-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

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

To use this MCP server with Cursor IDE, you need to configure it in your Cursor MCP settings:

### Method 1: Using the Cursor Settings UI (Recommended)

1. Open Cursor IDE
2. Press `Cmd/Ctrl + Shift + J` to open Cursor Settings
3. Navigate to the **MCP** tab
4. Click **"+ Add New MCP Server"**
5. Fill in the configuration:
   - **Name**: `opsgenie-mcp-server`
   - **Type**: `stdio`
   - **Command**: `npx opsgenie-mcp-server --transport stdio`

### Method 2: Manual Configuration File

Create or edit the MCP configuration file:

**Location:**
- **macOS/Linux**: `~/.cursor/mcp.json`
- **Windows**: `%USERPROFILE%\.cursor\mcp.json`

**Configuration:**
```json
{
  "mcpServers": {
    "opsgenie-mcp-server": {
      "command": "npx",
      "args": ["-y", "opsgenie-mcp-server", "--transport", "stdio"]
    }
  }
}
```

### Method 3: Using Local Installation

If you've installed the package globally:

```json
{
  "mcpServers": {
    "opsgenie-mcp-server": {
      "command": "opsgenie-mcp-server",
      "args": ["--transport", "stdio"]
    }
  }
}
```

### Verification

After configuration:
1. Restart Cursor IDE
2. The MCP server should appear in the MCP tab of Cursor Settings
3. You can verify it's working by asking Cursor's AI assistant to list Opsgenie alerts

**Example prompts to test:**
- "List my recent Opsgenie alerts"
- "Create a new alert in Opsgenie for database connection failure"
- "Show me notes for alert ID 12345"

## Development

- Built with TypeScript
- Uses the official MCP SDK
- Supports modern ES modules

## Links

- [GitHub Issues](https://github.com/burakdirin/opsgenie-mcp-server/issues)
- [OpsGenie Documentation](https://docs.opsgenie.com/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
