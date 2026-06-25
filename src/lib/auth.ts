import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
      return decoded
    } catch {
      return null
    }
  }

  const cookieToken = request.cookies.get("dubraska_auth")?.value
  if (cookieToken) {
    try {
      return jwt.verify(cookieToken, JWT_SECRET) as JwtPayload
    } catch {
      return null
    }
  }

  return null
}

export function requireAuth(request: NextRequest): JwtPayload {
  const user = verifyToken(request)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
