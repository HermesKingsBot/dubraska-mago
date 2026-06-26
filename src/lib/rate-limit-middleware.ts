import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, RATE_LIMITS, getClientIp } from "./rate-limit"
import type { RateLimitConfig } from "./rate-limit"

export function rateLimit(request: NextRequest, config: RateLimitConfig): boolean {
  const ip = getClientIp(request)
  const result = checkRateLimit(ip, config)
  return result.success
}

export function getRateLimitHeaders(request: NextRequest, config: RateLimitConfig): Record<string, string> {
  const ip = getClientIp(request)
  const result = checkRateLimit(ip, config)
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  }
}

export default { rateLimit, getRateLimitHeaders }
