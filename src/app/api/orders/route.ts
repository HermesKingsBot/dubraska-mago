import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAuth, requireCustomer } from "@/lib/auth"
import { checkoutSchema } from "@/lib/schemas"
import { calculateCartTotal, validateStock, generateOrderNumber } from "@/lib/cart-utils"

async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (user.role === "CUSTOMER") {
      where.userId = user.userId
    }

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(orders)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const body = await request.json()
    const data = checkoutSchema.parse(body)

    const address = await db.address.findFirst({
      where: { id: data.addressId, userId: user.userId },
    })
    if (!address) {
      return errorResponse("Dirección no encontrada", 404)
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: user.userId },
      include: { product: true },
    })
    if (cartItems.length === 0) {
      return errorResponse("Carrito vacío", 400)
    }

    const stockCheck = await validateStock(
      cartItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
    )
    if (!stockCheck.valid) {
      return errorResponse(stockCheck.errors.join(". "), 400)
    }

    const order = await db.$transaction(async (tx) => {
      const subtotal = calculateCartTotal(
        cartItems.map(i => ({ price: Number(i.product.price), quantity: i.quantity }))
      )
      const shippingCost = data.shippingCost || 0
      const total = subtotal + shippingCost
      const orderNumber = generateOrderNumber()

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.userId,
          customerName: user.email,
          customerEmail: user.email,
          shippingName: address.fullName,
          shippingPhone: address.phone,
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingZip: address.zipCode,
          shippingCarrier: data.shippingCarrier,
          shippingOffice: data.shippingOffice,
          shippingRef: address.reference,
          subtotal,
          shippingCost,
          total,
          notes: data.notes || null,
          status: "PAYMENT_PENDING",
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: Number(item.product.price),
            })),
          },
        },
        include: {
          items: { include: { product: true } },
          payment: true,
        },
      })

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      await tx.cartItem.deleteMany({
        where: { userId: user.userId },
      })

      return newOrder
    })

    return successResponse(order, 201)
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

export { GET, POST }
export default { GET, POST }
