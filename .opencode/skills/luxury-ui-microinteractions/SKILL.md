---
name: luxury-ui-microinteractions
description: Premium microinteractions and UI/UX patterns for dark luxury e-commerce — GSAP scroll, Framer Motion hover, 3D tilt, cursor, transitions, toasts
tags: [gsap, framer-motion, microinteractions, animations, ui, ux, e-commerce, luxury]
---

# Luxury UI Microinteractions & E-commerce UX

## Philosophy

For dark luxury e-commerce (jewelry, fashion, premium), microinteractions must feel:
- **Intentional** — every animation has a purpose, nothing is decorative noise
- **Smooth** — spring physics, never linear easing for organic movement
- **Subtle** — understated elegance, not flashy gamer aesthetics
- **Performant** — `will-change: transform`, GPU-accelerated properties only

## Animation Stack

| Tool | Use Case | Never Use For |
|------|----------|---------------|
| **GSAP + ScrollTrigger** | Scroll-based reveals, parallax, timelines | Hover states |
| **Framer Motion** | Hover, tap, layout animations, page transitions | Scroll triggers |
| **CSS transitions** | Simple color/opacity changes, focus rings | Complex sequences |

## Core Patterns

### 1. Custom Cursor
- Small circle (8px) following mouse with spring lag
- Expands to 40px with gold border on interactive elements
- `mix-blend-mode: difference` for visibility on any background
- `will-change: transform` for performance
- Hidden on touch devices and `prefers-reduced-motion`

### 2. 3D Tilt on Cards
- Track mouse position relative to card center
- `rotateX` and `rotateY` max ±8deg
- Use `onMouseMove` + `useMotionValue` + `useSpring`
- Reset on mouse leave with spring animation

### 3. Magnetic Buttons
- Calculate distance from cursor to button center
- Translate button toward cursor by 20-30% of distance
- Spring physics for natural feel
- Works best on CTAs and hero buttons

### 4. Page Transitions
- Overlay slide from left to right (gold or dark)
- 400ms in, 300ms out
- `AnimatePresence` + `usePathname` in root layout
- Keep transitions short — luxury feels fast

### 5. Toast Notifications
- Position: bottom-right
- Slide-in from right + fade
- Auto-dismiss after 3s with progress bar
- Types: success (green check), error (red X), info (gold info icon)
- Subscribe pattern for programmatic control

### 6. Loading States
- Skeleton shimmer (animated gradient background)
- Spinner with gold pulse
- Page loader with logo scale pulse
- Button-integrated spinner (replaces text)

### 7. Cart Drawer
- Spring slide-in from right (stiffness: 300, damping: 30)
- Backdrop blur intensifies on open
- Items enter with stagger (0.05s delay)
- Quantity controls with scale pulse
- Total with count-up animation
- Delete with shake confirmation

### 8. Form Inputs
- Floating labels that rise on focus
- Gold focus ring with smooth transition
- Error state with shake animation
- Success state with checkmark pop
- Password toggle with rotate animation

### 9. Product Cards
- Image zoom (scale 1.08) on hover
- Badge pulse for "SÚPER VENDIDO" / "NUEVO"
- Quick-view button slides up from bottom
- Wishlist heart with pop animation
- Ken Burns effect on featured images (scale 1.0→1.05 over 8s)

### 10. Empty States
- Inline SVG illustrations (gold-tinted)
- Clear headline + description
- CTA button to relevant section
- Fade-in + slide-up entrance

## E-commerce Specific Patterns

### Checkout Flow
- Progress indicator with animated steps
- Step transitions: slide from right with spring
- Sticky order summary with gold shadow
- Confirmation: checkmark with scale bounce + confetti

### Catalog/Collection
- Filter drawer: slide from left
- Filter chips: stagger entry
- Sort dropdown: fade-in
- Layout toggle: icon morph animation
- Pagination: hover scale + active gold state

### Product Detail
- Gallery zoom on hover (1.5x in cursor area)
- Thumbnail border gold on active
- Variant selector: radio with gold ring pop
- Tabs: animated underline (layoutId)
- Stock badge: green/gold/red with pulse

### Wishlist
- Grid with stagger reveal
- Remove: slide-out animation
- Count badge: bounce on change
- Move to cart: success feedback

## Timing Guidelines

| Animation | Duration | Easing |
|-----------|----------|--------|
| Hover states | 200-300ms | power2.out |
| Page transitions | 400ms in / 300ms out | spring |
| Scroll reveals | 600-800ms | power3.out |
| Stagger delays | 50-150ms | — |
| Spring animations | — | stiffness: 300, damping: 30 |
| Count-up | 1000ms | easeOutExpo |
| Toast auto-dismiss | 3000ms | — |

## Performance Rules

1. **Always** use `will-change: transform` on animated elements
2. **Never** animate `width`, `height`, `top`, `left` — use `transform` only
3. **Always** respect `prefers-reduced-motion: reduce`
4. **Use** `gsap.matchMedia()` for responsive animation differentiation
5. **Limit** simultaneous animations to avoid jank
6. **Use** `display: "swap"` for web fonts to prevent layout shift

## Code Style (Project-Specific)

- No semicolons in statements
- Double quotes only
- No comments in code
- `export default` at end of file
- 2-space indentation
- `var(--color-*)` for all colors
- Max 200 lines per file
- Function components with `React.JSX.Element` return type

## Real-World Case Study

See `references/dubraska-mago-microinteractions.md` for full implementation details and `references/dubraska-mago-uiux.md` for e-commerce UX patterns.

## Agent Invocation

See `references/opencode-agent-invocation.md` (in typography-system skill) for the correct OpenCode CLI pattern — critical: prompt goes as positional arg via stdin, not via `-f`.
