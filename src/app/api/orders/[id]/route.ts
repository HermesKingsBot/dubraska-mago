import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAuth, requireAdmin } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    })
    if (!order) {
      return errorResponse("Order not found", 404)
    }
    if (user.role === "CUSTOMER" && order.userId !== user.userId) {
      return errorResponse("Forbidden", 403)
    }
    return successResponse(order)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAdmin(request)
    const { id } = await params
    const body = await request.json()
    const existing = await db.order.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Order not found", 404)
    }
    const order = await db.order.update({
      where: { id },
      data: body,
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    })
    return successResponse(order)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Admins only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request)
    const { id } = await params
    const existing = await db.order.findUnique({ where: { id } })
    if (!existing) {
      return errorResponse("Order not found", 404)
    }
    await db.order.delete({ where: { id } })
    return successResponse({ message: "Order deleted" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Admins only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
