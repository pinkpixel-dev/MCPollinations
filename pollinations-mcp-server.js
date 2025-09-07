#!/usr/bin/env node

// Check Node.js version and provide polyfill for AbortController if needed
// This needs to be done before importing any modules that might use AbortController
const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0], 10);

// Show version info
console.error(`Running on Node.js version: ${nodeVersion}`);

// Add AbortController polyfill for Node.js versions < 16
if (majorVersion < 16) {
  // Check if AbortController is already defined globally
  if (typeof global.AbortController === 'undefined') {
    console.error('Adding AbortController polyfill for Node.js < 16');
    try {
      // Try to dynamically import a polyfill
      // First attempt to use node-abort-controller if it's installed
      try {
        const { AbortController: AbortControllerPolyfill } = await import('node-abort-controller');
        global.AbortController = AbortControllerPolyfill;
      } catch (importError) {
        // Create a basic implementation if the import fails
        console.error('Using basic AbortController polyfill');

        class AbortSignal {
          constructor() {
            this.aborted = false;
            this.onabort = null;
            this._eventListeners = {};
          }

          addEventListener(type, listener) {
            if (!this._eventListeners[type]) {
              this._eventListeners[type] = [];
            }
            this._eventListeners[type].push(listener);
          }

          removeEventListener(type, listener) {
            if (!this._eventListeners[type]) return;
            this._eventListeners[type] = this._eventListeners[type].filter(l => l !== listener);
          }

          dispatchEvent(event) {
            if (event.type === 'abort' && this.onabort) {
              this.onabort(event);
            }

            if (this._eventListeners[event.type]) {
              this._eventListeners[event.type].forEach(listener => listener(event));
            }
          }
        }

        global.AbortController = class AbortController {
          constructor() {
            this.signal = new AbortSignal();
          }

          abort() {
            if (this.signal.aborted) return;
            this.signal.aborted = true;
            const event = { type: 'abort' };
            this.signal.dispatchEvent(event);
          }
        };
      }
    } catch (error) {
      console.error('Failed to add AbortController polyfill:', error);
      console.error('This package requires Node.js >= 16. Please upgrade your Node.js version.');
      process.exit(1);
    }
  }
}

// Now import the MCP SDK and other modules
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import {
  generateImageUrl,
  generateImage,
  editImage,
  generateImageFromReference,
  respondAudio,
  listImageModels,
  listTextModels,
  listAudioVoices,
  respondText,

} from './src/index.js';
import { getAllToolSchemas } from './src/schemas.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import player from 'play-sound';

// Create audio player instance
const audioPlayer = player({});

// Read authentication configuration from environment variables
// These are optional - the server works without them (free tier)
const authConfig = {
  token: process.env.POLLINATIONS_TOKEN || null,
  referrer: process.env.POLLINATIONS_REFERRER || null
};

// Only create authConfig object if we have at least one auth parameter
const finalAuthConfig = (authConfig.token || authConfig.referrer) ? authConfig : null;

if (finalAuthConfig) {
  console.error('Auth configuration loaded:', {
    hasToken: !!finalAuthConfig.token,
    hasReferrer: !!finalAuthConfig.referrer
  });
} else {
  console.error('Running in free tier mode (no auth configuration)');
}

// Create the server instance
const server = new Server(
  {
    name: '@pinkpixel/mcpollinations',
    version: '1.2.1',
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Set up error handling
server.onerror = (error) => console.error('[MCP Error]', error);
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Set up tool handlers
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: getAllToolSchemas()
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'generateImageUrl') {
    try {
      const { prompt, model = 'flux', seed, width = 1024, height = 1024, enhance = true, safe = false } = args;
      const result = await generateImageUrl(prompt, model, seed, width, height, enhance, safe, finalAuthConfig);
      return {
        content: [
          { type: 'text', text: JSON.stringify(result, null, 2) }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error generating image URL: ${error.message}` }
        ],
        isError: true
      };
    }
  } else if (name === 'generateImage') {
    try {
      const { prompt, model = 'flux', seed, width = 1024, height = 1024, enhance = true, safe = false, outputPath = './mcpollinations-output', fileName = '', format = 'png' } = args;
      const result = await generateImage(prompt, model, seed, width, height, enhance, safe, outputPath, fileName, format, finalAuthConfig);

      // Prepare the response content
      const content = [
        {
          type: 'image',
          data: result.data,
          mimeType: result.mimeType
        }
      ];

      // Prepare the response text
      let responseText = `Generated image from prompt: "${prompt}"\n\nImage metadata: ${JSON.stringify(result.metadata, null, 2)}`;

      // Add file path information if the image was saved to a file
      if (result.filePath) {
        responseText += `\n\nImage saved to: ${result.filePath}`;
      }

      // Add the text content
      content.push({ type: 'text', text: responseText });

      return { content };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error generating image: ${error.message}` }
        ],
        isError: true
      };
    }
  } else if (name === 'respondAudio') {
    try {
      const { prompt, voice, seed, voiceInstructions } = args;
      const result = await respondAudio(prompt, voice, seed, voiceInstructions, finalAuthConfig);

      // Save audio to a temporary file
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `pollinations-audio-${Date.now()}.mp3`);

      // Decode base64 and write to file
      fs.writeFileSync(tempFilePath, Buffer.from(result.data, 'base64'));

      // Play the audio file
      audioPlayer.play(tempFilePath, (err) => {
        if (err) console.error('Error playing audio:', err);

        // Clean up the temporary file after playing
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupErr) {
          console.error('Error cleaning up temp file:', cleanupErr);
        }
      });

      return {
        content: [
          {
            type: 'text',
            text: `Audio has been played.\n\nAudio metadata: ${JSON.stringify(result.metadata, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error generating audio: ${error.message}` }
        ],
        isError: true
      };
    }
  } else if (name === 'listImageModels') {
    try {
      const result = await listImageModels();
      return {
        content: [
          { type: 'text', text: JSON.stringify(result, null, 2) }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error listing image models: ${error.message}` }
        ],
        isError: true
      };
    }
  } else if (name === 'listTextModels') {
    try {
      const result = await listTextModels();
      return {
        content: [
          { type: 'text', text: JSON.stringify(result, null, 2) }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error listing text models: ${error.message}` }
        ],
        isError: true
      };
    }
  } else if (name === 'listAudioVoices') {
    try {
      const result = await listAudioVoices();
      return {
        content: [
          { type: 'text', text: JSON.stringify(result, null, 2) }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error listing audio voices: ${error.message}` }
        ],
        isError: true
      };
    }
  } else if (name === 'respondText') {
    try {
      const { prompt, model = "openai", seed, temperature, top_p, system } = args;
      const result = await respondText(prompt, model, seed, temperature, top_p, system, finalAuthConfig);
      return {
        content: [
          { type: 'text', text: result }
        ]
      };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error generating text response: ${error.message}` }
        ],
        isError: true
      };
    }

  } else if (name === 'editImage') {
    try {
      const { prompt, imageUrl, model = 'kontext', seed, width = 1024, height = 1024, enhance = true, safe = false, outputPath = './mcpollinations-output', fileName = '', format = 'png' } = args;
      const result = await editImage(prompt, imageUrl, model, seed, width, height, enhance, safe, outputPath, fileName, format, finalAuthConfig);

      // Prepare the response content
      const content = [
        {
          type: 'image',
          data: result.data,
          mimeType: result.mimeType
        }
      ];

      // Prepare the response text
      let responseText = `Edited image from prompt: "${prompt}"\nInput image: ${imageUrl}\n\nImage metadata: ${JSON.stringify(result.metadata, null, 2)}`;

      // Add file path information if the image was saved to a file
      if (result.filePath) {
        responseText += `\n\nImage saved to: ${result.filePath}`;
      }

      content.push({
        type: 'text',
        text: responseText
      });

      return { content };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error editing image: ${error.message}` }
        ],
        isError: true
      };
    }

  } else if (name === 'generateImageFromReference') {
    try {
      const { prompt, imageUrl, model = 'kontext', seed, width = 1024, height = 1024, enhance = true, safe = false, outputPath = './mcpollinations-output', fileName = '', format = 'png' } = args;
      const result = await generateImageFromReference(prompt, imageUrl, model, seed, width, height, enhance, safe, outputPath, fileName, format, finalAuthConfig);

      // Prepare the response content
      const content = [
        {
          type: 'image',
          data: result.data,
          mimeType: result.mimeType
        }
      ];

      // Prepare the response text
      let responseText = `Generated image from reference: "${prompt}"\nReference image: ${imageUrl}\n\nImage metadata: ${JSON.stringify(result.metadata, null, 2)}`;

      // Add file path information if the image was saved to a file
      if (result.filePath) {
        responseText += `\n\nImage saved to: ${result.filePath}`;
      }

      content.push({
        type: 'text',
        text: responseText
      });

      return { content };
    } catch (error) {
      return {
        content: [
          { type: 'text', text: `Error generating image from reference: ${error.message}` }
        ],
        isError: true
      };
    }

  } else {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  }
});

// Run the server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCPollinations MCP server running on stdio');
}

run().catch(console.error);