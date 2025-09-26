# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Development Commands

```bash
# Start the MCP server
npm start
# or
node pollinations-mcp-server.js

# Generate MCP configuration interactively
npm run generate-config
# or
node generate-mcp-config.js

# Run tests
npm test                    # Basic MCP client test
npm run test:image-save     # Test image saving functionality
npm run test:list-tools     # Test tool listing

# Install globally for system-wide use
npm install -g .
```

## Architecture Overview

MCPollinations is a **Model Context Protocol (MCP) server** that provides AI image, text, and audio generation capabilities through the Pollinations API. The architecture follows MCP standards with a modular service-based design.

### Core Components

**MCP Server (`pollinations-mcp-server.js`)**
- Main entry point implementing MCP protocol
- Handles tool discovery and execution
- Includes Node.js compatibility layer for AbortController (pre-v16)
- Manages authentication configuration via environment variables

**Service Layer (`src/services/`)**
- `imageService.js`: Image generation, editing, and image-to-image functionality
- `audioService.js`: Audio generation with voice selection
- `textService.js`: Text generation with configurable parameters
- Each service has corresponding schema files defining MCP tool interfaces

**Schema Management (`src/schemas.js`)**
- Centralized export of all tool schemas
- `getAllToolSchemas()` function provides complete tool list for MCP registration

**Configuration Generator (`generate-mcp-config.js`)**
- Interactive CLI tool for creating MCP client configurations
- Supports customization of default parameters, authentication, and tool restrictions

### Key Architectural Patterns

**Service-Schema Pairing**: Each service module has a corresponding schema module that defines the MCP tool interface, ensuring consistency between implementation and API contract.

**Authentication Strategy**: Optional token-based auth via environment variables (`POLLINATIONS_TOKEN`, `POLLINATIONS_REFERRER`) with graceful fallback to free tier.

**File Management**: Automatic directory creation, unique filename generation with collision handling, and configurable output paths for generated content.

**Error Handling**: MCP-compliant error responses with detailed error messages and proper error classification.

## Development Workflow

### Adding New Tools
1. Create service function in appropriate `src/services/*Service.js` file
2. Define schema in corresponding `src/services/*Schema.js` file  
3. Export schema from `src/schemas.js`
4. Add tool handler in `pollinations-mcp-server.js` CallToolRequestSchema handler
5. Update default configuration in `generate-mcp-config.js`

### Testing Changes
- Use `npm test` for basic functionality verification
- Test specific features with `npm run test:image-save` or `npm run test:list-tools`
- Generate test configurations with `npm run generate-config`

### Authentication Testing
Set environment variables before running:
```bash
export POLLINATIONS_TOKEN="your-token"
export POLLINATIONS_REFERRER="your-referrer"
npm start
```

## Project Structure Context

This is an **ES module** project (`"type": "module"` in package.json) requiring Node.js 14+ with polyfills for older versions. The main executable is exposed via npm bin as `mcpollinations`.

The project follows **thin proxy design** - minimal abstraction over the Pollinations API while providing MCP protocol compliance and enhanced features like file saving and authentication.

Key files for modification:
- `pollinations-mcp-server.js` - MCP server implementation and tool handlers
- `src/services/` - Core API functionality 
- `src/schemas.js` - Tool schema definitions
- `generate-mcp-config.js` - Configuration generator logic