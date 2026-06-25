import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { auditLogQuerySchema } from "@/lib/schemas"

async function GET(request: NextRequest) {
  try {
    requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const query = auditLogQuerySchema.parse(Object.fromEntries(searchParams))

    const where: Record<string, unknown> = {}
    if (query.action) where.action = query.action
    if (query.entityType) where.entityType = query.entityType
    if (query.userId) where.userId = query.userId
    if (query.search) where.description = { contains: query.search }
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {}
      if (query.from) createdAt.gte = new Date(query.from)
      if (query.to) createdAt.lte = new Date(query.to)
      where.createdAt = createdAt
    }

    const [items, total] = await Promise.all([
      db.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      db.activityLog.count({ where }),
    ])

    return successResponse({
      items,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit),
    })
  } catch (error) {
    if (error instanceof Error && (error.message === "Unauthorized" || error.message === "Forbidden: Admins only")) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

export { GET }
export default { GET }
