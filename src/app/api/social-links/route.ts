import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { socialLinkSchema } from "@/lib/schemas"
import { requireAdmin } from "@/lib/auth"
import { logCreate } from "@/lib/audit"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const where: Record<string, unknown> = { deletedAt: null }
    if (!all) where.active = true
    const links = await db.socialLink.findMany({
      where,
      orderBy: { order: 'asc' },
    })
    return successResponse(links)
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    const body = await request.json()
    const data = socialLinkSchema.parse(body)
    const link = await db.socialLink.create({ data })
    await logCreate(admin, "SocialLink", link, request)
    return successResponse(link, 201)
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden: Admins only')) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request)
    const body = await request.json()
    const { reorder } = body
    if (!Array.isArray(reorder)) {
      return errorResponse('reorder array required', 400)
    }
    for (const item of reorder) {
      if (item.id && typeof item.order === 'number') {
        await db.socialLink.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      }
    }
    return successResponse({ message: 'Reordered' })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden: Admins only')) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST, PATCH }
export default { GET, POST, PATCH }
