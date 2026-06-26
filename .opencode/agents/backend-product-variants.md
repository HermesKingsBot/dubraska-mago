# BACKEND TASK: Product Variants System

## Objective
Implement a complete product variants system where each product can have multiple combinations of color, size, material, etc. Each variant has its own SKU, stock, price, image, and availability status.

## Critical Context

### Working Directory
`/opt/data/projects/dubraska-mago/`

### Current Stack
- Next.js 16 (App Router) with API routes in `src/app/api/`
- Prisma 6 + SQLite (`prisma/schema.prisma`)
- Zod for validation (`src/lib/schemas.ts`)
- Auth via `requireAuth()` from `src/lib/auth.ts`
- Audit logging via `logCreate`, `logUpdate`, `logDelete` from `src/lib/audit.ts`
- Soft delete pattern: `deletedAt DateTime?` on models

### EXISTING Files You MUST Read
- `prisma/schema.prisma` — Full database schema
- `src/lib/db.ts` — Database helper
- `src/lib/api.ts` — Response helpers
- `src/lib/auth.ts` — Auth middleware
- `src/lib/schemas.ts` — Zod schemas
- `src/lib/audit.ts` — Audit logging
- `src/app/api/products/route.ts` — Products list/create API
- `src/app/api/products/[id]/route.ts` — Product detail/update/delete API
- `src/app/api/products/filters/route.ts` — Filters API
- `src/types/product.ts` — Product type definitions
- `src/components/office/ProductForm.tsx` — Admin product form
- `src/components/product/ProductInfo.tsx` — Frontend product info display
- `src/components/product/ProductCTA.tsx` — Frontend product CTA
- `src/app/producto/[slug]/ProductDetailClient.tsx` — Product detail page

### Current Product Model Fields (relevant)
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Float
  oldPrice    Float?
  material    String
  length      String?
  diameter    String?
  weight      String?
  color       String
  badge       String?
  image       String
  gallery     String   @default("[]")
  inStock     Boolean  @default(true)
  featured    Boolean  @default(false)
  stock       Int      @default(0)
  lowStock    Int      @default(5)
  sku         String
  categoryId  String
  category    Category @relation(...)
  sizes       String   @default("[]")
  compareGroup String?
  // ... timestamps + soft delete
}
```

## What To Build

### Step 1: Add ProductVariant Model to Prisma Schema

Add a new model `ProductVariant` after the `Product` model:

```prisma
model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku         String   @unique
  name        String
  color       String?
  colorHex    String?
  size        String?
  material    String?
  price       Float?
  oldPrice    Float?
  stock       Int      @default(0)
  lowStock    Int      @default(5)
  weight      String?
  image       String?
  gallery     String   @default("[]")
  inStock     Boolean  @default(true)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  orderItems  OrderItem[]
  movements   InventoryMovement[]

  @@index([productId])
  @@index([color])
  @@index([size])
}
```

Also update the `Product` model:
- Make `color`, `size`, `sizes`, `price`, `oldPrice`, `stock`, `lowStock`, `sku`, `image`, `gallery`, `weight`, `material` fields optional (nullable) — these move to variants
- Keep `inStock` and `featured` on Product level
- Add `hasVariants Boolean @default(false)` — flag to know if product uses variants
- Add `variantAttributes String @default("[]")` — JSON array of attribute names like `["color", "size"]` that this product's variants use

Update `OrderItem` model to reference a variant:
```prisma
model OrderItem {
  id          String        @id @default(cuid())
  orderId     String
  order       Order         @relation(...)
  productId   String
  product     Product       @relation(...)
  variantId   String?
  variant     ProductVariant? @relation(...)
  quantity    Int
  price       Float
}
```

Update `InventoryMovement` model:
```prisma
model InventoryMovement {
  // ... existing fields
  variantId   String?
  variant     ProductVariant? @relation(...)
}
```

### Step 2: Run Prisma Migration

```bash
cd /opt/data/projects/dubraska-mago/
npx prisma migrate dev --name product_variants
npx prisma generate
```

### Step 3: Add Zod Schemas for Variants

Add to `src/lib/schemas.ts`:

```typescript
export const variantSchema = z.object({
  sku: z.string().min(1, "SKU requerido"),
  name: z.string().min(1, "Nombre requerido"),
  color: z.string().nullable().optional(),
  colorHex: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  oldPrice: z.number().positive().nullable().optional(),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  weight: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.string().default("[]"),
  inStock: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),
})

export const updateVariantSchema = variantSchema.partial()

export const createProductWithVariantsSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
  price: z.number().positive(),
  oldPrice: z.number().positive().nullable().optional(),
  material: z.string().default(""),
  length: z.string().nullable().optional(),
  diameter: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  color: z.string().default(""),
  badge: z.string().nullable().optional(),
  image: z.string().default(""),
  gallery: z.string().default("[]"),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  stock: z.number().int().default(0),
  lowStock: z.number().int().default(5),
  sku: z.string().default(""),
  categoryId: z.string().min(1),
  sizes: z.string().default("[]"),
  compareGroup: z.string().nullable().optional(),
  hasVariants: z.boolean().default(false),
  variantAttributes: z.string().default("[]"),
  variants: z.array(variantSchema).default([]),
})

export const updateProductWithVariantsSchema = createProductWithVariantsSchema.partial()
```

### Step 4: Create Variant API Routes

File: `src/app/api/products/[id]/variants/route.ts`
- GET: List all variants for a product (supports `?includeDeleted=true`)
- POST: Create a new variant for a product

```typescript
// GET /api/products/[id]/variants
async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const includeDeleted = searchParams.get("includeDeleted") === "true"
  
  const variants = await db.productVariant.findMany({
    where: {
      productId: id,
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    orderBy: { createdAt: "asc" },
  })
  
  return successResponse(variants.map(v => ({
    ...v,
    gallery: JSON.parse(v.gallery || "[]"),
  })))
}

// POST /api/products/[id]/variants
async function POST(request: NextRequest, { params }: RouteParams) {
  const user = requireAuth(request)
  const { id } = await params
  const body = await request.json()
  const data = variantSchema.parse(body)
  
  const product = await db.product.findUnique({ where: { id, deletedAt: null } })
  if (!product) return errorResponse("Product not found", 404)
  
  const variant = await db.productVariant.create({
    data: {
      productId: id,
      sku: data.sku,
      name: data.name,
      color: data.color,
      colorHex: data.colorHex,
      size: data.size,
      material: data.material,
      price: data.price,
      oldPrice: data.oldPrice,
      stock: data.stock,
      lowStock: data.lowStock,
      weight: data.weight,
      image: data.image,
      gallery: data.gallery,
      inStock: data.inStock,
      active: data.active,
    },
  })
  
  await logCreate(user, "ProductVariant", variant, request)
  return successResponse(variant, 201)
}
```

File: `src/app/api/products/[id]/variants/[variantId]/route.ts`
- GET: Single variant
- PATCH: Update variant
- DELETE: Soft delete variant

```typescript
// PATCH /api/products/[id]/variants/[variantId]
async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = requireAuth(request)
  const { variantId } = await params
  const body = await request.json()
  const data = updateVariantSchema.parse(body)
  
  const existing = await db.productVariant.findUnique({ where: { id: variantId, deletedAt: null } })
  if (!existing) return errorResponse("Variant not found", 404)
  
  const variant = await db.productVariant.update({
    where: { id: variantId },
    data,
  })
  
  await logUpdate(user, "ProductVariant", existing, existing as any, data as any, request)
  return successResponse(variant)
}

// DELETE /api/products/[id]/variants/[variantId]
async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = requireAuth(request)
  const { variantId } = await params
  
  const existing = await db.productVariant.findUnique({ where: { id: variantId, deletedAt: null } })
  if (!existing) return errorResponse("Variant not found", 404)
  
  await db.productVariant.update({
    where: { id: variantId },
    data: { deletedAt: new Date() },
  })
  
  await logDelete(user, "ProductVariant", existing, { sku: existing.sku, name: existing.name }, request)
  return successResponse({ message: "Variant deleted" })
}
```

File: `src/app/api/products/[id]/variants/bulk/route.ts`
- POST: Bulk create/update variants (for the variant matrix editor)

```typescript
// POST /api/products/[id]/variants/bulk
// Accepts { variants: [...], replaceExisting: boolean }
// If replaceExisting: true, deletes all existing variants and creates new ones
async function POST(request: NextRequest, { params }: RouteParams) {
  const user = requireAuth(request)
  const { id } = await params
  const body = await request.json()
  const { variants, replaceExisting } = body
  
  const product = await db.product.findUnique({ where: { id, deletedAt: null } })
  if (!product) return errorResponse("Product not found", 404)
  
  // Transaction
  const result = await db.$transaction(async (tx) => {
    if (replaceExisting) {
      await tx.productVariant.updateMany({
        where: { productId: id },
        data: { deletedAt: new Date() },
      })
    }
    
    const created = []
    for (const v of variants) {
      const data = variantSchema.parse(v)
      const variant = await tx.productVariant.create({
        data: {
          productId: id,
          sku: data.sku,
          name: data.name,
          color: data.color,
          colorHex: data.colorHex,
          size: data.size,
          material: data.material,
          price: data.price,
          oldPrice: data.oldPrice,
          stock: data.stock,
          lowStock: data.lowStock,
          weight: data.weight,
          image: data.image,
          gallery: data.gallery,
          inStock: data.inStock,
          active: data.active,
        },
      })
      created.push(variant)
    }
    
    // Update product flag
    await tx.product.update({
      where: { id },
      data: { hasVariants: created.length > 0 },
    })
    
    return created
  })
  
  await logUpdate(user, "Product", product, {}, { variantsCount: result.length }, request)
  return successResponse({ variants: result, count: result.length })
}
```

### Step 5: Update Product API to Support Variants

Modify `src/app/api/products/route.ts`:
- GET: Include variants in the response when `hasVariants: true` (add `variants` to the include)
- POST: Support creating product with variants in one request

Modify `src/app/api/products/[id]/route.ts`:
- PATCH: Update `hasVariants` and `variantAttributes` fields
- GET: Include variants in the response

### Step 6: Update Export/Import to Include Variants

Update `src/app/api/admin/export/products/route.ts`:
- For products with variants, export one row per variant (flattened)
- Include variant columns: Variant SKU, Variant Name, Color, Color Hex, Size, Material, Variant Price, Variant Stock

Update `src/app/api/admin/import/products/route.ts`:
- Support importing variants from a "variants" array in the JSON/Excel data
- If product has `hasVariants: true`, look for variant rows and create them

### Step 7: Add Variant Schemas for Import

Add to `src/lib/schemas.ts`:

```typescript
export const variantImportSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  color: z.string().nullable().optional(),
  colorHex: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  price: z.coerce.number().positive().nullable().optional(),
  oldPrice: z.coerce.number().positive().nullable().optional(),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  weight: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.string().default("[]"),
  inStock: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),
})
```

## File Structure After Changes

```
prisma/schema.prisma          — Added ProductVariant model, updated Product, OrderItem, InventoryMovement
src/lib/schemas.ts             — Added variantSchema, variantImportSchema, createProductWithVariantsSchema
src/app/api/products/[id]/
│   ├── variants/
│   │   ├── route.ts           — GET list, POST create
│   │   ├── bulk/route.ts      — POST bulk create/replace
│   │   └── [variantId]/route.ts — GET, PATCH, DELETE
src/app/api/admin/
│   ├── export/products/route.ts  — Updated to include variants
│   └── import/products/route.ts  — Updated to support variants
src/app/api/products/route.ts     — Updated to include variants in response
src/app/api/products/[id]/route.ts — Updated to include variants
```

## Code Rules (MANDATORY)
1. NO semicolons
2. Double quotes only
3. NO comments
4. 2-space indentation
5. TypeScript strict types — no `any`
6. All error messages in Spanish
7. Use `requireAuth(request)` on ALL admin routes
8. Use audit logging on all mutations
9. Filter `deletedAt: null` on all queries by default
10. Use Prisma transactions for bulk operations

## Verification
After making all changes, run:
```bash
npx prisma migrate dev --name product_variants && npx prisma generate && npm run build 2>&1 | tail -40
```
The build MUST succeed with zero errors.