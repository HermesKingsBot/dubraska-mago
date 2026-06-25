import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"
import { addressSchema } from "@/lib/schemas"

async function GET(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const addresses = await db.address.findMany({
      where: { userId: user.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })
    return successResponse(addresses)
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

async function POST(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const body = await request.json()
    const data = addressSchema.parse(body)
    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: user.userId },
        data: { isDefault: false },
      })
    }
    const existingCount = await db.address.count({
      where: { userId: user.userId },
    })
    const address = await db.address.create({
      data: {
        ...data,
        userId: user.userId,
        isDefault: existingCount === 0 ? true : data.isDefault,
      },
    })
    return successResponse(address, 201)
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

export { GET, POST }
export default { GET, POST }
