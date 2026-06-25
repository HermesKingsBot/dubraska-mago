## Step 4: Prisma Client Singleton (`src/lib/db.ts`)

```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

export default db
```

## Step 5: API Response Helpers (`src/lib/api.ts`)

```typescript
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
    return errorResponse(messages, 422)
  }
  console.error(error)
  return errorResponse("Internal server error", 500)
}

export function parseSearchParams(url: URL): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {}
  url.searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value)
      } else {
        params[key] = [params[key] as string, value]
      }
    } else {
      params[key] = value
    }
  })
  return params
}
```

## Step 6: Validation Schemas (`src/lib/schemas.ts`)

```typescript
import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1),
  price: z.number().positive(),
  oldPrice: z.number().positive().nullable().optional(),
  material: z.string().min(1),
  length: z.string().optional(),
  diameter: z.string().optional(),
  weight: z.string().optional(),
  color: z.enum(["dorado", "plateado", "rose", "negro"]),
  badge: z.string().nullable().optional(),
  image: z.string().min(1),
  gallery: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
  lowStock: z.number().int().min(0).optional(),
  sku: z.string().min(1),
  categoryId: z.string().min(1),
})

export const updateProductSchema = createProductSchema.partial()

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const createTestimonialSchema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  productId: z.string().optional(),
  date: z.string().datetime().optional(),
  active: z.boolean().optional(),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  })),
})

export const inventoryAdjustmentSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"]),
  quantity: z.number().int(),
  reason: z.string().optional(),
  reference: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```
