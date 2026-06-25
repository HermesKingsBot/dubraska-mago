import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomerAuth } from "@/lib/customer-auth"
import { addressSchema } from "@/lib/schemas"

async function GET(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    const addresses = await db.address.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(addresses)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const auth = requireCustomerAuth(request)
    const body = await request.json()
    const data = addressSchema.parse(body)

    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: auth.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await db.address.create({
      data: {
        userId: auth.id,
        label: data.label,
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        carrier: data.carrier,
        officeCode: data.officeCode,
        reference: data.reference,
        isDefault: data.isDefault,
      },
    })
    return successResponse(address, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
