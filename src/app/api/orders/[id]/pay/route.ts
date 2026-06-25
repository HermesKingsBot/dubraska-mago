import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"
import { paymentSchema } from "@/lib/schemas"

type RouteParams = { params: Promise<{ id: string }> }

async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { id } = await params
    const body = await request.json()
    const data = paymentSchema.parse(body)

    const order = await db.order.findFirst({
      where: { id, userId: user.userId },
    })
    if (!order) {
      return errorResponse("Orden no encontrada", 404)
    }
    if (order.status !== "PAYMENT_PENDING" && order.status !== "PAYMENT_SUBMITTED") {
      return errorResponse("La orden no está pendiente de pago", 400)
    }

    const existingPayment = await db.payment.findUnique({
      where: { orderId: id },
    })
    if (existingPayment) {
      const payment = await db.payment.update({
        where: { id: existingPayment.id },
        data: {
          method: data.method,
          reference: data.reference || null,
          amount: data.amount,
          status: "PENDING",
          adminNote: null,
          verifiedAt: null,
          verifiedBy: null,
        },
      })
      await db.order.update({
        where: { id },
        data: { status: "PAYMENT_SUBMITTED" },
      })
      return successResponse(payment)
    }

    const payment = await db.payment.create({
      data: {
        orderId: id,
        userId: user.userId,
        method: data.method,
        reference: data.reference || null,
        amount: data.amount,
        status: "PENDING",
      },
    })
    await db.order.update({
      where: { id },
      data: { status: "PAYMENT_SUBMITTED" },
    })
    return successResponse(payment, 201)
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

export { POST }
export default { POST }
