import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    address: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
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
import { GET as addressesGET, POST as addressesPOST } from "@/app/api/addresses/route"
import { GET as addressGET, PATCH as addressPATCH, DELETE as addressDELETE } from "@/app/api/addresses/[id]/route"

function mockRequest(method: string, body?: unknown) {
  return {
    url: "http://localhost:3000/api/addresses",
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockRequestWithId(method: string, id: string, body?: unknown) {
  return {
    url: `http://localhost:3000/api/addresses/${id}`,
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

const mockParams = { params: Promise.resolve({ id: "addr-1" }) }

describe("Addresses API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/addresses", () => {
    it("crea dirección correctamente", async () => {
      vi.mocked(db.address.count).mockResolvedValue(1)
      vi.mocked(db.address.create).mockResolvedValue({
        id: "addr-1",
        userId: "cust-1",
        label: "Casa",
        fullName: "Cliente Test",
        phone: "04121234567",
        street: "Calle Principal",
        city: "Caracas",
        state: "Distrito Capital",
        zipCode: "1010",
        isDefault: false,
      } as any)

      const req = mockRequest("POST", {
        label: "Casa",
        fullName: "Cliente Test",
        phone: "04121234567",
        street: "Calle Principal",
        city: "Caracas",
        state: "Distrito Capital",
      })
      const res = await addressesPOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.data.fullName).toBe("Cliente Test")
    })
  })

  describe("GET /api/addresses", () => {
    it("lista direcciones del usuario", async () => {
      vi.mocked(db.address.findMany).mockResolvedValue([
        {
          id: "addr-1",
          label: "Casa",
          fullName: "Cliente",
          street: "Calle 1",
          city: "Caracas",
          state: "DC",
          isDefault: true,
        } as any,
      ])

      const req = mockRequest("GET")
      const res = await addressesGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data).toHaveLength(1)
    })
  })

  describe("PUT /api/addresses/[id]", () => {
    it("actualiza dirección", async () => {
      vi.mocked(db.address.findFirst).mockResolvedValue({
        id: "addr-1",
        userId: "cust-1",
        label: "Casa",
        fullName: "Cliente",
        phone: "04121234567",
        street: "Calle 1",
        city: "Caracas",
        state: "DC",
      } as any)
      vi.mocked(db.address.update).mockResolvedValue({
        id: "addr-1",
        label: "Trabajo",
        fullName: "Cliente Test",
      } as any)

      const req = mockRequestWithId("PATCH", "addr-1", { label: "Trabajo" })
      const res = await addressPATCH(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.label).toBe("Trabajo")
    })
  })

  describe("DELETE /api/addresses/[id]", () => {
    it("elimina dirección", async () => {
      vi.mocked(db.address.findFirst).mockResolvedValue({
        id: "addr-1",
        userId: "cust-1",
      } as any)
      vi.mocked(db.address.delete).mockResolvedValue({} as any)

      const req = mockRequestWithId("DELETE", "addr-1")
      const res = await addressDELETE(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.message).toBe("Dirección eliminada")
    })
  })

  describe("GET /api/addresses/[id]", () => {
    it("obtiene dirección específica", async () => {
      vi.mocked(db.address.findFirst).mockResolvedValue({
        id: "addr-1",
        label: "Casa",
        fullName: "Cliente",
        street: "Calle 1",
        city: "Caracas",
        state: "DC",
      } as any)

      const req = mockRequestWithId("GET", "addr-1")
      const res = await addressGET(req, await mockParams)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.id).toBe("addr-1")
    })
  })
})
