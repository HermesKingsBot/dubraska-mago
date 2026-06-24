---
name: image-ai
description: "AI image generation and vision analysis: free/cheap image generation APIs (Pollinations, Stability, Replicate), ComfyUI workflows, and image understanding via vision models. Use for generating images, analyzing visuals, or image QA."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [image-generation, image-analysis, vision, comfyui, pollinations, stable-diffusion]
    related_skills: [image-generation, image-vision-analysis, comfyui]
---

# Image AI — Generation & Analysis

Umbrella for AI image generation and vision analysis.

## When to Use

| Task | Reference |
|------|-----------|
| Generate images (free/cheap APIs) | `references/image-generation.md` |
| Analyze images via vision models | `references/image-vision.md` |
| ComfyUI workflows (local/cloud) | Load `comfyui` skill |

## Image Generation Providers

| Provider | Cost | Quality | Notes |
|----------|------|---------|-------|
| Pollinations.ai | FREE | Medium | No signup, always works |
| Stability AI | 150 free credits | High | Needs API key |
| Replicate | ~$1/333 img | High | Flux Schnell/Dev |
| ComfyUI | Free (local) | Very High | Needs GPU |

## Fallback Chain
1. Pollinations.ai (always free, always works)
2. Stability AI (150 free credits)
3. Replicate (if budget approved)

## Vision Analysis

Free vision models via OpenRouter:
- `google/gemma-4-26b-a4b-it:free` — best quality
- `nvidia/nemotron-nano-12b-v2-vl:free` — reliable fallback

```bash
python3 /opt/data/scripts/vision.py <image_path> "Describe this image"
```
