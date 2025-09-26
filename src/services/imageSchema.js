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

/**
 * Schema for the editImage tool
 */
export const editImageSchema = {
  name: 'editImage',
  description: 'Edit or modify an existing image based on a text prompt. User-configured settings in MCP config will be used as defaults unless specifically overridden.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The text description of how to edit the image (e.g., "remove the cat and add a dog", "change background to mountains")'
      },
      imageUrl: {
        type: 'string',
        description: 'URL of the input image to edit'
      },
      model: {
        type: 'string',
        description: 'Model name to use for editing (default: user config or "kontext"). Available: "kontext", "nanobanana", "seedream"'
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
        description: 'Directory path where to save the image (default: user config or "./mcpollinations-output")'
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
    required: ['prompt', 'imageUrl']
  }
};

/**
 * Schema for the generateImageFromReference tool
 */
export const generateImageFromReferenceSchema = {
  name: 'generateImageFromReference',
  description: 'Generate a new image using an existing image as reference. User-configured settings in MCP config will be used as defaults unless specifically overridden.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The text description of what to generate based on the reference image (e.g., "create a cartoon version", "make it look like a painting")'
      },
      imageUrl: {
        type: 'string',
        description: 'URL of the reference image to base the generation on'
      },
      model: {
        type: 'string',
        description: 'Model name to use for generation (default: user config or "kontext"). Available: "kontext", "nanobanana", "seedream"'
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
        description: 'Directory path where to save the image (default: user config or "./mcpollinations-output")'
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
    required: ['prompt', 'imageUrl']
  }
};
