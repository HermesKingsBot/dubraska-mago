# Testing Suite Setup Plan — Dubraska Mago

## Overview
Set up Vitest + React Testing Library for unit/component tests and Playwright for E2E tests.

## Key Observations
- No existing test infrastructure
- No `data-testid` attributes in the codebase — need to add them
- Heavy GSAP + motion/react (Framer Motion v12) usage — need mocking in unit tests
- NavigationBar imports products from `data/products.json`
- All text is in Spanish — E2E selectors must use Spanish text
- Tailwind CSS v4 (no config file, uses `@theme` in globals.css)
- Next.js 16.2.9 with App Router

---

## Phase 1: Install Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react @playwright/test
npx playwright install chromium
```

---

## Phase 2: Configuration Files

### 2.1 `vitest.config.ts` (new file)
- Import `defineConfig` from `vitest/config`
- Plugin: `@vitejs/plugin-react`
- Test env: `jsdom`, globals: true, setupFiles: `./src/test/setup.ts`
- CSS: true
- Resolve alias: `@` → `./src`
- Exclude: `node_modules`, `.next`, `e2e`

### 2.2 `src/test/setup.ts` (new file)
- Import `@testing-library/jest-dom`
- Import `cleanup` from `@testing-library/react`
- Run `cleanup()` after each test via `afterEach`

### 2.3 `playwright.config.ts` (new file)
- testDir: `./e2e`
- fullyParallel: true
- reporter: `html`
- use.baseURL: `http://localhost:3000`
- Projects: chromium (Desktop Chrome) + mobile (iPhone 14)
- webServer: `npm run dev` on port 3000

### 2.4 `package.json` — Add scripts
- `"test": "vitest"`
- `"test:run": "vitest run"`
- `"test:coverage": "vitest run --coverage"`

---

## Phase 3: Mock Setup

### 3.1 GSAP Mocks
Create `src/test/__mocks__/gsap.ts` — mock `gsap.fromTo`, `gsap.set`, `gsap.matchMedia`
Create `src/test/__mocks__/gsap-react.ts` — mock `useGSAP` as passthrough
Create `src/test/__mocks__/motion.ts` — mock `motion/react` div as regular div

### 3.2 `src/test/mocks.ts`
- Central `mockProduct()` factory returning valid `Product` objects
- Central `mockFilters()` factory returning valid `CatalogFilters`
- Mock `fetch` helper with `vi.fn()`

---

## Phase 4: Unit/Component Test Files

### 4.1 `src/test/lib/catalog-utils.test.ts`
Tests for pure utility functions (no mocking needed):
- `parseSearchParams` — defaults, page, perPage, layout, sort, category (comma-separated), color, priceMin/Max, badges
- `filterProducts` — by category, color, price range, badge, search query, combined filters
- `paginateProducts` — correct slice, totalPages calc, "all" perPage, overflow page clamping
- `buildSearchParams` — skips defaults, includes active filters
- `buildApiQueryString` — maps filter keys correctly (priceMin→minPrice, ofertas→badge=OFERTA)

### 4.2 `src/test/lib/api-client.test.ts`
- Mock `global.fetch` with `vi.fn()`
- `getProducts()` — calls `/api/products` with query params
- `getProduct(id)` — calls `/api/products/:id`
- `getCategories()` — calls `/api/categories`
- `login(email, password)` — POSTs to `/api/auth/login`, returns token+user
- Error handling — throws when `success: false`
- All requests include `credentials: "include"`

### 4.3 `src/test/hooks/useApi.test.tsx`
- Mock `global.fetch`
- Returns `{ data: null, loading: false, error: null }` initially
- After successful fetch: data populated, loading=false
- After failed fetch: error populated, loading=false
- `reset()` clears state
- `fetch()` returns data on success

### 4.4 `src/test/components/ProductCard.test.tsx`
- Mock GSAP and motion
- Renders product name, price, image
- Shows badge (NUEVO, LIMITADO, OFERTA) when present
- Shows old price with strikethrough when on sale
- Shows discount percentage when oldPrice exists
- Shows WhatsApp CTA link with correct href
- Renders color indicator
- Renders category label

### 4.5 `src/test/components/SearchBar.test.tsx`
- Renders input with "Buscar joyas..." placeholder
- Calls `onSearch` on form submit
- Clear button clears input and calls `onSearch("")`
- Clear button only visible when input has value

### 4.6 `src/test/components/FilterChips.test.tsx`
- Renders category chips when filters.category has items
- Renders color chips
- Renders badge chips (Ofertas, Nuevos, Limitados)
- Renders price chips
- "Limpiar todo" button appears when 2+ active filters
- Clicking chip calls correct remove callback
- Clicking "Limpiar todo" calls onClearAll

### 4.7 `src/test/components/Pagination.test.tsx`
- Renders page numbers
- Current page highlighted
- Prev button disabled on page 1
- Next button disabled on last page
- Clicking page calls onPageChange
- Shows "Mostrando X–Y de Z" text
- Per-page select renders all options

### 4.8 `src/test/components/SortDropdown.test.tsx`
- Renders with current sort label
- Click opens dropdown with all SORT_OPTIONS
- Clicking option calls onChange and closes dropdown
- Current option highlighted in dropdown

### 4.9 `src/test/components/LayoutToggle.test.tsx`
- Renders 3 layout buttons (4, 2, 1 columns)
- Active layout highlighted
- Clicking button calls onChange with correct value

### 4.10 `src/test/components/EmptyState.test.tsx`
- Shows "No encontramos resultados" heading
- Shows "Limpiar filtros" button
- Button click calls onClearFilters

### 4.11 `src/test/components/NavigationBar.test.tsx`
- Mock GSAP
- Renders logo "DUBRASKA MAGO"
- Renders nav links (Inicio, Colecciones, Nosotros, Preguntas Frecuentes, Contacto)
- Search button present
- Logo links to "/"

### 4.12 `src/test/components/Footer.test.tsx`
- Mock GSAP + ScrollTrigger
- Renders copyright text "2026 Dubraska Mago"
- Renders social links (WhatsApp, Instagram)
- Renders Tienda section links
- Renders Información section links
- Renders email input and subscribe button

---

## Phase 5: Add data-testid Attributes

Add `data-testid` attributes to source components for reliable E2E selectors. Minimal additions — prefer `getByRole()` / `getByText()` where possible.

Files to modify:
- `src/components/catalog/ProductCard.tsx` — `data-testid="product-card"`, `data-testid="product-name"`, `data-testid="product-price"`, `data-testid="product-badge"`, `data-testid="product-old-price"`, `data-testid="product-whatsapp"`
- `src/components/catalog/SearchBar.tsx` — `data-testid="search-input"`, `data-testid="search-clear"`
- `src/components/catalog/FilterChips.tsx` — `data-testid="filter-chip"`, `data-testid="clear-all"`
- `src/components/catalog/Pagination.tsx` — `data-testid="pagination"`, `data-testid="page-btn"`, `data-testid="prev-page"`, `data-testid="next-page"`, `data-testid="per-page-select"`
- `src/components/catalog/SortDropdown.tsx` — `data-testid="sort-dropdown"`, `data-testid="sort-option"`
- `src/components/catalog/LayoutToggle.tsx` — `data-testid="layout-toggle"`, `data-testid="layout-btn"`
- `src/components/catalog/EmptyState.tsx` — `data-testid="empty-state"`, `data-testid="clear-filters-btn"`
- `src/components/NavigationBar.tsx` — `data-testid="navbar"`, `data-testid="nav-links"`, `data-testid="search-btn"`, `data-testid="mobile-menu-btn"`, `data-testid="search-overlay"`
- `src/components/Footer.tsx` — `data-testid="footer"`, `data-testid="copyright"`

---

## Phase 6: Playwright E2E Tests

### 6.1 `e2e/home.spec.ts`
- Page loads with correct title
- Hero section visible
- Navigation bar visible
- Footer visible

### 6.2 `e2e/catalog.spec.ts`
- Page loads with products
- Search filters products
- Category filter works
- Color filter works
- Sort changes order
- Layout toggle changes grid
- Pagination works
- Clear filters resets
- Empty state shows when no results
- URL updates with filter params
- Product card links to detail

### 6.3 `e2e/product-detail.spec.ts`
- Page loads with product info
- Price displayed
- WhatsApp link present
- Breadcrumb navigation works

### 6.4 `e2e/contact.spec.ts`
- Page loads with contact form
- Contact cards render
- Form validation works
- Map container renders

### 6.5 `e2e/faq.spec.ts`
- Page loads with questions
- Accordion expands/collapses
- Search filters questions

### 6.6 `e2e/office-login.spec.ts`
- Login page loads
- Shows error for wrong credentials
- Redirects on successful login

### 6.7 `e2e/navigation.spec.ts`
- Nav links work
- Logo returns to home
- Footer links work
- 404 for unknown routes

### 6.8 `e2e/seo.spec.ts`
- Each page has title tag
- Each page has meta description
- Structured data present on home

---

## Phase 7: Verification

1. `npm run test:run` — all unit tests pass
2. `npx playwright test` — all E2E tests pass
3. `npm run build` — build still passes
4. `npm run test:coverage` — coverage report generated

---

## File Count Summary
- **New files**: ~25 (config, setup, mocks, test files)
- **Modified files**: ~10 (package.json, source components for data-testid)
- **Estimated total**: ~35 files touched

## Implementation Order
1. Install deps + configs (Phase 1-2)
2. Mock setup (Phase 3)
3. Utility/hook tests first — no component rendering needed (Phase 4.1-4.3)
4. Component tests (Phase 4.4-4.12)
5. Add data-testid attributes (Phase 5)
6. E2E tests (Phase 6)
7. Verify everything (Phase 7)
