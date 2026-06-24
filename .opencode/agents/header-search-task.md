# TASK: Global Layout + Search Header + Footer on All Pages

## Problem
Currently only the Home page has NavigationBar and Footer. All other pages (catalog, contact, about, FAQ, policies, product detail) are missing header and footer. Also the NavigationBar is not sticky/fixed and has no search functionality.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (always apply)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY
- NO comments
- `export default ComponentName` at end
- 2-space indentation
- Function components with `React.JSX.Element` return type
- Use `var(--color-*)` or OKLCH for all colors

## What to Do

### 1. Update Root Layout (`src/app/layout.tsx`)

Move NavigationBar and Footer INTO the RootLayout so they appear on EVERY page.

```tsx
import type { Metadata } from "next"
import { Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"
import NavigationBar from "@/components/NavigationBar"
import Footer from "@/components/Footer"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dubraska Mago® | Joyería de Lujo",
  description:
    "Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y hechas para tu día a día.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="bg-[var(--color-bg)] text-white antialiased">
        <NavigationBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### 2. Rewrite NavigationBar (`src/components/NavigationBar.tsx`)

Transform it into a STICKY premium header with integrated search.

**Features:**
- **Sticky/Fixed**: Header stays at top while scrolling. Use `fixed top-0 left-0 right-0 z-50`
- **Background transition**: Transparent at top, becomes `bg-[var(--color-bg)]/95 backdrop-blur-md` after scrolling 20px
- **Logo**: "DUBRASKA MAGO®" — links to /
- **Nav links**: Inicio, Colecciones, Nosotros, Preguntas Frecuentes, Contacto
- **Search button/icon**: A magnifying glass icon (SVG) that opens a full-screen search overlay
- **Mobile menu**: Hamburger icon for mobile with slide-in menu

**Search Overlay (full-screen modal):**
When clicking the search icon, show a full-screen overlay:

1. **Search input** at the top: Large centered input with autofocus
   - Placeholder: "Buscar productos, categorías..."
   - Search icon on left, X (close) on right
   - Input has gold border on focus

2. **Suggestions dropdown** below the input:
   - Trigger after minimum 2 characters
   - Debounce: 300ms (professional, not too fast/slow)
   - Match against product names AND categories
   - Match priority: starts-with first, then contains
   - Each suggestion shows: product/category name with the **matched text highlighted** (gold bold)
   - Clicking a suggestion navigates to the product page or catalog with category filter

3. **Results preview** area:
   - Show up to 8 matching products as small cards (image placeholder + name + price)
   - Show categories that match (chips/badges)
   - If no results: show "No se encontraron resultados para [query]" with icon

4. **Footer of overlay**: "Presiona ESC para cerrar" hint

5. **Keyboard navigation**: Up/down arrows to navigate suggestions, Enter to select, Escape to close

**Search Data:**
- Import products from `data/products.json` (static, ~20 products)
- Search fields: `name`, `category`
- For categories: match against category name (collares, pulseras, aretes, sets)
- Highlight logic: wrap matched characters in `<span className="text-[var(--color-gold)] font-semibold">`

**Search Logic:**
```typescript
function searchProducts(query: string, products: Product[]) {
  if (query.length < 2) return { products: [], categories: [] }

  const q = query.toLowerCase()
  const matchedProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      // Prioritize starts-with matches
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1
      return aStarts - bStarts
    })
    .slice(0, 8)

  const matchedCategories = CATEGORIES.filter(c =>
    c.label.toLowerCase().includes(q)
  )

  return { products: matchedProducts, categories: matchedCategories }
}
```

**Highlight function:**
```typescript
function highlightMatch(text: string, query: string): React.JSX.Element {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--color-gold)] font-semibold">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}
```

**CSS/Animation:**
- Overlay entrance: GSAP fade-in (opacity 0→1) + slight scale (0.98→1)
- Suggestions entrance: GSAP staggered fade-up (each item 50ms delay)
- Header background transition: smooth CSS `transition-all duration-300`
- Use `gsap.context()` for cleanup

**Mobile:**
- Full search overlay on mobile
- Hamburger menu for nav links (slide from right)
- Search icon always visible in mobile header

### 3. Remove NavigationBar & Footer from Home Page

Since they are now in the RootLayout, remove them from `src/app/page.tsx`:
- Remove NavigationBar import and `<NavigationBar />` from the hero section
- Remove Footer import and `<Footer />` at the bottom
- The hero section should still have its background/video, just without the NavigationBar inside it

### 4. Remove NavigationBar & Footer from ALL Other Pages

Check and remove any NavigationBar or Footer imports/renders from:
- `src/app/colecciones/CatalogClient.tsx`
- `src/app/contacto/ContactClient.tsx`
- `src/app/nosotros/NosotrosClient.tsx`
- `src/app/preguntas-frecuentes/FAQClient.tsx`
- `src/app/politicas-cambios-devoluciones/PoliticasClient.tsx`
- `src/app/producto/[slug]/ProductDetailClient.tsx`

### 5. Update Footer Links

Make sure Footer links are correct:
- "Cambios y devoluciones" → `/politicas-cambios-devoluciones`
- "Preguntas frecuentes" → `/preguntas-frecuentes`
- "Sobre mí" or "Nosotros" → `/nosotros`
- "Contacto" → `/contacto`

### 6. Update Catalog Links in Footer

Footer currently has links like `/colecciones/collares` — update to just `/colecciones` since we have client-side filtering.

## Steps

1. Rewrite `src/components/NavigationBar.tsx` with sticky header + search overlay
2. Update `src/app/layout.tsx` to include NavigationBar + Footer
3. Update `src/app/page.tsx` to remove NavigationBar + Footer (they're now global)
4. Check all other page components and remove any NavigationBar/Footer renders
5. Update Footer links if needed
6. Run `npm run build` to verify
7. Fix any build errors
8. Do NOT deploy

## Important

- The NavigationBar must be `position: fixed` (not absolute) so it stays on scroll
- The search overlay must be full-screen with proper z-index (z-[100])
- Debounce must be 300ms (use a custom debounce hook or lodash.debounce)
- Minimum 2 characters before searching
- Highlight matches in gold
- Keyboard navigation is a bonus but optional
- All code must follow the project rules (no semicolons, double quotes, no comments, etc.)
- Import products directly from `data/products.json` in the NavigationBar component
