import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("bcryptjs", () => ({
  hash: vi.fn(() => "hashed-password"),
  compare: vi.fn(),
}))

vi.mock("@/lib/customer-auth", () => ({
  signCustomerToken: vi.fn(() => "mock-customer-token"),
  requireCustomerAuth: vi.fn(),
  COOKIE_NAME: "dubraska_customer",
  verifyCustomerToken: vi.fn(),
}))

import db from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { signCustomerToken, requireCustomerAuth, verifyCustomerToken } from "@/lib/customer-auth"
import { POST as registerPOST } from "@/app/api/customer/auth/register/route"
import { POST as loginPOST } from "@/app/api/customer/auth/login/route"
import { GET as meGET } from "@/app/api/customer/auth/me/route"
import { POST as logoutPOST } from "@/app/api/customer/auth/logout/route"

function mockRequest(method: string, body?: unknown, headers?: Record<string, string>) {
  return {
    url: "http://localhost:3000/api/customer/auth/test",
    method,
    json: async () => body,
    headers: new Map(Object.entries(headers || {})),
    cookies: {
      get: vi.fn(() => undefined),
      set: vi.fn(),
    },
  } as unknown as NextRequest
}

describe("Customer Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/customer/auth/register", () => {
    it("crea cliente y retorna 201", async () => {
      const mockUser = {
        id: "cust-1",
        name: "Cliente Test",
        email: "cliente@test.com",
        password: "hashed",
        role: "CUSTOMER",
        phone: "04121234567",
      }
      vi.mocked(db.user.findUnique).mockResolvedValue(null)
      vi.mocked(db.user.create).mockResolvedValue(mockUser)

      const req = mockRequest("POST", {
        name: "Cliente Test",
        email: "cliente@test.com",
        password: "password123",
        phone: "04121234567",
      })
      const res = await registerPOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data.token).toBe("mock-customer-token")
      expect(json.data.user.email).toBe("cliente@test.com")
    })
  })

  describe("POST /api/customer/auth/login", () => {
    it("login exitoso retorna token", async () => {
      const mockUser = {
        id: "cust-1",
        name: "Cliente",
        email: "cliente@test.com",
        password: "hashed",
        role: "CUSTOMER",
        phone: null,
        active: true,
      }
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const req = mockRequest("POST", {
        email: "cliente@test.com",
        password: "password123",
      })
      const res = await loginPOST(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.token).toBe("mock-customer-token")
    })
  })

  describe("GET /api/customer/auth/me", () => {
    it("obtiene perfil del cliente autenticado", async () => {
      vi.mocked(requireCustomerAuth).mockReturnValue({
        id: "cust-1",
        email: "cliente@test.com",
        role: "customer",
      })
      vi.mocked(db.user.findUnique).mockResolvedValue({
        id: "cust-1",
        name: "Cliente",
        email: "cliente@test.com",
        phone: null,
        role: "CUSTOMER",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const req = mockRequest("GET")
      const res = await meGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.email).toBe("cliente@test.com")
    })
  })

  describe("POST /api/customer/auth/logout", () => {
    it("cierra sesión correctamente", async () => {
      const req = mockRequest("POST")
      const res = await logoutPOST(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.message).toBe("Sesión cerrada")
    })
  })
})
