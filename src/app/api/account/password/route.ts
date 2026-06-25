import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireCustomer } from "@/lib/auth"
import * as bcrypt from "bcryptjs"

async function PATCH(request: NextRequest) {
  try {
    const user = requireCustomer(request)
    const body = await request.json()
    const { currentPassword, newPassword } = body as {
      currentPassword: string
      newPassword: string
    }
    if (!currentPassword || !newPassword) {
      return errorResponse("Contraseña actual y nueva requeridas", 400)
    }
    if (newPassword.length < 6) {
      return errorResponse("Mínimo 6 caracteres", 400)
    }
    const dbUser = await db.user.findUnique({
      where: { id: user.userId },
    })
    if (!dbUser) {
      return errorResponse("Usuario no encontrado", 404)
    }
    const isValid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!isValid) {
      return errorResponse("Contraseña actual incorrecta", 401)
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.user.update({
      where: { id: user.userId },
      data: { password: hashedPassword },
    })
    return successResponse({ message: "Contraseña actualizada" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    if (error instanceof Error && error.message === "Forbidden: Customers only") {
      return errorResponse("Forbidden", 403)
    }
    return handleApiError(error)
  }
}

export { PATCH }
export default { PATCH }
