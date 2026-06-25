import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { loginSchema } from "@/lib/schemas"
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = loginSchema.parse(body)
    const user = await db.user.findUnique({
      where: { email: data.email },
    })
    if (!user) {
      return errorResponse("Invalid credentials", 401)
    }
    if (!user.active) {
      return errorResponse("Cuenta desactivada", 401)
    }
    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      return errorResponse("Invalid credentials", 401)
    }
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
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
