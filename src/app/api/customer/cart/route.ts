import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"
import { z } from "zod"

const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
})

async function GET(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    const items = await db.cartItem.findMany({
      where: { userId: auth.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(items)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    const body = await request.json()
    const data = cartItemSchema.parse(body)

    const product = await db.product.findUnique({ where: { id: data.productId, deletedAt: null } })
    if (!product) {
      return errorResponse("Producto no encontrado", 404)
    }

    const item = await db.cartItem.upsert({
      where: { userId_productId: { userId: auth.id, productId: data.productId } },
      update: { quantity: data.quantity },
      create: { userId: auth.id, productId: data.productId, quantity: data.quantity },
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

async function DELETE(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    await db.cartItem.deleteMany({
      where: { userId: auth.id },
    })
    return successResponse({ message: "Carrito vaciado" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST, DELETE }
export default { GET, POST, DELETE }
