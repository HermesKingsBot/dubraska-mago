import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    testimonial: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    order: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    socialLink: {
      findMany: vi.fn(),
    },
  },
}))

import db from "@/lib/db"
import { GET as trashGET } from "@/app/api/trash/route"
import { POST as trashRestorePOST, DELETE as trashDeleteDELETE } from "@/app/api/trash/[type]/[id]/route"

function mockGetRequest() {
  return {
    url: "http://localhost:3000/api/trash",
    method: "GET",
    json: async () => ({}),
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockRequestWithParams(method: string, type: string, id: string) {
  return {
    url: `http://localhost:3000/api/trash/${type}/${id}`,
    method,
    json: async () => ({}),
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

const mockProductParams = { params: Promise.resolve({ type: "Product", id: "prod-1" }) }
const mockInvalidParams = { params: Promise.resolve({ type: "InvalidType", id: "x" }) }

describe("Trash API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/trash", () => {
    it("lista elementos eliminados", async () => {
      vi.mocked(db.product.findMany).mockResolvedValue([])
      vi.mocked(db.category.findMany).mockResolvedValue([])
      vi.mocked(db.testimonial.findMany).mockResolvedValue([])
      vi.mocked(db.order.findMany).mockResolvedValue([])
      vi.mocked(db.socialLink.findMany).mockResolvedValue([])

      const req = mockGetRequest()
      const res = await trashGET()
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.totalCount).toBe(0)
    })
  })

  describe("POST /api/trash/[type]/[id]", () => {
    it("restaura elemento de la papelera", async () => {
      vi.mocked(db.product.findUnique).mockResolvedValue({
        id: "prod-1",
        deletedAt: new Date(),
      } as any)
      vi.mocked(db.product.update).mockResolvedValue({
        id: "prod-1",
        deletedAt: null,
      } as any)

      const req = mockRequestWithParams("POST", "Product", "prod-1")
      const res = await trashRestorePOST(req, await mockProductParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.restored).toBe(true)
    })

    it("tipo no válido retorna 400", async () => {
      const req = mockRequestWithParams("POST", "InvalidType", "x")
      const res = await trashRestorePOST(req, await mockInvalidParams)
      expect(res.status).toBe(400)
    })
  })

  describe("DELETE /api/trash/[type]/[id]", () => {
    it("elimina permanentemente", async () => {
      vi.mocked(db.product.findUnique).mockResolvedValue({
        id: "prod-1",
        deletedAt: new Date(),
      } as any)
      vi.mocked(db.product.delete).mockResolvedValue({} as any)

      const req = mockRequestWithParams("DELETE", "Product", "prod-1")
      const res = await trashDeleteDELETE(req, await mockProductParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.deleted).toBe(true)
    })
  })
})
