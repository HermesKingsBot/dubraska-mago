import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createCategorySchema } from "@/lib/schemas"

async function GET(request: NextRequest) {
  try {
    const categories = await db.category.findMany({
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
    const body = await request.json()
    const data = createCategorySchema.parse(body)
    const category = await db.category.create({ data })
    return successResponse(category, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
