import { NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api"

async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body as { token?: string }
    if (!token) {
      return errorResponse("Token is required", 400)
    }
    const response = NextResponse.json({ success: true })
    response.cookies.set("dubraska_auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 604800,
    })
    return response
  } catch {
    return errorResponse("Failed to set cookie", 500)
  }
}

export { POST }
export default { POST }
