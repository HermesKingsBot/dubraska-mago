import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    product: {
      findMany: vi.fn(),
    },
    productComparison: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock("@/lib/auth", () => ({
  verifyToken: vi.fn(() => ({
    userId: "cust-1",
    email: "cliente@test.com",
    role: "CUSTOMER",
  })),
}))

import db from "@/lib/db"
import { GET as compareGET, POST as comparePOST, DELETE as compareDELETE } from "@/app/api/compare/route"

function mockRequest(method: string, body?: unknown, headers?: Record<string, string>) {
  return {
    url: "http://localhost:3000/api/compare",
    method,
    json: async () => body,
    headers: new Map(Object.entries(headers || {})),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockGetRequest(ids: string) {
  return {
    url: `http://localhost:3000/api/compare?ids=${ids}`,
    method: "GET",
    json: async () => ({}),
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

describe("Compare API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/compare", () => {
    it("agrega productos a comparar", async () => {
      vi.mocked(db.productComparison.findFirst).mockResolvedValue(null)
      vi.mocked(db.productComparison.create).mockResolvedValue({
        id: "comp-1",
        userId: "cust-1",
        productIds: JSON.stringify(["prod-1", "prod-2"]),
      } as any)

      const req = mockRequest("POST", {
        productIds: ["prod-1", "prod-2"],
      })
      const res = await comparePOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
    })
  })

  describe("GET /api/compare", () => {
    it("obtiene lista de comparación con 2 productos", async () => {
      vi.mocked(db.product.findMany).mockResolvedValue([
        { id: "prod-1", name: "Collar 1", category: {} },
        { id: "prod-2", name: "Collar 2", category: {} },
      ] as any)

      const req = mockGetRequest("prod-1,prod-2")
      const res = await compareGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.items).toHaveLength(2)
    })

    it("limite de productos (máx 4) retorna 400 si excede", async () => {
      const req = mockGetRequest("p1,p2,p3,p4,p5")
      const res = await compareGET(req)
      expect(res.status).toBe(400)
    })
  })

  describe("DELETE /api/compare", () => {
    it("elimina comparación", async () => {
      vi.mocked(db.productComparison.findFirst).mockResolvedValue({
        id: "comp-1",
      } as any)
      vi.mocked(db.productComparison.delete).mockResolvedValue({} as any)

      const req = mockRequest("DELETE")
      const res = await compareDELETE(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.message).toBe("Comparación eliminada")
    })
  })
})
