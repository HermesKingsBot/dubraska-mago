import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { logStatusChange } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = requireAdmin(request)
    const { id } = await params
    const body = await request.json()
    const { status, adminNote } = body as {
      status: "APPROVED" | "REJECTED"
      adminNote?: string
    }
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return errorResponse("Status must be APPROVED or REJECTED", 400)
    }

    const payment = await db.payment.findUnique({
      where: { id },
      include: { order: true },
    })
    if (!payment) {
      return errorResponse("Payment not found", 404)
    }

    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
        verifiedAt: new Date(),
        verifiedBy: admin.userId,
        paidAt: status === "APPROVED" ? (payment.paidAt || new Date()) : null,
      },
    })

    const orderStatus = status === "APPROVED" ? "PAYMENT_APPROVED" : "PAYMENT_PENDING"
    await db.order.update({
      where: { id: payment.orderId },
      data: { status: orderStatus },
    })

    await logStatusChange(admin, "Payment", payment, payment.status, status, request)

    return successResponse(updatedPayment)
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

export { PATCH }
export default { PATCH }
