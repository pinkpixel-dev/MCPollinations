/**
 * Pollinations Audio Service
 *
 * Functions for interacting with the Pollinations Audio API
 */

/**
 * Generates an audio response to a text prompt using the Pollinations Text API
 *
 * @param {string} prompt - The text prompt to respond to with audio
 * @param {string} [voice="alloy"] - Voice to use for audio generation. Available options: "alloy", "echo", "fable", "onyx", "nova", "shimmer", "coral", "verse", "ballad", "ash", "sage", "amuch", "dan"
 * @param {number} [seed] - Seed for reproducible results
 * @param {string} [voiceInstructions] - Additional instructions for voice character/style
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Promise<Object>} - Object containing the base64 audio data, mime type, and metadata
 */
export async function respondAudio(prompt, voice = "alloy", seed, voiceInstructions, authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  // Build the query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('model', 'openai-audio'); // Required for audio generation
  queryParams.append('voice', voice);
  if (seed !== undefined) queryParams.append('seed', seed);

  // Construct the URL
  let finalPrompt = prompt;

  // Add voice instructions if provided
  if (voiceInstructions) {
    finalPrompt = `${voiceInstructions}\n\n${prompt}`;
  }

  const encodedPrompt = encodeURIComponent(finalPrompt);
  const baseUrl = 'https://text.pollinations.ai';
  let url = `${baseUrl}/${encodedPrompt}`;

  // Add query parameters
  const queryString = queryParams.toString();
  url += `?${queryString}`;

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

    // Fetch the audio from the URL
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to generate audio: ${response.statusText}`);
    }

    // Get the audio data as an ArrayBuffer
    const audioBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a base64 string
    const base64Data = Buffer.from(audioBuffer).toString('base64');

    // Determine the mime type from the response headers or default to audio/mpeg
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    return {
      data: base64Data,
      mimeType: contentType,
      metadata: {
        prompt,
        voice,
        model: 'openai-audio',
        seed,
        voiceInstructions
      }
    };
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
}



/**
 * List available audio voices
 *
 * @returns {Promise<Object>} - Object containing the list of available voice options
 */
export async function listAudioVoices() {
  // Return the complete list of available voices
  const voices = [
    "alloy",
    "echo",
    "fable",
    "onyx",
    "nova",
    "shimmer",
    "coral",
    "verse",
    "ballad",
    "ash",
    "sage",
    "amuch",
    "dan"
  ];

  return { voices };
}
