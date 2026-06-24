# TASK: Página de Preguntas Frecuentes — Dubraska Mago

Create a comprehensive, premium `/preguntas-frecuentes` page for the Dubraska Mago jewelry e-commerce site. This is a DARK LUXURY themed page with gold accents. The FAQ page should be interactive, animated, and feature-rich.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Project Context
- **Live**: https://dubraska-mago.vercel.app
- **Repo**: https://github.com/HermesKingsBot/dubraska-mago
- **Stack**: Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript + GSAP + Framer Motion
- **Existing pages**: Home (/), Catalog (/catalog), Contact (/contacto), About (/nosotros)

## Design System
- **Colors**: `--color-bg: #050505`, `--color-gold: #D4AF37`, `--color-muted: #8A8A8A`, `--color-white: #FFFFFF`, `--color-rose: #E8B4B8`
- **Fonts**: Instrument Serif (display/headings via `var(--font-instrument-serif)`), Inter (body via `var(--font-inter)`)
- **Style**: Dark Luxury — deep blacks, 18k gold accents, premium feel
- **Animations**: GSAP for scroll animations, Framer Motion for micro-interactions
- **Mobile-first**: Responsive design

## What to Create

### 1. `src/app/preguntas-frecuentes/layout.tsx`
- Metadata: title "Preguntas Frecuentes | Dubraska Mago", Spanish SEO description about common questions regarding jewelry, shipping, materials, etc.
- Root layout wrapper

### 2. `src/app/preguntas-frecuentes/page.tsx`
- Server Component (no "use client")
- Imports and renders `FAQClient` from `./FAQClient`

### 3. `src/app/preguntas-frecuentes/FAQClient.tsx`
Main client component ("use client") containing all features:

#### Section 1: Hero
- Large headline: "Preguntas Frecuentes" with gold gradient on "Frecuentes"
- Subtitle: "Todo lo que necesitas saber sobre nuestras piezas"
- GSAP text reveal animation
- Decorative gold line divider

#### Section 2: Search Bar
- A premium search input at the top of the FAQ section
- Placeholder: "Buscar pregunta..."
- Search icon (inline SVG, gold color)
- Real-time filtering: filters questions by BOTH title AND answer content
- GSAP focus animation (border glow)
- Clear button (X) when there's text, to reset search
- If no results found: show a friendly message with icon

#### Section 3: FAQ Accordion (10 Questions)
An accordion with 10 questions. Each item has:
- Question title (clickable, with chevron icon that rotates on open)
- Answer content (expands/collapses with smooth GSAP height animation)
- **Copy button**: Small icon button next to the question that copies the question text to clipboard (with brief "✓ Copiado!" feedback)
- **Thumbs up/down buttons**: Two small buttons below each answer:
  - 👍 "¿Fue útil?" (thumbs up) — gold highlight when selected
  - 👎 "No me ayudó" (thumbs down) — muted highlight when selected
  - Only one can be selected per question (toggle behavior)
  - Show a small counter or visual feedback

The 10 questions (in Spanish, Venezuelan style):

1. **¿De qué material están hechas las piezas?**
   → Todas nuestras piezas están hechas de acero inoxidable 316L bañado en oro 18K. Es un material hipogénico, resistente a la corrosión y perfecto para uso diario sin perder el brillo.

2. **¿Las piezas se ponen negras o se despintan con el tiempo?**
   → No. El baño en oro 18K de alta calidad mantiene su color y brillo durante años con los cuidados adecuados. Evitamos el contacto con químicos fuertes, perfumes y cloro para prolongar su vida útil.

3. **¿Hacen envíos a todo el país?**
   → Sí, realizamos envíos a toda Venezuela a través de MRW, Zoom y Domesa. El tiempo de entrega varía entre 2 a 7 días hábiles según la zona.

4. **¿Cuánto cuesta el envío?**
   → El costo del envío depende del destino y la agencia seleccionada. Los precios van desde $3 hasta $8 para envíos nacionales. Envíos gratis en compras superiores a $100.

5. **¿Puedo devolver o cambiar una pieza?**
   → Sí, aceptamos devoluciones dentro de los primeros 7 días posteriores a la recepción, siempre que la pieza esté sin usar y en su empaque original. Los cambios por talla o defecto son sin costo.

6. **¿Ofrecen garantía en las piezas?**
   → Todas nuestras piezas tienen garantía de 6 meses contra defectos de fabricación. Si presenta algún problema, te reponemos la pieza sin costo adicional.

7. **¿Hacen piezas personalizadas?**
   → ¡Sí! Trabajamos con diseños personalizados. Envíanos tu idea o referencia y te enviamos una cotización en 24-48 horas. Perfecto para regalos especiales o piezas únicas.

8. **¿Cómo cuido mis piezas para que duren más?**
   → Guárdalas en su empaque original o en una bolsa suave. Evita contacto con agua salada, cloro, perfumes y cremas. Límpialas con un paño seco de microfibra después de cada uso.

9. **¿Tienen tienda física o solo venden online?**
   → Actualmente operamos 100% online, lo que nos permite ofrecer precios más competitivos sin sacrificar calidad. Puedes seguirnos en Instagram para ver nuestras piezas en vivo.

10. **¿Cómo puedo hacer un pedido?**
    → Puedes hacer tu pedido directamente por WhatsApp, Instagram o a través de nuestro catálogo online. Aceptamos pagos por transferencia, Zelle, PayPal o efectivo contra entrega (según zona).

#### Section 4: CTA Banner (Premium)
A full-width banner at the bottom:
- Headline: "¿Tienes más dudas?" with gold gradient
- Subtitle: "Escríbenos por WhatsApp y te respondemos al instante"
- WhatsApp CTA button with gold gradient + icon
- GSAP ScrollTrigger: banner scales up from 0.9 to 1, opacity 0 to 1
- Subtle gold particles animation (8-10 floating dots)
- Background: dark with subtle radial gold glow

## Technical Notes
- Use `"use client"` for FAQClient.tsx
- Import gsap and useGSAP hook
- Use `gsap.context()` for cleanup
- Use `gsap.matchMedia()` for responsive animations
- Respect `prefers-reduced-motion`: add reduced-motion query to disable all animations
- All text in Spanish (Venezuelan style, use "tú" not "vos")
- Use CSS variables for colors, don't hardcode hex values
- Next.js 15 App Router conventions
- No backend code, no API routes — purely frontend
- For clipboard copy: use `navigator.clipboard.writeText()` with fallback
- For thumbs state: use React useState with an object or Map to track each question's feedback
- For search: filter questions array based on query matching in both question and answer text (case-insensitive)
- For accordion: use GSAP.to for height animation on open/close, or use CSS max-height transition with GSAP for smoother effect

## Steps to Follow
1. Create `src/app/preguntas-frecuentes/layout.tsx`
2. Create `src/app/preguntas-frecuentes/page.tsx`
3. Create `src/app/preguntas-frecuentes/FAQClient.tsx` with all 4 sections
4. Run `npm run build` to verify no TypeScript/import errors
5. If build fails, fix all errors and rebuild
6. Do NOT deploy — that's Hermes' job
7. Report back: what files were created, features implemented, build result

## Important Constraints
- DO NOT modify any existing files
- Only create NEW files under `src/app/preguntas-frecuentes/`
- Keep the same design language as the rest of the site
- The page should feel PREMIUM, not generic
- GSAP ScrollTrigger should be used for entrance animations
- Use Instrument Serif for all headings, Inter for body text
- All animations must respect prefers-reduced-motion
- Search must filter by BOTH question title AND answer content
- Copy button must show visual feedback ("✓ Copiado!") for 2 seconds
- Thumbs up/down must be mutually exclusive per question
