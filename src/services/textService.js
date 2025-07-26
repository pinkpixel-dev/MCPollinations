/**
 * Pollinations Text Service
 *
 * Functions for interacting with the Pollinations Text API
 */

/**
 * Responds with text to a prompt using the Pollinations Text API
 *
 * @param {string} prompt - The text prompt to generate a response for
 * @param {string} [model="openai"] - Model to use for text generation. Available options: "openai", "anthropic", "mistral", "llama", "gemini"
 * @param {number} [seed] - Seed for reproducible results (default: random)
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Promise<string>} - The generated text response
 */
export async function respondText(prompt, model = "openai", seed = Math.floor(Math.random() * 1000000), authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  // Build the query parameters
  const queryParams = new URLSearchParams();
  if (model) queryParams.append('model', model);
  if (seed !== undefined) queryParams.append('seed', seed);

  // Construct the URL
  const encodedPrompt = encodeURIComponent(prompt);
  const baseUrl = 'https://text.pollinations.ai';
  let url = `${baseUrl}/${encodedPrompt}`;

  // Add query parameters if they exist
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    // Prepare fetch options with optional auth headers
    const fetchOptions = {};
    if (authConfig) {
      fetchOptions.headers = {};
      if (authConfig.token) {
        fetchOptions.headers['Authorization'] = `Bearer ${authConfig.token}`;
      }
      if (authConfig.referrer) {
        fetchOptions.headers['Referer'] = authConfig.referrer;
      }
    }

    // Fetch the text from the URL
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to generate text: ${response.statusText}`);
    }

    // Get the text response
    const textResponse = await response.text();

    return textResponse;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

/**
 * List available text generation models from Pollinations API
 *
 * @returns {Promise<Object>} - Object containing the list of available text models
 */
export async function listTextModels() {
  try {
    const response = await fetch('https://text.pollinations.ai/models');

    if (!response.ok) {
      throw new Error(`Failed to list text models: ${response.statusText}`);
    }

    const models = await response.json();
    return { models };
  } catch (error) {
    console.error('Error listing text models:', error);
    throw error;
  }
}
