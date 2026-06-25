import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createCategorySchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    const categories = await db.category.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: "asc" },
    })
    return successResponse(categories)
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const data = createCategorySchema.parse(body)
    const category = await db.category.create({ data })
    await logCreate(user, "Category", category, request)
    return successResponse(category, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
