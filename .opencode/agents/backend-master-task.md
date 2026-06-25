# MASTER TASK: Dubraska Mago — Complete Backend Implementation

Build the complete backend for the Dubraska Mago jewelry e-commerce site.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (MUST FOLLOW)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY
- NO comments in code
- `export default ModuleName` at end
- 2-space indentation
- Function components with `React.JSX.Element`
- `var(--color-*)` or OKLCH for colors

## Architecture

**Approach Selection:**
- **API Routes** (`/src/app/api/*/route.ts`): For public data (products listing, categories), external integrations, webhooks
- **Server Actions**: For admin mutations (create/update/delete products, inventory, testimonials) — these will be used from the /office backoffice pages

**Tech Stack:**
- Next.js 16 API Routes (App Router)
- Prisma ORM with SQLite (`file:./dev.db`)
- Zod for validation
- JWT (jsonwebtoken) + bcrypt for admin auth

## Files to Create

### 1. Setup Files
- `prisma/schema.prisma` — Full database schema
- `.env` — Environment variables
- Update `.gitignore` — Add db files

### 2. Library Files (`src/lib/`)
- `src/lib/db.ts` — Prisma client singleton
- `src/lib/api.ts` — API response helpers
- `src/lib/schemas.ts` — Zod validation schemas
- `src/lib/auth.ts` — JWT auth middleware

### 3. Global Types (`src/types/index.ts`)
Interfaces for Product, Category, Testimonial, Order, OrderItem, PaginatedResponse, ApiResponse, CatalogFilters

### 4. API Routes (`src/app/api/`)

| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/products` | GET, POST | No/Yes | List/create products |
| `/api/products/[id]` | GET, PATCH, DELETE | No/Yes | Single product CRUD |
| `/api/categories` | GET, POST | No/Yes | List/create categories |
| `/api/categories/[id]` | GET, PATCH, DELETE | No/Yes | Single category CRUD |
| `/api/testimonials` | GET, POST | No/Yes | List/create testimonials |
| `/api/testimonials/[id]` | GET, PATCH, DELETE | No/Yes | Single testimonial CRUD |
| `/api/orders` | GET, POST | Yes | List/create orders |
| `/api/orders/[id]` | GET, PATCH | Yes | Single order |
| `/api/inventory` | GET | Yes | Movement history |
| `/api/inventory/adjust` | POST | Yes | Stock adjustment |
| `/api/auth/login` | POST | No | Admin login |
| `/api/auth/me` | GET | Yes | Current user |
| `/api/auth/logout` | POST | No | Logout |
| `/api/seed` | POST | No | Seed database |

### 5. Database Schema Models
- Product (with stock, lowStock, sku, gallery as JSON string)
- Category
- Testimonial
- Order + OrderItem
- InventoryMovement
- AdminUser

## Implementation Steps

1. Install dependencies: `npm install prisma @prisma/client jsonwebtoken bcryptjs` and dev deps
2. Initialize Prisma with SQLite
3. Write schema.prisma
4. Run migration: `npx prisma migrate dev --name init`
5. Generate client: `npx prisma generate`
6. Create all library files (db.ts, api.ts, schemas.ts, auth.ts)
7. Create global types
8. Create all API routes
9. Create .env file
10. Update .gitignore
11. Run `npm run build` to verify

## IMPORTANT DETAILS

### Products JSON has `gallery: string[]` but SQLite doesn't support arrays
Store gallery as JSON string: `gallery: "[]"` and parse on read.

### Seed data
The seed route should populate from `data/products.json` and `data/testimonials.json`.

### Admin user for seed
Create with bcrypt hash of "Dubraska2026!" — generate a real bcrypt hash at runtime in the seed route.

### API Response Format
```json
{ "success": true, "data": {...} }
{ "success": false, "error": "message" }
```

### Pagination
```json
{ "items": [...], "total": 20, "page": 1, "totalPages": 2, "hasNext": true, "hasPrev": false }
```

## After Completion

Run `npm run build` and verify everything compiles. Do NOT deploy.

Read the detailed task files in `.opencode/agents/` for complete code examples:
- `backend-types-task.md` — Global types
- `backend-lib-task.ts` — Library helpers and schemas  
- `backend-api-products-task.md` — Products API
- `backend-api-categories-task.md` — Categories & Testimonials API
- `backend-api-orders-task.md` — Orders & Inventory API
- `backend-api-auth-task.md` — Auth API & Seed
- `backend-final-task.md` — Final checklist
