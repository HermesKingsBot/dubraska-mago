import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"
import { addressSchema } from "@/lib/schemas"

type RouteParams = { params: Promise<{ id: string }> }

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireCustomerAuth(request)
    const { id } = await params
    const body = await request.json()
    const data = addressSchema.partial().parse(body)

    const existing = await db.address.findFirst({
      where: { id, userId: auth.id },
    })
    if (!existing) {
      return errorResponse("Dirección no encontrada", 404)
    }

    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: auth.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await db.address.update({
      where: { id },
      data,
    })
    return successResponse(address)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireCustomerAuth(request)
    const { id } = await params

    const existing = await db.address.findFirst({
      where: { id, userId: auth.id },
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
    return handleApiError(error)
  }
}

export { PATCH, DELETE }
export default { PATCH, DELETE }
