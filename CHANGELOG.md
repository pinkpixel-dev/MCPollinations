 📜 Changelog

All notable changes to the MCPollinations will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - `2025-09-26`

### Added
- **New Image Models**: Added support for two new image generation models
  - `nanobanana`: Google's new model supporting both text-to-image and image-to-image generation
  - `seedream`: ByteDance's new model supporting both text-to-image and image-to-image generation
  - Both models work identically to `kontext` for image-to-image operations (editImage, generateImageFromReference)
  - Full support for all existing parameters: dimensions, seed, enhancement, safety filtering, file saving
- **Enhanced Documentation**: Updated README.md and OVERVIEW.md to include new models
  - Added examples showing usage with new models
  - Updated supported models lists in all documentation
- **Updated Configuration**: Enhanced MCP configuration generator to include new models in available options
- **Test Suite**: Added comprehensive test files for MCP functionality
  - `test-mcp-client.js`: Basic MCP protocol connectivity test
  - `test-list-tools.js`: Tool enumeration and schema validation test
  - `test-image-save.js`: Image generation and file saving functionality test
  - `test-new-models.js`: Validation test for new image models
  - `test-image-to-image.js`: Image-to-image functionality test with new models

### Changed
- **Schema Updates**: Updated tool schemas for `editImage` and `generateImageFromReference` to include new models in descriptions
- **Dynamic Model Support**: All new models are automatically available through the existing `listImageModels` API endpoint
- **Backward Compatibility**: All existing functionality remains unchanged - new models are additional options

### Technical Details
- New models use identical API patterns to existing models
- Support for up to 4 input images (following Pollinations API patterns)
- All existing parameters (width, height, seed, enhance, safe, etc.) work with new models
- File saving, unique naming, and base64 encoding work identically across all models

## [1.2.1] - `2025-09-06`

### ⚠️ BREAKING CHANGES
- **Removed `gptimage` model**: The `gptimage` model is no longer supported by the Pollinations API
  - All image-to-image operations (editImage, generateImageFromReference) now use `kontext` as the default model
  - Configuration files and examples have been updated to reflect available models
- **Removed transparent background support**: Transparent background functionality has been removed
  - Removed `transparent` parameter from all image generation tools
  - Updated tool schemas to remove transparent parameter
  - Removed transparent background configuration options
  - Documentation updated to remove all references to this feature

### Changed
- **Image-to-Image Model Defaults**: Updated default models for image-to-image operations
  - `editImage` tool: Default model changed from 'gptimage' to 'kontext'
  - `generateImageFromReference` tool: Default model changed from 'gptimage' to 'kontext'
  - Text-to-image operations continue to use 'flux' as default
- **Configuration Updates**: Updated all configuration files and generators
  - `example-mcp.json`: Removed transparent parameter
  - `generate-mcp-config.js`: Removed transparent configuration prompts and gptimage references
  - Updated available model lists in configuration generator
- **Documentation Updates**: Comprehensive documentation cleanup
  - `README.md`: Removed all references to gptimage model and transparent backgrounds
  - Updated code examples to use supported models only
  - Removed deprecated feature sections

### Removed
- `transparent` parameter from all image generation functions and schemas
- `gptimage` model references from documentation and configuration files
- Transparent background configuration prompts
- Deprecated feature documentation sections

### Migration Guide
- **For users with existing configurations**: Remove any `transparent` parameters from your MCP configuration files
- **For image-to-image operations**: Replace any `gptimage` model references with `kontext`
- **For transparent backgrounds**: This functionality is no longer available - consider using image editing tools as a post-processing step

## [1.2.0] - `2025-07-25`

### Added
- **Transparent Background Support**: Added `transparent` parameter for generating images with transparent backgrounds
  - Works with `gptimage` model only
  - Perfect for logos, icons, and graphics that need transparent backgrounds
  - Added to both `generateImageUrl` and `generateImage` tools
  - Configurable in MCP configuration with default settings
- **Image-to-Image Generation**: Two new powerful tools for working with existing images
  - `editImage` tool: Edit or modify existing images based on text prompts (e.g., "remove the cat and add a dog", "change background to mountains")
  - `generateImageFromReference` tool: Generate new images using existing images as reference (e.g., "make this into a cartoon", "create a painting version")
  - Both tools support `gptimage` and `kontext` models
  - Full parameter support including transparent backgrounds, custom dimensions, and file saving
- **Enhanced Configuration**: Updated configuration generator and example files
  - Added transparent parameter configuration prompts
  - Updated tool lists to include new image-to-image tools
  - Enhanced model guidance and descriptions

### Changed
- Updated tool schemas to include new transparent parameter
- Enhanced image generation capabilities with more flexible model options
- Improved tool descriptions for better AI assistant understanding

### Fixed
- Ensured all new tools follow consistent parameter patterns and error handling

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
## [1.3.0] - `2025-09-26`

### Added
- Multi-reference image support for new models:
  - `editImage` and `generateImageFromReference` now accept `imageUrl` as a string or an array of URLs. Arrays are encoded as the API’s comma-separated `image` parameter.
- Environment-driven defaults used when tool calls omit arguments:
  - Image: `IMAGE_MODEL`, `IMAGE_WIDTH`, `IMAGE_HEIGHT`, `IMAGE_ENHANCE`, `IMAGE_SAFE`
  - Text: `TEXT_MODEL`, `TEXT_TEMPERATURE`, `TEXT_TOP_P`, `TEXT_SYSTEM`
  - Audio: `AUDIO_VOICE`
  - Files: `OUTPUT_DIR`

### Changed
- Authentication loading recognizes both `token`/`referrer` (lowercase) and `POLLINATIONS_TOKEN`/`POLLINATIONS_REFERRER` (uppercase) from env, matching MCP client configs that pass simple keys.
- Configuration generator now outputs an `env`-only MCP config. Removed legacy `resources`, `disabled`, and `alwaysAllow` blocks to align with typical MCP client expectations.
- Example configuration and docs updated to use `env` for auth and defaults.

### Fixed
- Ensured server respects user defaults from env across all tools, so user’s configuration is always honored unless explicitly overridden in a request.

### Notes
- Model behavior details for `kontext`, `nanobanana`, and `seedream` are documented in `new_models_integration.md`. `kontext` uses only the first reference; `nanobanana` is safe up to ~4 refs; `seedream` up to 10.
