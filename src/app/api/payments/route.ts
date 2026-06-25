import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAdmin } from "@/lib/auth"

async function GET(request: NextRequest) {
  try {
    requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const payments = await db.payment.findMany({
      where,
      include: {
        order: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(payments)
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

export { GET }
export default { GET }
