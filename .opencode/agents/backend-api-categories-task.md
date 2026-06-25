### 7.2 Categories API

**`src/app/api/categories/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { createCategorySchema } from "@/lib/schemas"

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    })
    return successResponse(categories)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = createCategorySchema.parse(body)
    const category = await db.category.create({ data })
    return successResponse(category, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```

**`src/app/api/categories/[id]/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateCategorySchema } from "@/lib/schemas"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const category = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    })
    if (!category) return errorResponse("Category not found", 404)
    return successResponse(category)
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
    const data = updateCategorySchema.parse(body)
    const category = await db.category.update({ where: { id }, data })
    return successResponse(category)
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
    await db.category.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 7.3 Testimonials API

**`src/app/api/testimonials/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { createTestimonialSchema } from "@/lib/schemas"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active") === "true"
    const where: Record<string, unknown> = {}
    if (active) where.active = true

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: { date: "desc" },
    })
    return successResponse(testimonials)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = createTestimonialSchema.parse(body)
    const testimonial = await db.testimonial.create({ data })
    return successResponse(testimonial, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```

**`src/app/api/testimonials/[id]/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateTestimonialSchema } from "@/lib/schemas"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateTestimonialSchema.parse(body)
    const testimonial = await db.testimonial.update({ where: { id }, data })
    return successResponse(testimonial)
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
    await db.testimonial.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    return handleApiError(error)
  }
}
```
