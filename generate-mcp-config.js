#!/usr/bin/env node
import fs from 'fs';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default configuration template
const defaultConfig = {
  "mcpollinations": {
    "command": "npx",
    "args": [
      "-y",
      "@pinkpixel/mcpollinations"
    ],
    "resources": {
      "output_dir": "./mcpollinations-output",
    },
    "auth": {
      "token": "",
      "referrer": ""
    },
    "default_params": {
      "image": {
        "model": "flux",
        "width": 1024,
        "height": 1024,
        "safe": false,
        "enhance": true
      },
      "text": {
        "model": "openai",
        "temperature": 0.7,
        "top_p": 0.9,
        "system": ""
      },
      "audio": {
        "voice": "alloy"
      }
    },
    "disabled": false,
    "alwaysAllow": [
      "generateImageUrl",
      "generateImage",
      "editImage",
      "generateImageFromReference",
      "listImageModels",
      "respondAudio",
      "listAudioVoices",
      "respondText",
      "listTextModels"
    ]
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

    // The server name and package name are fixed to ensure compatibility
    const configKey = 'mcpollinations';

    // Resources customization
    console.log('\nResource Directories:');
    console.log('Note: Using relative path (starting with "./") is recommended for portability.');
    console.log('Absolute path is recommended on Windows or if you will not be moving the configuration file.');
    console.log('These directories will be created automatically if they don\'t exist.');

    const outputDir = await prompt(`Output directory for saved files (default: "${config[configKey].resources.output_dir}"): `);
    if (outputDir) {
      config[configKey].resources.output_dir = outputDir;
    }

    // Authentication configuration
    console.log('\nAuthentication Configuration (Optional):');
    console.log('These settings are optional and should be used only if you are Flower or Nectar tier user. Configuring these settings will provide access to more models and better rate limits for those tiers.');
    console.log('Leave empty to use the free (seed) tier. Note: some models may not be available without authentication.');
    console.log('Note: You can also set these via environment variables POLLINATIONS_TOKEN and POLLINATIONS_REFERRER');

    const authToken = await prompt('API Token (optional): ');
    if (authToken && authToken.trim()) {
      config[configKey].auth.token = authToken.trim();
    } else {
      delete config[configKey].auth.token;
    }

    const authReferrer = await prompt('Referrer URL (optional): ');
    if (authReferrer && authReferrer.trim()) {
      config[configKey].auth.referrer = authReferrer.trim();
    } else {
      delete config[configKey].auth.referrer;
    }

    // Remove auth section entirely if both fields are empty
    if (!config[configKey].auth.token && !config[configKey].auth.referrer) {
      delete config[configKey].auth;
    }

    // Default parameters customization
    console.log('\nDefault Parameters:');

    // Image parameters
    console.log('\nImage Generation Parameters:');
    const customizeImage = await promptYesNo('Customize image generation parameters?', false);

    if (customizeImage) {
      console.log('Available image models: "flux", "turbo", "kontext". Use the listImageModels tool to see the most recent model list');
      const imageModel = await prompt('Default image model (default: "flux"): ');
      if (imageModel) config[configKey].default_params.image.model = imageModel;

      const imageWidth = await prompt('Default image width (default: 1024): ');
      if (imageWidth) config[configKey].default_params.image.width = parseInt(imageWidth);

      const imageHeight = await prompt('Default image height (default: 1024): ');
      if (imageHeight) config[configKey].default_params.image.height = parseInt(imageHeight);

      const imageSafe = await promptYesNo('Enable safe mode for images? (default: false)', false);
      config[configKey].default_params.image.safe = imageSafe;

      const imageEnhance = await promptYesNo('Enable prompt enhancement using LLM before image generation?', true);
      config[configKey].default_params.image.enhance = imageEnhance;
    }

    // Text parameters
    console.log('\nText Generation Parameters:');
    const customizeText = await promptYesNo('Customize text generation parameters?', false);

    if (customizeText) {
      console.log('Some generally available text models: "openai", "openai-large", "openai-reasoning". Model choices change frequently - use the listTextModels tool to see all models');
      const textModel = await prompt('Default text model (default: "openai"): ');
      if (textModel) config[configKey].default_params.text.model = textModel;

      const textTemperature = await prompt('Default temperature (0.0-2.0, controls randomness, default: 0.7): ');
      if (textTemperature) config[configKey].default_params.text.temperature = parseFloat(textTemperature);

      const textTopP = await prompt('Default top_p (0.0-1.0, controls diversity, default: 0.9): ');
      if (textTopP) config[configKey].default_params.text.top_p = parseFloat(textTopP);

      const textSystem = await prompt('Default system prompt (optional, guides model behavior): ');
      if (textSystem) config[configKey].default_params.text.system = textSystem;
    }

    // Audio parameters
    console.log('\nAudio Generation Parameters:');
    const customizeAudio = await promptYesNo('Customize audio generation parameters?', false);

    if (customizeAudio) {
      console.log('Available voices: "alloy", "echo", "fable", "onyx", "nova", "shimmer", "coral", "verse", "ballad", "ash", "sage", "amuch", "dan"');
      const audioVoice = await prompt('Default voice (default: "alloy"): ');
      if (audioVoice) config[configKey].default_params.audio.voice = audioVoice;
    }

    // Tool restrictions
    console.log('\nTool Restrictions:');
    const disableServer = await promptYesNo('Disable the server by default?', false);
    config[configKey].disabled = disableServer;

    const customizeAllowedTools = await promptYesNo('Customize allowed tools?', false);
    if (customizeAllowedTools) {
      console.log('\nAvailable tools:');
      const allTools = [
        'generateImageUrl',
        'generateImage',
        'editImage',
        'generateImageFromReference',
        'listImageModels',
        'respondAudio',
        'listAudioVoices',
        'respondText',
        'listTextModels'
      ];

      allTools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool}`);
      });

      const selectedTools = await prompt('Enter tool numbers to allow (comma-separated, e.g., "1,2,3") or "all" for all tools: ');

      if (selectedTools.toLowerCase() === 'all') {
        config[configKey].alwaysAllow = [...allTools];
      } else {
        const toolIndices = selectedTools.split(',').map(num => parseInt(num.trim()) - 1);
        config[configKey].alwaysAllow = toolIndices
          .filter(index => index >= 0 && index < allTools.length)
          .map(index => allTools[index]);
      }
    }
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
