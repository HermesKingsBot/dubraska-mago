import { NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api"

async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.set("dubraska_auth", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    })
    return response
  } catch {
    return errorResponse("Failed to clear cookie", 500)
  }
}

export { POST }
export default { POST }
