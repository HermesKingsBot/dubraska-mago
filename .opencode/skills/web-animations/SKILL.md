---
name: web-animations
description: "Web Animations — CSS animations, Web Animations API, performance optimization, reduced-motion, and modern patterns. Use for implementing animations, optimizing animation performance, or building motion-aware interfaces."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [animations, css-animations, web-animations-api, performance, reduced-motion, motion, keyframes, waapi]
    related_skills: [gsap, luxury-ui-microinteractions, web-a11y, tailwind-css4]
---

# Web Animations — CSS, WAAPI, Performance & Accessibility

Comprehensive guide for implementing web animations using CSS and the Web Animations API (WAAPI), with focus on performance, accessibility, and modern patterns (2025-2026).

## When to Use

| Task | Section |
|------|---------|
| CSS keyframe animations | §1 CSS Animations |
| Programmatic animations | §2 Web Animations API |
| Performance optimization | §3 Performance |
| Reduced motion & a11y | §4 Accessibility |
| React/Vue/Svelte integration | §5 Framework Integration |
| Common patterns & recipes | §6 Recipes |

---

## §1 — CSS Animations

### Keyframe Basics

```css
/* Basic keyframe animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeIn 0.6s ease-out forwards;
}
```

### Multi-step Keyframes

```css
@keyframes slideInBounce {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  60% {
    opacity: 1;
    transform: translateX(10%);
  }
  80% {
    transform: translateX(-5%);
  }
  100% {
    transform: translateX(0);
  }
}
```

### Animation Shorthand

```css
/* shorthand: name | duration | timing-function | delay | iteration-count | direction | fill-mode | play-state */
.element {
  animation: fadeIn 0.6s ease-out 0s 1 normal forwards running;
}

/* Multiple animations */
.element {
  animation:
    fadeIn 0.4s ease-out forwards,
    slideUp 0.6s ease-out 0.1s forwards;
}
```

### Timing Functions

```css
/* Built-in easing curves */
.ease-linear    { animation-timing-function: linear; }
.ease-in       { animation-timing-function: ease-in; }      /* slow start */
.ease-out      { animation-timing-function: ease-out; }     /* slow end */
.ease-in-out   { animation-timing-function: ease-in-out; }  /* slow both */

/* Cubic bezier custom curves */
.bounce-out { animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
.smooth     { animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0); }

/* Steps for sprite-based animations */
.sprite {
  animation: playSprite 1s steps(8) infinite;
}
```

### Modern CSS Animation Features (2024-2026)

```css
/* @keyframes with nesting (CSS Nesting — Chrome 120+) */
@keyframes pulse {
  from, to {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Individual transform properties (better performance) */
.element {
  animation:
    fadeOpacity 0.4s ease-out,
    moveTranslate 0.6s ease-out;
}

@keyframes fadeOpacity {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes moveTranslate {
  from { translate: 0 20px; }
  to   { translate: 0 0; }
}

/* @property for animating custom properties (Houdini) */
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.rotating-border {
  --gradient-angle: 0deg;
  background: conic-gradient(from var(--gradient-angle), #ff6b6b, #4ecdc4, #ff6b6b);
  animation: rotateGradient 3s linear infinite;
}

@keyframes rotateGradient {
  to { --gradient-angle: 360deg; }
}

/* animation-composition for combining animations */
.combined {
  animation:
    fadeIn 0.4s ease-out,
    scaleUp 0.6s ease-out;
  animation-composition: add; /* add | replace | accumulate */
}

/* Scroll-driven animations (CSS-only, Chrome 115+) */
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### CSS Animation Performance Rules

```css
/* ✅ GPU-accelerated properties */
.optimized {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

/* ❌ Never animate these — triggers layout/paint */
.slow {
  animation: bad 0.3s ease;
}
@keyframes bad {
  from { width: 100px; height: 100px; top: 0; left: 0; }
  to   { width: 200px; height: 200px; top: 50px; left: 50px; }
}

/* ✅ Use transform instead */
.fast {
  animation: good 0.3s ease;
}
@keyframes good {
  from { transform: scale(1) translate(0, 0); }
  to   { transform: scale(2) translate(50px, 50px); }
}
```

---

## §2 — Web Animations API (WAAPI)

### Basic Usage

```javascript
// Element.animate() — the native animation API
const animation = element.animate(
  [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ],
  {
    duration: 600,
    easing: 'ease-out',
    fill: 'forwards',
    iterations: 1
  }
);

// Control playback
animation.play();
animation.pause();
animation.reverse();
animation.cancel();
animation.finish();

// Current time
animation.currentTime = 300; // Jump to 300ms

// Event listeners
animation.onfinish = () => console.log('Animation complete');
animation.oncancel = () => console.log('Animation cancelled');
```

### Keyframe Effects

```javascript
// KeyframeEffect for reusable keyframe definitions
const keyframes = new KeyframeEffect(
  element,
  [
    { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
    { opacity: 1, transform: 'translateY(0) scale(1)' }
  ],
  { duration: 500, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', fill: 'forwards' }
);

const animation = new Animation(keyframes, document.timeline);
animation.play();
```

### Sequential & Parallel Animations

```javascript
// Sequential — using promises
async function runSequence() {
  await element1.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { duration: 300, fill: 'forwards' }
  ).finished;

  await element2.animate(
    [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
    { duration: 400, easing: 'ease-out', fill: 'forwards' }
  ).finished;

  await element3.animate(
    [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
    { duration: 300, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' }
  ).finished;
}

// Parallel — all at once
function runParallel() {
  const animations = [
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: 'forwards' }),
    el.animate([{ transform: 'translateY(20px)' }, { transform: 'translateY(0)' }], { duration: 400, fill: 'forwards' }),
  ];
  return Promise.all(animations.map(a => a.finished));
}

// WAAPI GroupEffect for parallel playback
const group = new GroupEffect([
  element1.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 }),
  element2.animate([{ transform: 'translateY(20px)' }, { transform: 'translateY(0)' }], { duration: 400 }),
]);
document.timeline.play(group);
```

### WAAPI with React

```tsx
'use client';

import { useRef, useEffect, useState } from 'react';

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.animate(
            [
              { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' }
            ],
            {
              duration: 500,
              easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
              fill: 'forwards'
            }
          );
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

### WAAPI with Vue 3

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const cardRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const el = cardRef.value;
  if (!el) return;

  el.animate(
    [
      { opacity: 0, transform: 'translateY(30px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 500, easing: 'ease-out', fill: 'forwards' }
  );
});
</script>

<template>
  <div ref="cardRef" class="card">
    <slot />
  </div>
</template>
```

### WAAPI with Svelte 5

```svelte
<script lang="ts">
  let { children } = $props();
  let el = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!el) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 400, easing: 'ease-out', fill: 'forwards' }
    );
  });
</script>

<div bind:this={el} class="animate-on-mount">
  {@render children?.()}
</div>
```

### Spring Physics with WAAPI

```javascript
// WAAPI doesn't have built-in spring physics, but you can approximate it
function springAnimation(element, keyframes, { stiffness = 180, damping = 12, mass = 1 } = {}) {
  const duration = calculateSpringDuration(stiffness, damping, mass);

  return element.animate(keyframes, {
    duration,
    easing: generateSpringEasing(stiffness, damping, mass),
    fill: 'forwards'
  });
}

// Approximate spring easing using cubic-bezier
function generateSpringEasing(stiffness, damping) {
  const dampingRatio = damping / (2 * Math.sqrt(stiffness));
  if (dampingRatio < 1) {
    // Underdamped — will overshoot
    const naturalFreq = Math.sqrt(stiffness);
    const dampedFreq = naturalFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
    // Approximate overshoot with cubic-bezier
    return `cubic-bezier(${0.34 + dampingRatio * 0.2}, 1.56 - dampingRatio * 0.3}, 0.64, 1)`;
  }
  return 'cubic-bezier(0.25, 0.1, 0.25, 1)';
}

// Usage
springAnimation(
  document.querySelector('.bounce'),
  [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
  { stiffness: 300, damping: 20 }
);
```

---

## §3 — Performance Optimization

### Core Principles

```
Animation Performance Hierarchy (fastest to slowest):
1. ✅ transform (translate, scale, rotate) — GPU compositor
2. ✅ opacity — GPU compositor
3. ✅ filter — GPU (but expensive on low-end)
4. ⚠️ clip-path — GPU but can trigger paint
5. ❌ width/height/top/left — triggers layout + paint
6. ❌ box-shadow — triggers paint
7. ❌ background-color — triggers paint
```

### will-change Best Practices

```css
/* ✅ Apply will-change just before animation starts */
.element {
  transition: transform 0.3s;
}

.element:hover {
  will-change: transform; /* Only on hover */
  transform: scale(1.05);
}

/* ✅ With CSS class toggle (JS-controlled) */
.element.is-animating {
  will-change: transform, opacity;
}

/* ❌ Never apply permanently to many elements */
* {
  will-change: transform; /* BAD — wastes GPU memory */
}

/* ✅ Remove will-change after animation ends (JS) */
element.addEventListener('animationend', () => {
  element.style.will-change = 'auto';
});
```

### Layout Thrashing Prevention

```javascript
// ❌ BAD — causes layout thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // Read — forces layout
  el.style.height = height * 2 + 'px'; // Write — invalidates layout
  // Next read triggers ANOTHER layout calculation!
});

// ✅ GOOD — batch reads, then writes
const heights = elements.map(el => el.offsetHeight); // Batch all reads

requestAnimationFrame(() => {
  elements.forEach((el, i) => {
    el.style.height = heights[i] * 2 + 'px'; // Batch all writes
  });
});
```

### requestAnimationFrame for Custom Animations

```javascript
function animateScrollTo(element, targetY, duration = 500) {
  const startY = element.scrollTop;
  const distance = targetY - startY;
  let startTime = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    element.scrollTop = startY + distance * easedProgress;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
```

### CSS Contain for Animation Isolation

```css
/* Isolate animated elements from the rest of the layout */
.animated-container {
  contain: layout style paint;
}

/* Strictest isolation — use for complex animated components */
.complex-animation {
  contain: strict;
  content-visibility: auto;
}
```

### Performance Monitoring

```javascript
// Check animation frame rate
let frameCount = 0;
let lastTime = performance.now();

function measureFPS() {
  frameCount++;
  const now = performance.now();

  if (now - lastTime >= 1000) {
    const fps = Math.round((frameCount * 1000) / (now - lastTime));
    console.log(`FPS: ${fps}`);
    frameCount = 0;
    lastTime = now;
  }

  requestAnimationFrame(measureFPS);
}

// Use PerformanceObserver for long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn(`Long task detected: ${entry.duration}ms`, entry);
    }
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

### Reducing Animation Complexity on Low-end Devices

```javascript
// Detect low-end device
function isLowEndDevice() {
  const memory = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency;

  return (memory && memory <= 2) || (cores && cores <= 2);
}

// Conditionally apply animations
function applyAnimation(element, animationOptions) {
  if (isLowEndDevice() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Instant state change, no animation
    return element.animate(
      [animationOptions.keyframes[animationOptions.keyframes.length - 1]],
      { duration: 0, fill: 'forwards' }
    );
  }

  return element.animate(animationOptions.keyframes, animationOptions.options);
}
```

---

## §4 — Accessibility (Reduced Motion)

### CSS-Only Reduced Motion

```css
/* globals.css — Comprehensive reduced motion reset */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* More nuanced approach — keep instant transitions but remove complex animations */
@media (prefers-reduced-motion: reduce) {
  /* Remove transform/position animations */
  .card:hover {
    transform: none;
  }

  /* Remove parallax */
  .parallax-element {
    transform: none !important;
  }

  /* Simplify page transitions */
  .page-enter {
    opacity: 1;
    transform: none;
  }

  /* Keep color transitions for usability */
  .button {
    transition: background-color 0.15s ease, color 0.15s ease;
  }
}
```

### JS Reduced Motion Hook (React)

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// Usage with WAAPI
function AnimatedDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const keyframes = reducedMotion
      ? [{ opacity: 1, transform: 'none' }]
      : [
          { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' }
        ];

    const anim = dialogRef.current.animate(keyframes, {
      duration: reducedMotion ? 0 : 300,
      easing: 'ease-out',
      fill: 'forwards'
    });

    return () => anim.cancel();
  }, [isOpen, reducedMotion]);

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" style={{ opacity: 0 }}>
      {/* dialog content */}
    </div>
  );
}
```

### Accessible Animation Checklist

```
Animation Accessibility Rules:
1. ✅ No content flashes more than 3 times per second (seizure prevention)
2. ✅ Auto-playing content > 5s must have pause/stop control
3. ✅ Respect prefers-reduced-motion: reduce
4. ✅ Avoid auto-advancing carousels without controls
5. ✅ Don't parallax-scroll without reduced-motion alternative
6. ✅ Provide visible focus indicators that survive animations
7. ✅ Don't rely solely on motion to convey information
8. ✅ Test with screen reader — animations shouldn't break announcements
9. ✅ Use aria-live regions for content that changes via animation
10. ✅ Ensure animations don't cause content to disappear off-screen permanently
```

---

## §5 — Framework Integration

### Tailwind CSS 4 Animation Utilities

```css
/* tailwind.config or CSS-first config */
@import "tailwindcss";

/* Custom keyframes in Tailwind CSS 4 */
@theme {
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-slide-up: slide-up 0.6s ease-out;
  --animate-bounce-in: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  --animate-shimmer: shimmer 2s linear infinite;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-in {
  from { opacity: 0; transform: scale(0.3); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}

/* Usage: <div class="animate-fade-in"> */
```

### Next.js View Transitions (Next.js 15+)

```tsx
// app/template.tsx — automatic route transitions
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}

// next.config.ts
const nextConfig = {
  experimental: {
    // View Transitions API integration
    serverActions: { bodySizeLimit: '2mb' },
  },
};
```

### Intersection Observer + WAAPI Pattern

```tsx
'use client';

import { useEffect, useRef } from 'react';

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use WAAPI for the reveal animation
          el.animate(
            [
              { opacity: 0, transform: 'translateY(40px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ],
            {
              duration: 600,
              easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
              fill: 'forwards'
            }
          );
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

// Usage
function RevealSection() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} style={{ opacity: 0 }}>
      <h2>Reveals on scroll</h2>
    </section>
  );
}
```

---

## §6 — Recipes & Common Patterns

### Staggered List Animation

```javascript
function staggerAnimation(elements, baseDelay = 100) {
  elements.forEach((el, index) => {
    el.animate(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      {
        duration: 400,
        delay: index * baseDelay,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );
  });
}

// Usage
const items = document.querySelectorAll('.stagger-item');
staggerAnimation(items, 80);
```

### Hover Scale with Spring

```css
/* Pure CSS spring-like hover */
.card {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.card:hover {
  transform: scale(1.05);
}

.card:active {
  transform: scale(0.98);
  transition-duration: 0.1s;
}
```

### Skeleton Loading Shimmer

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-bg, #e0e0e0) 25%,
    var(--skeleton-highlight, #f0f0f0) 50%,
    var(--skeleton-bg, #e0e0e0) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: var(--skeleton-bg, #e0e0e0);
  }
}
```

### Page Transition (View Transitions API)

```css
/* View Transitions API — native page transitions */
@view-transition {
  navigation: auto;
}

::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Named view transitions for specific elements */
.hero-image {
  view-transition-name: hero;
}

::view-transition-group(hero) {
  animation-duration: 0.4s;
}
```

### Morphing Button (Loading State)

```tsx
function LoadingButton({ isLoading, children, onClick }: {
  isLoading: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    if (isLoading) {
      const originalWidth = buttonRef.current.offsetWidth;

      buttonRef.current.animate(
        [
          { width: `${originalWidth}px` },
          { width: `${originalWidth}px` } // Keep width, change content
        ],
        { duration: 0, fill: 'forwards' }
      );
    }
  }, [isLoading]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={isLoading}
      className="transition-all duration-300 ease-out"
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### Parallax with Reduced Motion

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

function ParallaxSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const rate = scrolled * 0.3;
          el.style.transform = `translateY(${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <div ref={ref} style={reducedMotion ? {} : { willChange: 'transform' }}>
      {children}
    </div>
  );
}
```

---

## Common Mistakes & Pitfalls

| Mistake | Fix |
|---------|-----|
| Animating `width`/`height`/`top`/`left` | Use `transform: translate/scale/rotate` |
| Permanent `will-change` on many elements | Apply only during animation, remove after |
| Not respecting `prefers-reduced-motion` | Always check and provide instant alternative |
| Using `setTimeout` for animations | Use `requestAnimationFrame` or WAAPI |
| Layout thrashing in JS animations | Batch reads, then batch writes |
| Animating without `fill: forwards` | Element snaps back — use `fill: 'forwards'` |
| Forgetting to cancel animations on unmount | Always `.cancel()` WAAPI animations in cleanup |
| Using CSS animations for one-time effects | Use `animation-fill-mode: forwards` or WAAPI |
| Not testing on low-end devices | Test on throttled CPU / low-end Android |

---

## Browser Support (2025-2026)

| Feature | Chrome | Firefox | Safari |
|---------|--------|---------|--------|
| CSS Animations | ✅ All | ✅ All | ✅ All |
| WAAPI (Element.animate) | ✅ 84+ | ✅ 80+ | ✅ 15.4+ |
| Individual transforms | ✅ 104+ | ✅ 103+ | ✅ 16+ |
| @property (Houdini) | ✅ 85+ | ✅ 128+ | ✅ 15.4+ |
| View Transitions API | ✅ 111+ | ✅ 132+ | ✅ 18+ |
| Scroll-driven animations | ✅ 115+ | ❌ | ❌ |
| CSS Nesting | ✅ 120+ | ✅ 128+ | ✅ 17.2+ |
| `animation-composition` | ✅ 112+ | ✅ 128+ | ✅ 17.2+ |

---

## References

- MDN Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations
- web.dev Animations Guide: https://web.dev/animations/
- View Transitions API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
- Can I Use — Web Animations: https://caniuse.com/web-animation
- CSS @property: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
- WCAG 2.3.1 Three Flashes: https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html
- Google Web Fundamentals — Animations: https://web.dev/articles/animations-guide
- CSS Scroll-Driven Animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
