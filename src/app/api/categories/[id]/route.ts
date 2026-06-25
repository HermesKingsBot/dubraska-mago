import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateCategorySchema } from "@/lib/schemas"

async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })
    if (!category) {
      return errorResponse("Category not found", 404)
    }
    return successResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateCategorySchema.parse(body)
    const category = await db.category.update({
      where: { id },
      data,
    })
    return successResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.category.delete({
      where: { id },
    })
    return successResponse({ message: "Category deleted" })
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
