# TASK: Página de Políticas de Cambios y Devoluciones — Dubraska Mago

Create a comprehensive, premium `/politicas-cambios-devoluciones` page for the Dubraska Mago jewelry e-commerce site. This is a DARK LUXURY themed page with gold accents. This page should feel like a premium legal/trust page — not boring or generic.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Project Context
- **Live**: https://dubraska-mago.vercel.app
- **Repo**: https://github.com/HermesKingsBot/dubraska-mago
- **Stack**: Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript + GSAP + Framer Motion
- **Existing pages**: Home (/), Catalog (/catalog), Contact (/contacto), About (/nosotros), FAQ (/preguntas-frecuentes)

## Design System
- **Colors**: `--color-bg: #050505`, `--color-gold: #D4AF37`, `--color-muted: #8A8A8A`, `--color-white: #FFFFFF`, `--color-rose: #E8B4B8`
- **Fonts**: Instrument Serif (display/headings via `var(--font-instrument-serif)`), Inter (body via `var(--font-inter)`)
- **Style**: Dark Luxury — deep blacks, 18k gold accents, premium feel
- **Animations**: GSAP for scroll animations, Framer Motion for micro-interactions
- **Mobile-first**: Responsive design

## What to Create

### 1. `src/app/politicas-cambios-devoluciones/layout.tsx`
- Metadata: title "Políticas de Cambios y Devoluciones | Dubraska Mago", Spanish SEO description
- Root layout wrapper

### 2. `src/app/politicas-cambios-devoluciones/page.tsx`
- Server Component (no "use client")
- Imports and renders `PoliticasClient` from `./PoliticasClient`

### 3. `src/app/politicas-cambios-devoluciones/PoliticasClient.tsx`
Main client component ("use client") containing all sections:

#### Section 1: Hero
- Large headline: "Políticas de Cambios y Devoluciones" with gold gradient on key words
- Subtitle: "Tu satisfacción y confianza son nuestra prioridad"
- GSAP text reveal animation
- Decorative gold line divider
- Small badge: "Última actualización: Junio 2026"

#### Section 2: Política de Devoluciones (Returns Policy)
A premium card/section with:
- Section title with icon (↩️ or similar)
- Content blocks:

**Plazo de Devolución:**
- Tienes **7 días calendario** desde la recepción del producto para solicitar un cambio o devolución.

**Condiciones:**
- La pieza debe estar sin usar, sin marcas de uso, en su empaque original y con todas las etiquetas intactas.
- El producto debe venir con el mismo empaque de entrega (bolsa de terciopelo, caja, etc.).

**¿Cómo solicitar una devolución?**
- Envía un mensaje a nuestro WhatsApp con tu número de pedido y el motivo.
- Te enviaremos la dirección de envío y las instrucciones.
- Una vez recibida la pieza y verificado su estado, procesamos el reembolso en 3-5 días hábiles.

**Costos de envío de devolución:**
- Si la devolución es por defecto nuestro: nosotros cubrimos el envío.
- Si es por cambio de opinión: el cliente cubre el costo de envío de retorno.

#### Section 3: Política de Cambios (Exchanges Policy)
Another premium card/section:
- Section title with icon (🔄)

**Cambio por defecto de fabricación:**
- Si tu pieza llega con un defecto de fabricación (no por uso), te la cambiamos sin costo.
- Debes reportarlo dentro de las primeras 48 horas después de recibir el producto.
- Envía fotos o video del defecto a nuestro WhatsApp.

**Cambio por talla o modelo:**
- Si necesitas una talla diferente o quieres cambiar por otro modelo:
  - Tienes 7 días para solicitarlo.
  - La pieza debe estar en condiciones originales.
  - El cliente cubre el envío de retorno; nosotros cubrimos el envío de la nueva pieza.

#### Section 4: ⚠️ Higiene — Aclaración Importante (CRITICAL SECTION)
This section should be visually distinct — use a subtle red/warning accent or a bordered card:

**Sobre cambios por higiene (Aretes, Zarcillos y Piercings):**
- Por motivos de **higiene y salud**, **no aceptamos devoluciones ni cambios de aretes, zarcillos, piercings o cualquier pieza que se introduzca en la oreja o cuerpo.**
- Una vez abiertos o usados, estos artículos no pueden ser revendidos ni reutilizados por razones sanitarias.
- **Excepción:** Si la pieza llega defectuosa de fábrica (cierre roto, pieza torcida, etc.), sí procede el cambio sin costo. Debe reportarse en las primeras 48 horas con fotos.

**Recomendación:**
- Revisa bien la pieza al recibirla. Si tienes alguna duda sobre el modelo o tamaño, contáctanos antes de usarla.

#### Section 5: ¿Qué pasa si mi pieza llega rota por el envío? (CRITICAL SECTION)
Another visually distinct section with a shield/protection icon:

**Daños durante el envío:**
- Si tu paquete llega visiblemente dañado en el exterior (caja aplastada, rota, mojada):
  1. **No lo recibas** o documenta el daño con fotos/video en el momento de la entrega.
  2. **Contáctanos inmediatamente** por WhatsApp con fotos del empaque y la pieza.
  3. **Nos haremos cargo al 100%** — te enviaremos una pieza nueva sin costo o te reembolsaremos completamente.

**Proceso para piezas dañadas:**
- Envía evidencia fotográfica dentro de las primeras 24 horas.
- Verificamos el caso (puede tomar 1-2 días hábiles).
- Te enviamos un reemplazo o procesamos el reembolso completo.
- **No necesitas devolver la pieza dañada** — quésela como evidencia.

**Nuestra promesa:**
- Cada pieza sale de nuestro taller con empaque protector diseñado para el transporte. Si llega dañada, es responsabilidad del transportista y nosotros respondemos por ti.

#### Section 6: Reembolsos
- Section title with icon (💰)
- Métodos de reembolso: transferencia bancaria, Zelle, PayPal
- Tiempo: 3-5 días hábiles después de aprobar la devolución
- El reembolso incluye el precio del producto (no el envío original, a menos que el error sea nuestro)

#### Section 7: CTA Banner — "¿Necesitas ayuda con tu pedido?"
A premium animated CTA section:
- Headline: "¿Necesitas ayuda con tu pedido?" with gold gradient
- Subtitle: "Nuestro equipo está listo para resolver cualquier duda sobre cambios o devoluciones"
- Two CTA buttons:
  1. **Escribir por WhatsApp** — gold gradient button, links to WhatsApp
  2. **Ver Preguntas Frecuentes** — outlined gold button, links to /preguntas-frecuentes
- GSAP ScrollTrigger: scale + fade entrance
- Floating gold particles (8-10)
- Background: subtle radial gold glow

## Technical Notes
- Use `"use client"` for PoliticasClient.tsx
- Import gsap and useGSAP hook
- Use `gsap.context()` for cleanup
- Use `gsap.matchMedia()` for responsive animations
- Respect `prefers-reduced-motion`
- All text in Spanish (Venezuelan style, use "tú" not "vos")
- Use CSS variables for colors
- Next.js 15 App Router conventions
- No backend code — purely frontend

## Steps to Follow
1. Create `src/app/politicas-cambios-devoluciones/layout.tsx`
2. Create `src/app/politicas-cambios-devoluciones/page.tsx`
3. Create `src/app/politicas-cambios-devoluciones/PoliticasClient.tsx` with all 7 sections
4. Run `npm run build` to verify no TypeScript/import errors
5. If build fails, fix all errors and rebuild
6. Do NOT deploy — that's Hermes' job
7. Report back: what files were created, sections implemented, build result

## Important Constraints
- DO NOT modify any existing files (including Footer.tsx)
- Only create NEW files under `src/app/politicas-cambios-devoluciones/`
- Keep the same design language as the rest of the site
- The page should feel PREMIUM and TRUSTWORTHY — not like a boring legal page
- GSAP ScrollTrigger should be used for entrance animations
- Use Instrument Serif for all headings, Inter for body text
- All animations must respect prefers-reduced-motion
- The hygiene section and damaged shipping section should be visually distinct (use accent colors, borders, or icons)
- Make it feel professional but on-brand
