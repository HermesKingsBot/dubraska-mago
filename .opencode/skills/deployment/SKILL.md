---
name: deployment
description: "Application deployment and hosting: Vercel CLI deployment, Next.js layout patterns, and frontend deployment gotchas. Use when deploying projects to Vercel, debugging Next.js layouts, or setting up CI/CD."
version: 1.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [deployment, vercel, nextjs, hosting, ci-cd, layout]
    related_skills: [nextjs, vercel-deploy, nextjs-layout-patterns]
---

# Deployment — Vercel & Next.js

Umbrella for deployment workflows and frontend layout patterns.

## When to Use

| Task | Reference |
|------|-----------|
| Deploy to Vercel (CLI, token, CI/CD) | `references/vercel-deploy.md` |
| Next.js layout patterns & CSS gotchas | `references/nextjs-layouts.md` |

## Quick Decision

- **Vercel deployment** → vercel-deploy reference
- **Next.js layout bugs** (viewport, z-index, video, GSAP) → nextjs-layouts reference
- **GitHub PR + deploy workflow** → load `github` skill + this skill together
