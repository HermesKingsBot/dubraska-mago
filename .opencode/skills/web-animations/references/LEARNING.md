# Learning Record — Web Animations

**Date:** 2026-06-26
**Topic:** Web Animations (CSS animations, Web Animations API, performance, reduced-motion)

## Key Findings

1. **WAAPI is now fully supported** across all modern browsers (Chrome 84+, Firefox 80+, Safari 15.4+) — it's the preferred way to implement programmatic animations without GSAP/Framer Motion overhead.

2. **Performance hierarchy is critical**: Only `transform` and `opacity` run on the GPU compositor. Animating `width`/`height`/`top`/`left` triggers layout + paint on every frame, causing jank.

3. **Scroll-driven animations** are now possible with pure CSS (`animation-timeline: view()`) in Chrome 115+, eliminating the need for IntersectionObserver + JS in many cases.

4. **View Transitions API** (Chrome 111+, Safari 18+) enables native page transitions without any JS framework — perfect for Next.js App Router.

5. **`will-change` must be applied sparingly** — permanent `will-change` on many elements wastes GPU memory. Apply it just before animation starts and remove it after.

6. **`@property` (CSS Houdini)** enables animating custom CSS properties with full control over interpolation — supported in Chrome 85+ and Safari 15.4+.

## Skill Created
- `web-animations` — comprehensive skill covering CSS animations, WAAPI, performance, accessibility, framework integration, and recipes.
