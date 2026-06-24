You are building the complete catalog page for Dubraska Mago jewelry e-commerce.

## Task
Create the full /colecciones page with filtering, search, pagination, and layout toggle.

## Data Source
Read products from: data/products.json (20 products already there)

## Architecture (Next.js 15 Best Practices)
1. Server Component: app/colecciones/page.tsx — reads products.json, passes to client
2. Client Component: app/colecciones/CatalogClient.tsx — all state management
3. Sub-components in src/components/catalog/:
   - ProductCard.tsx — individual product card
   - FiltersDrawer.tsx — left slide drawer with filters
   - SearchBar.tsx — search input with debounce
   - Pagination.tsx — page navigation + per-page selector
   - LayoutToggle.tsx — 4/2/1 column toggle buttons
   - ProductGrid.tsx — responsive grid
   - EmptyState.tsx — no results state

## Design
- Colors: bg #050505, gold #D4AF37, muted #8A8A8A, rose #E8B4B8
- Fonts: Instrument Serif (display), Inter (body)
- Cards: dark bg, gold border on hover, badge, color dot, WhatsApp CTA
- Grid: 4 cols default, responsive to 2/1
- Animations: GSAP for scroll/transitions, Framer Motion for hovers

## Filters (Drawer)
- Category: collar, pulseras, aretes, sets
- Color: dorado, plateado, rose, negro
- Price range: min/max inputs
- Toggles: Ofertas, Nuevos, Limitados

## URL Sync
All state changes update URL: /colecciones?category=x&color=y&q=z&page=2&perPage=12&layout=4

## Pagination
- Options: 8, 12, 20, "Ver todos"
- Prev/Next + page numbers
- Scroll to top on page change

## Layout Toggle
- 3 buttons: 4 cols | 2 cols | 1 col
- Active state: gold border

## Rules
- "use client" on all interactive components
- GSAP useGSAP hook for animations
- prefers-reduced-motion respect
- Spanish (Venezuelan) only
- Mobile-first responsive
- No backend — static JSON only
- TypeScript strict

## Steps
1. Create app/colecciones/page.tsx (Server Component)
2. Create app/colecciones/layout.tsx
3. Create all catalog components
4. Update NavigationBar to link to /colecciones
5. Build and verify

Read AGENT.md for full project context.
