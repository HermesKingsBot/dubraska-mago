# TASK: Página de Contacto — Dubraska Mago

Create a premium `/contacto` page for the Dubraska Mago jewelry e-commerce site. This is a DARK LUXURY themed page with gold accents.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## What to Create

### 1. `src/app/contacto/layout.tsx`
Metadata + layout for the contact page. Title: "Contacto | Dubraska Mago". Include Spanish SEO description.

### 2. `src/app/contacto/page.tsx`
Server Component. Renders the ContactClient component.

### 3. `src/app/contacto/ContactClient.tsx`
Main client component ("use client") containing all sections:

#### Section 1: Hero Contact
- Large animated headline "Hablemos" with gold gradient
- Subtitle about custom pieces and inquiries
- GSAP text reveal animation on scroll

#### Section 2: Contact Cards (Premium Cards)
Display contact methods as premium cards in a responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop). Each card has:
- Icon (use inline SVGs or emoji-style icons)
- Platform name (Instagram, WhatsApp, Facebook, Email)
- Username/handle
- Description
- CTA button linking to the platform
- GSAP staggered entrance animation
- Hover effects with gold glow border

Cards to include:
1. **Instagram** — @dubraska.mago (or similar) — "Síguenos para ver nuevas piezas" — Link to Instagram
2. **WhatsApp** — "+58 412 XXX XXXX" (placeholder) — "Escríbenos para pedidos personalizados" — Link to wa.me
3. **Facebook** — "Dubraska Mago" — "Síguenos en Facebook" — Link to Facebook page
4. **Email** — "hola@dubraskamago.com" (placeholder) — "Para consultas y colaboraciones" — mailto link

#### Section 3: Contact Form
A premium dark contact form with:
- Name (required)
- Email (required)
- Phone (optional)
- Subject dropdown (Pedido personalizado, Consulta, Colaboración, Otro)
- Message textarea (required)
- Submit button with gold gradient
- GSAP focus animations on inputs
- Success/error state after submission (just show success message, no backend)
- Form validation (client-side)

#### Section 4: Map with Leaflet
- Embedded Leaflet map showing a location in Venezuela (use Caracas coordinates: 10.4806, -66.9036 as placeholder, or ask user to update)
- Dark-themed map tiles (use CartoDB dark tiles)
- Custom gold marker
- Map section with heading "Nuestra Ubicación"
- Responsive height (400px mobile, 500px desktop)
- IMPORTANT: Leaflet CSS must be imported in globals.css or inline. Map container must have explicit height.

#### Section 5: Premium CTA (Super Animated)
An incredible animated CTA section at the bottom:
- Large headline: "¿Listo para lucir algo único?"
- Subtitle about limited pieces
- Animated gold particles/shimmer effect using GSAP
- Pulsing CTA button linking to WhatsApp
- Background with subtle gold gradient animation
- GSAP ScrollTrigger entrance: scale from 0.8 to 1, opacity 0 to 1
- Floating particles animation (at least 10 dots moving randomly)
- Button hover: glow effect + scale up

## Design Specs
- **Colors**: bg #050505, gold #D4AF37, muted #8A8A8A, white #FFFFFF, rose #E8B4B8
- **Fonts**: Instrument Serif (display/headings), Inter (body)
- **Cards**: Dark background (#0A0A0A or #111), subtle border, gold border on hover
- **Animations**: GSAP for all scroll animations, Framer Motion for micro-interactions
- **Responsive**: Mobile-first
- **Accessibility**: prefers-reduced-motion respected

## Technical Notes
- Use `"use client"` for ContactClient.tsx
- Import Leaflet CSS in globals.css: `@import 'leaflet/dist/leaflet.css';`
- For Leaflet map, use dynamic import with `ssr: false` to avoid window undefined errors
- GSAP with `useGSAP` hook and `gsap.context()` for cleanup
- `gsap.matchMedia()` for responsive animations
- All text in Spanish (Venezuelan style, use "tú" not "vos")

## Steps
1. Create `src/app/contacto/layout.tsx`
2. Create `src/app/contacto/page.tsx`
3. Create `src/app/contacto/ContactClient.tsx` with all sections
4. Add Leaflet CSS import to `src/app/globals.css`
5. Create `src/components/contact/ContactMap.tsx` (dynamic import for Leaflet map, ssr: false)
6. Test build with `npm run build`
7. If build fails, fix TypeScript/import errors
8. Do NOT deploy — that's Hermes' job

## Important
- The Leaflet map MUST work with SSR. Use dynamic import: `const MapComponent = dynamic(() => import('@/components/contact/ContactMap'), { ssr: false })`
- All GSAP animations must respect `prefers-reduced-motion`
- Cards should have staggered entrance animations (gsap.fromTo with stagger)
- The final CTA should be visually stunning — this is the climax of the page
