import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateTestimonialSchema } from "@/lib/schemas"

async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const testimonial = await db.testimonial.findUnique({
      where: { id },
    })
    if (!testimonial) {
      return errorResponse("Testimonial not found", 404)
    }
    return successResponse(testimonial)
  } catch (error) {
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateTestimonialSchema.parse(body)
    const testimonial = await db.testimonial.update({
      where: { id },
      data,
    })
    return successResponse(testimonial)
  } catch (error) {
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.testimonial.delete({
      where: { id },
    })
    return successResponse({ message: "Testimonial deleted" })
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
