import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

async function GET(request: NextRequest) {
  try {
    const movements = await db.inventoryMovement.findMany({
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
