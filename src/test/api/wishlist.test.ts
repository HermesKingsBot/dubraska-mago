import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    wishlistItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
    },
  },
}))

vi.mock("@/lib/auth", () => ({
  requireCustomer: vi.fn(() => ({
    userId: "cust-1",
    email: "cliente@test.com",
    role: "CUSTOMER",
  })),
}))

import db from "@/lib/db"
import { GET as wishlistGET, POST as wishlistPOST } from "@/app/api/wishlist/route"
import { GET as wishlistItemGET, DELETE as wishlistItemDELETE } from "@/app/api/wishlist/[productId]/route"

function mockRequest(method: string, body?: unknown) {
  return {
    url: "http://localhost:3000/api/wishlist",
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockRequestWithParams(method: string) {
  return {
    url: "http://localhost:3000/api/wishlist/prod-1",
    method,
    json: async () => ({}),
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

const mockParams = { params: Promise.resolve({ productId: "prod-1" }) }

describe("Wishlist API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/wishlist", () => {
    it("agrega producto a favoritos", async () => {
      vi.mocked(db.product.findUnique).mockResolvedValue({
        id: "prod-1",
        name: "Collar Test",
      } as any)
      vi.mocked(db.wishlistItem.findUnique).mockResolvedValue(null)
      vi.mocked(db.wishlistItem.create).mockResolvedValue({
        id: "wish-1",
        userId: "cust-1",
        productId: "prod-1",
        product: { id: "prod-1", name: "Collar Test" },
      } as any)

      const req = mockRequest("POST", { productId: "prod-1" })
      const res = await wishlistPOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
    })

    it("duplicado retorna 200 (no crea duplicado)", async () => {
      vi.mocked(db.product.findUnique).mockResolvedValue({ id: "prod-1" } as any)
      vi.mocked(db.wishlistItem.findUnique).mockResolvedValue({
        id: "existing-wish",
        userId: "cust-1",
        productId: "prod-1",
        product: { id: "prod-1" },
      } as any)

      const req = mockRequest("POST", { productId: "prod-1" })
      const res = await wishlistPOST(req)
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/wishlist", () => {
    it("lista favoritos del usuario", async () => {
      vi.mocked(db.wishlistItem.findMany).mockResolvedValue([
        {
          id: "wish-1",
          userId: "cust-1",
          productId: "prod-1",
          product: { id: "prod-1", name: "Collar" },
        } as any,
      ])

      const req = mockRequest("GET")
      const res = await wishlistGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data).toHaveLength(1)
    })
  })

  describe("DELETE /api/wishlist/[productId]", () => {
    it("elimina producto de favoritos", async () => {
      vi.mocked(db.wishlistItem.findUnique).mockResolvedValue({
        id: "wish-1",
        userId: "cust-1",
        productId: "prod-1",
      } as any)
      vi.mocked(db.wishlistItem.delete).mockResolvedValue({} as any)

      const req = mockRequestWithParams("DELETE")
      const res = await wishlistItemDELETE(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.message).toBe("Eliminado de lista de deseos")
    })
  })

  describe("GET /api/wishlist/[productId]", () => {
    it("verifica si está en favoritos (true)", async () => {
      vi.mocked(db.wishlistItem.findUnique).mockResolvedValue({
        id: "wish-1",
        userId: "cust-1",
        productId: "prod-1",
      } as any)

      const req = mockRequestWithParams("GET")
      const res = await wishlistItemGET(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.inWishlist).toBe(true)
    })

    it("verifica si está en favoritos (false)", async () => {
      vi.mocked(db.wishlistItem.findUnique).mockResolvedValue(null)

      const req = mockRequestWithParams("GET")
      const res = await wishlistItemGET(req, await mockParams)
      const json = await res.json()

      expect(json.data.inWishlist).toBe(false)
    })
  })
})
