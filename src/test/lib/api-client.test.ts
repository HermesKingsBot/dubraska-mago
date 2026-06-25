import { describe, it, expect, vi, beforeEach } from "vitest"
import { getProducts, getProduct, getCategories, login } from "@/lib/api-client"

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

function mockSuccessResponse(data: unknown) {
  return {
    ok: true,
    json: async () => ({ success: true, data }),
  }
}

function mockErrorResponse(error: string) {
  return {
    ok: true,
    json: async () => ({ success: false, error }),
  }
}

describe("api-client", () => {
  describe("getProducts", () => {
    it("fetches with correct URL", async () => {
      const mockData = { items: [], total: 0, page: 1, totalPages: 0, hasNext: false, hasPrev: false }
      mockFetch.mockResolvedValue(mockSuccessResponse(mockData))
      await getProducts()
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/products",
        expect.objectContaining({
          credentials: "include",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      )
    })

    it("includes query params", async () => {
      const mockData = { items: [], total: 0, page: 1, totalPages: 0, hasNext: false, hasPrev: false }
      mockFetch.mockResolvedValue(mockSuccessResponse(mockData))
      await getProducts({ q: "oro", category: "collares" })
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/products?q=oro&category=collares",
        expect.any(Object)
      )
    })

    it("returns data on success", async () => {
      const mockData = { items: [{ id: "1" }], total: 1, page: 1, totalPages: 1, hasNext: false, hasPrev: false }
      mockFetch.mockResolvedValue(mockSuccessResponse(mockData))
      const result = await getProducts()
      expect(result).toEqual(mockData)
    })
  })

  describe("getProduct", () => {
    it("fetches single product by id", async () => {
      const mockProduct = { id: "1", name: "Collar" }
      mockFetch.mockResolvedValue(mockSuccessResponse(mockProduct))
      const result = await getProduct("1")
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/products/1",
        expect.any(Object)
      )
      expect(result).toEqual(mockProduct)
    })
  })

  describe("getCategories", () => {
    it("fetches categories", async () => {
      const mockCategories = [{ id: "1", name: "Collares" }]
      mockFetch.mockResolvedValue(mockSuccessResponse(mockCategories))
      const result = await getCategories()
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/categories",
        expect.any(Object)
      )
      expect(result).toEqual(mockCategories)
    })
  })

  describe("login", () => {
    it("posts credentials and returns token", async () => {
      const mockLoginData = { token: "abc123", user: { email: "test@test.com", name: "Test", role: "admin" } }
      mockFetch.mockResolvedValue(mockSuccessResponse(mockLoginData))
      const result = await login("test@test.com", "password")
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "test@test.com", password: "password" }),
        })
      )
      expect(result).toEqual(mockLoginData)
    })
  })

  describe("error handling", () => {
    it("throws on unsuccessful response", async () => {
      mockFetch.mockResolvedValue(mockErrorResponse("Not found"))
      await expect(getProducts()).rejects.toThrow("Not found")
    })

    it("throws generic error when no error message", async () => {
      mockFetch.mockResolvedValue(mockErrorResponse(""))
      await expect(getProducts()).rejects.toThrow("API request failed")
    })
  })

  describe("credentials", () => {
    it("includes credentials include in all requests", async () => {
      mockFetch.mockResolvedValue(mockSuccessResponse(null))
      await getProducts()
      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].credentials).toBe("include")
    })
  })
})
