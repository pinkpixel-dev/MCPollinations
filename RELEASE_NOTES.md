# MCPollinations v1.3.0 — Release Notes

Date: 2025-09-26

## Highlights

- Env-only configuration for MCP clients
  - All user-tunable settings (auth + defaults) now live under the server’s `env` in your MCP config.
  - Preferred auth keys: `token`, `referrer`. Also accepted: `POLLINATIONS_TOKEN`, `POLLINATIONS_REFERRER`.
  - Defaults honored when tool args are omitted:
    - Image: `IMAGE_MODEL`, `IMAGE_WIDTH`, `IMAGE_HEIGHT`, `IMAGE_ENHANCE`, `IMAGE_SAFE`
    - Text: `TEXT_MODEL`, `TEXT_TEMPERATURE`, `TEXT_TOP_P`, `TEXT_SYSTEM`
    - Audio: `AUDIO_VOICE`
    - Files: `OUTPUT_DIR`

- Multi‑reference image support (kontext, nanobanana, seedream)
  - `editImage` and `generateImageFromReference` accept `imageUrl` as a string or an array.
  - Behavior: kontext uses the first image; nanobanana is safe with up to ~4 refs; seedream supports up to 10.

- Silent by default
  - The MCP server no longer writes to stdout/stderr by default (prevents MCP stdio issues).
  - Enable debug logging by setting `DEBUG=true` (or `MCP_DEBUG=true`).

- Generator and examples
  - `generate-mcp-config.js` now emits an env‑only MCP config (no `resources`, `disabled`, or `alwaysAllow`).
  - `example-mcp.json` and repository `mcp.json` are updated accordingly.


## Upgrade Guide

1) Move settings into `env` in your MCP client config.

Replace any older `auth`, `default_params`, or `resources.output_dir` fields with the following `env` structure:

```json
{
  "mcpollinations": {
    "command": "npx",
    "args": ["-y", "@pinkpixel/mcpollinations"],
    "env": {
      "token": "YOUR_TOKEN_OPTIONAL",
      "referrer": "your-app-or-domain-optional",
      "IMAGE_MODEL": "flux",
      "IMAGE_WIDTH": "1024",
      "IMAGE_HEIGHT": "1024",
      "IMAGE_ENHANCE": "true",
      "IMAGE_SAFE": "false",
      "TEXT_MODEL": "openai",
      "TEXT_TEMPERATURE": "0.7",
      "TEXT_TOP_P": "0.9",
      "TEXT_SYSTEM": "",
      "AUDIO_VOICE": "alloy",
      "OUTPUT_DIR": "./mcpollinations-output"
    }
  }
}
```

2) For image‑to‑image, pass multiple references as an array (optional):

```js
// editImage
// imageUrl may be a single URL string or an array of URLs
await editImage("add neon glow", ["https://a.jpg", "https://b.png"], "seedream");

// generateImageFromReference
await generateImageFromReference("stylize", ["https://ref1.jpg", "https://ref2.jpg"], "nanobanana");
```

3) Enable debug logs only when you need them:

```bash
DEBUG=true npx @pinkpixel/mcpollinations
```


## Model Notes (kontext, nanobanana, seedream)

- Dimension ceilings still apply (see `new_models_integration.md`).
- `kontext`: only the first reference image is used.
- `nanobanana`: safe with up to ~4 reference images.
- `seedream`: accepts up to 10 references; supports high resolutions.


## What Changed Under the Hood

- Server respects env defaults across all tools.
- Auth detection from `token`/`referrer` or `POLLINATIONS_TOKEN`/`POLLINATIONS_REFERRER`.
- MCP server logs are suppressed by default to avoid stdio interference. Use `DEBUG=true` to enable.
- Schemas updated so `imageUrl` can be a string or an array.


## Links

- Changelog: CHANGELOG.md
- Overview: OVERVIEW.md
- Quick Config Example: README.md

