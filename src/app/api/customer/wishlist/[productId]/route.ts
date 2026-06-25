import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"

type RouteParams = { params: Promise<{ productId: string }> }

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireCustomerAuth(request)
    const { productId } = await params

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: auth.id, productId } },
    })
    if (!existing) {
      return errorResponse("Producto no encontrado en la lista de deseos", 404)
    }

    await db.wishlistItem.delete({ where: { id: existing.id } })
    return successResponse({ message: "Eliminado de la lista de deseos" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { DELETE }
export default { DELETE }
