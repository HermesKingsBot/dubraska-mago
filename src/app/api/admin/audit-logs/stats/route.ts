import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

async function GET(request: NextRequest) {
  try {
    requireAdmin(request)

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [todayCount, weekCount, monthCount, actionsByType, recentLogs] = await Promise.all([
      db.activityLog.count({ where: { createdAt: { gte: startOfDay } } }),
      db.activityLog.count({ where: { createdAt: { gte: startOfWeek } } }),
      db.activityLog.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.activityLog.groupBy({
        by: ["action"],
        _count: true,
        orderBy: { _count: { action: "desc" } },
      }),
      db.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, action: true, entityType: true, description: true, userEmail: true, createdAt: true },
      }),
    ])

    const topAdmins = await db.activityLog.groupBy({
      by: ["userEmail"],
      _count: true,
      orderBy: { _count: { userEmail: "desc" } },
      take: 10,
    })

    return successResponse({
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
      actionsByType: actionsByType.map(a => ({ action: a.action, count: a._count })),
      topAdmins: topAdmins.filter(a => a.userEmail).map(a => ({ email: a.userEmail, count: a._count })),
      recent: recentLogs,
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
