import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error }, { status })
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return errorResponse(error.issues.map(e => e.message).join(", "), 400)
  }
  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }
  return errorResponse("Internal server error", 500)
}
