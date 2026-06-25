# Error & Not-Found Pages — Premium Design

## Objective
Create premium, on-brand `error.tsx` and `not-found.tsx` pages for the Dubraska Mago site. These must follow the exact same Dark Luxury aesthetic as the rest of the site.

## Design System Reference
- **Colors**: `var(--color-bg)` (dark background), `var(--color-gold)` (#D4AF37), `var(--color-muted)`, `var(--color-white)`, `var(--color-rose)`
- **Fonts**: `var(--font-instrument-serif)` for headings, `var(--font-inter)` for body
- **Style**: Dark Luxury — deep blacks + gold accents, elegant, minimal
- **Animations**: Framer Motion for entrance animations, GSAP for scroll
- **Pattern**: `function Component(): React.JSX.Element` with `export default` at end

## What to Create

### 1. `src/app/error.tsx` — Global Error Page (Client Component)

A premium error page that:
- Is a Client Component (`"use client"` at top)
- Accepts `error: Error & { digest?: string }` and `reset: () => void` props
- Has a full-screen dark background with subtle animated gold particles or gradient
- Shows a large "500" or error icon in gold with elegant typography
- Message: "Algo salió mal" / "Estamos trabajando para resolverlo"
- Two CTAs: "Intentar de nuevo" (calls `reset()`) and "Volver al inicio" (links to `/`)
- Uses Framer Motion for entrance animations (fade up, stagger)
- Shows error digest in a subtle way (for debugging, only in dev)
- Has a decorative element (gold line, diamond shape, or abstract jewelry SVG)
- Fully responsive (mobile-first)
- Respects `prefers-reduced-motion`

**Visual layout:**
```
┌─────────────────────────────────────┐
│                                     │
│            ✦ (gold ornament)        │
│                                     │
│              500                    │
│        (Instrument Serif, gold)     │
│                                     │
│    Algo salió mal                   │
│    (Inter light, muted)             │
│                                     │
│    Estamos trabajando para          │
│    resolverlo. Vuelve a intentarlo │
│    en unos momentos.                │
│                                     │
│    [ Intentar de nuevo ]           │
│    [ Volver al inicio ]            │
│                                     │
│         ─ ─ ─ ─ ─ ─ ─              │
│                                     │
└─────────────────────────────────────┘
```

### 2. `src/app/not-found.tsx` — 404 Page (Server Component)

A premium 404 page that:
- Can be a Server Component (no "use client" needed unless using interactivity)
- Has the same dark luxury aesthetic
- Shows a large "404" in gold with elegant typography
- Message: "Página no encontrada" / "La página que buscas no existe o fue movida"
- Fun jewelry-themed message: "Como una joya perdida, esta página no está en nuestra colección"
- CTAs: "Volver al inicio" (links to `/`) and "Ver colección" (links to `/colecciones`)
- Has a decorative gold ornament or animated element
- Search bar to help users find what they need
- Links to key pages (Nosotros, Contacto, FAQ)
- Fully responsive
- Uses Framer Motion for animations

**Visual layout:**
```
┌─────────────────────────────────────┐
│                                     │
│            ◇ (gold diamond)         │
│                                     │
│              404                    │
│        (Instrument Serif, gold)     │
│                                     │
│    Página no encontrada             │
│                                     │
│    Como una joya perdida, esta      │
│    página no está en nuestra        │
│    colección.                       │
│                                     │
│    [ Buscar... ]                    │
│                                     │
│    [ Volver al inicio ]            │
│    [ Ver colección ]               │
│                                     │
│    O explora: · Nosotros · Contacto · FAQ │
│                                     │
└─────────────────────────────────────┘
```

### 3. `src/app/not-found.module.css` (optional, if needed for complex animations)

Only if CSS modules are needed for keyframe animations that can't be done with Tailwind.

### 4. Create `src/components/ErrorOrnament.tsx`

A reusable decorative component for error pages:
- Abstract gold line/diamond/ornament shape
- Subtle animation (pulse, rotate, or shimmer)
- Used in both error and not-found pages

### 5. Create `src/components/ErrorSearch.tsx` (for not-found page)

A search component for the 404 page:
- Input with search icon
- On submit, redirects to `/colecciones?q={query}`
- Styled to match the dark luxury theme
- Auto-focuses on mount

## Code Rules (MUST FOLLOW)
- NO semicolons
- Double quotes only
- NO comments
- `export default` at end of file
- 2-space indentation
- Use `function` components with `React.JSX.Element` return type
- Use `var(--color-*)` for all colors (NEVER hex values)
- Max 200 lines per file — split into multiple components if needed
- `"use client"` only for error.tsx (required) and interactive components
- Respect `prefers-reduced-motion`

## Animation Requirements
- Framer Motion for entrance animations (initial → animate)
- Stagger children with `transition: { delay: 0.1 }`
- Gold ornament should have subtle continuous animation (pulse or rotate)
- Buttons should have `whileHover` and `whileTap` animations
- Page should feel alive but elegant (not overwhelming)

## Accessibility
- Proper heading hierarchy (h1 for main title)
- All buttons have accessible labels
- Focus states visible
- Color contrast meets WCAG AA
- `prefers-reduced-motion` disables all animations

## Files to Read First
- `src/app/layout.tsx` — Root layout (to understand font/color setup)
- `src/app/globals.css` — Color variables and base styles
- `src/components/HeroSection.tsx` — Reference for animation style and typography
- `src/components/NavigationBar.tsx` — Reference for button styles
- `src/components/catalog/SearchBar.tsx` — Reference for search input styling

## Verification
After all changes:
1. Run `npm run build` — must pass
2. Visit `/this-page-does-not-exist` to see 404
3. Check mobile responsiveness
4. Check animations work smoothly
5. Check `prefers-reduced-motion` disables animations
