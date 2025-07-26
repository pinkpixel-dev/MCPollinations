/**
 * Schema definitions for the Pollinations Image API
 */

/**
 * Schema for the generateImageUrl tool
 */
export const generateImageUrlSchema = {
  name: 'generateImageUrl',
  description: 'Generate an image URL from a text prompt. User-configured settings in MCP config will be used as defaults unless specifically overridden.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The text description of the image to generate'
      },
      model: {
        type: 'string',
        description: 'Model name to use for generation (default: user config or "flux"). Use listImageModels to see all available models'
      },
      seed: {
        type: 'number',
        description: 'Seed for reproducible results (default: random)'
      },
      width: {
        type: 'number',
        description: 'Width of the generated image (default: 1024)'
      },
      height: {
        type: 'number',
        description: 'Height of the generated image (default: 1024)'
      },
      enhance: {
        type: 'boolean',
        description: 'Whether to enhance the prompt using an LLM before generating (default: true)'
      },
      safe: {
        type: 'boolean',
        description: 'Whether to apply content filtering (default: false)'
      }
    },
    required: ['prompt']
  }
};

/**
 * Schema for the generateImage tool
 */
export const generateImageSchema = {
  name: 'generateImage',
  description: 'Generate an image, return the base64-encoded data, and save to a file by default. User-configured settings in MCP config will be used as defaults unless specifically overridden.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The text description of the image to generate'
      },
      model: {
        type: 'string',
        description: 'Model name to use for generation (default: user config or "flux"). Use listImageModels to see all available models'
      },
      seed: {
        type: 'number',
        description: 'Seed for reproducible results (default: random)'
      },
      width: {
        type: 'number',
        description: 'Width of the generated image (default: 1024)'
      },
      height: {
        type: 'number',
        description: 'Height of the generated image (default: 1024)'
      },
      enhance: {
        type: 'boolean',
        description: 'Whether to enhance the prompt using an LLM before generating (default: true)'
      },
      safe: {
        type: 'boolean',
        description: 'Whether to apply content filtering (default: false)'
      },
      outputPath: {
        type: 'string',
        description: 'Directory path where to save the image (default: "./mcpollinations-output")'
      },
      fileName: {
        type: 'string',
        description: 'Name of the file to save (without extension, default: generated from prompt)'
      },
      format: {
        type: 'string',
        description: 'Image format to save as (png, jpeg, jpg, webp - default: png)'
      }
    },
    required: ['prompt']
  }
};

/**
 * Schema for the listImageModels tool
 */
export const listImageModelsSchema = {
  name: 'listImageModels',
  description: 'List available image models',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};
