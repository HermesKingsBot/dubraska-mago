import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"

async function GET(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const items = await db.wishlistItem.findMany({
      where: { userId: user.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(items)
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

async function POST(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const body = await request.json()
    const { productId } = body as { productId: string }
    if (!productId) {
      return errorResponse("productId requerido", 400)
    }
    const product = await db.product.findUnique({
      where: { id: productId },
    })
    if (!product) {
      return errorResponse("Producto no encontrado", 404)
    }
    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
    })
    if (existing) {
      return successResponse(existing)
    }
    const item = await db.wishlistItem.create({
      data: {
        userId: user.userId,
        productId,
      },
      include: { product: true },
    })
    return successResponse(item, 201)
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

async function DELETE(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    await db.wishlistItem.deleteMany({
      where: { userId: user.userId },
    })
    return successResponse({ message: "Lista de deseos vaciada" })
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

export { GET, POST, DELETE }
export default { GET, POST, DELETE }
