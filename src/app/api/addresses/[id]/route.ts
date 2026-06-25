import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"
import { addressSchema } from "@/lib/schemas"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { id } = await params
    const address = await db.address.findFirst({
      where: { id, userId: user.userId },
    })
    if (!address) {
      return errorResponse("Dirección no encontrada", 404)
    }
    return successResponse(address)
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

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { id } = await params
    const body = await request.json()
    const existing = await db.address.findFirst({
      where: { id, userId: user.userId },
    })
    if (!existing) {
      return errorResponse("Dirección no encontrada", 404)
    }
    if (body.isDefault) {
      await db.address.updateMany({
        where: { userId: user.userId, id: { not: id } },
        data: { isDefault: false },
      })
    }
    const address = await db.address.update({
      where: { id },
      data: body,
    })
    return successResponse(address)
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

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireCustomer(request)
    const { id } = await params
    const existing = await db.address.findFirst({
      where: { id, userId: user.userId },
    })
    if (!existing) {
      return errorResponse("Dirección no encontrada", 404)
    }
    await db.address.delete({ where: { id } })
    return successResponse({ message: "Dirección eliminada" })
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

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
