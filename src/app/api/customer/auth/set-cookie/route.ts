import { NextRequest, NextResponse } from "next/server"
import { COOKIE_NAME } from "@/lib/customer-auth"
import { errorResponse, handleApiError } from "@/lib/api"
import { z } from "zod"

const setCookieSchema = z.object({
  token: z.string().min(1),
})

async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = setCookieSchema.parse(body)

    const response = NextResponse.json(
      { success: true, data: { message: "Cookie establecida" } },
      { status: 200 }
    )
    response.cookies.set(COOKIE_NAME, data.token, {
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
