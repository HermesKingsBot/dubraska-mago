---
name: design
description: "Visual design skill collection: design artifacts (landing, prototype, deck), design systems (DESIGN.md tokens), architecture diagrams, hand-drawn diagrams, popular brand designs, and creative coding. Use for any design, diagram, or visual artifact task."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [design, html, prototype, ux, ui, creative, artifact, deck, motion, design-system, diagram, generative-art]
    related_skills: [claude-design, popular-web-designs, design-md, architecture-diagram, excalidraw, p5js]
---

# Design — Visual Design Skill Collection

Umbrella for all visual design, diagram, and creative coding skills. Load the specific reference file for the task at hand.

## When to Use

| Task | Reference |
|------|-----------|
| Design a from-scratch HTML artifact (landing, prototype, deck) | `references/claude-design.md` |
| Match a known brand's look (Stripe, Linear, Vercel...) | `references/popular-web-designs.md` |
| Author/validate a DESIGN.md token spec | `references/design-md.md` |
| Architecture/cloud/infra diagram (SVG) | `references/architecture-diagram.md` |
| Hand-drawn diagram (flow, sequence, concept) | `references/excalidraw.md` |
| Generative art, interactive visuals, shaders | `references/p5js.md` |

## Design Process (from claude-design)

1. **Understand the brief** — What, for whom, what constraints
2. **Gather context** — Brand docs, repo files, design tokens, references
3. **Define the design system** — Colors, type, spacing, radii, motion
4. **Choose format** — Static comparison, clickable prototype, deck, component lab, motion
5. **Build** — Self-contained HTML file, preserve versions
6. **Verify** — File exists, browser check, visual inspection
7. **Report** — Path, what was created, verification status

### Anti-Slop Rules

Avoid: aggressive gradients, glassmorphism, generic SaaS cards, fake dashboards, stock-photo heroes, oversized rounded rectangles, rainbow palettes, vague labels ("Insights", "Growth", "Scale").

## Design Systems (DESIGN.md)

Google's spec for machine-readable design tokens. See `references/design-md.md` for authoring, linting, and exporting.

## Popular Brand Designs

54 ready-to-paste design systems. See `references/popular-web-designs.md` for the catalog.

## Diagrams

- **Architecture diagrams** (SVG, dark theme): `references/architecture-diagram.md`
- **Hand-drawn diagrams** (Excalidraw JSON): `references/excalidraw.md`

## Creative Coding

Generative art, interactive visuals, shaders via p5.js. See `references/p5js.md`.
