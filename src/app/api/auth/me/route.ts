import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

async function GET(request: NextRequest) {
  try {
    let token: string | null = null
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
    }
    if (!token) {
      token = request.cookies.get("dubraska_auth")?.value || null
    }
    if (!token) {
      return errorResponse("No token provided", 401)
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
      },
    })
    if (!user) {
      return errorResponse("User not found", 404)
    }
    return successResponse(user)
  } catch (error) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return errorResponse("Invalid token", 401)
    }
    return handleApiError(error)
  }
}

export { GET }
export default { GET }
