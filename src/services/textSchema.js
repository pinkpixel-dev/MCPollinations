/**
 * Schema definitions for the Pollinations Text API
 */

/**
 * Schema for the respondText tool
 */
export const respondTextSchema = {
  name: 'respondText',
  description: 'Respond with text to a prompt using the Pollinations Text API. User-configured settings in MCP config will be used as defaults unless specifically overridden.',
  inputSchema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The text prompt to generate a response for'
      },
      model: {
        type: 'string',
        description: 'Model to use for text generation (default: user config or "openai"). Use listTextModels to see all available models'
      },
      seed: {
        type: 'number',
        description: 'Seed for reproducible results (default: random)'
      },
      temperature: {
        type: 'number',
        description: 'Controls randomness in the output (0.0 to 2.0, default: user config or model default)'
      },
      top_p: {
        type: 'number',
        description: 'Controls diversity via nucleus sampling (0.0 to 1.0, default: user config or model default)'
      },
      system: {
        type: 'string',
        description: 'System prompt to guide the model\'s behavior (default: user config or none)'
      }
    },
    required: ['prompt']
  }
};

/**
 * Schema for the listTextModels tool
 */
export const listTextModelsSchema = {
  name: 'listTextModels',
  description: 'List available text models',
  inputSchema: {
    type: 'object',
    properties: {}
  }
};
