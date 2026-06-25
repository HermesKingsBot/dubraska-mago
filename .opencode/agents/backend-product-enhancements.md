# Backend — Product Enhancements (Sizes, Reviews, Compare)

## Objective
Add product sizes/variants, customer reviews system, and product comparison support to the backend.

## What to Do

### 1. Update Prisma Schema (`prisma/schema.prisma`)

Add new models and update Product:

```prisma
// ADD to Product model:
model Product {
  // ... existing fields ...
  
  // NEW fields for enhanced product page
  sizes        String?  @default("") // JSON array: ["S","M","L"] or ["48","50","52"] or ["Único"]
  reviews      Review[]
  compareGroup String?  // Products in same group can be compared
}

model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  name      String   // Reviewer name (or "Anónimo")
  email     String?  // Optional, for verification
  rating    Int      // 1-5
  title     String?  // Review headline
  comment   String   // Review body
  verified  Boolean  @default(false) // Verified purchase
  images    String   @default("[]")  // JSON array of image URLs
  helpful   Int      @default(0)     // "Helpful" count
  status    String   @default("PENDING") // PENDING, APPROVED, REJECTED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// For product comparison (saved comparisons)
model ProductComparison {
  id        String   @id @default(cuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionId String?  // For guest users
  productIds String  // JSON array of product IDs (max 4)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Update Product Schema (`src/lib/schemas.ts`)

```typescript
// Product sizes (admin sets available sizes)
export const updateProductSizesSchema = z.object({
  sizes: z.array(z.string()).default([]),
})

// Review
export const createReviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Nombre muy corto").max(50),
  email: z.string().email("Email inválido").optional(),
  rating: z.number().int().min(1, "Mínimo 1 estrella").max(5, "Máximo 5 estrellas"),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, "Mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres"),
  images: z.array(z.string()).default([]),
})

export const updateReviewSchema = createReviewSchema.partial().extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
})

// Comparison
export const saveComparisonSchema = z.object({
  productIds: z.array(z.string()).min(2, "Mínimo 2 productos").max(4, "Máximo 4 productos"),
})
```

### 3. Create Reviews API Routes

#### `src/app/api/products/[slug]/reviews/route.ts`
- `GET` — Public, get approved reviews for a product
  - Query: `?page=1&limit=10&sort=newest|helpful|rating`
  - Returns: `{ items, total, averageRating, ratingDistribution: {5:10, 3:2,...} }`
- `POST` — Public (logged in or guest), create review
  - Body: `{ name, email, rating, title, comment, images? }`
  - Status: "PENDING" (admin must approve)
  - Rate limit: 1 review per product per user/email

#### `src/app/api/reviews/route.ts`
- `GET` — Admin only, all reviews with filters
  - Query: `?status=PENDING|APPROVED|REJECTED&productId=xxx&page=1`

#### `src/app/api/reviews/[id]/route.ts`
- `PATCH` — Admin, approve/reject `{ status, adminNote? }`
- `DELETE` — Admin, remove review
- `PATCH /reviews/[id]/helpful` — Public, increment helpful count

### 4. Create Comparison API Routes

#### `src/app/api/compare/route.ts`
- `GET?ids=id1,id2,id3` — Public, get products for comparison
  - Returns full product data for side-by-side comparison
  - Max 4 products
- `POST` — Save comparison (logged in or session)
- `DELETE` — Clear saved comparison

### 5. Update Products API

#### `src/app/api/products/route.ts` (GET)
- Include `sizes` field in response
- Include review summary: `reviewCount`, `averageRating`

#### `src/app/api/products/[id]/route.ts` (PATCH)
- Allow updating `sizes` field

### 6. Update Seed Data

Add `sizes` to products in seed:
- Collares: `["40cm", "45cm", "50cm"]`
- Pulseras: `["S", "M", "L"]`
- Aretes: `["Único"]`
- Sets: `["Único"]`
- Anillos: `["48", "50", "52", "54", "56"]`

Add some sample reviews (APPROVED status) to popular products.

### 7. Update `src/lib/defaults.ts`

Add default sizes info if API fails.

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file
- Reviews require admin approval before showing
- GET routes are public, mutations require auth

## Files to Read First
- `prisma/schema.prisma`
- `src/lib/schemas.ts`
- `src/app/api/products/route.ts`
- `src/app/api/products/[id]/route.ts`
- `src/app/api/seed/route.ts`
- `src/types/product.ts`

## Verification
1. `npx prisma migrate dev --name product_enhancements` — success
2. `npx prisma generate` — success
3. `npm run build` — success
4. `curl http://localhost:3000/api/products/collar-cadena-dorado/reviews` — returns reviews
5. `curl "http://localhost:3000/api/compare?ids=id1,id2"` — returns comparison data
