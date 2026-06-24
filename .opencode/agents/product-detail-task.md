# TASK: Página de Detalle de Producto — Dubraska Mago

Create a comprehensive, premium `/producto/[slug]` dynamic page for the Dubraska Mago jewelry e-commerce site. This is a DARK LUXURY themed page with gold accents. This is THE most important page — it must convert visitors into buyers.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Project Context
- **Live**: https://dubraska-mago.vercel.app
- **Repo**: https://github.com/HermesKingsBot/dubraska-mago
- **Stack**: Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript + GSAP + Framer Motion
- **Existing pages**: Home (/), Catalog (/catalog), Contact (/contacto), About (/nosotros), FAQ (/preguntas-frecuentes), Policies (/politicas-cambios-devoluciones)

## Design System
- **Colors**: `--color-bg: #050505`, `--color-gold: #D4AF37`, `--color-muted: #8A8A8A`, `--color-white: #FFFFFF`, `--color-rose: #E8B4B8`
- **Fonts**: Instrument Serif (display/headings via `var(--font-instrument-serif)`), Inter (body via `var(--font-inter)`)
- **Style**: Dark Luxury — deep blacks, 18k gold accents, premium feel
- **Animations**: GSAP for scroll animations, Framer Motion for micro-interactions
- **Mobile-first**: Responsive design

## Data Source

All product data comes from `data/products.json` (read with fs/promises in Server Component).

Product interface (from `src/types/product.ts`):
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  category: string;
  color: string;
  badge: string | null;
  image: string;
  material: string;
  length?: string;
  diameter?: string;
  weight?: string;
  pieces?: number;
  inStock: boolean;
  featured: boolean;
  // NEW fields added:
  gallery: string[];
  waterResistant: boolean;
  details: string;
  careInstructions: string;
  dimensions: string;
  relatedIds: string[];
}
```

## What to Create

### 1. `src/app/producto/[slug]/layout.tsx`
- Shared layout for all product detail pages
- Metadata with template: `%s | Dubraska Mago`
- Root layout wrapper

### 2. `src/app/producto/[slug]/page.tsx`
- **Server Component** with `generateStaticParams` and `generateMetadata`
- `generateStaticParams`: read all products from data/products.json, return `{ slug: product.slug }` for each
- `generateMetadata`: find the product by slug, return title and description
- Main render: find product by slug, pass to `ProductDetailClient`
- If product not found: return a "Producto no encontrado" fallback with link to catalog

### 3. `src/app/producto/[slug]/ProductDetailClient.tsx`
Main client component ("use client") containing ALL features:

#### Section 1: Image Gallery with Zoom
- **Main image area**: Large image (400-500px height) showing the selected photo
- **Zoom on hover**: When user hovers over the main image, show a magnified view (use GSAP for pan tracking, or a simple scale transform with mouse position tracking)
- **Thumbnail strip**: 4 small images below (80-100px each), clicking changes the main image
- **Active thumbnail**: Gold border around selected thumb
- GSAP animation: gallery entrance fade-in + scale
- Use placeholder divs with gradient backgrounds since we don't have real images yet

Gallery images order:
1. Main product shot (front/flat lay)
2. Detail shot (material texture close-up)
3. Worn/model shot (to see real size)
4. Size reference shot

#### Section 2: Product Info (Right side on desktop, below on mobile)
- **Product name**: Large, Instrument Serif, gold accent
- **Badge** (if exists): Use badge styling from catalog (SÚPER VENDIDO, NUEVO, etc.)
- **Category label**: Small muted text above name
- **Price**: Large gold number. If oldPrice exists, show old price strikethrough + new price + discount badge
- **Color indicator**: Small colored dot + color name (Dorado, Plateado, Rosé, Negro)
- **Material**: Text showing material (Acero inoxidable + Oro 18K)
- **Dimensions**: Show length/diameter and weight
- **Water resistant**: Small badge with shield icon ✓

#### Section 3: Description & Details
- Expandable section with title "Descripción"
- Rich description text from product.details
- Below: "Especificaciones" table:
  - Material
  - Medidas
  - Peso
  - Resistencia al agua: Sí
  - Categoría
  - Color
  - Garantía: 6 meses

#### Section 4: Add to Cart / CTA Area (Sticky on desktop right side)
- **Quantity selector**: + / - buttons with number display
- **WhatsApp CTA button**: Large gold gradient button "Consultar por WhatsApp"
  - Links to wa.me with pre-filled message: "Hola! Me interesa [producto] - [precio]. ¿Está disponible?"
- **Stock status**: Green dot + "Disponible" or red dot + "Agotado"
- GSAP: button has subtle pulse animation to attract attention

#### Section 5: Care Instructions
- Collapsible section with "Cuidados" title
- Icon + text showing product.careInstructions
- Small tips with bullet points

#### Section 6: Shipping & Returns Info
- Three mini-cards (horizontal on desktop, vertical on mobile):
  1. 🚚 Envío: "Envío gratis en compras +$100"
  2. ↩️ Devoluciones: "7 días para devolver"
  3. 🛡️ Garantía: "6 meses de garantía"
- Each with icon, title, short description
- GSAP staggered entrance

#### Section 7: Related Products
- Section title: "También te puede gustar" with gold accent
- Fetch related products using product.relatedIds (map IDs back to product objects from data/products.json)
- Show 3 products in a row using the same ProductCard component from catalog
- If no related products, show 3 random products from same category
- GSAP staggered entrance animation

## Technical Notes
- Use `"use client"` for ProductDetailClient.tsx
- Import Product type from `@/types/product`
- Import ProductCard from the catalog (reuse the existing component if possible: `@/components/catalog/ProductCard`)
- For data access in client component: receive as props from Server Component
- Import gsap and useGSAP hook
- Use `gsap.context()` for cleanup
- Use `gsap.matchMedia()` for responsive animations
- Respect `prefers-reduced-motion`
- All text in Spanish (Venezuelan style, use "tú")
- Use CSS variables for colors
- Next.js 15 App Router conventions with dynamic `[slug]` route
- Use `generateStaticParams` for SSG (static generation of all product pages)
- For image zoom: use `onMouseMove` handler to track cursor position and apply `transform-origin` or use GSAP for pan effect
- No backend code — purely frontend

## Steps to Follow
1. Read `data/products.json` to understand current product structure
2. Read `src/app/colecciones/CatalogClient.tsx` and `src/components/catalog/ProductCard.tsx` to understand existing patterns
3. Create `src/app/producto/[slug]/layout.tsx`
4. Create `src/app/producto/[slug]/page.tsx` (Server Component with generateStaticParams + generateMetadata)
5. Create `src/app/producto/[slug]/ProductDetailClient.tsx` with all 7 sections
6. Run `npm run build` to verify no TypeScript/import errors
7. If build fails, fix all errors and rebuild
8. Do NOT deploy — that's Hermes' job
9. Report back: what files were created, features implemented, build result

## Important Constraints
- DO NOT modify any existing files
- Only create NEW files under `src/app/producto/[slug]/`
- Keep the same design language as the rest of the site
- The page should feel PREMIUM and CONVERT — this is the money page
- GSAP ScrollTrigger should be used for entrance animations
- Use Instrument Serif for all headings, Inter for body text
- All animations must respect prefers-reduced-motion
- Image zoom must work smoothly on desktop (mobile can skip zoom or use pinch)
- Related products must reuse the ProductCard component for consistency
- Route MUST use `[slug]` not `[id]` — products are accessed by slug
- generateStaticParams is required so all 20 products have static pages at build time
