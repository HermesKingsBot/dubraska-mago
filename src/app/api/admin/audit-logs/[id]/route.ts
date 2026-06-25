import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request)
    const { id } = await params
    const log = await db.activityLog.findUnique({ where: { id } })
    if (!log) {
      return errorResponse("Log not found", 404)
    }
    return successResponse({
      ...log,
      oldValues: log.oldValues ? JSON.parse(log.oldValues) : null,
      newValues: log.newValues ? JSON.parse(log.newValues) : null,
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
