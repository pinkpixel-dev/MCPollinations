#!/usr/bin/env node
import fs from 'fs';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default configuration template (MCP-friendly). All configurable values live in `env`.
const defaultConfig = {
  "mcpollinations": {
    "command": "npx",
    "args": [
      "-y",
      "@pinkpixel/mcpollinations"
    ],
    "env": {
      // Auth (optional)
      "token": "",
      "referrer": "",

      // Defaults used by the server when tool args are omitted
      "IMAGE_MODEL": "flux",
      "IMAGE_WIDTH": "1024",
      "IMAGE_HEIGHT": "1024",
      "IMAGE_SAFE": "false",
      "IMAGE_ENHANCE": "true",

      "TEXT_MODEL": "openai",
      "TEXT_TEMPERATURE": "0.7",
      "TEXT_TOP_P": "0.9",
      "TEXT_SYSTEM": "",

      "AUDIO_VOICE": "alloy",

      // Default output directory for saved files
      "OUTPUT_DIR": "./mcpollinations-output"
    }
  }
};

// Function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to prompt user for yes/no input
async function promptYesNo(question, defaultYes = true) {
  const defaultOption = defaultYes ? 'Y/n' : 'y/N';
  const response = await prompt(`${question} (${defaultOption}): `);
  if (response === '') return defaultYes;
  return response.toLowerCase() === 'y';
}

// Function to generate the MCP configuration
async function generateMcpConfig() {
  console.log('MCPollinations MCP Configuration Generator');
  console.log('=========================================');
  console.log('This tool will help you create an MCP configuration file for the MCPollinations server.');
  console.log('You can use this configuration with any application that supports the Model Context Protocol.');
  console.log('');

  // Ask for configuration options
  const useDefaults = await promptYesNo('Use default configuration?');

  let config = JSON.parse(JSON.stringify(defaultConfig)); // Deep copy

  if (!useDefaults) {
    console.log('\nCustomizing configuration:');

    const configKey = 'mcpollinations';

    // Resources customization
    console.log('\nResource Directories:');
    console.log('Note: Using relative path (starting with "./") is recommended for portability.');
    console.log('Windows users may prefer absolute paths.');
    console.log('These directories will be created automatically if they don\'t exist.');

    const outputDir = await prompt(`Output directory for saved files (default: "${config[configKey].env.OUTPUT_DIR}"): `);
    if (outputDir) {
      config[configKey].env.OUTPUT_DIR = outputDir;
    }

    // Authentication configuration
    console.log('\nAuthentication Configuration (Optional):');
    console.log('These env settings enable access to newer models and higher rate limits.');
    console.log('Leave empty to use the free (seed) tier.');

    const authToken = await prompt('API Token (optional): ');
    if (authToken && authToken.trim()) {
      config[configKey].env.token = authToken.trim();
    }

    const authReferrer = await prompt('Referrer (domain or app id, optional): ');
    if (authReferrer && authReferrer.trim()) {
      config[configKey].env.referrer = authReferrer.trim();
    }

    // Default parameters customization
    console.log('\nDefault Parameters:');

    // Image parameters
    console.log('\nImage Generation Parameters:');
    const customizeImage = await promptYesNo('Customize image generation parameters?', false);

    if (customizeImage) {
      console.log('Available image models: "flux", "turbo", "kontext", "nanobanana", "seedream". Use the listImageModels tool to see the most recent model list');
      const imageModel = await prompt('Default image model (default: "flux"): ');
      if (imageModel) config[configKey].env.IMAGE_MODEL = imageModel;

      const imageWidth = await prompt('Default image width (default: 1024): ');
      if (imageWidth) config[configKey].env.IMAGE_WIDTH = String(parseInt(imageWidth));

      const imageHeight = await prompt('Default image height (default: 1024): ');
      if (imageHeight) config[configKey].env.IMAGE_HEIGHT = String(parseInt(imageHeight));

      const imageSafe = await promptYesNo('Enable safe mode for images? (default: false)', false);
      config[configKey].env.IMAGE_SAFE = imageSafe ? 'true' : 'false';

      const imageEnhance = await promptYesNo('Enable prompt enhancement using LLM before image generation?', true);
      config[configKey].env.IMAGE_ENHANCE = imageEnhance ? 'true' : 'false';
    }

    // Text parameters
    console.log('\nText Generation Parameters:');
    const customizeText = await promptYesNo('Customize text generation parameters?', false);

    if (customizeText) {
      console.log('Some generally available text models: "openai", "openai-large", "openai-reasoning". Model choices change frequently - use the listTextModels tool to see all models');
      const textModel = await prompt('Default text model (default: "openai"): ');
      if (textModel) config[configKey].env.TEXT_MODEL = textModel;

      const textTemperature = await prompt('Default temperature (0.0-2.0, controls randomness, default: 0.7): ');
      if (textTemperature) config[configKey].env.TEXT_TEMPERATURE = String(parseFloat(textTemperature));

      const textTopP = await prompt('Default top_p (0.0-1.0, controls diversity, default: 0.9): ');
      if (textTopP) config[configKey].env.TEXT_TOP_P = String(parseFloat(textTopP));

      const textSystem = await prompt('Default system prompt (optional, guides model behavior): ');
      if (textSystem) config[configKey].env.TEXT_SYSTEM = textSystem;
    }

    // Audio parameters
    console.log('\nAudio Generation Parameters:');
    const customizeAudio = await promptYesNo('Customize audio generation parameters?', false);

    if (customizeAudio) {
      console.log('Available voices: "alloy", "echo", "fable", "onyx", "nova", "shimmer", "coral", "verse", "ballad", "ash", "sage", "amuch", "dan"');
      const audioVoice = await prompt('Default voice (default: "alloy"): ');
      if (audioVoice) config[configKey].env.AUDIO_VOICE = audioVoice;
    }

    // Tool restrictions removed; MCP clients usually control allow lists.
  }

  // Ask for output options
  console.log('\nOutput options:');
  const outputPath = await prompt('Output file path (default: "./mcp.json"): ');
  const filePath = outputPath || './mcp.json';

  // Write the configuration to a file
  try {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(`\nMCP configuration saved to: ${filePath}`);
    console.log('\nYou can now use this configuration with any application that supports the Model Context Protocol.');
    console.log('For example, you can add this configuration to your application\'s MCP configuration directory.');

    // Display the configuration
    console.log('\nGenerated configuration:');
    console.log(JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(`Error saving configuration: ${error.message}`);
  }

  rl.close();
}

// Run the generator
generateMcpConfig().catch(console.error);
