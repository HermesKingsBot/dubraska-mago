import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"
import { z } from "zod"

type RouteParams = { params: Promise<{ productId: string }> }

const updateSchema = z.object({
  quantity: z.number().int().min(0),
})

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireCustomerAuth(request)
    const { productId } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const existing = await db.cartItem.findUnique({
      where: { userId_productId: { userId: auth.id, productId } },
    })
    if (!existing) {
      return errorResponse("Producto no encontrado en el carrito", 404)
    }

    if (data.quantity <= 0) {
      await db.cartItem.delete({ where: { id: existing.id } })
      return successResponse({ message: "Eliminado del carrito" })
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
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireCustomerAuth(request)
    const { productId } = await params

    const existing = await db.cartItem.findUnique({
      where: { userId_productId: { userId: auth.id, productId } },
    })
    if (!existing) {
      return errorResponse("Producto no encontrado en el carrito", 404)
    }

    await db.cartItem.delete({ where: { id: existing.id } })
    return successResponse({ message: "Eliminado del carrito" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { PATCH, DELETE }
export default { PATCH, DELETE }
