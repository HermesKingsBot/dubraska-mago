import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"
const COOKIE_NAME = "dubraska_customer"

export interface CustomerJwtPayload {
  id: string
  email: string
  role: string
}

export function verifyCustomerToken(request: NextRequest): CustomerJwtPayload | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    try {
      return jwt.verify(token, JWT_SECRET) as CustomerJwtPayload
    } catch {
      return null
    }
  }

  const cookieToken = request.cookies.get(COOKIE_NAME)?.value
  if (cookieToken) {
    try {
      return jwt.verify(cookieToken, JWT_SECRET) as CustomerJwtPayload
    } catch {
      return null
    }
  }

  return null
}

export function requireCustomerAuth(request: NextRequest): CustomerJwtPayload {
  const user = verifyCustomerToken(request)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export function signCustomerToken(payload: { id: string; email: string }): string {
  return jwt.sign(
    { id: payload.id, email: payload.email, role: "customer" },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export { COOKIE_NAME }
