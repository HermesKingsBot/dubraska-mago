import { NextRequest } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { loginSchema } from "@/lib/schemas"
import * as bcrypt from "bcryptjs"
import { signCustomerToken, COOKIE_NAME } from "@/lib/customer-auth"
import { NextResponse } from "next/server"
import { checkRateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit"

async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const loginResult = checkRateLimit(ip, RATE_LIMITS.login)
    if (!loginResult.success) {
      return createRateLimitResponse(loginResult)
    }

    const body = await request.json()
    const data = loginSchema.parse(body)

    const user = await db.user.findUnique({
      where: { email: data.email },
    })
    if (!user) {
      return errorResponse("Credenciales inválidas", 401)
    }
    if (!user.active) {
      return errorResponse("Cuenta desactivada", 401)
    }
    if (user.role !== "CUSTOMER") {
      return errorResponse("Credenciales inválidas", 401)
    }

    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      return errorResponse("Credenciales inválidas", 401)
    }

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
      { status: 200 }
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
