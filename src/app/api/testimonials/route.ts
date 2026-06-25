import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createTestimonialSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const rating = searchParams.get("rating")
    const productId = searchParams.get("productId")

    const where: Record<string, unknown> = {}
    const includeDeleted = searchParams.get("includeDeleted") === "true"
    if (!includeDeleted) where.deletedAt = null
    if (active === "true") where.active = true
    if (active === "false") where.active = false
    if (rating) where.rating = parseInt(rating)
    if (productId) where.productId = productId

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: { date: "desc" },
    })
    return successResponse(testimonials)
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const data = createTestimonialSchema.parse(body)
    const testimonial = await db.testimonial.create({ data })
    await logCreate(user, "Testimonial", testimonial, request)
    return successResponse(testimonial, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
