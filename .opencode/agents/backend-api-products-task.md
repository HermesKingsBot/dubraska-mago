## Step 7: API Routes to Create

### 7.1 Products API

**`src/app/api/products/route.ts`** — GET (list) + POST (create)

```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createProductSchema } from "@/lib/schemas"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const color = searchParams.get("color") || undefined
    const featured = searchParams.get("featured") === "true"
    const inStock = searchParams.get("inStock") === "true"
    const search = searchParams.get("q") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Record<string, unknown> = {}
    if (category) where.categoryId = category
    if (color) where.color = color
    if (featured) where.featured = true
    if (inStock) where.inStock = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ]
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    return successResponse({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = createProductSchema.parse(body)
    const product = await db.product.create({ data })
    return successResponse(product, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```

**`src/app/api/products/[id]/route.ts`** — GET (one) + PATCH (update) + DELETE

```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateProductSchema } from "@/lib/schemas"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) return errorResponse("Product not found", 404)
    return successResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateProductSchema.parse(body)
    const product = await db.product.update({ where: { id }, data })
    return successResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    return handleApiError(error)
  }
}
```
