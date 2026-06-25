import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"

async function GET(request: NextRequest) {
  try {
    requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const productId = searchParams.get("productId") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Record<string, unknown> = { deletedAt: null }
    if (status) where.status = status
    if (productId) where.productId = productId

    const [items, total] = await Promise.all([
      db.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { product: { select: { name: true, slug: true } } },
      }),
      db.review.count({ where }),
    ])

    const itemsParsed = items.map((r) => ({
      ...r,
      images: JSON.parse(r.images || "[]"),
    }))

    return successResponse({
      items: itemsParsed,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET }
export default { GET }
