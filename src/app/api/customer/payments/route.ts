import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"
import { z } from "zod"

const paymentSchema = z.object({
  orderId: z.string().min(1),
  method: z.enum(["transferencia", "pago_movil", "zelle", "paypal", "efectivo"]),
  reference: z.string().optional(),
  amount: z.number().positive(),
  proofImageUrl: z.string().optional(),
})

async function POST(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    const body = await request.json()
    const data = paymentSchema.parse(body)

    const order = await db.order.findFirst({
      where: { id: data.orderId, userId: auth.id },
    })
    if (!order) {
      return errorResponse("Pedido no encontrado", 404)
    }

    const existingPayment = await db.payment.findUnique({
      where: { orderId: data.orderId },
    })
    if (existingPayment) {
      return errorResponse("Ya existe un pago registrado para este pedido", 409)
    }

    const payment = await db.payment.create({
      data: {
        orderId: data.orderId,
        userId: auth.id,
        amount: data.amount,
        method: data.method,
        reference: data.reference || null,
        proofImageUrl: data.proofImageUrl || null,
        status: "PENDING",
      },
    })

    await db.order.update({
      where: { id: data.orderId },
      data: { status: "PAYMENT_REVIEW" },
    })

    return successResponse(payment, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
