---
name: gsap
description: "GSAP (GreenSock Animation Platform): core API, React/Vue/Svelte integration, ScrollTrigger, timeline, plugins, performance, and utilities. Use for any web animation task."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [gsap, animation, scrolltrigger, timeline, react, vue, motion]
    related_skills: [gsap-core, gsap-react, gsap-scrolltrigger, gsap-timeline]
---

# GSAP — Animation Platform

Umbrella for all GSAP (GreenSock Animation Platform) skills. Covers core API, framework integrations, plugins, and performance.

## When to Use

| Task | Reference |
|------|-----------|
| Core animations (gsap.to, gsap.from, gsap.timeline) | Built-in |
| React integration (useGSAP hook) | Built-in |
| Vue/Svelte integration | Built-in |
| Scroll-linked animations | Built-in |
| Performance optimization | Built-in |
| Plugin-specific features (Morph, Draw, etc.) | Built-in |

## Quick Start

```bash
npm install gsap
```

```javascript
import { gsap } from "gsap";
gsap.to(".box", { x: 100, duration: 1, ease: "power2.out" });
```

## Framework Integration

- **React**: `useGSAP()` hook, `gsap.context()` for cleanup
- **Vue**: `onMounted` + `gsap.context()`, `onUnmounted` + `ctx.revert()`
- **Svelte**: `gsap.context()` in action, cleanup on destroy

## Key Patterns

- Always use `gsap.context()` for proper cleanup in frameworks
- Always call `ctx.revert()` in cleanup
- Use transforms (x/y/scale/rotation) over top/left for performance
- Respect `prefers-reduced-motion`
