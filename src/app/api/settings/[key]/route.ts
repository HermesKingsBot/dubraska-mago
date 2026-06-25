import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"
import { clearSettingsCache } from "@/lib/settings"

type RouteParams = { params: Promise<{ key: string }> }

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request)
    const { key } = await params
    const body = await request.json()
    const { value } = body
    if (typeof value !== 'string') {
      return errorResponse('Value must be a string', 400)
    }
    const existing = await db.setting.findUnique({ where: { key } })
    if (!existing) {
      return errorResponse('Setting not found', 404)
    }
    await db.setting.update({
      where: { key },
      data: { value },
    })
    clearSettingsCache()
    return successResponse({ message: 'Setting updated' })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden: Admins only')) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

export { PATCH }
export default { PATCH }
