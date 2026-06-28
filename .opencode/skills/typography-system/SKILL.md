---
name: typography-system
description: Typography system for luxury/dark-themed web projects — font pairing, sizing, and implementation with next/font
tags: [typography, fonts, nextjs, design, ui]
---

# Typography System for Dark Luxury Web Projects

## Philosophy

Typography is 90% of web design. For dark luxury brands (jewelry, fashion, premium), the font pairing must convey:
- **Elegance** — refined letterforms with high contrast
- **Authority** — bold presence that commands attention
- **Readability** — body text must be effortless to read at all sizes

## Font Pairing Strategy

### Display Fonts (Headlines, Hero, Titles)

**Tier 1 — Maximum Impact (Luxury/Editorial):**
- **Playfair Display** — High contrast, dramatic serifs. Best for: hero titles, section headers
- **Bodoni Moda** — Extreme contrast, fashion-forward. Best for: high-fashion, editorial
- **Cormorant Garamond** — Elegant, lighter weight. Best for: refined, minimalist luxury

**Tier 2 — Modern Luxury:**
- **Instrument Serif** — Contemporary serif with character. Best for: modern brands
- **Fraunces** — Variable font, playful yet elegant. Best for: creative luxury
- **Newsreader** — Classic editorial feel. Best for: content-heavy luxury

**Tier 3 — Bold/Statement:**
- **Syne** — Geometric, artistic. Best for: avant-garde brands
- **Bricolage Grotesque** — Bold, distinctive. Best for: statement headlines

### Body Fonts (Paragraphs, UI, Captions)

**Tier 1 — Clean & Modern:**
- **Inter** — Neutral, highly readable. Best for: UI-heavy sites
- **DM Sans** — Geometric, friendly. Best for: approachable luxury
- **Sora** — Geometric, tech-forward. Best for: modern/futuristic

**Tier 2 — Refined:**
- **Source Sans 3** — Classic, professional. Best for: corporate luxury
- **Work Sans** — Versatile, clean. Best for: multi-purpose
- **Plus Jakarta Sans** — Contemporary, rounded. Best for: friendly luxury

**Tier 3 — Editorial:**
- **Lora** — Serif body for editorial feel. Best for: storytelling brands
- **Spectral** — Elegant serif body. Best for: high-end editorial

## Recommended Pairings for Dark Luxury

### Pairing 1: "Classic Elegance" (RECOMMENDED for jewelry/fashion)
- Display: **Playfair Display** (400, 700)
- Body: **DM Sans** (300, 400, 500, 600)
- Vibe: Timeless, sophisticated, high-end

### Pairing 2: "Modern Editorial"
- Display: **Bodoni Moda** (400, 700, 900)
- Body: **Inter** (300, 400, 500, 600)
- Vibe: Fashion magazine, bold, contemporary

### Pairing 3: "Refined Minimal"
- Display: **Cormorant Garamond** (300, 400, 600)
- Body: **Sora** (300, 400, 500, 600)
- Vibe: Understated luxury, clean, premium

### Pairing 4: "Creative Luxury"
- Display: **Fraunces** (variable)
- Body: **Plus Jakarta Sans** (300, 400, 500, 600)
- Vibe: Artistic, unique, memorable

## Implementation with next/font

```typescript
import { Playfair_Display, DM_Sans } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
})
```

In layout:
```tsx
<html className={`${playfair.variable} ${dmSans.variable}`}>
  <body className="font-sans">
```

In Tailwind v4:
```css
@theme {
  --font-playfair: var(--font-playfair);
  --font-dm-sans: var(--font-dm-sans);
}
```

## Type Scale (Tailwind v4)

```css
@theme {
  /* Display sizes */
  --text-display-xl: clamp(3.5rem, 8vw, 7rem);
  --text-display-lg: clamp(2.5rem, 5vw, 4.5rem);
  --text-display-md: clamp(2rem, 4vw, 3.5rem);
  --text-display-sm: clamp(1.5rem, 3vw, 2.5rem);
  
  /* Body sizes */
  --text-body-lg: 1.125rem;
  --text-body-base: 1rem;
  --text-body-sm: 0.875rem;
  --text-body-xs: 0.75rem;
  
  /* Letter spacing */
  --tracking-tight: -0.04em;
  --tracking-snug: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-wider: 0.1em;
  --tracking-widest: 0.25em;
}
```

## Usage Patterns

### Hero Title
```tsx
<h1 className="text-display-xl tracking-tight leading-[0.9] font-bold">
  Your Title Here
</h1>
```

### Section Heading
```tsx
<h2 className="text-display-md tracking-snug leading-tight">
  Section Title
</h2>
```

### Body Text
```tsx
<p className="text-body-base leading-relaxed text-[var(--color-muted)]">
  Body text here...
</p>
```

### Caption/Label
```tsx
<span className="text-body-xs uppercase tracking-widest text-[var(--color-gold)]">
  Label
</span>
```

## Pitfalls to Avoid

1. **Too many fonts** — Max 2 fonts per project (1 display + 1 body)
2. **Too many weights** — Use 2-3 weights max per font
3. **Missing font-display: swap** — Always use `display: "swap"` for performance
4. **Ignoring line-height** — Display: 0.9-1.05, Body: 1.6-1.8
5. **No letter-spacing adjustment** — Large titles need tighter tracking
6. **Using system fonts for display** — Always load a custom display font for luxury feel

## Performance Best Practices

- Use `next/font/google` — self-hosts fonts, zero layout shift
- Load only needed weights — each weight adds ~50-80KB
- Use `subsets: ["latin"]` unless multilingual needed
- Preload critical fonts in layout
- Use `variable` CSS custom properties for Tailwind integration

## Real-World Case Study

See `references/dubraska-mago-case-study.md` for a full migration example (Instrument Serif + Inter → Playfair Display + DM Sans across 94 components).

## Agent Invocation

See `references/opencode-agent-invocation.md` for the correct way to invoke the OpenCode frontend agent (critical: prompt goes as positional arg, not via `-f`).
