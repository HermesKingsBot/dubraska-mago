import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { z } from "zod"

type RouteParams = { params: Promise<{ id: string }> }

const updatePaymentSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().optional(),
})

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request)
    const { id } = await params
    const payment = await db.payment.findUnique({
      where: { orderId: id },
      include: { order: true, user: { select: { id: true, name: true, email: true } } },
    })
    if (!payment) {
      return errorResponse("Pago no encontrado", 404)
    }
    return successResponse(payment)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Admins only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = requireAdmin(request)
    const { id } = await params
    const body = await request.json()
    const data = updatePaymentSchema.parse(body)

    const payment = await db.payment.findUnique({
      where: { orderId: id },
    })
    if (!payment) {
      return errorResponse("Pago no encontrado", 404)
    }

    const updated = await db.payment.update({
      where: { orderId: id },
      data: {
        status: data.status,
        adminNote: data.adminNote || null,
        verifiedAt: new Date(),
        verifiedBy: admin.userId,
      },
    })

    await db.order.update({
      where: { id },
      data: {
        status: data.status === "APPROVED" ? "CONFIRMED" : "PAYMENT_REJECTED",
      },
    })

    return successResponse(updated)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Admins only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH }
export default { GET, PATCH }
