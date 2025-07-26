/**
 * Pollinations Text Service
 *
 * Functions for interacting with the Pollinations Text API
 */

/**
 * Responds with text to a prompt using the Pollinations Text API
 *
 * @param {string} prompt - The text prompt to generate a response for
 * @param {string} [model="openai"] - Model to use for text generation. Use listTextModels to see all available models
 * @param {number} [seed] - Seed for reproducible results (default: random)
 * @param {number} [temperature] - Controls randomness in the output (0.0 to 2.0)
 * @param {number} [top_p] - Controls diversity via nucleus sampling (0.0 to 1.0)
 * @param {string} [system] - System prompt to guide the model's behavior
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Promise<string>} - The generated text response
 * @note Always includes private=true parameter
 */
export async function respondText(prompt, model = "openai", seed = Math.floor(Math.random() * 1000000), temperature = null, top_p = null, system = null, authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  // Build the query parameters
  const queryParams = new URLSearchParams();
  if (model) queryParams.append('model', model);
  if (seed !== undefined) queryParams.append('seed', seed);
  if (temperature !== null) queryParams.append('temperature', temperature);
  if (top_p !== null) queryParams.append('top_p', top_p);
  if (system) queryParams.append('system', system);

  // Always set private to true
  queryParams.append('private', 'true');

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
