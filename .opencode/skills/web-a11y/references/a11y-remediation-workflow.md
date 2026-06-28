# A11y Audit & Remediation Workflow — WCAG 2.2

Practical workflow for auditing and fixing accessibility in existing Next.js projects, derived from real remediation work on dubraska-mago (dark luxury e-commerce).

## Phase 1 — Quick Manual Audit (before code changes)

- Tab through the page — can you reach every interactive element?
- Is there a "Skip to main content" link as the first focusable element?
- Is `<html lang="es">` set correctly for Spanish sites?
- Are all `<img>` elements using descriptive `alt` text (or `alt=""` for decorative)?
- Do all `<button>` elements without visible text have `aria-label`?
- Are SVGs decorative (`aria-hidden="true"`) or meaningful (`aria-labelledby`)?
- Do modals have `role="dialog"` + `aria-modal="true"` + focus trap?
- Does the mobile menu have `aria-expanded` + `aria-controls`?

## Phase 2 — Code Remediation Checklist

Apply fixes in this order (most impactful first):

### 2.1 Root Layout (`src/app/layout.tsx`)
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-gold)] focus:text-[var(--color-bg)]">
  Saltar al contenido principal
</a>
<main id="main-content" tabIndex={-1}>
```

### 2.2 Navigation (`NavigationBar.tsx`)
```tsx
// Track active page
import { usePathname } from "next/navigation"
const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
<a href={item.href} aria-current={isActive ? "page" : undefined}>

// Mobile menu
<button aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav">
<div id="mobile-nav">

// Action buttons (always descriptive)
<button aria-label="Buscar productos">  // NOT just "Buscar"
```

### 2.3 All Decorative SVGs
```tsx
<svg aria-hidden="true">  // if purely decorative
```

### 2.4 All Modals/Drawers/Overlays
```tsx
<div role="dialog" aria-modal="true" aria-label="Descripción">
```

### 2.5 Search Combobox Pattern
```tsx
<input role="combobox"
       aria-expanded={hasSuggestions}
       aria-controls="search-suggestions"
       aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined} />
<div id="search-suggestions" role="listbox">
  <a role="option" aria-selected={isSelected} id={`suggestion-${i}`}>
```

### 2.6 Empty States / Status Messages
```tsx
<div role="status" aria-live="polite">
  No se encontraron resultados
</div>
```

### 2.7 Forms — Always Use Labels
```tsx
<label htmlFor="newsletter-email">Email</label>
<input id="newsletter-email" aria-describedby="newsletter-hint" autoComplete="email" />
<p id="newsletter-hint">Helper text here</p>
```

### 2.8 External Links
```tsx
<a href={social.url} target="_blank" rel="noopener noreferrer"
   aria-label={`Visitar ${social.platform} (abre en nueva pestaña)`}>
```

### 2.9 CustomCursor — Respect Reduced Motion
```tsx
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
if (mq.matches || window.innerWidth <= 768 || !finePointer.matches) return  // skip custom cursor
```

### 2.10 Global CSS (`globals.css`)
```css
/* Focus visible (WCAG 2.4.7) */
:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 3px; border-radius: 2px; }
:focus:not(:focus-visible) { outline: none; }

/* Reduced motion (WCAG 2.3.3) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast (WCAG 1.4.11) */
@media (prefers-contrast: high) {
  a, button { text-decoration: underline; }
  :focus-visible { outline-width: 3px; outline-color: #fff; }
}

/* Touch target size (WCAG 2.5.8 — 24×24 AA, using 44×44 for practical) */
@media (pointer: coarse) {
  button, a, [role="button"] { min-height: 44px; min-width: 44px; }
}
```

## Phase 3 — Verification

```bash
# Run axe-core (if installed)
npx axe http://localhost:3000

# Run Lighthouse
npx lighthouse http://localhost:3000 --port=9222 --only-categories=accessibility --output=json --output-path=./a11y-report.json

# Unit test a11y assertions
npx vitest run src/test/components/Accessibility.test.tsx
```

## Common Issues on Dark-Themed Sites

| Issue | Dark Luxury Fix |
|-------|----------------|
| Low contrast muted text | `--color-muted: oklch(0.62 0.005 60)` — borderline, test against `var(--color-bg)` |
| Gold focus on dark bg | `outline-color: var(--color-gold)` — gold has high contrast on near-black |
| Decorative dividers/shimmers | Always `aria-hidden="true"` |
| CSS animations without reduced-motion support | Use `gsap.matchMedia()` with reduced-motion check |
| `cursor: none` (custom cursor) | Re-enables `cursor: auto` when reduced-motion; skips custom cursor entirely |
