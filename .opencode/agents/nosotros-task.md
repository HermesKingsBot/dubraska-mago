# TASK: Página de Nosotros — Dubraska Mago

Create a comprehensive, premium `/nosotros` page for the Dubraska Mago jewelry e-commerce site. This is a DARK LUXURY themed page with gold accents. The page should tell the complete story of the brand.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Project Context
- **Live**: https://dubraska-mago.vercel.app
- **Repo**: https://github.com/HermesKingsBot/dubraska-mago
- **Stack**: Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript + GSAP + Framer Motion
- **Existing pages**: Home (/) with 8 sections, Catalog (/catalog)

## Design System
- **Colors**: `--color-bg: #050505`, `--color-gold: #D4AF37`, `--color-muted: #8A8A8A`, `--color-white: #FFFFFF`, `--color-rose: #E8B4B8`
- **Fonts**: Instrument Serif (display/headings via `var(--font-instrument-serif)`), Inter (body via `var(--font-inter)`)
- **Logo**: assets/logo.png — bottom-right corner of every image
- **Style**: Dark Luxury — deep blacks, 18k gold accents, premium feel, minimalist
- **Animations**: GSAP for scroll animations, Framer Motion for micro-interactions
- **Mobile-first**: Responsive design

## What to Create

### 1. `src/app/nosotros/layout.tsx`
- Metadata: title "Nuestra Historia | Dubraska Mago", Spanish SEO description about the brand's story, craftsmanship, and Venezuelan roots
- Root layout wrapper

### 2. `src/app/nosotros/page.tsx`
- Server Component (no "use client")
- Imports and renders `NosotrosClient` from `./NosotrosClient`

### 3. `src/app/nosotros/NosotrosClient.tsx`
Main client component ("use client") containing ALL these sections:

#### Section 1: Hero Story
- Full-width hero with large headline: "Nuestra Historia"
- Gold gradient on "Historia"
- Subtitle: A compelling line about craftsmanship and timeless beauty
- GSAP text reveal animation (letters or words appearing)
- Decorative gold line divider animated

#### Section 2: Brand Origin Story
- Two-column layout (stacked on mobile):
  - Left: Narrative text about the founder (Dubraska Mago), how the brand started, inspiration, vision
  - Right: Placeholder for brand image (use a div with gold border and "Imagen de la marca" as placeholder, or use Next Image if there's a placeholder image)
- GSAP ScrollTrigger: left column slides from left, right column slides from right
- Text about passion for jewelry, Venezuelan heritage, commitment to quality

#### Section 3: Mission & Values
- Three premium cards in a row (1 col mobile, 3 cols desktop):
  1. **Misión** — What the brand stands for
  2. **Visión** — Where the brand is going  
  3. **Filosofía** — The design philosophy (minimal, timeless, personal)
- Each card has an icon (inline SVG), title, description
- GSAP staggered entrance animation (cards appear one by one with delay)
- Gold border accent on each card

#### Section 4: Process / Craftsmanship
- Section title: "Nuestro Proceso" with gold decorative line
- 4-step visual timeline/process (horizontal on desktop, vertical on mobile):
  1. **Diseño** — Sketch and concept
  2. **Selección** — Choose premium materials (18K gold-plated stainless steel)
  3. **Creación** — Handcrafted assembly
  4. **Entrega** — Packaged with care
- Each step has icon, title, short description
- GSAP animation: reveal on scroll, connecting line between steps
- Background subtle gold gradient pulse

#### Section 5: Stats / Numbers
- Full-width dark section with 4 animated counters:
  - **+500** Clientes satisfechos
  - **+1,000** Piezas creadas
  - **100%** Acero inoxidable premium
  - **+3** Años de experiencia
- GSAP: numbers count up from 0 to target on ScrollTrigger
- Gold accent numbers, white labels
- Animation triggers when section enters viewport

#### Section 6: Values / What Makes Us Different
- Grid of 6 value propositions (2 cols tablet, 3 cols desktop):
  1. **Materiales Premium** — Stainless steel 18K gold plated
  2. **Diseño Atemporal** — Pieces that never go out of style
  3. **Hecho con Amor** — Handcrafted with care
  4. **Envío Seguro** — Protected packaging
  5. **Garantía** — Satisfaction guaranteed
  6. **Atención Personalizada** — Custom pieces available
- Each with icon, title, 1-line description
- GSAP staggered entrance animation
- Cards have subtle hover lift effect

#### Section 7: CTA Section (Premium Animated)
- Large headline: "¿Quieres ser parte de nuestra historia?"
- Subtitle: About joining the community, getting exclusive access
- Three CTA buttons (horizontal on desktop, stacked on mobile):
  1. **Ver Colección** — gold gradient button, links to /catalog
  2. **Contactar** — outlined gold button, links to /contacto
  3. **Instagram** — outlined gold button, links to Instagram
- GSAP ScrollTrigger: section scales up, fade in
- Subtle gold particles animation (8-10 dots floating)
- Background: radial gold gradient pulse

## Technical Notes
- Use `"use client"` for NosotrosClient.tsx
- Import gsap and useGSAP hook
- Use `gsap.context()` for cleanup in effects
- Use `gsap.matchMedia()` for responsive animations
- Respect `prefers-reduced-motion`: add reduced-motion query to disable all animations
- All text in Spanish (Venezuelan style, use "tú" not "vos")
- Use CSS variables for colors, don't hardcode hex values
- Next.js 15 App Router conventions
- No backend code, no API routes — purely frontend

## Steps to Follow
1. Create `src/app/nosotros/layout.tsx`
2. Create `src/app/nosotros/page.tsx`
3. Create `src/app/nosotros/NosotrosClient.tsx` with all 7 sections
4. Run `npm run build` to verify no TypeScript/import errors
5. If build fails, fix all errors and rebuild
6. Do NOT deploy — that's Hermes' job
7. Report back: what files were created, sections implemented, build result

## Important Constraints
- DO NOT modify any existing files (page.tsx, layout.tsx in root, components, etc.)
- Only create NEW files under `src/app/nosotros/`
- Keep the same design language as the rest of the site
- The page should feel PREMIUM, not generic
- GSAP ScrollTrigger should be used for entrance animations
- Use Instrument Serif for all headings, Inter for body text
- All animations must respect prefers-reduced-motion
