 📜 Changelog

All notable changes to the MCPollinations will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - `2025-07-25`

### Added
- **Enhanced Text Generation**: Added configurable parameters for text generation
  - `temperature` parameter (0.0-2.0) for controlling randomness in output
  - `top_p` parameter (0.0-1.0) for controlling diversity via nucleus sampling
  - `system` parameter for providing system prompts to guide model behavior
  - Configuration generator now includes prompts for text generation parameters
- **User Configuration Priority**: Added documentation and tool descriptions emphasizing user-configured settings are used as defaults
- **Improved Model Guidance**: Updated tool schemas to reference listTextModels and listImageModels for current model lists
- **Text Generation Privacy**: Added hardcoded `private=true` parameter to text generation requests

### Changed
- Updated configuration generator with more accurate model information and tier-specific messaging
- Enhanced tool descriptions to clarify user config priority and override behavior
- Improved path guidance for Windows users in configuration prompts

### Fixed
- Added missing `private=true` parameter to text generation API requests

## [1.1.2] - `2025-07-25`

### Added
- **Optional Authentication Support**: Added support for optional `token` and `referrer` parameters to access enhanced Pollinations API features
  - Environment variable support: `POLLINATIONS_TOKEN` and `POLLINATIONS_REFERRER`
  - MCP configuration file support with new `auth` section
  - Authorization header (`Bearer token`) and Referer header support in all API requests
  - Backward compatible - free tier continues to work without authentication
- Enhanced MCP configuration generator with authentication prompts
- Updated example-mcp.json to include auth section template
- Comprehensive documentation updates for authentication setup
- **Windows Path Guidance**: Added documentation for Windows users to use absolute paths for reliable file saving

### Changed
- All service functions now accept optional `authConfig` parameter
- MCP server now reads and passes authentication configuration to services
- Configuration generator includes new authentication configuration section

### Fixed
- Improved file path handling documentation for Windows compatibility

## [1.0.7] - `2025-04-08`

### Added
- Project analysis and `OVERVIEW.md` update by Pink Pixel on `2025-04-08`.
- Added Usage and Key Features sections to OVERVIEW.md.
- Comprehensive codebase analysis.
- Added ability to save generated images to a customizable file path as PNG (or other formats).
- New options for `generateImage` tool: `saveToFile`, `outputPath`, `fileName`, and `format`.
- Added hardcoded parameter `nologo=true` for all image generation.
- Added customizable parameter `safe` for content filtering (defaults to false).
- Set default seed to random for image generation to ensure variety.
- Added customizable parameter `enhance` for image quality enhancement.
- Set 'flux' as the default model for image generation.
- Changed default behavior to save images to file automatically (PNG format).
- Added comprehensive documentation in README.md about image saving behavior, locations, and accessing base64 data.
- Implemented unique filename generation to prevent overwriting existing images.
- Added automatic numeric suffixes for duplicate filenames.
- Renamed `generateText` tool to `respondText` for clarity and consistency.
- Removed `sayText` tool as it's not supported by the API.
- Removed generic `listModels` tool in favor of specific `listImageModels` and `listTextModels` tools for clarity.
- Ensured `model` parameter is properly documented as customizable for text generation.
- Improved `listAudioVoices` tool to return the complete list of available voices.
- Enhanced documentation for the `voice` parameter in `respondAudio` tool.
- Fixed tool registration to ensure all tools are properly displayed in the MCP protocol.
- Added test script to verify tool registration.
- Standardized package name references throughout the codebase.
- Replaced Claude-specific installation script with a comprehensive MCP configuration generator that supports customizing:
  - Output and temporary directories (using relative paths for portability)
  - Default parameters for image, text, and audio generation
  - Tool restrictions and permissions
  - Fixed server and package names to ensure compatibility
  - Removed nologo parameter from configuration as it's hardcoded to true
  - Added lists of available models for image and text generation to help users make informed choices
- Changed the command to start the server from "model-context-protocol" to "mcpollinations" for better branding consistency
- Removed `listPrompts` and `listResources` tools as they're not currently implemented with an API
- Removed resourceService.js and resourceSchema.js files
- Updated tool schemas to expose only the parameters we want to customize in the MCP client
- Added MIT LICENSE file
- Added comprehensive .gitignore file
- Updated documentation to reflect the new configuration generator.

## [1.0.6] - `2025-04-01`

### Added
- Compatibility with Node.js versions 14.0.0 and later.
- AbortController polyfill for Node.js versions below 16.0.0.
- Troubleshooting guide in README.
- Enhanced documentation with system requirements and installation options.

### Fixed
- "AbortController is not defined" error.
- Improved error handling and reporting.

## [1.0.5] - `2025-04-01`

### Added
- Initial public release.