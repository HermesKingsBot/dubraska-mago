### 7.4 Orders API

**`src/app/api/orders/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { createOrderSchema } from "@/lib/schemas"

export async function GET(): Promise<NextResponse> {
  try {
    const orders = await db.order.findMany({
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(orders)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = createOrderSchema.parse(body)

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`

    const total = data.items.reduce((sum, item) => sum + item.quantity * 0, 0)

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        notes: data.notes,
        total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    return successResponse(order, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```

**`src/app/api/orders/[id]/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const order = await db.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    })
    if (!order) return errorResponse("Order not found", 404)
    return successResponse(order)
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
    const { status } = body
    const order = await db.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    })
    return successResponse(order)
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 7.5 Inventory API

**`src/app/api/inventory/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"

export async function GET(): Promise<NextResponse> {
  try {
    const movements = await db.inventoryMovement.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return successResponse(movements)
  } catch (error) {
    return handleApiError(error)
  }
}
```

**`src/app/api/inventory/adjust/route.ts`**
```typescript
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { inventoryAdjustmentSchema } from "@/lib/schemas"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = inventoryAdjustmentSchema.parse(body)

    const movement = await db.$transaction(async (tx) => {
      const movement = await tx.inventoryMovement.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          reference: data.reference,
        },
      })

      const product = await tx.product.findUnique({
        where: { id: data.productId },
      })

      if (!product) {
        throw new Error("Product not found")
      }

      let newStock = product.stock
      if (data.type === "STOCK_IN") {
        newStock += data.quantity
      } else if (data.type === "STOCK_OUT") {
        newStock = Math.max(0, newStock - data.quantity)
      } else {
        newStock = data.quantity
      }

      await tx.product.update({
        where: { id: data.productId },
        data: { stock: newStock },
      })

      return movement
    })

    return successResponse(movement, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
```
