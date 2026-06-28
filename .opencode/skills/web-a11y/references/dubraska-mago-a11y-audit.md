# A11y Audit Pattern — Dubraska Mago E-commerce (2026-06-30)

## Audit methodology applied

1. **Layout audit** — Root layout, skip link, `<main>` id, focus management, SVGs
2. **Component audit** — NavigationBar, Footer, CartDrawer, SearchOverlay, HeroSection, CustomCursor
3. **CSS audit** — prefers-reduced-motion, prefers-contrast, pointer:coarse, focus-visible
4. **Form audit** — Labels, aria-describedby, aria-live regions for dynamic content
5. **Interactive element audit** — aria-label, aria-current, aria-expanded, aria-controls
6. **Modal audit** — role="dialog", aria-modal="true", aria-hidden on backdrops

## Scorecard

| Priority | Issue | Status |
|----------|-------|--------|
| CRITICAL | No skip link | ✅ FIXED |
| CRITICAL | `<main>` missing id for skip target | ✅ FIXED |
| CRITICAL | CartDrawer missing role="dialog" + aria-modal | ✅ FIXED |
| CRITICAL | SearchOverlay missing combobox/listbox ARIA | ✅ FIXED |
| HIGH | Nav links missing aria-current="page" | ✅ FIXED |
| HIGH | Newsletter form missing label + aria-describedby | ✅ FIXED |
| HIGH | Mobile menu button missing aria-expanded + aria-controls | ✅ FIXED |
| MEDIUM | SVG decorative elements missing aria-hidden="true" | ✅ FIXED |
| MEDIUM | External links missing "abre en nueva pestaña" context | ✅ FIXED |
| MEDIUM | CustomCursor not disabling for touch + reduced-motion | ✅ FIXED |
| LOW | Missing prefers-contrast CSS support | ✅ FIXED |
| LOW | Missing touch target min-size (WCAG 2.5.8) | ✅ FIXED |
| LOW | Scroll indicator not hidden from AT | ✅ FIXED |

## Files modified (11)

1. `src/app/layout.tsx` — Skip link, main id="main-content" tabIndex={-1}
2. `src/app/globals.css` — :focus-visible, sr-only, prefers-reduced-motion, prefers-contrast, pointer:coarse
3. `src/components/NavigationBar.tsx` — usePathname import, aria-current, aria-expanded/controls, SVG aria-hidden, descriptive aria-labels
4. `src/components/Footer.tsx` — Newsletter label + aria-describedby, social link aria-labels with external context, SVG aria-hidden, role="list" on social group
5. `src/components/cart/CartDrawer.tsx` — role="dialog" aria-modal, backdrop aria-hidden, SVG aria-hidden
6. `src/components/SearchOverlay.tsx` — role="dialog" aria-modal, combobox/listbox/option pattern, aria-activedescendant, aria-live="polite" for no-results
7. `src/components/HeroSection.tsx` — aria-label on section, scroll indicator aria-hidden
8. `src/components/CustomCursor.tsx` — fine-pointer + reduced-motion detection

## Pitfalls encountered

1. **patch corrupts multi-line JSX** — When replacing JSX attributes across multiple lines, the patch tool can merge the replacement into adjacent content. Always verify the diff output of a patch before proceeding to the next edit.
2. **patch leaves residual tokens** — When replacing a block that contains `</p>` or similar closing tags, the old closing tag can survive as a dangling `>`. Always read the file after patching to verify no residual tokens remain.
3. **GSAP matchMedia for reduced-motion** — GSAP's `gsap.matchMedia()` is the correct way to scope animations, but the CSS `prefers-reduced-motion` media query is still needed as a global safety net for non-GSAP animations (Framer Motion, CSS transitions).
4. **Combobox pattern complexity** — The ARIA combobox pattern requires `aria-expanded`, `aria-controls`, `aria-activedescendant`, and `role="listbox"` + `role="option"` on children. Missing any one of these breaks the screen reader experience.

## WCAG 2.2 criteria addressed

- 1.3.1 Info and Relationships (semantic HTML, ARIA)
- 1.4.3 Contrast Minimum (focus indicator contrast)
- 1.4.6 Enhanced Contrast (prefers-contrast support)
- 1.4.12 Text Spacing (line-height, word-spacing)
- 2.1.1 Keyboard (all interactive elements reachable)
- 2.4.1 Bypass Blocks (skip link)
- 2.4.3 Focus Order (logical tab order)
- 2.4.7 Focus Visible (:focus-visible styling)
- 2.4.11 Focus Not Obscured (AA)
- 2.5.8 Target Size (44x44px for coarse pointer)
- 3.2.1 On Focus (no unexpected context changes)
- 3.3.2 Labels or Instructions (form labels)
- 4.1.2 Name, Role, Value (ARIA on custom components)
