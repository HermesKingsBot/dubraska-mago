import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateTestimonialSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logUpdate, logDelete, logStatusChange } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const testimonial = await db.testimonial.findUnique({ where: { id, deletedAt: null } })
    if (!testimonial) {
      return errorResponse("Testimonial not found", 404)
    }
    return successResponse(testimonial)
  } catch (error) {
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const data = updateTestimonialSchema.parse(body)
    const existing = await db.testimonial.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse("Testimonial not found", 404)
    }
    const oldValues: Record<string, unknown> = {}
    for (const key of Object.keys(data)) {
      ;(oldValues as any)[key] = (existing as any)[key]
    }
    const testimonial = await db.testimonial.update({
      where: { id },
      data,
    })
    if (data.active !== undefined && data.active !== existing.active) {
      await logStatusChange(user, "Testimonial", existing, existing.active ? "active" : "inactive", data.active ? "active" : "inactive", request)
    } else {
      await logUpdate(user, "Testimonial", existing, oldValues, data as any, request)
    }
    return successResponse(testimonial)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const existing = await db.testimonial.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse("Testimonial not found", 404)
    }
    await db.testimonial.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    await logDelete(user, "Testimonial", existing, { name: existing.name }, request)
    return successResponse({ message: "Testimonial deleted" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
