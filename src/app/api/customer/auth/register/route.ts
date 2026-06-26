import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { registerSchema } from "@/lib/schemas"
import * as bcrypt from "bcryptjs"
import { signCustomerToken, COOKIE_NAME } from "@/lib/customer-auth"
import { NextResponse } from "next/server"
import { checkRateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit"

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
      return errorResponse("El email ya está registrado", 409)
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

    const token = signCustomerToken({ id: user.id, email: user.email })
    const response = NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        },
      },
      { status: 201 }
    )
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
