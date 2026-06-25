import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || undefined
    const entityType = searchParams.get("entityType") || undefined
    const search = searchParams.get("q") || undefined
    const userId = searchParams.get("userId") || undefined
    const from = searchParams.get("from") || undefined
    const to = searchParams.get("to") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: Record<string, unknown> = {}
    if (action) where.action = action
    if (entityType) where.entityType = entityType
    if (userId) where.userId = userId
    if (search) {
      where.OR = [
        { description: { contains: search } },
        { entityName: { contains: search } },
      ]
    }
    if (from || to) {
      where.createdAt = {}
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from)
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to + "T23:59:59.999Z")
    }

    const [logs, total] = await Promise.all([
      db.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.activityLog.count({ where }),
    ])

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [todayCount, weekCount, monthCount, totalCount, actionCounts] = await Promise.all([
      db.activityLog.count({ where: { createdAt: { gte: startOfDay } } }),
      db.activityLog.count({ where: { createdAt: { gte: startOfWeek } } }),
      db.activityLog.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.activityLog.count(),
      db.activityLog.groupBy({ by: ["action"], _count: true }),
    ])

    const byAction: Record<string, number> = {}
    actionCounts.forEach((a) => { byAction[a.action] = a._count })

    const mostCommon = Object.entries(byAction).sort(([, a], [, b]) => b - a)[0]

    return successResponse({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        today: todayCount,
        week: weekCount,
        month: monthCount,
        total: totalCount,
        byAction,
        mostCommon: mostCommon ? mostCommon[0] : null,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
