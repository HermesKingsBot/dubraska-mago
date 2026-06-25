import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

type RouteParams = { params: Promise<{ id: string }> }

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const existing = await db.review.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Reseña no encontrada", 404)
    }
    const review = await db.review.update({
      where: { id },
      data: { helpful: existing.helpful + 1 },
    })
    return successResponse({ helpful: review.helpful })
  } catch (error) {
    return handleApiError(error)
  }
}

export { PATCH }
export default { PATCH }
