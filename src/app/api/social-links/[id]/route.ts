import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateSocialLinkSchema } from "@/lib/schemas"
import { requireAdmin } from "@/lib/auth"
import { logUpdate, logDelete } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const link = await db.socialLink.findUnique({ where: { id, deletedAt: null } })
    if (!link) {
      return errorResponse('Social link not found', 404)
    }
    return successResponse(link)
  } catch (error) {
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = requireAdmin(request)
    const { id } = await params
    const body = await request.json()
    const data = updateSocialLinkSchema.parse(body)
    const existing = await db.socialLink.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse('Social link not found', 404)
    }
    const oldValues: Record<string, unknown> = {}
    for (const key of Object.keys(data)) {
      ;(oldValues as any)[key] = (existing as any)[key]
    }
    const link = await db.socialLink.update({
      where: { id },
      data,
    })
    await logUpdate(admin, "SocialLink", existing, oldValues, data as any, request)
    return successResponse(link)
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden: Admins only')) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = requireAdmin(request)
    const { id } = await params
    const existing = await db.socialLink.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse('Social link not found', 404)
    }
    await db.socialLink.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    await logDelete(admin, "SocialLink", existing, { platform: existing.platform }, request)
    return successResponse({ message: 'Social link deleted' })
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Forbidden: Admins only')) {
      return errorResponse(error.message, 401)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
