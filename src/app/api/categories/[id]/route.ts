import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateCategorySchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({ where: { id } })
    if (!category) {
      return errorResponse("Category not found", 404)
    }
    return successResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const data = updateCategorySchema.parse(body)
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Category not found", 404)
    }
    const category = await db.category.update({
      where: { id },
      data,
    })
    return successResponse(category)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAuth(request)
    const { id } = await params
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Category not found", 404)
    }
    await db.category.delete({ where: { id } })
    return successResponse({ message: "Category deleted" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
