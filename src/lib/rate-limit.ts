import { NextResponse } from "next/server"

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyPrefix: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const key = `${config.keyPrefix}:${identifier}`
  const entry = store.get(key)

  if (store.size > 1000) {
    const cutoff = now - config.windowMs
    for (const [k, v] of store.entries()) {
      if (v.resetTime < cutoff) store.delete(k)
    }
  }

  if (!entry || entry.resetTime < now) {
    store.set(key, { count: 1, resetTime: now + config.windowMs })
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    }
  }

  entry.count++
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, keyPrefix: "auth" },
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10, keyPrefix: "login" },
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: "register" },
  api: { windowMs: 60 * 1000, maxRequests: 60, keyPrefix: "api" },
  search: { windowMs: 60 * 1000, maxRequests: 30, keyPrefix: "search" },
  export: { windowMs: 60 * 60 * 1000, maxRequests: 5, keyPrefix: "export" },
  import: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: "import" },
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 3, keyPrefix: "contact" },
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp

  return "unknown"
}

export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Demasiadas solicitudes. Intenta más tarde.",
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
        "Retry-After": String(result.retryAfter || 0),
      },
    }
  )
}

export function withRateLimit(
  handler: (request: Request, ...args: any[]) => Promise<Response>,
  config: RateLimitConfig
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    const ip = getClientIp(request)
    const result = checkRateLimit(ip, config)

    if (!result.success) {
      return createRateLimitResponse(result)
    }

    const response = await handler(request, ...args)

    response.headers.set("X-RateLimit-Limit", String(result.limit))
    response.headers.set("X-RateLimit-Remaining", String(result.remaining))
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(result.resetTime / 1000)))

    return response
  }
}

export default { checkRateLimit, RATE_LIMITS, getClientIp, createRateLimitResponse, withRateLimit }
