import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"
import { z } from "zod"

const addWishlistSchema = z.object({
  productId: z.string().min(1),
})

async function GET(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    const items = await db.wishlistItem.findMany({
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
    const data = addWishlistSchema.parse(body)

    const product = await db.product.findUnique({ where: { id: data.productId } })
    if (!product) {
      return errorResponse("Producto no encontrado", 404)
    }

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: auth.id, productId: data.productId } },
    })
    if (existing) {
      return errorResponse("Producto ya está en la lista de deseos", 409)
    }

    const item = await db.wishlistItem.create({
      data: { userId: auth.id, productId: data.productId },
      include: { product: true },
    })
    return successResponse(item, 201)
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
    const body = await request.json()
    const data = addWishlistSchema.parse(body)

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: auth.id, productId: data.productId } },
    })
    if (!existing) {
      return errorResponse("Producto no encontrado en la lista de deseos", 404)
    }

    await db.wishlistItem.delete({
      where: { userId_productId: { userId: auth.id, productId: data.productId } },
    })
    return successResponse({ message: "Eliminado de la lista de deseos" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST, DELETE }
export default { GET, POST, DELETE }
