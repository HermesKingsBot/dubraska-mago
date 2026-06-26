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

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(() => "mock-token"),
  verify: vi.fn(),
}))

import db from "@/lib/db"
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { POST as registerPOST } from "@/app/api/auth/register/route"
import { POST as loginPOST } from "@/app/api/auth/login/route"
import { GET as meGET } from "@/app/api/auth/me/route"

function mockRequest(method: string, body?: unknown, headers?: Record<string, string>) {
  return {
    url: "http://localhost:3000/api/auth/test",
    method,
    json: async () => body,
    headers: new Map(Object.entries(headers || {})),
    cookies: {
      get: vi.fn(() => undefined),
    },
  } as unknown as NextRequest
}

function mockRequestWithToken(method: string, token: string, body?: unknown) {
  return {
    url: "http://localhost:3000/api/auth/test",
    method,
    json: async () => body,
    headers: new Map(Object.entries({ authorization: `Bearer ${token}` })),
    cookies: {
      get: vi.fn(() => undefined),
    },
  } as unknown as NextRequest
}

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/auth/register", () => {
    it("creates usuario y retorna 201 con token", async () => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@test.com",
        password: "hashed-password",
        role: "CUSTOMER",
        phone: null,
      }
      vi.mocked(db.user.findUnique).mockResolvedValue(null)
      vi.mocked(db.user.create).mockResolvedValue(mockUser)

      const req = mockRequest("POST", {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
      })
      const res = await registerPOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data.token).toBe("mock-token")
      expect(json.data.user.email).toBe("test@test.com")
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
    })

    it("email duplicado retorna 409", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue({
        id: "existing",
        email: "test@test.com",
      } as any)

      const req = mockRequest("POST", {
        name: "Test",
        email: "test@test.com",
        password: "password123",
      })
      const res = await registerPOST(req)
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.success).toBe(false)
    })
  })

  describe("POST /api/auth/login", () => {
    it("credenciales válidas retorna token", async () => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@test.com",
        password: "hashed-password",
        role: "CUSTOMER",
        phone: null,
        active: true,
      }
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const req = mockRequest("POST", {
        email: "test@test.com",
        password: "password123",
      })
      const res = await loginPOST(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data.token).toBe("mock-token")
    })

    it("credenciales inválidas retorna 401", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@test.com",
        password: "hashed-password",
        active: true,
      }
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      const req = mockRequest("POST", {
        email: "test@test.com",
        password: "wrong",
      })
      const res = await loginPOST(req)
      expect(res.status).toBe(401)
    })

    it("email no existe retorna 401", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null)

      const req = mockRequest("POST", {
        email: "noexiste@test.com",
        password: "password",
      })
      const res = await loginPOST(req)
      expect(res.status).toBe(401)
    })
  })

  describe("GET /api/auth/me", () => {
    it("token válido retorna datos usuario", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
        role: "CUSTOMER",
        phone: null,
      }
      vi.mocked(jwt.verify).mockReturnValue({ userId: "user-1" } as any)
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser)

      const req = mockRequestWithToken("GET", "valid-token")
      const res = await meGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.email).toBe("test@test.com")
    })

    it("sin token retorna 401", async () => {
      const req = mockRequest("GET")
      const res = await meGET(req)
      expect(res.status).toBe(401)
    })

    it("token inválido retorna 401", async () => {
      const err = new Error("jwt malformed")
      err.name = "JsonWebTokenError"
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw err
      })

      const req = mockRequestWithToken("GET", "invalid-token")
      const res = await meGET(req)
      expect(res.status).toBe(401)
    })
  })
})
