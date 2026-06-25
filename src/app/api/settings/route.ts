import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { bulkUpdateSettingsSchema } from "@/lib/schemas"
import { requireAdmin } from "@/lib/auth"
import { clearSettingsCache } from "@/lib/settings"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const where = group ? { group } : {}
    const settings = await db.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
    })
    const data: Record<string, string> = {}
    for (const s of settings) {
      data[s.key] = s.value
    }
    return successResponse(data)
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    requireAdmin(request)
    const body = await request.json()
    const { settings } = bulkUpdateSettingsSchema.parse(body)
    for (const s of settings) {
      await db.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value },
      })
    }
    clearSettingsCache()
    return successResponse({ message: 'Settings updated' })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden: Admins only')) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
