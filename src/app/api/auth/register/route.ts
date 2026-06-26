import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { registerSchema } from "@/lib/schemas"
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { checkRateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const registerResult = checkRateLimit(ip, RATE_LIMITS.register)
    if (!registerResult.success) {
      return createRateLimitResponse(registerResult)
    }

    const body = await request.json()
    const data = registerSchema.parse(body)
    const existing = await db.user.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return errorResponse("El email ya está registrado", 400)
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone || null,
        role: "CUSTOMER",
      },
    })
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )
    return successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
