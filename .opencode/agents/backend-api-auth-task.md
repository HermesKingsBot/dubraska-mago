### 7.6 Auth API

**`src/app/api/auth/login/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { loginSchema } from "@/lib/schemas"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await db.adminUser.findUnique({ where: { email } })
    if (!user || !user.active) {
      return errorResponse("Invalid credentials", 401)
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return errorResponse("Invalid credentials", 401)
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```

**`src/app/api/auth/me/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import db from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse("Unauthorized", 401)
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    const user = await db.adminUser.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!user) return errorResponse("User not found", 404)
    return successResponse(user)
  } catch {
    return errorResponse("Invalid token", 401)
  }
}
```

**`src/app/api/auth/logout/route.ts`**
```typescript
import { NextResponse } from "next/server"
import { successResponse } from "@/lib/api"

export async function POST(): Promise<NextResponse> {
  return successResponse({ loggedOut: true })
}
```

### 7.7 Seed Route

**`src/app/api/seed/route.ts`**

Populate database with initial data from products.json and testimonials.json.

```typescript
import { NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import products from "../../../../data/products.json"
import testimonials from "../../../../data/testimonials.json"

export async function POST(): Promise<NextResponse> {
  try {
    await db.inventoryMovement.deleteMany()
    await db.orderItem.deleteMany()
    await db.order.deleteMany()
    await db.testimonial.deleteMany()
    await db.product.deleteMany()
    await db.category.deleteMany()

    const categoryMap: Record<string, string> = {}
    const uniqueCategories = [...new Set(products.map((p: { category: string }) => p.category))]

    for (const catName of uniqueCategories) {
      const category = await db.category.create({
        data: {
          name: catName.charAt(0).toUpperCase() + catName.slice(1),
          slug: catName,
          description: `${catName.charAt(0).toUpperCase() + catName.slice(1)} collection`,
          active: true,
          order: uniqueCategories.indexOf(catName),
        },
      })
      categoryMap[catName] = category.id
    }

    for (const product of products as Record<string, unknown>[]) {
      await db.product.create({
        data: {
          id: product.id as string,
          name: product.name as string,
          slug: product.slug as string,
          description: product.description as string,
          price: product.price as number,
          oldPrice: product.oldPrice as number | null,
          material: product.material as string,
          length: product.length as string | null,
          weight: product.weight as string | null,
          color: product.color as string,
          badge: product.badge as string | null,
          image: product.image as string,
          gallery: JSON.stringify([]),
          inStock: product.inStock as boolean,
          featured: product.featured as boolean,
          stock: 15,
          lowStock: 5,
          sku: `${(product.id as string).slice(0, 3).toUpperCase()}-${(product.id as string).slice(-3).toUpperCase()}`,
          categoryId: categoryMap[product.category as string],
        },
      })
    }

    for (const t of testimonials as Record<string, unknown>[]) {
      await db.testimonial.create({
        data: {
          id: t.id as string,
          name: t.name as string,
          text: t.text as string,
          rating: t.rating as number,
          productId: t.productId as string | null,
          date: new Date(t.date as string),
          active: t.active as boolean,
        },
      })
    }

    const adminPassword = "$2a$10$placeholder"
    await db.adminUser.create({
      data: {
        email: "admin@dubraskamago.com",
        name: "Dubraska Mago",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    return successResponse({
      message: "Database seeded successfully",
      categories: uniqueCategories.length,
      products: products.length,
      testimonials: testimonials.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```
