import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { inventoryAdjustmentSchema } from "@/lib/schemas"

async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = inventoryAdjustmentSchema.parse(body)
    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: data.productId, deletedAt: null },
      })
      if (!product) {
        throw new Error("Product not found")
      }
      let newStock = product.stock
      if (data.type === "STOCK_IN") {
        newStock = product.stock + data.quantity
      } else if (data.type === "STOCK_OUT") {
        newStock = product.stock - data.quantity
      } else if (data.type === "SET") {
        newStock = data.quantity
      }
      const updatedProduct = await tx.product.update({
        where: { id: data.productId },
        data: { stock: newStock },
      })
      const movement = await tx.inventoryMovement.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          reference: data.reference,
          previousStock: product.stock,
          newStock,
        },
      })
      return { product: updatedProduct, movement }
    })
    return successResponse(result, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
