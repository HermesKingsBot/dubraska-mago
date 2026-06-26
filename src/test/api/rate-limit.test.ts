import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  checkRateLimit,
  RATE_LIMITS,
  getClientIp,
  createRateLimitResponse,
} from "@/lib/rate-limit"

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("checkRateLimit", () => {
  it("permite requests dentro del límite", () => {
    const config = { windowMs: 60000, maxRequests: 5, keyPrefix: "test" }
    const result = checkRateLimit("test-ip-1", config)
    expect(result.success).toBe(true)
    expect(result.limit).toBe(5)
    expect(result.remaining).toBe(4)
    expect(result.retryAfter).toBeUndefined()
  })

  it("bloquea requests que exceden el límite", () => {
    const config = { windowMs: 60000, maxRequests: 3, keyPrefix: "test-block" }
    checkRateLimit("test-ip-2", config)
    checkRateLimit("test-ip-2", config)
    checkRateLimit("test-ip-2", config)
    const result = checkRateLimit("test-ip-2", config)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfter).toBeDefined()
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it("resetea después de la ventana de tiempo", () => {
    const config = { windowMs: 100, maxRequests: 1, keyPrefix: "test-reset" }
    checkRateLimit("test-ip-3", config)
    const blocked = checkRateLimit("test-ip-3", config)
    expect(blocked.success).toBe(false)

    const originalDateNow = Date.now.bind(Date)
    const futureTime = Date.now() + 200
    vi.spyOn(Date, "now").mockReturnValue(futureTime)

    const result = checkRateLimit("test-ip-3", config)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(0)

    vi.spyOn(Date, "now").mockReturnValue(originalDateNow())
  })

  it("usa diferentes contadores para diferentes IPs", () => {
    const config = { windowMs: 60000, maxRequests: 2, keyPrefix: "test-multi" }
    const r1 = checkRateLimit("ip-a", config)
    const r2 = checkRateLimit("ip-b", config)
    expect(r1.success).toBe(true)
    expect(r2.success).toBe(true)
  })
})

describe("getClientIp", () => {
  it("extrae IP de x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
    })
    expect(getClientIp(request)).toBe("192.168.1.1")
  })

  it("extrae IP de x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "10.0.0.5" },
    })
    expect(getClientIp(request)).toBe("10.0.0.5")
  })

  it("retorna unknown si no hay headers", () => {
    const request = new Request("http://localhost")
    expect(getClientIp(request)).toBe("unknown")
  })
})

describe("createRateLimitResponse", () => {
  it("retorna status 429 con headers correctos", () => {
    const result = {
      success: false,
      limit: 10,
      remaining: 0,
      resetTime: Date.now() + 60000,
      retryAfter: 60,
    }
    const response = createRateLimitResponse(result)
    expect(response.status).toBe(429)
    expect(response.headers.get("X-RateLimit-Limit")).toBe("10")
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0")
    expect(response.headers.get("Retry-After")).toBe("60")
  })
})
