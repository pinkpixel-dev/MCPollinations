[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/pinkpixel-dev-mcpollinations-badge.png)](https://mseep.ai/app/pinkpixel-dev-mcpollinations)

# MCPollinations Multimodal MCP Server

[![smithery badge](https://smithery.ai/badge/@pinkpixel-dev/mcpollinations)](https://smithery.ai/server/@pinkpixel-dev/mcpollinations)
A Model Context Protocol (MCP) server that enables AI assistants to generate images, text, and audio through the Pollinations APIs

## Features

- Generate image URLs from text prompts
- Generate images and return them as base64-encoded data AND save as png, jpeg, jpg, or webp (default: png)
- Generate text responses from text prompts
- Generate audio responses from text prompts
- List available image and text generation models
- No authentication required
- Simple and lightweight
- Compatible with the Model Context Protocol (MCP)

## System Requirements

- **Node.js**: Version 14.0.0 or higher
  - For best performance, we recommend Node.js 16.0.0 or higher
  - Node.js versions below 16 use an AbortController polyfill

## Quick Start

### Installing via Smithery

To install mcpollinations for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@pinkpixel-dev/mcpollinations):

```bash
npx -y @smithery/cli install @pinkpixel-dev/mcpollinations --client claude
```

The easiest way to use the MCP server:

```bash
# Run directly with npx (no installation required)
npx @pinkpixel/mcpollinations
```

If you prefer to install it globally:

```bash
# Install globally
npm install -g @pinkpixel/mcpollinations

# Run the server
mcpollinations
# or
npx @pinkpixel/mcpollinations

```

Or clone the repository:

```bash
# Clone the git repository
git clone https://github.com/pinkpixel-dev/mcpollinations.git
# Run the server
mcpollinations
# or
npx @pinkpixel/mcpollinations
# or run directly
node /path/to/MCPollinations/pollinations-mcp-server.js

```

## MCP Integration

To integrate the server with applications that support the Model Context Protocol (MCP):

1. Generate an MCP configuration file:

```bash
# If installed globally
npx @pinkpixel/mcpollinations generate-config

# Or run directly
node /path/to/MCPollinations/generate-mcp-config.js
```

2. Follow the prompts to customize your configuration or use the defaults.
   - Set custom output and temporary directories (defaults to relative paths for portability)
     - **Windows users**: Consider using absolute paths (e.g., `C:\Users\YourName\Pictures\MCPollinations`) for more reliable file saving
   - **Configure optional authentication** (token and referrer for enhanced access)
   - Configure default parameters for image generation (with a list of available models, dimensions, etc.)
   - Configure default parameters for text generation (with a list of available models)
   - Configure default parameters for audio generation (voice)
   - Specify which tools should be allowed

3. Copy the generated `mcp.json` file to your application's MCP settings .json file.
4. Restart your application.

After integration, you can use commands like:

"Generate an image of a sunset over the ocean using MCPollinations"

## Authentication (Optional)

MCPollinations supports optional authentication to provide access to more models and better rate limits. The server works perfectly without authentication (free tier), but users with API tokens can get enhanced access.

### Configuration Methods

**Method 1: Environment Variables (Recommended for security)**
```bash
# Set environment variables before running the server
export POLLINATIONS_TOKEN="your-api-token"
export POLLINATIONS_REFERRER="https://your-domain.com"

# Then run the server
npx @pinkpixel/mcpollinations
```

**Method 2: MCP Configuration File**
When generating your MCP configuration, you'll be prompted for optional authentication settings:
```json
{
  "mcpollinations": {
    "auth": {
      "token": "your-api-token",
      "referrer": "https://your-domain.com"
    }
  }
}
```

### Authentication Parameters

- **`token`** (optional): Your Pollinations API token for enhanced access
- **`referrer`** (optional): Your domain/application referrer URL

Both parameters are completely optional. Leave them empty or unset to use the free tier.

## Using Your Configuration Settings

MCPollinations respects your MCP configuration settings as defaults. When you ask an AI assistant to generate content:

- **Your configured models, output directories, and parameters are used automatically**
- **To override**: Specifically instruct the AI to use different settings
  - "Generate an image using the gptimage model"
  - "Save this image to my Desktop folder"
  - "Use a temperature of 1.2 for this text generation"

**Example Instructions:**
- ✅ "Generate a sunset image" → Uses your configured model and output directory
- ✅ "Generate a sunset image with the flux model" → Overrides model only
- ✅ "Generate a sunset image and save it to C:\Pictures" → Overrides output path only

This ensures your preferences are always respected unless you specifically want different settings for a particular request.

## Troubleshooting

### "AbortController is not defined" Error

If you encounter this error when running the MCP server:

```
ReferenceError: AbortController is not defined
```

This is usually caused by running on an older version of Node.js (below version 16.0.0). Try one of these solutions:

1. **Update Node.js** (recommended):
   - Update to Node.js 16.0.0 or newer

2. **Use Global Installation**
   - Update to the latest version of the package:
   ```bash
   npm install -g @pinkpixel/mcpollinations
   # Run with npx
   npx @pinkpixel/mcpollinations
   ```

3. **Install AbortController manually**:
   - If for some reason the polyfill doesn't work:
   ```bash
   npm install node-abort-controller
   ```

### Check Your Node.js Version

To check your current Node.js version:

```bash
node --version
```

If it shows a version lower than 16.0.0, consider upgrading for best compatibility.

## Available Tools

The MCP server provides the following tools:

### **Image Generation Tools**
1. `generateImageUrl` - Generates an image URL from a text prompt
2. `generateImage` - Generates an image, returns it as base64-encoded data, and saves it to a file by default (PNG format)
3. `editImage` - **NEW!** Edit or modify existing images based on text prompts
4. `generateImageFromReference` - **NEW!** Generate new images using existing images as reference
5. `listImageModels` - Lists available models for image generation

### **Text & Audio Tools**
6. `respondText` - Responds with text to a prompt using text models (customizable parameters)
7. `respondAudio` - Generates an audio response to a text prompt (customizable voice parameter)
8. `listTextModels` - Lists available models for text generation
9. `listAudioVoices` - Lists all available voices for audio generation

## Text Generation Details

### Available Parameters

The `respondText` tool supports several parameters for fine-tuning text generation:

- **`model`**: Choose from available text models (use `listTextModels` to see current options)
- **`temperature`** (0.0-2.0): Controls randomness in the output
  - Lower values (0.1-0.7) = more focused and deterministic
  - Higher values (0.8-2.0) = more creative and random
- **`top_p`** (0.0-1.0): Controls diversity via nucleus sampling
  - Lower values = more focused on likely tokens
  - Higher values = considers more token possibilities
- **`system`**: System prompt to guide the model's behavior and personality

### Customizing Text Generation

```javascript
// Example options for respondText
const options = {
  model: "openai",           // Model selection
  temperature: 0.7,          // Balanced creativity
  top_p: 0.9,               // High diversity
  system: "You are a helpful assistant that explains things clearly and concisely."
};
```

### Configuration Examples

In your MCP configuration, you can set defaults:

```json
{
  "default_params": {
    "text": {
      "model": "openai",
      "temperature": 0.7,
      "top_p": 0.9,
      "system": "You are a helpful coding assistant."
    }
  }
}
```

## Image-to-Image Generation (NEW!)

MCPollinations now supports powerful image-to-image generation with two specialized tools:

### **editImage Tool**
Perfect for modifying existing images:
- **Remove objects**: "remove the cat from this image"
- **Add elements**: "add a dog to this scene"
- **Change backgrounds**: "replace the background with mountains"
- **Style modifications**: "make the lighting more dramatic"

### **generateImageFromReference Tool**
Perfect for creating variations and new styles:
- **Style transfer**: "make this photo look like a painting"
- **Format changes**: "convert this to a cartoon style"
- **Creative variations**: "create a futuristic version of this"
- **Artistic interpretations**: "make this look like a sketch"

### **Supported Models**
- **`gptimage`**: Versatile model for both editing and reference generation
- **`kontext`**: Specialized model optimized for image-to-image tasks

### **Example Usage**
```javascript
// Edit an existing image
const editResult = await editImage(
  "change the background to a sunset beach",
  "https://example.com/photo.jpg",
  "gptimage"
);

// Generate from reference
const referenceResult = await generateImageFromReference(
  "make this into a watercolor painting",
  "https://example.com/photo.jpg",
  "kontext"
);
```

### **Transparent Backgrounds (NEW!)**
Generate images with transparent backgrounds using the `gptimage` model:
- Perfect for logos, icons, and graphics
- Set `transparent: true` in your requests
- Only works with the `gptimage` model

## Image Generation Details

### Default Behavior

When using the `generateImage` tool:

- Images are saved to disk by default as PNG files
- The default save location is the current working directory where the MCP server is running
- The 'flux' model is used by default
- A random seed is generated by default for each image (ensuring variety)
- Base64-encoded image data is always returned, regardless of whether the image is saved to a file

### Customizing Image Generation

```javascript
// Example options for generateImage
const options = {
  // Model selection (defaults to 'flux')
  model: "flux",

  // Image dimensions
  width: 1024,
  height: 1024,

  // Generation options
  seed: 12345,  // Specific seed for reproducibility (defaults to random)
  enhance: true,  // Enhance the prompt using an LLM before generating (defaults to true)
  safe: false,  // Content filtering (defaults to false)
  transparent: false,  // Generate with transparent background (gptimage model only)

  // File saving options
  saveToFile: true,  // Set to false to skip saving to disk
  outputPath: "/path/to/save/directory",  // Custom save location
  fileName: "my_custom_name",  // Without extension
  format: "png"  // png, jpeg, jpg, or webp
};
```

### Where Images Are Saved

When using Claude or another application with the MCP server:

1. **Images are saved in the current working directory of where the MCP server is running**, not where Claude or the client application is installed.

2. If you start the MCP server manually from a specific directory, images will be saved there by default.

3. If Claude Desktop launches the MCP server automatically, images will be saved in Claude Desktop's working directory (typically in an application data folder).

**💡 Windows Users**: For reliable file saving on Windows, use absolute paths in your MCP configuration instead of relative paths (e.g., `C:\Users\YourName\Pictures\MCPollinations` instead of `./mcpollinations-output`). Relative paths may not resolve as expected depending on the working directory context.

### Finding Your Generated Images

- The response from Claude after generating an image includes the full file path where the image was saved
- You can specify a familiar location using the `outputPath` parameter
- Best practice: Ask Claude to save images to an easily accessible folder like your Pictures or Downloads directory

### Unique Filenames

The MCP server ensures that generated images always have unique filenames and will never overwrite existing files:

1. **Default filenames** include:
   - A sanitized version of the prompt (first 20 characters)
   - A timestamp
   - A random suffix

2. **Custom filenames** are also protected:
   - If you specify a filename and a file with that name already exists, a numeric suffix will be added automatically
   - For example: `sunset.png`, `sunset_1.png`, `sunset_2.png`, etc.

This means you can safely generate multiple images with the same prompt or filename without worrying about overwriting previous images.

### Accessing Base64 Data

Even when saving to a file, the base64-encoded image data is always returned and can be used for:

- Embedding in web pages (`<img src="data:image/png;base64,..." />`)
- Passing to other services or APIs
- Processing in memory without filesystem operations
- Displaying in applications that support data URIs

## For Developers

If you want to use the package in your own projects:

```bash
# Install as a dependency
npm install @pinkpixel/mcpollinations

# Import in your code
import { generateImageUrl, generateImage, repsondText, respondAudio, listTextModels, listImageModels, listAudioVoices } from '@pinkpixel/mcpollinations';
```

