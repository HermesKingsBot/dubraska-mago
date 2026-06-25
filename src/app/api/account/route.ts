import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"

async function GET(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const profile = await db.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })
    if (!profile) {
      return errorResponse("Usuario no encontrado", 404)
    }
    return successResponse(profile)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Customers only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const body = await request.json()
    const { name, email, phone } = body as {
      name?: string
      email?: string
      phone?: string
    }
    if (email) {
      const existing = await db.user.findFirst({
        where: { email, id: { not: user.userId } },
      })
      if (existing) {
        return errorResponse("El email ya está en uso", 400)
      }
    }
    const updated = await db.user.update({
      where: { id: user.userId },
      data: { name, email, phone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    })
    return successResponse(updated)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Customers only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH }
export default { GET, PATCH }
