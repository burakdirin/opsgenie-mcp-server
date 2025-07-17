# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-17

### Added
- **Configurable API Key Support**: Multiple ways to provide Opsgenie API key for enhanced flexibility
  - CLI argument: `--api-key <key>` for command-line usage
  - Environment variable: `OPSGENIE_API_KEY` for system-wide configuration
  - Per-tool parameter: Backward compatible `apiKey` parameter (now optional)
- **Enhanced HTTP Transport**: Multiple API key authentication methods
  - Environment variable (`OPSGENIE_API_KEY`)
  - Custom header (`X-Opsgenie-API-Key`)
  - Authorization header (`Authorization: Bearer <key>`)
  - Query parameter (`?apiKey=<key>`)
- **Improved User Experience**: 
  - Clear error messages when API key is missing
  - Helpful console output showing API key configuration options
  - Updated CLI help with new options

### Changed
- **Tool Schemas**: All 8 tools now have optional `apiKey` parameter with fallback to environment variable
- **Documentation**: Comprehensive updates to README with authentication options and deployment scenarios
- **API Key Resolution**: Smart fallback logic prioritizes parameter > environment variable

### Security
- **Multiple Authentication Methods**: Flexible API key configuration for different deployment scenarios
- **Environment Variable Support**: Secure API key storage without hardcoding in scripts

### Developer Experience
- **Enhanced CLI**: New `--api-key` option for easier testing and development
- **Better Error Handling**: Clear guidance when API key configuration is missing
- **Deployment Flexibility**: Support for both desktop integration and hosted services

## [1.0.0] - 2025-01-17

### Added
- Initial release of Opsgenie MCP Server
- Complete Model Context Protocol (MCP) server implementation
- 8 comprehensive tools for Opsgenie alert management:
  - `opsgenie_list_alerts` - List alerts with filtering options
  - `opsgenie_create_alert` - Create new alerts with full configuration
  - `opsgenie_acknowledge_alert` - Acknowledge existing alerts
  - `opsgenie_close_alert` - Close alerts
  - `opsgenie_list_alert_notes` - List notes for specific alerts
  - `opsgenie_add_note` - Add notes to alerts
  - `opsgenie_list_alert_logs` - View alert activity logs
  - `opsgenie_add_details` - Add custom properties to alerts
- Multiple transport support:
  - stdio transport for command-line integration
  - HTTP transport with modern streamable and legacy SSE support
- TypeScript implementation with strict type safety
- Zod schema validation for all tool inputs
- Comprehensive error handling and user-friendly error messages
- CLI interface with configurable transport and port options
- Binary executable (`opsgenie-mcp-server`) for global installation
- Complete integration guide for Cursor IDE
- Detailed API key setup and security documentation
- Professional documentation with usage examples
- MIT license for open source usage
- Published to npm registry as `opsgenie-mcp-server`

### Security
- HTTPS-only communication with Opsgenie API
- Secure API key handling with parameter-based authentication
- Input validation and sanitization for all user inputs
- Protection against common web vulnerabilities

### Developer Experience
- ESLint and Prettier configuration for code quality
- Comprehensive TypeScript configuration
- Build automation with pre-publish hooks
- Modern ES modules support
- Node.js 18+ compatibility
