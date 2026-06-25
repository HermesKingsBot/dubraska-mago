import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"

type RouteParams = { params: Promise<{ orderNumber: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireCustomerAuth(request)
    const { orderNumber } = await params
    const order = await db.order.findFirst({
      where: { orderNumber, userId: auth.id },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    })
    if (!order) {
      return errorResponse("Pedido no encontrado", 404)
    }
    return successResponse(order)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET }
export default { GET }
