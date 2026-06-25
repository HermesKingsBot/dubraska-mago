import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateCategorySchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logUpdate, logDelete } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({ where: { id, deletedAt: null } })
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
    const user = requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const data = updateCategorySchema.parse(body)
    const existing = await db.category.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse("Category not found", 404)
    }
    const oldValues: Record<string, unknown> = {}
    for (const key of Object.keys(data)) {
      ;(oldValues as any)[key] = (existing as any)[key]
    }
    const category = await db.category.update({
      where: { id },
      data,
    })
    await logUpdate(user, "Category", existing, oldValues, data as any, request)
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
    const user = requireAuth(request)
    const { id } = await params
    const existing = await db.category.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse("Category not found", 404)
    }
    await db.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    await logDelete(user, "Category", existing, { name: existing.name }, request)
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
