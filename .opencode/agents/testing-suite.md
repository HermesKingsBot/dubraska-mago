# Testing Suite — Dubraska Mago

## Objective
Set up a complete testing suite with:
1. **Vitest + React Testing Library** — Unit and component tests
2. **Playwright** — End-to-end tests for critical user flows

## Part 1: Setup Vitest + React Testing Library

### 1. Install dependencies
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

### 2. Create `vitest.config.ts`
```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/test/**", "src/**/*.stories.*"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### 3. Create `src/test/setup.ts`
```typescript
import "@testing-library/jest-dom"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => {
  cleanup()
})
```

### 4. Update `package.json` scripts
Add:
```json
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"
```

## Part 2: Unit & Component Tests

### Test Files to Create:

#### `src/test/components/ProductCard.test.tsx`
Test the ProductCard component:
- Renders product name, price, and image
- Shows badge when product has one (NUEVO, LIMITADO, OFERTA)
- Shows old price with strikethrough when on sale
- Shows "Ver detalle" link with correct href
- Shows WhatsApp CTA with correct link
- Shows out-of-stock state when inStock is false
- Shows low stock warning when stock is low

#### `src/test/components/SearchBar.test.tsx`
Test the SearchBar component:
- Renders input with placeholder
- Calls onSearch callback when typing (debounced)
- Clears input when clear button is clicked
- Submits on Enter key
- Shows clear button only when input has value

#### `src/test/components/FilterChips.test.tsx`
Test the FilterChips component:
- Renders active filter chips
- Removes chip when clicked
- Shows "Limpiar todo" when 2+ filters active
- Calls onRemove with correct filter value
- Calls onClearAll when "Limpiar todo" clicked

#### `src/test/components/Pagination.test.tsx`
Test the Pagination component:
- Renders correct page numbers
- Calls onPageChange when page clicked
- Disables previous button on first page
- Disables next button on last page
- Shows current page as active

#### `src/test/components/SortDropdown.test.tsx`
Test the SortDropdown component:
- Renders with default sort option
- Opens dropdown when clicked
- Calls onSelect when option selected
- Closes dropdown after selection
- Shows current selection

#### `src/test/components/LayoutToggle.test.tsx`
Test the LayoutToggle component:
- Renders 4/2/1 column buttons
- Highlights active layout
- Calls onChange when clicked

#### `src/test/components/EmptyState.test.tsx`
Test the EmptyState component:
- Renders "no results" message
- Shows "Limpiar filtros" button
- Calls onClearFilters when clicked

#### `src/test/components/NavigationBar.test.tsx`
Test the NavigationBar component:
- Renders logo
- Renders navigation links
- Renders search toggle
- Opens search overlay when search clicked

#### `src/test/components/Footer.test.tsx`
Test the Footer component:
- Renders copyright text
- Renders social links
- Renders navigation links

#### `src/test/lib/catalog-utils.test.ts`
Test catalog utility functions:
- `parseSearchParams` — parses URL params correctly, handles arrays (comma-separated)
- `filterProducts` — filters by category, color, price range, badge, search query
- `paginateProducts` — returns correct slice, handles "all" perPage
- `buildSearchParams` — builds URL params from filter state
- `buildApiQueryString` — builds API query string from filters

#### `src/test/lib/api-client.test.ts`
Test the API client:
- `getProducts()` — fetches with correct query params
- `getProduct(id)` — fetches single product
- `getCategories()` — fetches categories
- `login()` — posts credentials, returns token
- Handles error responses (throws on !success)
- Includes credentials: "include" in all requests

#### `src/test/hooks/useApi.test.tsx`
Test the useApi hook:
- Returns loading state initially
- Returns data after successful fetch
- Returns error on failed fetch
- Refetch works correctly

## Part 3: Playwright E2E Tests

### 1. Install Playwright
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 2. Create `playwright.config.ts`
```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 14"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

### 3. Create E2E Test Files

#### `e2e/home.spec.ts`
Test the home page:
- Page loads with correct title
- Hero section is visible
- Navigation bar is visible
- All 8 sections render (hero, about, bestsellers, categories, color guide, features, testimonials, footer)
- GSAP animations don't break rendering
- Mobile: hamburger menu works

#### `e2e/catalog.spec.ts`
Test the catalog page:
- Page loads with products
- Search filters products (type "oro", see results)
- Category filter works (click "Collares", see only collares)
- Color filter works (click "Dorado", see only dorado)
- Multi-select filters work (select 2 categories)
- Sort changes order (sort by price asc)
- Layout toggle changes grid (4 → 2 → 1 columns)
- Pagination works (go to page 2)
- Clear filters resets everything
- Empty state shows when no results
- URL updates with filter params
- Product card links to product detail

#### `e2e/product-detail.spec.ts`
Test the product detail page:
- Page loads with product info
- Gallery shows images
- Price is displayed correctly
- "Comprar por WhatsApp" link works
- Related products section renders
- Care instructions section renders
- Breadcrumb navigation works

#### `e2e/contact.spec.ts`
Test the contact page:
- Page loads with contact form
- All contact cards render (Instagram, WhatsApp, Facebook, Email, Location)
- Form validation works (empty fields show errors)
- Form submits successfully
- Map renders (Leaflet container visible)
- CTA section is visible

#### `e2e/faq.spec.ts`
Test the FAQ page:
- Page loads with questions
- Accordion expands/collapses on click
- Search filters questions
- Copy button copies answer text
- Thumbs up/down buttons work
- CTA banner is visible

#### `e2e/office-login.spec.ts`
Test the office login flow:
- Login page loads
- Shows error for wrong credentials
- Redirects to dashboard on successful login
- Dashboard shows stats after login
- Logout works and redirects to login

#### `e2e/office-products.spec.ts`
Test the office products management:
- Products list loads from API
- Search filters products
- Create product form works
- Edit product works
- Delete product shows confirmation
- Stock status badges display correctly

#### `e2e/navigation.spec.ts`
Test site-wide navigation:
- Nav links work from any page
- Logo click returns to home
- Footer links work
- Mobile menu opens/closes
- Search overlay opens/closes
- 404 page for unknown routes

#### `e2e/seo.spec.ts`
Test SEO elements:
- Each page has correct title tag
- Each page has meta description
- Open Graph tags present
- Structured data (JSON-LD) present
- Sitemap.xml is accessible
- Robots.txt is accessible
- Canonical URLs present

## Code Rules (MUST FOLLOW)
- NO semicolons
- Double quotes only
- NO comments
- `export default` at end of file
- 2-space indentation
- Max 200 lines per file

## Important Notes
- Mock fetch/API calls in unit tests (don't hit real API)
- Use `data-testid` attributes where needed for E2E selectors
- Tests should be deterministic (no flaky timing)
- E2E tests should seed data first or mock the API
- For Playwright, mock the API routes to avoid database dependency
- Use `screen.getByRole()` over `getByTestId()` when possible (better accessibility testing)

## Files to Read First
- `src/components/catalog/ProductCard.tsx`
- `src/components/catalog/SearchBar.tsx`
- `src/components/catalog/FilterChips.tsx`
- `src/components/catalog/Pagination.tsx`
- `src/components/catalog/SortDropdown.tsx`
- `src/components/catalog/LayoutToggle.tsx`
- `src/components/catalog/EmptyState.tsx`
- `src/components/NavigationBar.tsx`
- `src/components/Footer.tsx`
- `src/lib/catalog-utils.ts`
- `src/lib/api-client.ts`
- `src/hooks/useApi.ts`
- `src/app/page.tsx`
- `src/app/colecciones/page.tsx`
- `src/app/producto/[slug]/page.tsx`
- `src/app/contacto/page.tsx`
- `src/app/preguntas-frecuentes/page.tsx`
- `src/app/office/page.tsx`

## Verification
After all changes:
1. Run `npm run test:run` — all unit tests pass
2. Run `npx playwright test` — all E2E tests pass
3. Run `npm run build` — build still passes
4. Run `npm run test:coverage` — coverage report generated
