# Frontend — Filters, Search & UX Overhaul

## Problem
The catalog filters currently work client-side only (filtering a static JSON). Now that the backend API supports multi-select filters, server-side search, and pagination, the frontend must:
1. Send filter params to the API instead of filtering locally
2. Update URL with filter state (already partially done)
3. Support multi-select for categories and colors
4. Server-side search with debounce
5. Server-side pagination
6. Excellent UX: animated filter chips, active filter count, clear all, loading states, empty states
7. Office backoffice must also use the API with proper filtering/search

## What to Do

### 1. Update Catalog Page (`src/app/colecciones/page.tsx`)

Change from local filtering to server-side API calls:

```typescript
// Build query string from filters
const buildQueryString = (filters: CatalogFilters & { q: string; page: number; sort?: string }) => {
  const params = new URLSearchParams()
  if (filters.q) params.set("q", filters.q)
  if (filters.category.length > 0) params.set("category", filters.category.join(","))
  if (filters.color.length > 0) params.set("color", filters.color.join(","))
  if (filters.priceMin) params.set("minPrice", filters.priceMin)
  if (filters.priceMax) params.set("maxPrice", filters.priceMax)
  if (filters.ofertas) params.set("badge", "OFERTA")
  if (filters.nuevos) params.set("badge", "NUEVO")
  if (filters.limitados) params.set("badge", "LIMITADO")
  if (filters.page > 1) params.set("page", String(filters.page))
  if (filters.sort) params.set("sort", filters.sort)
  return params.toString()
}

// Fetch from API
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/products?${queryString}`, {
  cache: "no-store"
})
const json = await res.json()
// json.data = { items, total, page, totalPages, hasNext, hasPrev, availableFilters }
```

Also fetch filter options:
```typescript
const filtersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/products/filters`, {
  next: { revalidate: 300 } // cache 5 min
})
```

Pass both products and filter options to CatalogClient.

### 2. Update CatalogClient (`src/app/colecciones/CatalogClient.tsx`)

Add:
- `loading` state when fetching (skeleton loaders)
- `availableFilters` prop (categories with counts, colors with counts, price range)
- Sort dropdown (newest, oldest, price low-high, price high-low, name A-Z)
- Smooth transitions when filters change (GSAP fade out/in)
- Better empty state with illustration suggestion
- URL updates on every filter change (already done, keep it)

### 3. Update FiltersDrawer (`src/components/catalog/FiltersDrawer.tsx`)

Improve UX:
- Show product count per category/color (from `availableFilters`)
- Add sort dropdown section
- Add price range slider (min/max inputs with visual feedback)
- Animate filter selection with Framer Motion
- Show "X resultados" preview count
- Better mobile experience (bottom sheet instead of left drawer on mobile)
- Add "Aplicar" button that shows result count before applying
- Sticky footer with clear/apply buttons (already exists, keep it)

### 4. Update SearchBar (`src/components/catalog/SearchBar.tsx`)

Improve:
- Add search suggestions/autocomplete (fetch from API as user types, debounced 300ms)
- Show recent searches (stored in sessionStorage, not localStorage)
- Keyboard navigation (arrow keys + enter)
- Clear button animation
- Loading spinner while searching

### 5. Create FilterChips component (`src/components/catalog/FilterChips.tsx`)

A new component that shows active filters as removable chips:
- Animated entrance/exit with AnimatePresence
- Each chip shows filter name + remove button
- Color-coded by filter type (category=gold, color=rose, price=blue)
- "Limpiar todo" button when 2+ filters active
- GSAP stagger animation on mount

### 6. Create SortDropdown component (`src/components/catalog/SortDropdown.tsx`)

A dropdown to sort products:
- Opciones: "Más recientes", "Más antiguos", "Precio: menor a mayor", "Precio: mayor a menor", "Nombre A-Z"
- Animated dropdown with Framer Motion
- Shows current selection
- Updates URL param `sort`

### 7. Create PriceRangeSlider component (`src/components/catalog/PriceRangeSlider.tsx`)

A dual-handle price range slider:
- Uses the min/max from `availableFilters.priceRange`
- Two inputs (min + max) with real-time validation
- Visual bar showing selected range
- GSAP animation on change

### 8. Update Office Products page (`src/app/office/productos/`)

Add search and filters:
- Search bar that filters products via API (`?q=xxx`)
- Filter by category dropdown
- Filter by stock status (in stock / low stock / out of stock)
- Show loading skeleton while fetching
- Inline edit/delete with optimistic updates

### 9. Update Office Dashboard (`src/app/office/dashboard/`)

Add:
- Quick stats from API (total products, low stock count, total orders, revenue)
- Recent orders from API
- Low stock alerts from API
- Animated counters with GSAP

### 10. Update Office Inventory page (`src/app/office/inventario/`)

Add:
- Search/filter movements by product
- Filter by movement type (IN/OUT/SET)
- Date range filter
- Export to CSV button

### 11. Create a Skeleton component (`src/components/catalog/ProductSkeleton.tsx`)

Loading placeholder for product cards:
- Matches ProductCard dimensions
- Animated shimmer/pulse
- Respects layout (4/2/1 columns)

## Code Rules (MUST FOLLOW)
- NO semicolons
- Double quotes only
- NO comments
- `export default` at end of file
- 2-space indentation
- Use `function` components with `React.JSX.Element` return type
- Use `var(--color-*)` for all colors (never hex)
- Max 200 lines per file — split into multiple components if needed
- Use `'use client'` for components using hooks/state
- GSAP for scroll/enter animations, Framer Motion for micro-interactions
- Respect `prefers-reduced-motion`

## Design Requirements
- Dark Luxury aesthetic: deep blacks + gold accents
- Smooth animations (GSAP for page transitions, Framer for UI interactions)
- Mobile-first responsive
- Loading states everywhere data is fetched
- Empty states with helpful messages and CTAs
- Accessible (aria labels, keyboard nav, focus states)

## Files to Read First
- `src/app/colecciones/page.tsx` — Current catalog page
- `src/app/colecciones/CatalogClient.tsx` — Current catalog client
- `src/components/catalog/FiltersDrawer.tsx` — Current filters
- `src/components/catalog/SearchBar.tsx` — Current search
- `src/components/catalog/ProductGrid.tsx` — Product grid
- `src/components/catalog/Pagination.tsx` — Pagination
- `src/components/catalog/EmptyState.tsx` — Empty state
- `src/lib/catalog-utils.ts` — Catalog utilities
- `src/types/product.ts` — Product types
- `src/lib/api-client.ts` — API client (just created)
- `src/hooks/useApi.ts` — API hook (just created)
- `src/app/office/productos/` — Office products page
- `src/app/office/dashboard/` — Office dashboard
- `src/app/office/inventario/` — Office inventory

## Verification
After all changes:
1. Run `npm run build` — must pass
2. Test catalog page: filters should update URL and fetch from API
3. Test search: should show loading state and results from API
4. Test office: products should load from API with search/filter
5. Test mobile: filters should be bottom sheet, search should be full-width
