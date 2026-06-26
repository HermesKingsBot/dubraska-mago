import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    cartItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
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
  requireAuth: vi.fn(),
  verifyToken: vi.fn(),
}))

import db from "@/lib/db"
import { GET as cartGET, POST as cartPOST } from "@/app/api/cart/route"
import { PATCH as cartPATCH, DELETE as cartDELETE } from "@/app/api/cart/[productId]/route"

function mockRequest(method: string, body?: unknown) {
  return {
    url: "http://localhost:3000/api/cart",
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockRequestWithParams(method: string, productId: string, body?: unknown) {
  return {
    url: `http://localhost:3000/api/cart/${productId}`,
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

const mockParams = { params: Promise.resolve({ productId: "prod-1" }) }

describe("Cart API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/cart", () => {
    it("agrega producto al carrito", async () => {
      vi.mocked(db.product.findUnique).mockResolvedValue({
        id: "prod-1",
        name: "Collar Test",
        price: 29.99,
      } as any)
      vi.mocked(db.cartItem.findUnique).mockResolvedValue(null)
      vi.mocked(db.cartItem.create).mockResolvedValue({
        id: "cart-1",
        userId: "cust-1",
        productId: "prod-1",
        quantity: 1,
        product: { id: "prod-1", name: "Collar Test" },
      } as any)

      const req = mockRequest("POST", { productId: "prod-1", quantity: 1 })
      const res = await cartPOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
    })

    it("producto inexistente retorna 404", async () => {
      vi.mocked(db.product.findUnique).mockResolvedValue(null)

      const req = mockRequest("POST", { productId: "no-existe", quantity: 1 })
      const res = await cartPOST(req)
      expect(res.status).toBe(404)
    })
  })

  describe("GET /api/cart", () => {
    it("obtiene carrito con items", async () => {
      vi.mocked(db.cartItem.findMany).mockResolvedValue([
        {
          id: "cart-1",
          userId: "cust-1",
          productId: "prod-1",
          quantity: 2,
          product: { id: "prod-1", name: "Collar" },
        } as any,
      ])

      const req = mockRequest("GET")
      const res = await cartGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data).toHaveLength(1)
    })
  })

  describe("PUT /api/cart/[productId]", () => {
    it("actualiza cantidad del item", async () => {
      vi.mocked(db.cartItem.findUnique).mockResolvedValue({
        id: "cart-1",
        userId: "cust-1",
        productId: "prod-1",
        quantity: 1,
      } as any)
      vi.mocked(db.cartItem.update).mockResolvedValue({
        id: "cart-1",
        quantity: 3,
        product: { id: "prod-1" },
      } as any)

      const req = mockRequestWithParams("PATCH", "prod-1", { quantity: 3 })
      const res = await cartPATCH(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
    })
  })

  describe("DELETE /api/cart/[productId]", () => {
    it("elimina producto del carrito", async () => {
      vi.mocked(db.cartItem.findUnique).mockResolvedValue({
        id: "cart-1",
        userId: "cust-1",
        productId: "prod-1",
        quantity: 1,
      } as any)
      vi.mocked(db.cartItem.delete).mockResolvedValue({} as any)

      const req = mockRequestWithParams("DELETE", "prod-1")
      const res = await cartDELETE(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.message).toBe("Item eliminado del carrito")
    })

    it("producto no está en carrito retorna 404", async () => {
      vi.mocked(db.cartItem.findUnique).mockResolvedValue(null)

      const req = mockRequestWithParams("DELETE", "no-existe")
      const res = await cartDELETE(req, await mockParams)
      expect(res.status).toBe(404)
    })
  })
})
