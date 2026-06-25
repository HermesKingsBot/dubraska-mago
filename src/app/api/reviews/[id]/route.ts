import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { updateReviewSchema } from "@/lib/schemas"

type RouteParams = { params: Promise<{ id: string }> }

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request)
    const { id } = await params
    const body = await request.json()
    const data = updateReviewSchema.parse(body)
    const existing = await db.review.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Reseña no encontrada", 404)
    }
    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.rating !== undefined) updateData.rating = data.rating
    if (data.title !== undefined) updateData.title = data.title
    if (data.comment !== undefined) updateData.comment = data.comment
    if (data.status !== undefined) updateData.status = data.status
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images)
    const review = await db.review.update({
      where: { id },
      data: updateData,
    })
    return successResponse({ ...review, images: JSON.parse(review.images || "[]") })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request)
    const { id } = await params
    const existing = await db.review.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Reseña no encontrada", 404)
    }
    await db.review.delete({ where: { id } })
    return successResponse({ message: "Reseña eliminada" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { PATCH, DELETE }
export default { PATCH, DELETE }
