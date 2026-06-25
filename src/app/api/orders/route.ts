import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createOrderSchema } from "@/lib/schemas"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const sort = searchParams.get("sort") || "newest"

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const orderBy: Record<string, string> = {}
    switch (sort) {
      case "oldest": orderBy.createdAt = "asc"; break
      case "total": orderBy.total = "desc"; break
      default: orderBy.createdAt = "desc"
    }

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy,
    })
    return successResponse(orders)
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createOrderSchema.parse(body)
    const total = await db.$transaction(async (tx) => {
      let orderTotal = 0
      const productPrices: Record<string, number> = {}
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })
        if (!product) {
          throw new Error("Product not found: " + item.productId)
        }
        productPrices[item.productId] = Number(product.price)
        orderTotal += Number(product.price) * item.quantity
      }
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          notes: data.notes,
          total: orderTotal,
          status: "PENDING",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productPrices[item.productId],
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
      return order
    })
    return successResponse(total, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
