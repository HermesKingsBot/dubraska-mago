# Backend API — Multi-Select Filters Fix

## Problem
The products API currently only supports single-value filters (`category` as string, `color` as string). The frontend sends arrays (`category: string[]`, `color: string[]`). The backend must support multi-select filters and server-side pagination/search.

## What to Do

### 1. Update `/api/products` GET route (`src/app/api/products/route.ts`)

Replace the current GET handler to support:

**Multi-value filters (comma-separated in query params):**
- `?category=collares,pulseras` → `where: { categoryId: { in: ["collares", "pulseras"] } }`
- `?color=dorado,plateado` → `where: { color: { in: ["dorado", "plateado"] } }`
- `?category=collares&color=dorado,rose` → combine both with AND

**Search (server-side):**
- `?q=keyword` → search in name, description, sku (already implemented, keep it)

**Boolean filters (keep as-is):**
- `?featured=true`
- `?inStock=true`

**Server-side pagination (already implemented, keep it):**
- `?page=1&limit=20`

**New: Sort/filter params:**
- `?sort=newest|oldest|price_asc|price_desc|name_asc` — default `newest`
- `?badge=NUEVO|LIMITADO|OFERTA` — filter by badge
- `?minPrice=10&maxPrice=100` — price range filter

**Implementation details:**

```typescript
// Parse comma-separated values into arrays
const categories = searchParams.get("category")?.split(",").filter(Boolean) || []
const colors = searchParams.get("color")?.split(",").filter(Boolean) || []

// Build where clause
const where: Prisma.ProductWhereInput = {}
if (categories.length > 0) where.categoryId = { in: categories }
if (colors.length > 0) where.color = { in: colors }
if (featured) where.featured = true
if (inStock) where.inStock = true
if (badge) where.badge = badge
if (minPrice || maxPrice) {
  where.price = {}
  if (minPrice) where.price.gte = parseFloat(minPrice)
  if (maxPrice) where.price.lte = parseFloat(maxPrice)
}
if (search) {
  where.OR = [
    { name: { contains: search } },
    { description: { contains: search } },
    { sku: { contains: search } },
  ]
}

// Sort
const sort = searchParams.get("sort") || "newest"
const orderBy: Prisma.ProductOrderByWithRelationInput = {}
switch (sort) {
  case "oldest": orderBy.createdAt = "asc"; break
  case "price_asc": orderBy.price = "asc"; break
  case "price_desc": orderBy.price = "desc"; break
  case "name_asc": orderBy.name = "asc"; break
  default: orderBy.createdAt = "desc"
}
```

**IMPORTANT**: Use `Prisma.ProductWhereInput` type instead of `Record<string, unknown>` for proper type safety.

### 2. Update `/api/products` response to include filter metadata

Add to the response:
```typescript
return successResponse({
  items: itemsWithGallery,
  total,
  page,
  totalPages: Math.ceil(total / limit),
  hasNext: page * limit < total,
  hasPrev: page > 1,
  // NEW: available filter options based on current results
  availableFilters: {
    categories: [...new Set(items.map(p => p.category?.name).filter(Boolean))],
    colors: [...new Set(items.map(p => p.color).filter(Boolean))],
    priceRange: {
      min: Math.min(...items.map(p => Number(p.price))),
      max: Math.max(...items.map(p => Number(p.price))),
    },
  },
})
```

### 3. Add a new `/api/products/filters` route

Create `src/app/api/products/filters/route.ts` that returns all available filter options:
- All categories with product count
- All colors with count
- Price range (min/max)
- All badges

```typescript
// GET /api/products/filters
const categories = await db.category.findMany({
  include: { _count: { select: { products: true } } },
})
const products = await db.product.findMany({
  select: { color: true, price: true, badge: true },
})
const colors = [...new Set(products.map(p => p.color))]
const badges = [...new Set(products.map(p => p.badge).filter(Boolean))]
const prices = products.map(p => Number(p.price))
return successResponse({
  categories: categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products })),
  colors: colors.map(c => ({ value: c, count: products.filter(p => p.color === c).length })),
  badges: badges.map(b => ({ value: b, count: products.filter(p => p.badge === b).length })),
  priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
})
```

### 4. Update `/api/categories` GET to include product count per category

Already done — verify it works.

### 5. Update `/api/testimonials` GET to support filtering

Add support for:
- `?active=true|false` — filter by active status
- `?rating=5` — filter by rating
- `?productId=xxx` — filter by product

### 6. Update `/api/orders` GET to support filtering

Add support for:
- `?status=PENDING|CONFIRMED|etc` — filter by status
- `?sort=newest|oldest|total` — sort orders

### 7. Update `/api/inventory` GET to support filtering

Add support for:
- `?productId=xxx` — filter by product
- `?type=STOCK_IN|STOCK_OUT|SET` — filter by movement type

## Code Rules (MUST FOLLOW)
- NO semicolons
- Double quotes only
- NO comments
- `export default` at end of file
- 2-space indentation
- Use `function` components with `React.JSX.Element` return type
- Use `var(--color-*)` for all colors (never hex)
- Max 200 lines per file
- Use Prisma types (`Prisma.ProductWhereInput`) for type safety

## Files to Read First
- `src/app/api/products/route.ts` — Current products API
- `src/app/api/categories/route.ts` — Categories API
- `src/app/api/testimonials/route.ts` — Testimonials API
- `src/app/api/orders/route.ts` — Orders API
- `src/app/api/inventory/route.ts` — Inventory API
- `prisma/schema.prisma` — Database schema
- `src/lib/api.ts` — API helpers
- `src/lib/schemas.ts` — Zod schemas

## Verification
After all changes:
1. Run `npm run build` — must pass
2. Test: `curl "http://localhost:3000/api/products?category=collares,pulseras&color=dorado&sort=price_asc"`
3. Test: `curl "http://localhost:3000/api/products/filters"`
4. Test: `curl "http://localhost:3000/api/products?q=oro&minPrice=10&maxPrice=50"`
