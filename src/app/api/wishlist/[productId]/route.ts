import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"

type RouteParams = { params: Promise<{ productId: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { productId } = await params
    const item = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
    })
    return successResponse({ inWishlist: !!item })
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
    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
    })
    if (!existing) {
      return errorResponse("Producto no está en lista de deseos", 404)
    }
    await db.wishlistItem.delete({ where: { id: existing.id } })
    return successResponse({ message: "Eliminado de lista de deseos" })
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

export { GET, DELETE }
export default { GET, DELETE }
