---
name: web-a11y
description: "Web Accessibility (a11y) — WCAG 2.2, ARIA patterns, keyboard navigation, screen reader support, semantic HTML, focus management, reduced motion. Use when building accessible components, auditing accessibility, implementing keyboard navigation, or designing for screen readers."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [a11y, accessibility, wcag, aria, screen-reader, keyboard, semantic-html, focus-management, reduced-motion]
    related_skills: [design, nextjs, tailwind-css4, web-security]
---

# Web Accessibility (a11y) — WCAG 2.2 & Inclusive Design

Comprehensive guide for building accessible web applications (WCAG 2.2 AA/AAA compliance).

## When to Use

| Task | Section |
|------|---------|
| WCAG 2.2 principles & conformance levels | §1 WCAG 2.2 |
| Semantic HTML patterns | §2 Semantic HTML |
| ARIA attributes & live regions | §3 ARIA |
| Keyboard navigation & focus | §4 Keyboard Navigation |
| Screen reader patterns | §5 Screen Readers |
| Forms & error handling | §6 Accessible Forms |
| Color, contrast & typography | §7 Visual Accessibility |
| Motion, animations & reduced-motion | §8 Motion & Animation |
| Testing & auditing | §9 Testing |
| React/Next.js specific patterns | §10 React & Next.js a11y |
| **Full audit + remediation workflow** | **`references/a11y-remediation-workflow.md`** |

---

## §1 — WCAG 2.2 (2024 Update)

WCAG 2.2 became a W3C Recommendation in October 2023. It adds 9 new success criteria on top of 2.1.

### The Four Principles (POUR)

1. **Perceivable** — Information must be presentable in ways users can perceive
2. **Operable** — UI components must be operable by all users
3. **Understandable** — Information and UI operation must be understandable
4. **Robust** — Content must be robust enough for various assistive technologies

### Conformance Levels

| Level | Description | Target |
|-------|-------------|--------|
| A | Minimum | Must have |
| AA | Recommended | **Target for most projects** |
| AAA | Enhanced | Ideal for gov/health/education |

### New in WCAG 2.2

- **2.4.11 Focus Not Obscured** (AA) — focused elements not entirely hidden
- **2.4.12 Focus Not Obscured** (AAA) — no part of focused element hidden
- **2.4.13 Focus Appearance** (AAA) — focus indicator has 3:1 contrast & 2px thickness
- **2.5.7 Dragging Movements** (AA) — provide non-drag alternatives
- **2.5.8 Target Size** (AA) — interactive targets ≥ 24×24px (up from 44×44 in AAA)
- **3.2.6 Consistent Help** (A) — help mechanisms in consistent location
- **3.3.7 Redundant Entry** (A) — don't require re-entering previously provided info
- **3.3.8 Accessible Authentication (Minimum)** (AA) — auth processes don't rely on cognitive tests

---

## §2 — Semantic HTML

Semantic HTML is the foundation of accessibility. Use the right element for the job.

### Document Structure

```html
<!-- ✅ Proper document structure -->
<body>
  <a href="#main" class="skip-link">Skip to main content</a>

  <header role="banner">
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main id="main" role="main">
    <h1>Page Title</h1>
    <!-- Important: The h1 should describe the page -->
  </main>

  <aside aria-label="Related content">
    <!-- Supplementary content -->
  </aside>

  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <!-- Footer links with DIFFERENT label from main nav -->
    </nav>
  </footer>
</body>
```

### Headings Hierarchy

```html
<!-- ✅ Logical heading hierarchy -->
<h1>Main page title</h1>
  <h2>Section heading</h2>
    <h3>Subsection</h3>
  <h2>Another section</h2>

<!-- ❌ Skipping levels or using headings for visual styling -->
<h1>Title</h1>
<h4>Jump to h4 for visual size</h4>
<strong>Use of strong as heading</strong>
```

### Lists

```html
<!-- ✅ Use lists for list-like content -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Current Product</li>
  </ol>
</nav>
```

### Landmark Roles

```html
<!-- HTML5 landmarks (implicit roles) -->
<header>       <!-- role="banner" -->
<main>         <!-- role="main" -->
<nav>          <!-- role="navigation" -->
<aside>        <!-- role="complementary" -->
<footer>       <!-- role="contentinfo" -->
<form>         <!-- role="form" (with name/aria-label) -->
<section>      <!-- role="region" (with label) -->

<!-- Add labels when you have multiple landmarks of same type -->
<nav aria-label="Main">...</nav>
<nav aria-label="Footer">...</nav>
```

### The Skip Link

```css
/* globals.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
}

.skip-link:focus {
  top: 6px;
}
```

---

## §3 — ARIA (Accessible Rich Internet Applications)

> **Rule #1:** No ARIA is better than bad ARIA. Use native HTML first.

### The Five Rules of ARIA

1. Don't use ARIA if native HTML can achieve the same semantics
2. Don't change native semantics (unless absolutely necessary)
3. All interactive ARIA controls must be keyboard accessible
4. Don't use `role="presentation"` or `aria-hidden` on focusable elements
5. All interactive elements must have an accessible name

### Common ARIA Patterns

```tsx
// ✅ Dialog / Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">This will permanently delete the item.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>

// ✅ Tabs
<div role="tablist" aria-label="Account settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    Profile
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Billing
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabIndex={0}>
  Profile content
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabIndex={0} hidden>
  Billing content
</div>

// ✅ Accordion
<h3>
  <button aria-expanded="false" aria-controls="section-1">
    Section 1
  </button>
</h3>
<div id="section-1" role="region" hidden>
  Section 1 content
</div>

// ✅ Alert / Status messages
<div role="alert">
  Error: Password must be at least 8 characters.
</div>

<div role="status" aria-live="polite">
  5 results found
</div>

// ✅ Disclosure (show/hide with link)
<details>
  <summary>Advanced options</summary>
  <div>Additional settings here</div>
</details>
```

### Live Regions

```tsx
// aria-live="polite" — announces when user is idle
<div aria-live="polite" className="sr-only">
  {searchResults.length} results found
</div>

// aria-live="assertive" — interrupts immediately
<div aria-live="assertive" role="alert">
  Session expiring in 2 minutes
</div>

// aria-atomic="true" — reads entire region, not just changed part
<div aria-live="polite" aria-atomic="true">
  <span>{currentTime}</span>
</div>

// aria-relevant — what changes trigger announcement
<div aria-live="polite" aria-relevant="additions text">
  <!-- Only new additions are announced (useful for chat) -->
</div>
```

### ARIA Labels & References

```tsx
// aria-label — provides accessible name when no visible label
<button aria-label="Close dialog">×</button>

// aria-labelledby — references another element's ID for name
<h2 id="shipping-heading">Shipping Address</h2>
<section aria-labelledby="shipping-heading">...</section>

// aria-describedby — provides additional descriptive information
<input
  type="password"
  aria-describedby="password-requirements"
/>
<p id="password-requirements">
  Must be 8+ characters with uppercase, lowercase, number, and symbol.
</p>

// aria-owns — re-expresses parent/child relationships (use sparingly)
<div role="menu" ariaowns="item-1 item-2">
  <div role="menuitem" id="item-1">Save</div>
  <div role="menuitem" id="item-2">Delete</div>
</div>
```

---

## §4 — Keyboard Navigation & Focus Management

### Focusable Elements

```html
<!-- Naturally focusable -->
<a href="...">Link</a>
<button>Button</button>
<input type="text">
<select>...</select>
<textarea>...</textarea>

<!-- Make custom elements focusable -->
<div tabindex="0" role="button" onkeydown="handleKey">Custom Button</div>

<!-- Remove from tab order but keep programmatically focusable -->
<div tabindex="-1">Receives focus via JS</div>

<!-- ❌ Never do this -->
<div tabindex="2">Positive tabindex</div>
<!-- Use tabindex="0" only for elements that need to be interactive -->
```

### Focus Trap Pattern (Modals)

```tsx
'use client';

import { useRef, useEffect, useCallback } from 'react';

function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      // Prevent scrolling background
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      previousFocus.current?.focus(); // Restore focus on close
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const modal = modalRef.current;
      if (!modal) return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

### Roving tabindex Pattern (Toolbars, Tabs, Menus)

```tsx
'use client';

import { useState, useRef, type KeyboardEvent } from 'react';

function Toolbar({ items }: { items: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % items.length;
        setActiveIndex(nextIndex);
        buttonRefs.current[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + items.length) % items.length;
        setActiveIndex(prevIndex);
        buttonRefs.current[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        buttonRefs.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = items.length - 1;
        setActiveIndex(lastIndex);
        buttonRefs.current[lastIndex]?.focus();
        break;
    }
  };

  return (
    <div role="toolbar" aria-label="Text formatting">
      {items.map((item, index) => (
        <button
          key={item}
          ref={el => { buttonRefs.current[index] = el; }}
          tabIndex={activeIndex === index ? 0 : -1}
          onKeyDown={handleKeyDown}
          aria-pressed={activeIndex === index}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
```

### Menu Keyboard Navigation

```tsx
function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        Options
      </button>
      {isOpen && (
        <ul role="menu" aria-label="Options">
          <li role="none">
            <a role="menuitem" href="/save" tabIndex={0}>Save</a>
          </li>
          <li role="none">
            <a role="menuitem" href="/edit" tabIndex={-1}>Edit</a>
          </li>
          <li role="none">
            <button role="menuitem" tabIndex={-1}>Delete</button>
          </li>
        </ul>
      )}
    </div>
  );
}
```

---

## §5 — Screen Reader Patterns

### Visually Hidden Content

```css
/* globals.css — Text only visible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Image Alt Text

```tsx
<!-- ✅ Descriptive alt for meaningful images -->
<img src="/chart.png" alt="Bar chart showing revenue growth from Q1 to Q4: $1M, $1.5M, $2M, $2.5M" />

<!-- ✅ Empty alt for decorative images -->
<img src="/decorative-line.svg" alt="" role="presentation" />

<!-- ✅ Complex images with long description -->
<a href="#chart-description">
  <img src="/complex-chart.png" alt="Revenue trends 2024. Detailed description below." />
</a>
<div id="chart-description" className="sr-only">
  Detailed: The chart shows consistent quarter-over-quarter growth...
</div>

<!-- ❌ Avoid -->
<img src="image.png" alt="image" />
<img src="photo.jpg" alt="photo of something" />
<img src="chart.png" alt="Figure 1" />
```

### SVG Accessibility

```tsx
<!-- Decorative SVG -->
<svg aria-hidden="true" focusable="false">
  <!-- decorations -->
</svg>

<!-- Meaningful SVG -->
<svg role="img" aria-labelledby="icon-title">
  <title id="icon-title">Shopping cart</title>
  <path d="..." />
</svg>

<!-- Interactive SVG button -->
<button aria-label="Add item to cart">
  <svg aria-hidden="true" focusable="false">
    <path d="..." />
  </svg>
</button>
```

### Table Accessibility

```tsx
<table>
  <caption>Monthly sales figures</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Units Sold</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$10,000</td>
      <td>500</td>
    </tr>
  </tbody>
</table>
```

---

## §6 — Accessible Forms

### Labels & Instructions

```tsx
<!-- ✅ Explicit label association -->
<label htmlFor="email">Email address</label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-required="true"
  aria-describedby="email-hint email-error"
  aria-invalid={hasError}
/>
<span id="email-hint">We'll never share your email.</span>
<span id="email-error" role="alert">
  {hasError && 'Please enter a valid email address.'}
</span>

<!-- ✅ Wrapping label -->
<label>
  <input type="checkbox" name="terms" />
  I agree to the <a href="/terms">terms of service</a>
</label>

<!-- ✅ Floating label pattern (use with aria-label fallback) -->
<div>
  <label htmlFor="name" className="sr-only">Full name</label>
  <input
    type="text"
    id="name"
    placeholder="Full name"
    aria-label="Full name"
  />
</div>
```

### Form Validation

```tsx
'use client';

import { useState } from 'react';

function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form noValidate> {/* Handle validation with custom accessible UX */}
      <div>
        <label htmlFor="password">
          Password <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          type="password"
          id="password"
          required
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby="password-strength pw-error"
          onChange={(e) => {
            // Validate as user types
            if (e.target.value.length < 8) {
              setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
            } else {
              setErrors(prev => { const n = { ...prev }; delete n.password; return n; });
            }
          }}
        />
        <div id="password-strength" aria-live="polite">
          {/* Strength indicator */}
        </div>
        {errors.password && (
          <span
            id="pw-error"
            role="alert"
            style={{ color: 'red' }}
          >
            {errors.password}
          </span>
        )}
      </div>

      {/* Summarize errors at top of form */}
      {Object.keys(errors).length > 0 && (
        <div role="alert" aria-atomic="true">
          <h2>There are {Object.keys(errors).length} errors in this form</h2>
          <ul>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}>
                <a href={`#${field}`}>{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
```

### Select & Autocomplete

```tsx
// Accessible combobox pattern
function AccessibleSelect({ options, label }: {
  options: { value: string; label: string }[];
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();

  return (
    <div>
      <label id={`${listboxId}-label`}>{label}</label>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-owns={listboxId}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={`${listboxId}-label`}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              setIsOpen(true);
              setActiveIndex(i => Math.min(i + 1, options.length - 1));
              break;
            case 'ArrowUp':
              e.preventDefault();
              setActiveIndex(i => Math.max(i - 1, 0));
              break;
            case 'Enter':
              if (isOpen && activeIndex >= 0) {
                setSelected(options[activeIndex].value);
                setIsOpen(false);
              }
              break;
            case 'Escape':
              setIsOpen(false);
              break;
          }
        }}
      >
        <span>{selected ? options.find(o => o.value === selected)?.label : `Select ${label.toLowerCase()}`}</span>
        <span aria-hidden="true">▼</span>
      </div>
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={selected === option.value}
              onClick={() => {
                setSelected(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## §7 — Visual Accessibility

### Color Contrast Requirements

```
WCAG 2.2 Minimum Contrast Ratios:
- Normal text (< 24px / < 18.66px bold):  4.5:1 (AA) / 7:1 (AAA)
- Large text (≥ 24px / ≥ 18.66px bold):   3:1 (AA) / 4.5:1 (AAA)
- UI components & graphical objects:          3:1 (AA)

Don't rely on color alone to convey information.
```

### Color-Safe Patterns

```tsx
// ✅ Use icons + color for error states
<span style={{ color: 'red' }}>
  <svg aria-hidden="true">✕</svg>
  Error: Invalid email format
</span>

// ✅ Color + text + pattern for charts
<Bar color="#ff0000" aria-label="Q1: $1M (Lowest)" />
<Bar color="#00aa00" aria-label="Q4: $2.5M (Highest)" />

// ❌ Using only color
<span style={{ color: 'red' }}>Invalid</span>
```

### Focus Indicator Styling

```css
/* globals.css — Visible focus styles (3:1 contrast minimum) */
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Different focus for dark backgrounds */
.dark :focus-visible {
  outline-color: #93c5fd;
}

/* Remove focus ring for mouse clicks, keep for keyboard */
:focus:not(:focus-visible) {
  outline: none;
}

/* Custom focus for specific components */
.button:focus-visible {
  box-shadow: 0 0 0 3px #3b82f6, 0 0 0 6px #bfdbfe;
}
```

### Typography for Accessibility

```css
/* globals.css — Accessible typography */
:root {
  --min-font-size: 16px; /* Never below 16px — prevents iOS zoom */
  --line-height-body: 1.5; /* WCAG 1.4.12 requires ≥ 1.5 */
  --line-height-heading: 1.2;
  --paragraph-spacing: 1.5em; /* WCAG 1.4.12 requires ≥ 2em spacing */
}

body {
  font-size: var(--min-font-size);
  line-height: var(--line-height-body);
  word-spacing: 0.16em; /* WCAG 1.4.12: word-spacing ≥ 0.16em */
  letter-spacing: 0.12em; /* WCAG 1.4.12: letter-spacing ≥ 0.12em */
}

p {
  margin-bottom: 2em; /* Paragraph spacing ≥ 2em */
  max-width: 70ch; /* Optimal reading width */
  text-align: left; /* Avoid justified text — hard for dyslexic users */
}
```

### Responsive & Zoom Support

```css
/* Support up to 400% zoom without horizontal scrolling */
.container {
  max-width: 100%;
  overflow-x: hidden;
}

/* Ensure text can be resized */
html {
  font-size: 100%; /* Respects user browser settings */
}

/* Use rem/em for scalable spacing */
.card {
  padding: 1.5rem;
  margin-bottom: 2rem;
}
```

---

## §8 — Motion & Animation

### Reduced Motion

```css
/* globals.css */
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
```

```tsx
// React hook for reduced motion preference
'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// Usage with Motion / Framer Motion
import { motion, useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Card Content
    </motion.div>
  );
}
```

### Animation Guidelines

```
Accessible animation rules:
1. No flashing more than 3 times per second (seizure prevention)
2. Auto-playing content > 5s must have pause/stop control
3. Respect prefers-reduced-motion
4. Avoid auto-advancing carousels without controls
5. Don't parallax-scroll without reduced-motion alternative
```

```tsx
// Accessible auto-playing carousel
function Carousel({ slides }: { slides: Slide[] }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    const interval = setInterval(() => {
      // Next slide
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, reducedMotion]);

  return (
    <div role="region" aria-label="Featured products" aria-roledescription="carousel">
      <div aria-live={isPlaying ? 'off' : 'polite'}>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            aria-roledescription="slide"
            hidden={currentSlide !== i}
          >
            {slide.content}
          </div>
        ))}
      </div>

      <button
        aria-label={isPlaying ? 'Pause auto-advance' : 'Resume auto-advance'}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}
```

---

## §9 — Testing & Auditing

### Automated Tools

```bash
# axe-core CLI — fast automated audit
npm install -g @axe-core/cli
axe http://localhost:3000

# Lighthouse (Chrome DevTools or CLI)
npx lighthouse http://localhost:3000 --port=9222 --output=html

# Pa11y — headless accessibility testing
npm install -g pa11y
pa11y http://localhost:3000

# Storybook a11y addon
npm install --save-dev @storybook/addon-a11y

# jest-axe for unit tests
npm install --save-dev jest-axe
```

### Vitest + jest-axe

```tsx
// __tests__/a11y/button.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/Button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible name when icon-only', async () => {
    const { container } = render(
      <Button aria-label="Close dialog">
        <XIcon />
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Playwright E2E Accessibility Tests

```tsx
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('should pass axe audit on homepage', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should have no critical violations on dashboard', async ({ page }) => {
    await page.goto('/login');
    // Login flow...

    await page.goto('/dashboard');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // Manual check needed
      .analyze();

    // Log violations for review
    if (results.violations.length > 0) {
      console.table(results.violations.map(v => ({
        rule: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
      })));
    }

    expect(results.violations.filter(v => v.impact === 'critical')).toEqual([]);
  });

  test('keyboard navigation works on main flow', async ({ page }) => {
    await page.goto('/');

    // Tab through main navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        text: el?.textContent?.trim(),
        ariaLabel: el?.getAttribute('aria-label'),
      };
    });

    expect(focusedElement.tag).toBe('A');
    expect(focusedElement.text).toBe('Skip to main content');
  });
});
```

### Manual Testing Checklist

```
Manual Accessibility Testing:
□ Tab through entire page — can you reach every interactive element?
□ Tab order is logical and follows visual flow
□ Focus indicator is clearly visible (3:1 contrast)
□ All images have appropriate alt text
□ Color is not the only means of conveying information
□ Form inputs have visible labels
□ Error messages are descriptive and linked to inputs
□ Page works at 200% zoom
□ Page works at 400% zoom (no horizontal scroll)
□ Content reflows at 320px viewport (no scroll required)
□ All functionality works with keyboard only
□ Screen reader announces meaningful content correctly
□ Animations respect prefers-reduced-motion
□ No content flashes more than 3x/second
□ Skip navigation link works
□ Page title is unique and descriptive
□ Language attribute is set on <html>
```

---

## §10 — React & Next.js Specific Patterns

### Layout-Level Accessibility (globals.css + root layout)

Always include these baseline styles in `globals.css`:

```css
/* Focus visible for keyboard navigation (WCAG 2.4.7, 2.4.11, 2.4.13) */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
}

/* Skip link base */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}
.sr-only:focus, .sr-only-focusable:focus {
  position: fixed;
  width: auto; height: auto;
  padding: inherit; margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* WCAG 2.3.3 — Honor reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* WCAG 1.4.6 — Honor high contrast */
@media (prefers-contrast: high) {
  a, button { text-decoration: underline; }
  :focus-visible { outline-width: 3px; outline-color: #fff; }
}

/* WCAG 2.5.8 — Minimum touch target 44x44px */
@media (pointer: coarse) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

In `layout.tsx`, always include:

```tsx
// Skip link as FIRST child of <body>
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 ...">
  Saltar al contenido principal
</a>

// Main with id and negative tabIndex for skip-link targeting
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

### Navigation Accessibility

```tsx
// aria-current for active page
import { usePathname } from "next/navigation"

function NavLink({ item }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
  return (
    <a href={item.href} aria-current={isActive ? "page" : undefined}>
      {item.label}
      <span aria-hidden="true" /> {/* decorative underline */}
    </a>
  )
}

// Mobile menu button
<button
  aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
  aria-expanded={mobileOpen}
  aria-controls="mobile-nav"
>

// Mobile nav container
<motion.div id="mobile-nav" ...>
```

### Modal/Drawer Accessibility (Cart, Search, etc.)

Every overlay/modal must have:

```tsx
// Backdrop is hidden from AT
<div onClick={onClose} aria-hidden="true" />

// Dialog panel
<div
  role="dialog"
  aria-modal="true"
  aria-label="Carrito de compras"
>
  <button aria-label="Cerrar carrito">X</button>
  ...
</div>
```

### Search Overlay as Combobox

```tsx
<div role="dialog" aria-modal="true" aria-label="Buscar productos">
  <input
    role="combobox"
    aria-expanded={results.length > 0}
    aria-controls="search-suggestions"
    aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
  />
  <div id="search-suggestions" role="listbox" aria-label="Resultados de búsqueda">
    {items.map((item, i) => (
      <a
        key={item.id}
        id={`suggestion-${i}`}
        role="option"
        aria-selected={selectedIndex === i}
        href={item.href}
      >
        {item.name}
      </a>
    ))}
  </div>
  <div role="status" aria-live="polite">
    {noResults && "No se encontraron resultados"}
  </div>
</div>
```

### SVG Decorative Elements

```tsx
// Decorative SVG — hide from screen readers
<svg aria-hidden="true" focusable="false">...</svg>

// Meaningful SVG — label it
<svg role="img" aria-labelledby="icon-title">
  <title id="icon-title">Shopping cart</title>
  ...
</svg>

// SVG inside labeled button — hide it
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>
```

### Form Accessibility

```tsx
// Always use explicit label association
<label htmlFor="newsletter-email">Email</label>
<input
  type="email"
  id="newsletter-email"
  name="email"
  autoComplete="email"
  aria-describedby="newsletter-hint"
/>
<p id="newsletter-hint">
  Sin spam. Aceptas nuestra <a href="/politicas-privacidad">política de privacidad</a>.
</p>
```

### External Links

```tsx
// Indicate new tab in accessible name
<a
  href="https://..."
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visitar Instagram (abre en nueva pestaña)"
>
  <svg aria-hidden="true">...</svg>
</a>
```

### Custom Cursor Accessibility

```tsx
// Only show custom cursor for users who:
// 1. Don't prefer reduced motion
// 2. Have fine pointer (mouse, not touch)
// 3. Are on desktop (>768px)
useEffect(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
  if (mq.matches || window.innerWidth <= 768 || !finePointer.matches) return
  setVisible(true)
  // ...
}, [])
```

### Quantity Buttons

```tsx
// Use descriptive labels that include product context
<button aria-label={`Reducir cantidad de ${productName}`}>-</button>
<button aria-label={`Aumentar cantidad de ${productName}`}>+</button>
```

### Next.js Specific

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> {/* Always set language */}
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

// app/page.tsx
export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      {/* tabIndex={-1} allows programmatic focus for skip link */}
      <h1>Page Title</h1>
    </main>
  );
}

// next.config.ts
const nextConfig = {
  // Experimental: React compiler helps with memoization
  // but doesn't affect a11y
};
```

### Accessible Link vs Next.js Link

```tsx
import Link from 'next/link';

// ✅ Next.js Link is accessible by default
<Link href="/about">About</Link>

// ✅ With aria-label for context
<Link href="/blog/123" aria-label="Read more about Getting Started with Next.js">
  Read more
</Link>

// ✅ External links with proper indicators
<Link
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visit example.com (opens in new tab)"
>
  External Resource
</Link>
```

### Accessible Loading States

```tsx
// app/components/loading.tsx
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading content</span>
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
}
```

### Error Boundary with Accessibility

```tsx
// app/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main role="alert" aria-live="assertive">
      <h1>Something went wrong</h1>
      <p>We encountered an error while loading this page.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
```

### Dynamic Route Announcements

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function RouteAnnouncer() {
  const pathname = usePathname();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Navigated to ${document.title}`;
    }
  }, [pathname]);

  return (
    <div
      ref={liveRegionRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}

// Add to layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RouteAnnouncer />
        {children}
      </body>
    </html>
  );
}
```

### Accessible Data Fetching States

```tsx
// app/users/page.tsx
import { Suspense } from 'react';

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <main>
      <h1>Users</h1>
      {users.length === 0 ? (
        <p role="status">No users found.</p>
      ) : (
        <ul aria-label={`${users.length} users`}>
          {users.map(user => (
            <li key={user.id}>
              <a href={`/users/${user.id}`}>{user.name}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

// app/users/loading.tsx
export default function UsersLoading() {
  return (
    <main aria-busy="true" aria-describedby="loading-message">
      <p id="loading-message">Loading users...</p>
      <div aria-hidden="true">
        {/* Skeleton UI */}
      </div>
    </main>
  );
}
```

---

## References

| File | Description |
|------|-------------|
| `references/dubraska-mago-a11y-audit.md` | Full accessibility audit pattern from Dubraska Mago e-commerce — pitfalls, scorecard, WCAG criteria mapped to files |

## §11 — Next.js App Router A11y Implementation (2026-07-01)

### Skip Link Pattern

```tsx
// In root layout.tsx — FIRST element inside <body>
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-gold)] focus:text-[var(--color-bg)] focus:rounded-md focus:text-sm"
>
  Saltar al contenido principal
</a>

// Main content wrapper
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

### Navigation Active State

```tsx
"use client"
import { usePathname } from "next/navigation"

function NavLink({ item }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
  return (
    <a href={item.href} aria-current={isActive ? "page" : undefined}>
      {item.label}
    </a>
  )
}
```

### Mobile Menu Accessibility

```tsx
<button
  aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
  aria-expanded={mobileOpen}
  aria-controls="mobile-nav"
  onClick={() => setMobileOpen(!mobileOpen)}
>
```

### Modal/Dialog Pattern

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label="Carrito de compras"
  tabIndex={-1}
>
```

### Search Overlay (Combobox Pattern)

```tsx
<input
  role="combobox"
  aria-expanded={totalSuggestions > 0}
  aria-controls="search-suggestions"
  aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
/>
<div id="search-suggestions" role="listbox" aria-label="Resultados de búsqueda">
  <a id={`suggestion-${i}`} role="option" aria-selected={selectedIndex === i}>
```

### SVG Decorative Elements

Always add `aria-hidden="true"` to decorative SVGs:
```tsx
<svg aria-hidden="true">...</svg>
```

### Focus Visible (globals.css)

```css
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
  border-radius: 2px;
}
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion (globals.css)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Touch Targets (globals.css)

```css
@media (pointer: coarse) {
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### High Contrast (globals.css)

```css
@media (prefers-contrast: high) {
  a, button { text-decoration: underline; }
  :focus-visible { outline-width: 3px; outline-color: #fff; }
}
```

### Custom Cursor with Reduced Motion

```tsx
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
if (mq.matches || window.innerWidth <= 768 || !finePointer.matches) return
// Only show custom cursor for users with fine pointer who don't prefer reduced motion
```

---

## Quick Reference — Common A11y Mistakes

| Mistake | Fix |
|---------|-----|
| `<div onClick={...}>` without keyboard support | Use `<button>` or add `tabIndex={0}`, `onKeyDown` |
| Missing form labels | Add `<label htmlFor="...">` or `aria-label` |
| `alt="image"` or `alt=""` on meaningful images | Write descriptive alt text |
| No focus management in modals | Trap focus, restore on close |
| `outline: none` without replacement | Use `:focus-visible` with custom style |
| No skip link | Add "Skip to main content" link |
| Missing `lang` attribute | `<html lang="en">` |
| Color-only error indicators | Add icons + text |
| Auto-playing without controls | Add pause/stop button |
| `tabindex="1"` or higher | Use `tabindex="0"` or `-1` only |
| `aria-hidden` on focusable elements | Remove from tab order entirely |
| No heading hierarchy | Use h1-h6 in logical order |
| Small touch targets | Minimum 44×44px (WCAG 2.5.8: 24×24px AA) |

---

## Accessibility Checklist Summary

### Before Launch
- [ ] All images have appropriate alt text
- [ ] All form inputs have labels
- [ ] Color contrast meets 4.5:1 (AA) minimum
- [ ] Full keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Skip navigation link present
- [ ] Heading hierarchy is logical
- [ ] `lang` attribute on `<html>`
- [ ] Page titles are unique and descriptive
- [ ] `prefers-reduced-motion` respected
- [ ] ARIA used correctly (or not at all when native HTML suffices)
- [ ] Live regions for dynamic content
- [ ] Error messages are descriptive and linked to inputs
- [ ] Tested with screen reader (NVDA/VoiceOver)
- [ ] Tested with axe-core automated tool
- [ ] Tested at 200% and 400% zoom
- [ ] Tested at 320px viewport width (reflow)

---

## References

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WCAG Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- web.dev Accessibility: https://web.dev/accessibility/
- Deque University: https://dequeuniversity.com/
- axe-core: https://github.com/dequelabs/axe-core
- Pa11y: https://pa11y.org/
- The A11Y Project: https://www.a11yproject.com/
- Smashing Magazine a11y: https://www.smashingmagazine.com/tag/accessibility/
- React Accessibility: https://react.dev/reference/react/accessibility
- Next.js Accessibility: https://nextjs.org/docs/app/building-your-application/accessibility
- Framer Motion Reduced Motion: https://www.framer.com/docs/animation/#reduced-motion
- Inclusive Components: https://inclusive-components.design/
