/**
 * Pollinations Image Service
 *
 * Functions for interacting with the Pollinations Image API
 */

/**
 * Generates an image URL from a text prompt using the Pollinations Image API
 *
 * @param {string} prompt - The text description of the image to generate
 * @param {string} [model='flux'] - Model name to use for generation
 * @param {number} [seed] - Seed for reproducible results (defaults to random if not specified)
 * @param {number} [width=1024] - Width of the generated image
 * @param {number} [height=1024] - Height of the generated image
 * @param {boolean} [enhance=true] - Whether to enhance the prompt using an LLM before generating
 * @param {boolean} [safe=false] - Whether to apply content filtering
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Object} - Object containing the image URL and metadata
 * @note Always includes nologo=true and private=true parameters
 */
export async function generateImageUrl(prompt, model = 'flux', seed = Math.floor(Math.random() * 1000000), width = 1024, height = 1024, enhance = true, safe = false, authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  // Parameters are now directly passed as function arguments

  // Build the query parameters
  const queryParams = new URLSearchParams();

  // Always include model (with default 'flux')
  queryParams.append('model', model);

  // Add other parameters
  if (seed !== undefined) queryParams.append('seed', seed);
  if (width) queryParams.append('width', width);
  if (height) queryParams.append('height', height);

  // Add enhance parameter if true
  if (enhance) queryParams.append('enhance', 'true');

  // Add parameters
  queryParams.append('nologo', 'true'); // Always set nologo to true
  queryParams.append('private', 'true'); // Always set private to true)
  queryParams.append('safe', safe.toString()); // Use the customizable safe parameter

  // Construct the URL
  const encodedPrompt = encodeURIComponent(prompt);
  const baseUrl = 'https://image.pollinations.ai';
  let url = `${baseUrl}/prompt/${encodedPrompt}`;

  // Add query parameters
  const queryString = queryParams.toString();
  url += `?${queryString}`;

  // Return the URL directly, keeping it simple
  return {
    imageUrl: url,
    prompt,
    width,
    height,
    model,
    seed,
    enhance,
    private: true,
    nologo: true,
    safe
  };
}

/**
 * Generates an image from a text prompt and returns the image data as base64
 * Saves the image to a file by default
 *
 * @param {string} prompt - The text description of the image to generate
 * @param {string} [model='flux'] - Model name to use for generation
 * @param {number} [seed] - Seed for reproducible results (defaults to random if not specified)
 * @param {number} [width=1024] - Width of the generated image
 * @param {number} [height=1024] - Height of the generated image
 * @param {boolean} [enhance=true] - Whether to enhance the prompt using an LLM before generating
 * @param {boolean} [safe=false] - Whether to apply content filtering
 * @param {string} [outputPath='./mcpollinations-output'] - Directory path where to save the image
 * @param {string} [fileName] - Name of the file to save (without extension)
 * @param {string} [format='png'] - Image format to save as (png, jpeg, jpg, webp)
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Promise<Object>} - Object containing the base64 image data, mime type, metadata, and file path if saved
 * @note Always includes nologo=true and private=true parameters
 */
export async function generateImage(prompt, model = 'flux', seed = Math.floor(Math.random() * 1000000), width = 1024, height = 1024, enhance = true, safe = false, outputPath = './mcpollinations-output', fileName = '', format = 'png', authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  // First, generate the image URL
  const urlResult = await generateImageUrl(prompt, model, seed, width, height, enhance, safe, authConfig);

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

    // Fetch the image from the URL
    const response = await fetch(urlResult.imageUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    // Get the image data as an ArrayBuffer
    const imageBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a base64 string
    const base64Data = Buffer.from(imageBuffer).toString('base64');

    // Determine the mime type from the response headers or default to image/jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Prepare the result object
    const result = {
      data: base64Data,
      mimeType: contentType,
      metadata: {
        prompt: urlResult.prompt,
        width: urlResult.width,
        height: urlResult.height,
        model: urlResult.model,
        seed: urlResult.seed,
        enhance: urlResult.enhance,
        private: urlResult.private,
        nologo: urlResult.nologo,
        safe: urlResult.safe
      }
    };

    // Always save the image to a file
    // Import required modules
    const fs = await import('fs');
    const path = await import('path');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Validate the file format
    const validFormats = ['png', 'jpeg', 'jpg', 'webp'];
    if (!validFormats.includes(format)) {
      console.warn(`Invalid format '${format}', defaulting to 'png'`);
    }
    const extension = validFormats.includes(format) ? format : 'png';

    // Generate a file name if not provided or ensure it's unique
    let baseFileName = fileName;
    if (!baseFileName) {
      // Create a safe filename from the prompt (first 20 chars, alphanumeric only)
      const safePrompt = prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const timestamp = Date.now();
      // Add a random component to ensure uniqueness
      const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      baseFileName = `${safePrompt}_${timestamp}_${randomSuffix}`;
    }

    // Ensure the filename is unique to prevent overwriting
    let fileNameWithSuffix = baseFileName;
    let filePath = path.join(outputPath, `${fileNameWithSuffix}.${extension}`);
    let counter = 1;

    // If the file already exists, add a numeric suffix
    while (fs.existsSync(filePath)) {
      fileNameWithSuffix = `${baseFileName}_${counter}`;
      filePath = path.join(outputPath, `${fileNameWithSuffix}.${extension}`);
      counter++;
    }

    // Save the image to the file
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    // Add the file path to the result
    result.filePath = filePath;

    return result;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Edits or modifies an existing image based on a text prompt
 *
 * @param {string} prompt - The text description of how to edit the image
 * @param {string} imageUrl - URL of the input image to edit
 * @param {string} [model='kontext'] - Model name to use for editing (kontext recommended for image-to-image)
 * @param {number} [seed] - Seed for reproducible results (defaults to random if not specified)
 * @param {number} [width=1024] - Width of the generated image
 * @param {number} [height=1024] - Height of the generated image
 * @param {boolean} [enhance=true] - Whether to enhance the prompt using an LLM before generating
 * @param {boolean} [safe=false] - Whether to apply content filtering
 * @param {string} [outputPath='./mcpollinations-output'] - Directory path where to save the image
 * @param {string} [fileName] - Name of the file to save (without extension)
 * @param {string} [format='png'] - Image format to save as (png, jpeg, jpg, webp)
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Promise<Object>} - Object containing the base64 image data, mime type, metadata, and file path if saved
 * @note Always includes nologo=true and private=true parameters
 */
export async function editImage(prompt, imageUrl, model = 'kontext', seed = Math.floor(Math.random() * 1000000), width = 1024, height = 1024, enhance = true, safe = false, outputPath = './mcpollinations-output', fileName = '', format = 'png', authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('Image URL is required and must be a string');
  }

  // Build the query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('model', model);
  queryParams.append('image', imageUrl); // Add the input image URL
  if (seed !== undefined) queryParams.append('seed', seed);
  if (width !== 1024) queryParams.append('width', width);
  if (height !== 1024) queryParams.append('height', height);

  // Add enhance parameter if true
  if (enhance) queryParams.append('enhance', 'true');

  // Add parameters
  queryParams.append('nologo', 'true'); // Always set nologo to true
  queryParams.append('private', 'true'); // Always set private to true)
  queryParams.append('safe', safe.toString()); // Use the customizable safe parameter

  // Construct the URL
  const encodedPrompt = encodeURIComponent(prompt);
  const baseUrl = 'https://image.pollinations.ai';
  let url = `${baseUrl}/prompt/${encodedPrompt}`;

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

    // Fetch the image from the URL
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to edit image: ${response.statusText}`);
    }

    // Get the image data as an ArrayBuffer
    const imageBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a base64 string
    const base64Data = Buffer.from(imageBuffer).toString('base64');

    // Determine the mime type from the response headers or default to image/jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Prepare the result object
    const result = {
      data: base64Data,
      mimeType: contentType,
      metadata: {
        prompt,
        inputImageUrl: imageUrl,
        width,
        height,
        model,
        seed,
        enhance,
        private: true,
        nologo: true,
        safe
      }
    };

    // Always save the image to a file
    // Import required modules
    const fs = await import('fs');
    const path = await import('path');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Generate a filename if not provided
    let finalFileName = fileName;
    if (!finalFileName) {
      // Create a filename from the prompt (first 20 characters) and timestamp
      const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000);
      finalFileName = `edited_${sanitizedPrompt}_${timestamp}_${randomSuffix}`;
    }

    // Ensure the filename has the correct extension
    const extension = format.toLowerCase();
    if (!finalFileName.endsWith(`.${extension}`)) {
      finalFileName += `.${extension}`;
    }

    // Check if file already exists and add a number suffix if needed
    let finalFilePath = path.join(outputPath, finalFileName);
    let counter = 1;
    while (fs.existsSync(finalFilePath)) {
      const nameWithoutExt = finalFileName.replace(`.${extension}`, '');
      const numberedFileName = `${nameWithoutExt}_${counter}.${extension}`;
      finalFilePath = path.join(outputPath, numberedFileName);
      counter++;
    }

    // Write the image data to the file
    fs.writeFileSync(finalFilePath, Buffer.from(base64Data, 'base64'));

    // Add the file path to the result
    result.filePath = finalFilePath;

    return result;

  } catch (error) {
    console.error('Error editing image:', error);
    throw error;
  }
}

/**
 * Generates a new image using an existing image as reference
 *
 * @param {string} prompt - The text description of what to generate based on the reference image
 * @param {string} imageUrl - URL of the reference image
 * @param {string} [model='kontext'] - Model name to use for generation (kontext recommended for image-to-image)
 * @param {number} [seed] - Seed for reproducible results (defaults to random if not specified)
 * @param {number} [width=1024] - Width of the generated image
 * @param {number} [height=1024] - Height of the generated image
 * @param {boolean} [enhance=true] - Whether to enhance the prompt using an LLM before generating
 * @param {boolean} [safe=false] - Whether to apply content filtering
 * @param {string} [outputPath='./mcpollinations-output'] - Directory path where to save the image
 * @param {string} [fileName] - Name of the file to save (without extension)
 * @param {string} [format='png'] - Image format to save as (png, jpeg, jpg, webp)
 * @param {Object} [authConfig] - Optional authentication configuration {token, referrer}
 * @returns {Promise<Object>} - Object containing the base64 image data, mime type, metadata, and file path if saved
 * @note Always includes nologo=true and private=true parameters
 */
export async function generateImageFromReference(prompt, imageUrl, model = 'kontext', seed = Math.floor(Math.random() * 1000000), width = 1024, height = 1024, enhance = true, safe = false, outputPath = './mcpollinations-output', fileName = '', format = 'png', authConfig = null) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string');
  }

  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('Reference image URL is required and must be a string');
  }

  // Build the query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('model', model);
  queryParams.append('image', imageUrl); // Add the reference image URL
  if (seed !== undefined) queryParams.append('seed', seed);
  if (width !== 1024) queryParams.append('width', width);
  if (height !== 1024) queryParams.append('height', height);

  // Add enhance parameter if true
  if (enhance) queryParams.append('enhance', 'true');

  // Add parameters
  queryParams.append('nologo', 'true'); // Always set nologo to true
  queryParams.append('private', 'true'); // Always set private to true)
  queryParams.append('safe', safe.toString()); // Use the customizable safe parameter

  // Construct the URL
  const encodedPrompt = encodeURIComponent(prompt);
  const baseUrl = 'https://image.pollinations.ai';
  let url = `${baseUrl}/prompt/${encodedPrompt}`;

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

    // Fetch the image from the URL
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to generate image from reference: ${response.statusText}`);
    }

    // Get the image data as an ArrayBuffer
    const imageBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a base64 string
    const base64Data = Buffer.from(imageBuffer).toString('base64');

    // Determine the mime type from the response headers or default to image/jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Prepare the result object
    const result = {
      data: base64Data,
      mimeType: contentType,
      metadata: {
        prompt,
        referenceImageUrl: imageUrl,
        width,
        height,
        model,
        seed,
        enhance,
        private: true,
        nologo: true,
        safe
      }
    };

    // Always save the image to a file
    // Import required modules
    const fs = await import('fs');
    const path = await import('path');

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Generate a filename if not provided
    let finalFileName = fileName;
    if (!finalFileName) {
      // Create a filename from the prompt (first 20 characters) and timestamp
      const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000);
      finalFileName = `reference_${sanitizedPrompt}_${timestamp}_${randomSuffix}`;
    }

    // Ensure the filename has the correct extension
    const extension = format.toLowerCase();
    if (!finalFileName.endsWith(`.${extension}`)) {
      finalFileName += `.${extension}`;
    }

    // Check if file already exists and add a number suffix if needed
    let finalFilePath = path.join(outputPath, finalFileName);
    let counter = 1;
    while (fs.existsSync(finalFilePath)) {
      const nameWithoutExt = finalFileName.replace(`.${extension}`, '');
      const numberedFileName = `${nameWithoutExt}_${counter}.${extension}`;
      finalFilePath = path.join(outputPath, numberedFileName);
      counter++;
    }

    // Write the image data to the file
    fs.writeFileSync(finalFilePath, Buffer.from(base64Data, 'base64'));

    // Add the file path to the result
    result.filePath = finalFilePath;

    return result;

  } catch (error) {
    console.error('Error generating image from reference:', error);
    throw error;
  }
}

/**
 * List available image generation models from Pollinations API
 *
 * @returns {Promise<Object>} - Object containing the list of available image models
 */
export async function listImageModels() {
  try {
    const response = await fetch('https://image.pollinations.ai/models');

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing image models:', error);
    throw error;
  }
}
