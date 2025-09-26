# MCPollinations Project Overview 🎨✨

*Last Updated: September 26, 2025*

## Project Identity

**MCPollinations** is a comprehensive Model Context Protocol (MCP) server that enables AI assistants to generate multimodal content through the Pollinations APIs. It serves as a bridge between AI applications and advanced generative AI capabilities for images, text, and audio.

- **Project Name**: MCPollinations
- **Package Name**: `@pinkpixel/mcpollinations`
- **Current Version**: 1.3.0
- **Maintainer**: Pink Pixel (pinkpixel.dev)
- **License**: MIT
- **Repository**: https://github.com/pinkpixel-dev/mcpollinations

## Purpose & Vision

MCPollinations democratizes access to multimodal AI generation by providing:

- 🖼️ **Professional Image Generation** - Create high-quality images from text prompts
- 🎨 **Advanced Image Editing** - Modify existing images with natural language instructions  
- 📝 **Intelligent Text Generation** - Generate contextual text responses with fine-tuned parameters
- 🎵 **Voice Synthesis** - Convert text to natural-sounding speech with multiple voice options
- 🔧 **MCP Protocol Compliance** - Seamless integration with AI applications like Claude Desktop
- 🎛️ **Flexible Configuration** - Customizable parameters and optional authentication for enhanced features

## Architecture Overview

MCPollinations follows a **service-oriented architecture** with a **thin proxy design**, providing minimal abstraction over the Pollinations API while adding valuable MCP protocol compliance and enhanced functionality.

### Core Components

```
MCPollinations/
├── pollinations-mcp-server.js    # 🚀 Main MCP server entry point
├── src/
│   ├── index.js                  # 📦 Service exports and API client
│   ├── schemas.js                # 🔧 Centralized MCP tool definitions
│   └── services/                 # 🎯 Modular service architecture
│       ├── imageService.js       # 🎨 Image generation & editing
│       ├── imageSchema.js        # 📋 Image tool schemas
│       ├── audioService.js       # 🎵 Audio generation
│       ├── audioSchema.js        # 📋 Audio tool schemas
│       ├── textService.js        # 📝 Text generation
│       └── textSchema.js         # 📋 Text tool schemas
├── generate-mcp-config.js        # ⚙️ Interactive configuration generator
└── tests/                        # 🧪 Testing suite
    ├── test-mcp-client.js        # Basic MCP functionality test
    ├── test-image-save.js        # Image saving test
    └── test-list-tools.js        # Tool enumeration test
```

### Design Principles

1. **Service-Schema Pairing**: Each service module has a corresponding schema module ensuring consistency between implementation and MCP API contract
2. **Thin Proxy Design**: Minimal abstraction over Pollinations API while adding MCP compliance and enhanced features
3. **Modular Architecture**: Clear separation of concerns between image, text, and audio services
4. **Configuration-Driven**: Comprehensive configuration system supporting various deployment patterns
5. **Error-First Design**: Robust error handling with MCP-compliant error responses

## Technical Specifications

### Runtime Requirements
- **Node.js**: Version 14.0.0+ (16.0.0+ recommended for best performance)
- **AbortController**: Built-in polyfill for Node.js < 16
- **ES Modules**: Project uses `"type": "module"`

### Key Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `node-fetch`: HTTP client for API requests  
- `play-sound`: Audio playback functionality
- `node-abort-controller`: AbortController polyfill

### Authentication Support
- Optional token-based auth for enhanced API access
- Environment variables supported:
  - `token`, `referrer` (preferred for MCP `env`)
  - `POLLINATIONS_TOKEN`, `POLLINATIONS_REFERRER` (also accepted)
- Graceful fallback to free tier if unset

## Capabilities & Tools

MCPollinations provides **9 specialized MCP tools** across three categories:

### 🎨 Image Generation Tools (5 tools)

1. **`generateImageUrl`** - Generate image URLs from text prompts
   - Models: flux (default), turbo, kontext, nanobanana, seedream
   - Customizable dimensions, seeds, enhancement options

2. **`generateImage`** - Generate images with file saving
   - Returns base64 data AND saves to file (PNG default)
   - Unique filename generation prevents overwrites
   - Supports PNG, JPEG, JPG, WebP formats

3. **`editImage`** ⭐ *New in v1.2.0*
   - Edit existing images with natural language instructions
   - Perfect for: removing objects, adding elements, changing backgrounds
   - Supports models: kontext (default), nanobanana, seedream

4. **`generateImageFromReference`** ⭐ *New in v1.2.0*
   - Generate new images using existing images as reference
   - Perfect for: style transfer, artistic interpretations, format changes
   - Supports models: kontext (default), nanobanana, seedream

5. **`listImageModels`** - Enumerate available image generation models

### 📝 Text Generation Tools (2 tools)

6. **`respondText`** - Advanced text generation with fine-tuning parameters
   - Models: openai (default), and others via `listTextModels`
   - Parameters: temperature (randomness), top_p (diversity), system prompts
   - Privacy-first: always includes `private=true`

7. **`listTextModels`** - Dynamic model listing from Pollinations API

### 🎵 Audio Generation Tools (2 tools)

8. **`respondAudio`** - Text-to-speech generation
   - 13 available voices: alloy, echo, fable, onyx, nova, shimmer, coral, verse, ballad, ash, sage, amuch, dan
   - Customizable voice instructions for character/style
   - Returns base64 audio data

9. **`listAudioVoices`** - Enumerate all available voice options

## File Management & Storage

### Default Behavior
- **Auto-Save**: Images are automatically saved to disk by default
- **Output Directory**: `./mcpollinations-output` (configurable)
- **Format Support**: PNG (default), JPEG, JPG, WebP
- **Unique Naming**: Automatic collision avoidance with timestamp and random suffixes

### Filename Generation Strategy
```javascript
// Default pattern
`${sanitized_prompt}_${timestamp}_${random_suffix}.${format}`

// Custom filename collision handling
`${custom_name}.png`     → `${custom_name}_1.png`     → `${custom_name}_2.png`
```

### Cross-Platform Considerations
- **Relative Paths**: Default for portability
- **Windows Guidance**: Absolute paths recommended for reliability
- **Directory Creation**: Automatic recursive directory creation

## Configuration & Integration

### Installation Methods

1. **Direct Usage** (No installation required)
   ```bash
   npx @pinkpixel/mcpollinations
   ```

2. **Global Installation**
   ```bash
   npm install -g @pinkpixel/mcpollinations
   mcpollinations
   ```

3. **Smithery Integration** (Claude Desktop)
   ```bash
   npx -y @smithery/cli install @pinkpixel-dev/mcpollinations --client claude
   ```

4. **Repository Clone** (Development)
   ```bash
   git clone https://github.com/pinkpixel-dev/mcpollinations.git
   ```

### Configuration Generator

The interactive configuration generator (`generate-mcp-config.js`) outputs an `env`-only MCP config and provides:
- ⚙️ Custom output directory (`OUTPUT_DIR`)
- 🔐 Optional authentication (`token`, `referrer`)
- 🎛️ Default parameters for image/text/audio via env keys
- 📁 Platform-specific path guidance

### MCP Client Integration

MCPollinations integrates seamlessly with MCP-compatible clients:

```json
{
  "mcpServers": {
    "mcpollinations": {
      "command": "npx",
      "args": ["-y", "@pinkpixel/mcpollinations"],
      "env": {
        "token": "optional-token",
        "referrer": "optional-referrer",
        "OUTPUT_DIR": "./mcpollinations-output"
      }
    }
  }
}
```

## Development Workflow

### Quick Development Commands

```bash
# Start the MCP server
npm start

# Generate MCP configuration interactively  
npm run generate-config

# Run tests
npm test                    # Basic MCP client test
npm run test:image-save     # Test image saving functionality
npm run test:list-tools     # Test tool listing

# Install globally for system-wide use
npm install -g .
```

### Development Tools & Testing
- **MCP Inspector**: Compatible for interactive testing and debugging
- **Test Suite**: Comprehensive testing for core functionality
- **Error Handling**: Robust error reporting with detailed messages
- **Logging**: Structured logging for debugging and monitoring

### Adding New Tools
1. Create service function in appropriate `src/services/*Service.js` file
2. Define schema in corresponding `src/services/*Schema.js` file
3. Export schema from `src/schemas.js`
4. Add tool handler in `pollinations-mcp-server.js` CallToolRequestSchema handler
5. Update default configuration in `generate-mcp-config.js`

## Project Status & Evolution

### Current Version: 1.3.0 (September 2025)

**Recent Breaking Changes:**
- 🚫 **Removed `gptimage` model** - No longer supported by Pollinations API
- 🚫 **Removed transparent background support** - Feature discontinued
- ✅ **Updated image-to-image operations** - Now use `kontext` model as default

### Version History Highlights

- **v1.2.0** (July 2025): Added image-to-image generation tools
- **v1.1.3** (July 2025): Enhanced text generation with fine-tuning parameters
- **v1.1.2** (July 2025): Optional authentication support added
- **v1.0.7** (April 2025): Major update with file saving and comprehensive improvements
- **v1.0.6** (April 2025): Node.js compatibility improvements
- **v1.0.5** (April 2025): Initial public release

### Ecosystem Integration

- ✅ **Smithery**: Official listing and automated installation
- ✅ **MCP Clients**: Full compatibility with Claude Desktop and other MCP clients
- ✅ **CI/CD**: GitHub Actions for automated testing and publishing
- ✅ **Docker**: Containerization support for deployment flexibility
- ✅ **NPM**: Published package for easy distribution

## Quality Assurance & Standards

### Code Quality
- 📏 **Semantic Versioning**: Strict adherence to SemVer principles
- 📝 **Comprehensive Documentation**: README, CHANGELOG, CONTRIBUTING guides
- 🧪 **Testing Suite**: Automated tests for core functionality
- 🔍 **Error Handling**: Robust error management with detailed reporting

### Security & Privacy
- 🔐 **Optional Authentication**: Token-based enhanced access
- 🛡️ **Privacy-First**: Default `private=true` parameters
- ⚡ **Rate Limiting**: Graceful handling of API rate limits
- 🔒 **Secure Defaults**: Safe parameter defaults for content filtering

### Development Standards
- 📋 **MIT License**: Open source with permissive licensing
- 🌐 **Cross-Platform**: Linux, Windows, macOS compatibility  
- 📦 **Dependency Management**: Minimal, well-maintained dependencies
- 🔄 **Backward Compatibility**: Careful handling of breaking changes with migration guides

## Future Considerations

While no formal roadmap exists, potential areas for future development include:

- 🔄 **Enhanced Model Support**: Integration with new Pollinations models as they become available
- 🎛️ **Advanced Configuration**: More granular control over generation parameters
- 📊 **Usage Analytics**: Optional usage tracking for optimization insights
- 🌐 **Multi-Language Support**: Internationalization for broader adoption
- 🔧 **Plugin Architecture**: Extensibility for custom functionality

---

*Made with ❤️ by Pink Pixel*  
*"Dream it, Pixel it" ✨*
