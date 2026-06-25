# Frontend API Integration Task

## Objective
Connect the entire frontend to the backend API, migrate auth from localStorage to secure cookies, and make everything work with the database-backed API.

## Current State
- Backend API is fully functional with SQLite via Prisma 6
- API routes: `/api/products`, `/api/products/[id]`, `/api/categories`, `/api/categories/[id]`, `/api/testimonials`, `/api/testimonials/[id]`, `/api/orders`, `/api/orders/[id]`, `/api/inventory`, `/api/inventory/adjust`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, `/api/seed`
- Auth currently uses localStorage (INSECURE) — must migrate to httpOnly cookies
- Catalog page reads from static `data/products.json` — must read from API
- Office backoffice reads from static data — must read from API

## What to Do

### 1. Create API Service Layer (`src/lib/api-client.ts`)
Create a client-side API service that:
- Uses `fetch()` with `credentials: "include"` to send cookies
- Has typed methods for all API endpoints: `getProducts()`, `getProduct(id)`, `getCategories()`, `getTestimonials()`, `getOrders()`, `getInventory()`, `login(email, password)`, `logout()`, `getMe()`
- Handles the `{ success, data, error }` response format from the API
- Throws errors on `!success` with the error message
- All methods properly typed with the interfaces from `src/types/index.ts`

### 2. Create Auth Cookie Utilities (`src/lib/cookie-utils.ts`)
Create utilities to:
- `setAuthCookie(token)` — sets an httpOnly cookie via a server action (client can't set httpOnly)
- `clearAuthCookie()` — clears the auth cookie
- `getAuthCookie()` — reads the cookie (for server-side use)

### 3. Create Auth API Routes (cookie-based)
Create these routes in `src/app/api/auth/`:
- `src/app/api/auth/set-cookie/route.ts` — POST `{ token }` → sets httpOnly cookie with `name=dubraska_auth`, `httpOnly=true`, `sameSite=lax`, `secure=process.env.NODE_ENV === "production"`, `path=/`, `maxAge=604800` (7 days)
- `src/app/api/auth/clear-cookie/route.ts` — POST → clears the cookie by setting maxAge=0

### 4. Update Auth Middleware (`src/lib/auth.ts`)
Update `verifyToken()` to also check the cookie if no Authorization header:
```typescript
export function verifyToken(request: NextRequest): JwtPayload | null {
  // Try Authorization header first
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) { ... }
  
  // Fall back to cookie
  const cookieToken = request.cookies.get("dubraska_auth")?.value
  if (cookieToken) {
    try {
      return jwt.verify(cookieToken, JWT_SECRET) as JwtPayload
    } catch { return null }
  }
  return null
}
```

### 5. Migrate Office Auth from localStorage to API-based
Rewrite `src/context/OfficeAuthContext.tsx` to:
- Login: POST to `/api/auth/login` with email/password → API returns token → client calls `/api/auth/set-cookie` to store in httpOnly cookie
- Logout: Call `/api/auth/clear-cookie` to clear cookie, clear local user state
- On mount: Call `/api/auth/me` (which reads cookie) to restore session
- Store user info in state (not localStorage)
- The login function must be async and return the API response

### 6. Update Office Login Page (`src/app/office/login/page.tsx`)
Update the login form to use the new async auth context:
- Call `login(email, password)` which hits the API
- Show loading state during API call
- Redirect to dashboard on success
- Show error message on failure

### 7. Update Office Layout — Auth Guard
Update `src/components/office/AuthGuard.tsx` (or wherever auth is guarded):
- On mount, call `/api/auth/me` to check session
- If no session, redirect to `/office/login`
- Use cookie-based auth (no localStorage)

### 8. Update Catalog Page to Use API
Rewrite `src/app/colecciones/page.tsx` to:
- Fetch products from `/api/products?page=1&limit=20` using `fetch()` with `cache: "no-store"` (dynamic data)
- Fetch categories from `/api/categories` with `next: { revalidate: 3600 }` (cached 1 hour)
- Pass data to CatalogClient
- Handle pagination from API response

### 9. Update Office Dashboard to Use API
Update the office dashboard and all sub-pages to fetch from API:
- Products list: `GET /api/products`
- Categories: `GET /api/categories`
- Testimonials: `GET /api/testimonials`
- Inventory: `GET /api/inventory`
- Orders: `GET /api/orders`
- All create/update/delete operations should hit the API

### 10. Create a Generic Hook (`src/hooks/useApi.ts`)
Create a custom React hook for API calls:
```typescript
function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetch = async (url: string) => { ... }
  
  return { data, loading, error, refetch: fetch }
}
```

### 11. Update Product Detail Page
Update `src/app/producto/[slug]/page.tsx` to fetch product from API:
- `GET /api/products?slug=xxx` or fetch all and filter
- Use `generateStaticParams` from API data (fetch from API at build time)

### 12. Seed Database
After all code is done, run `POST /api/seed` to ensure the database has all products.

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
- All fetch calls must include `credentials: "include"` for cookie auth

## Security Requirements
- Auth token MUST be in httpOnly cookie (never localStorage)
- Cookie settings: `httpOnly=true`, `sameSite=lax`, `secure=production`, `path=/`, `maxAge=604800`
- All API mutations (POST/PATCH/DELETE) must include auth token
- Login is rate-limited by API (already implemented)
- Never expose JWT secret to client

## Files to Read First
- `src/lib/api.ts` — API response helpers
- `src/lib/auth.ts` — Current auth (needs cookie update)
- `src/lib/db.ts` — Prisma client
- `src/types/index.ts` — All type definitions
- `src/types/office.ts` — Office-specific types
- `src/context/OfficeAuthContext.tsx` — Current auth context (needs rewrite)
- `src/app/colecciones/page.tsx` — Current catalog (needs API integration)
- `src/app/colecciones/CatalogClient.tsx` — Catalog client component
- `src/app/office/login/page.tsx` — Login page
- `src/components/office/AuthGuard.tsx` — Auth guard
- `src/app/api/auth/login/route.ts` — Login API
- `src/app/api/auth/me/route.ts` — Me API
- `src/app/api/products/route.ts` — Products API
- `src/app/api/categories/route.ts` — Categories API
- `src/app/api/testimonials/route.ts` — Testimonials API
- `src/app/api/inventory/route.ts` — Inventory API
- `src/app/api/orders/route.ts` — Orders API

## Verification
After all changes:
1. Run `npm run build` — must pass with no errors
2. Run `npx prisma generate` to ensure client is up to date
3. Verify the seed route works: `curl -X POST http://localhost:3000/api/seed`
4. Verify login works: `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@dubraskamago.com","password":"admin123"}'`
