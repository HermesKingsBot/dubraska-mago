import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId") || undefined
    const type = searchParams.get("type") || undefined

    const where: Record<string, unknown> = {}
    if (productId) where.productId = productId
    if (type) where.type = type

    const movements = await db.inventoryMovement.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return successResponse(movements)
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET }
export default { GET }
