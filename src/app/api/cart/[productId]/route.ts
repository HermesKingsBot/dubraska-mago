import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"
import { updateCartItemSchema } from "@/lib/schemas"

type RouteParams = { params: Promise<{ productId: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { productId } = await params
    const item = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
      include: { product: true },
    })
    if (!item) {
      return errorResponse("Item no encontrado en el carrito", 404)
    }
    return successResponse(item)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Customers only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { productId } = await params
    const body = await request.json()
    const data = updateCartItemSchema.parse(body)
    const existing = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
    })
    if (!existing) {
      return errorResponse("Item no encontrado en el carrito", 404)
    }
    if (data.quantity === 0) {
      await db.cartItem.delete({ where: { id: existing.id } })
      return successResponse({ message: "Item eliminado del carrito" })
    }
    const item = await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: data.quantity },
      include: { product: true },
    })
    return successResponse(item)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Customers only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { productId } = await params
    const existing = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
    })
    if (!existing) {
      return errorResponse("Item no encontrado en el carrito", 404)
    }
    await db.cartItem.delete({ where: { id: existing.id } })
    return successResponse({ message: "Item eliminado del carrito" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Customers only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
