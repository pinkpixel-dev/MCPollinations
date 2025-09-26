## Pollinations Image Models Integration Cheat Sheet (kontext, nanobanana, seedream)

### 0. Base Pattern

GET (simple):
https://image.pollinations.ai/prompt/{URL_ENCODED_PROMPT}?model=MODEL&width=W&height=H&seed=S&nologo=true

Parameters (query):
- prompt (path segment, required)
- model = kontext | nanobanana | seedream
- width, height (integers; see per‑model limits below)
- seed (int; optional; reproducibility; default 42)
- image (reference/edit images; see format below)
- nologo=true (omit watermark if your referrer/token allows)
- enhance=true (only meaningful for kontext; ignored by nanobanana/seedream)
- private=true (keep out of public feed)
- safe=true (strict filter; otherwise default relaxed)
- referrer=YourApp (to get tier credit if using referrer auth)

Return: binary image (JPEG/PNG). Handle as blob/stream.

### 1. Model Limits & Behavior

| Model        | Type / Backend                                | Tier Needed | Max Side Length | Ref Images Support | Ref Image Handling | Notes |
|--------------|-----------------------------------------------|-------------|-----------------|--------------------|--------------------|-------|
| kontext      | BPAIGen primary + Kontext fallback            | seed        | 1216            | Yes (UI lists it)  | Only FIRST used    | Form-data POST upstream; URL edit via `image=` works (first only) |
| nanobanana   | Google Vertex AI Gemini 2.5 Flash Image Preview | seed      | 1024            | Yes                | Multiple (limit effectively 4 via UI constant) | Multi-ref + transparent aspect-ratio helper internally |
| seedream     | ByteDance ARK Seedream 4.0 (versioned id)     | seed        | 2048 (supports explicit >2K up to 4K via pixels) | Yes | Up to 10 (backend slices to 10) | Accepts array or single; size param auto 1K/2K/4K if no width/height |

Frontend `MAX_REFERENCE_IMAGES = 4`. Backend seedream allows 10. Nanobanana limit not hard-coded in surfaced code; treat 4 as safe ceiling. Kontext: only first image used.

### 2. Reference / Edit Image Parameter

Pass images via query: single `image` param containing comma‑separated URLs (this is how internal builder encodes them):

image=https%3A%2F%2Fexample.com%2Fa.jpg,https%3A%2F%2Fexample.com%2Fb.png

OR (also accepted by server parsers) repeat `image=` for each. Builder code consolidates into array.

Ordering matters (put most important first). Seedream truncates after 10.

### 3. Dimension Strategy

| Model | Recommended Defaults | If Omitting width/height | Aspect Ratio Handling |
|-------|----------------------|--------------------------|-----------------------|
| kontext | 1024x1024 or ≤1216 long side | Defaults to server standard (1024 if omitted) | Just supply explicit values |
| nanobanana | Explicit width & height ≤1024 | If omitted: defaults square 1024 | Non‑1:1 triggers transparent placeholder internally to enforce AR |
| seedream | Provide exact pixel WxH; can do 2048x2048 / widescreen / 4K | If both omitted: sizeParam computed → 2K (2048²) | Free-form; if using large dims ensure both provided |

Seedream auto size mapping (when width & height absent):
- ≤ 1024*1024 → "1K"
- ≤ 2048*2048 → "2K"
- Else → "4K"
Provide explicit WxH to control exact pixel dimensions.

### 4. Minimal GET Examples

#### kontext (image-to-image; only first ref used)
```
https://image.pollinations.ai/prompt/turn%20this%20logo%20into%20a%20glass%20emblem?model=kontext&image=https://example.com/logo.png&width=1024&height=1024&seed=12345&nologo=true
```

#### nanobanana (multi-ref edit)
```
https://image.pollinations.ai/prompt/cinematic%20golden%20hour%20portrait?model=nanobanana&image=https://example.com/base.jpg,https://example.com/lighting_ref.png&width=768&height=1152&seed=991122
```

#### seedream (4K upscale with multiple references)
```
https://image.pollinations.ai/prompt/ultra%20detailed%20matte%20painting%20of%20a%20floating%20city?model=seedream&image=https://example.com/style1.jpg,https://example.com/style2.jpg&width=4096&height=2304&seed=777001
```

### 5. Programmatic Usage

#### JavaScript (Browser / Node Fetch)

```js
async function generateImage({ prompt, model, width, height, seed, images = [] }) {
  const base = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt);
  const params = new URLSearchParams();
  if (model) params.set('model', model);
  if (width) params.set('width', width);
  if (height) params.set('height', height);
  if (seed) params.set('seed', seed);
  params.set('nologo', 'true');
  if (images.length && ['kontext','nanobanana','seedream'].includes(model)) {
    // Comma separated to match internal builder
    params.set('image', images.map(u => encodeURIComponent(u)).join(','));
  }
  const url = `${base}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.arrayBuffer(); // convert to blob/file as needed
}

(async () => {
  const buf = await generateImage({
    prompt: 'dreamy cinematic desert caravan at dawn',
    model: 'seedream',
    width: 2048,
    height: 1152,
    seed: 445566,
    images: ['https://example.com/color_ref.jpg']
  });
  // Save (Node)
  require('fs').writeFileSync('out.jpg', Buffer.from(buf));
})();
```

#### Python (requests)

```python
import requests, urllib.parse

def gen_image(prompt, model, width=None, height=None, seed=None, images=None, out='out.jpg'):
    base = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}"
    params = {}
    if model: params['model'] = model
    if width: params['width'] = width
    if height: params['height'] = height
    if seed: params['seed'] = seed
    params['nologo'] = 'true'
    if images and model in ['kontext','nanobanana','seedream']:
        # Comma-separated
        params['image'] = ",".join(images)
    r = requests.get(base, params=params, timeout=300)
    r.raise_for_status()
    with open(out, 'wb') as f:
        f.write(r.content)

gen_image(
    prompt="high fidelity studio portrait with soft rim light",
    model="nanobanana",
    width=896,
    height=1152,
    seed=202501,
    images=["https://example.com/base_portrait.jpg"]
)
```

#### cURL (seedream multi-ref)

```bash
curl -o styled.jpg "https://image.pollinations.ai/prompt/stylize%20this%20scene?model=seedream&image=https://example.com/ref1.jpg,https://example.com/ref2.jpg&width=2048&height=2048&seed=900123&nologo=true"
```

### 6. Reference Image Usage Strategy

| Goal | kontext | nanobanana | seedream |
|------|---------|------------|----------|
| Single edit | Provide 1 `image=` | Provide 1 `image=` | Provide 1 `image=` |
| Multi-style fusion | Not effective (first only) | Up to 4 (safe) | Up to 10 (backend) |
| High-res 4K | Not supported (cap 1216) | Not supported (cap 1024) | Yes (explicit WxH) |
| Aspect-ratio strict | Provide dims | Provide dims; internal transparent pad assists non-square | Provide dims exactly |

### 7. Error Handling Signals

| Symptom | Likely Cause |
|---------|--------------|
| 403 / Auth error mentioning model requires seed tier | Your referrer/token not recognized at seed tier |
| 400 / clamp or weird stretch | Exceeded model maxSideLength |
| Only first ref used (kontext) | By design (only processes index 0) |
| seedream ignoring >10 refs | Backend slice to 10 |

### 8. Quick Validation Checklist Per Request

1. Choose model (kontext / nanobanana / seedream).
2. Set width & height within model cap (≤1216, ≤1024, ≤4096 target).
3. Supply seed if you need reproducibility.
4. For references:
   - Order by importance.
   - Comma-separated single `image=` param.
   - Stay ≤4 for nanobanana (to be safe), ≤10 for seedream.
5. Add `nologo=true` if allowed.
6. Encode prompt path segment.
7. Fetch; treat response as binary image.

### 9. When To Use Which

| Use Case | Pick |
|----------|------|
| Fast general i2i with fallback resilience | kontext (BPAIGen + fallback) |
| Style-consistent edits / object-level refinement | nanobanana |
| Highest fidelity / large resolution composites | seedream |

---

## Plain Text-to-Image Usage (No Reference Images)

All three models accept a bare prompt with zero `image` params. If `image` is omitted (or empty after sanitation) the backend treats the request as pure text-to-image:

| Model      | Recommended Default Size | Hard Cap | Notes |
|------------|--------------------------|----------|-------|
| kontext    | 1024x1024 (or 1216 max)  | 1216 any side | Goes through BPAIGen first, falls back to Kontext if needed. |
| nanobanana | 1024x1024                | 1024 any side | Gemini adapter; if you pass a non-square size it adds an internal transparent AR helper (only when width & height provided). |
| seedream   | 2048x2048                | Practically up to 4K (explicit WxH) | If you omit width/height it auto-picks a size tier (likely 2K). Supply explicit WxH when you care. |

### Parameter Minimal Set (Text-only)
- `prompt` (path segment)
- Optional: `model`, `width`, `height`, `seed`
- Optional flags: `nologo=true`, `private=true`, `safe=true`, `enhance=true` (only meaningful for kontext)
- Do NOT send `image=` at all (or send nothing after sanitation).

---

## Fast Examples (Copy/Paste)

### kontext (general purpose, with enhancement)
```bash
curl -o kontext.jpg "https://image.pollinations.ai/prompt/futuristic%20urban%20plaza%20at%20blue%20hour%20wet%20pavement%20volumetric%20light?model=kontext&width=1152&height=1152&seed=101991&enhance=true&nologo=true"
```

### nanobanana (Gemini, square)
```bash
curl -o nano.jpg "https://image.pollinations.ai/prompt/an%20elegant%20macro%20shot%20of%20dew%20on%20a%20violet%20petal%20with%20bokeh?model=nanobanana&width=1024&height=1024&seed=551144&nologo=true"
```

### nanobanana (non-square)
```bash
curl -o nano_ar.jpg "https://image.pollinations.ai/prompt/cinematic%20widescreen%20frame%20of%20a%20lone%20sailboat%20in%20mist?model=nanobanana&width=1024&height=576&seed=778899"
```

### seedream (2K default explicit)
```bash
curl -o sd2k.jpg "https://image.pollinations.ai/prompt/epic%20mountain%20range%20sunrise%20atmospheric%20layers%20painted%20style?model=seedream&width=2048&height=2048&seed=300771"
```

### seedream (custom cinematic 4K-ish)
```bash
curl -o sd4k.jpg "https://image.pollinations.ai/prompt/hyperdetailed%20neo-noir%20alley%20rain%20reflections?model=seedream&width=3840&height=2160&seed=909090"
```

---

## Programmatic (Text-only) Pattern (JS)
```js
async function generate({ prompt, model, width, height, seed }) {
  const base = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt);
  const p = new URLSearchParams();
  if (model) p.set('model', model);
  if (width) p.set('width', width);
  if (height) p.set('height', height);
  if (seed) p.set('seed', seed);
  p.set('nologo', 'true');
  const url = `${base}?${p.toString()}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
  return Buffer.from(await r.arrayBuffer());
}

// Example
generate({
  prompt: 'lush bioluminescent jungle clearing with ancient monolith',
  model: 'kontext',
  width: 1152,
  height: 1152,
  seed: 424242
}).then(buf => require('fs').writeFileSync('jungle.jpg', buf));
```

---

## Selection Logic (Text-Only Quick Heuristics)

| Desired Outcome | Choose |
|-----------------|--------|
| Balanced general stylization, fallback resilience | kontext |
| Cleaner edits + consistent semantic fidelity (even w/o ref) | nanobanana |
| Max fidelity, large canvases, painterly / cinematic | seedream |

---

## Seeds & Repro
Seed handling is uniform; same prompt + model + seed (+ identical dimensions) should give stable output (subject to upstream provider drift—expect occasional minor variation on nanobanana / seedream due to external model updates).

---

## Edge Cases (Text-only)
- Passing `enhance=true` on nanobanana / seedream: ignored (safe to omit).
- Oversized dimensions: server clamps or rejects above model cap (kontext >1216, nanobanana >1024). Seedream: you control; if you go absurd (e.g. >4096 in both dimensions) you may hit provider failure—keep within conventional 4K bounds.
- Omitting width/height on seedream: implicit size tier; specify explicitly for reproducibility across time.

---
