import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createTestimonialSchema } from "@/lib/schemas"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const where = active === "true" ? { active: true } : {}
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
    const body = await request.json()
    const data = createTestimonialSchema.parse(body)
    const testimonial = await db.testimonial.create({ data })
    return successResponse(testimonial, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
