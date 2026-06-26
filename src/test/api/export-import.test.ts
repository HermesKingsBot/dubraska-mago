import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    product: {
      findMany: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
    },
    testimonial: {
      findMany: vi.fn(),
    },
    inventoryMovement: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn(() => ({
    userId: "admin-1",
    email: "admin@test.com",
    role: "ADMIN",
  })),
}))

vi.mock("@/lib/export-utils", () => ({
  generateExportFile: vi.fn(() => Buffer.from("mock-file-content")),
  generateTemplateFile: vi.fn(() => Buffer.from("mock-template")),
  getExportHeaders: vi.fn(() => new Headers({
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": "attachment; filename=test.xlsx",
  })),
}))

vi.mock("@/lib/import-utils", () => ({
  parseImportFile: vi.fn(() => ({ valid: [], errors: [], total: 0 })),
  validateImportFile: vi.fn(),
}))

import db from "@/lib/db"
import { GET as exportProductsGET } from "@/app/api/admin/export/products/route"
import { GET as exportCategoriesGET } from "@/app/api/admin/export/categories/route"
import { GET as exportTestimonialsGET } from "@/app/api/admin/export/testimonials/route"
import { GET as exportInventoryGET } from "@/app/api/admin/export/inventory/route"
import { GET as importTemplateGET } from "@/app/api/admin/import/products/template/route"
import { POST as importProductsPOST } from "@/app/api/admin/import/products/route"

function mockRequest(url: string) {
  return {
    url,
    method: "GET",
    json: async () => ({}),
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockPostRequest(body: FormData) {
  return {
    url: "http://localhost:3000/api/admin/import/products",
    method: "POST",
    json: async () => ({}),
    formData: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

describe("Export / Import API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/admin/export/products", () => {
    it("descarga productos en XLSX (default)", async () => {
      vi.mocked(db.product.findMany).mockResolvedValue([])
      const req = mockRequest("http://localhost:3000/api/admin/export/products")
      const res = await exportProductsGET(req)
      expect(res.status).toBe(200)
      const buffer = await res.arrayBuffer()
      expect(buffer.byteLength).toBeGreaterThan(0)
    })

    it("descarga productos en CSV", async () => {
      vi.mocked(db.product.findMany).mockResolvedValue([])
      const req = mockRequest("http://localhost:3000/api/admin/export/products?format=csv")
      const res = await exportProductsGET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/admin/export/categories", () => {
    it("descarga categorías en CSV", async () => {
      vi.mocked(db.category.findMany).mockResolvedValue([])
      const req = mockRequest("http://localhost:3000/api/admin/export/categories?format=csv")
      const res = await exportCategoriesGET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/admin/export/testimonials", () => {
    it("descarga testimonios en CSV", async () => {
      vi.mocked(db.testimonial.findMany).mockResolvedValue([])
      const req = mockRequest("http://localhost:3000/api/admin/export/testimonials?format=csv")
      const res = await exportTestimonialsGET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/admin/export/inventory", () => {
    it("descarga inventario en CSV", async () => {
      vi.mocked(db.inventoryMovement.findMany).mockResolvedValue([])
      const req = mockRequest("http://localhost:3000/api/admin/export/inventory?format=csv")
      const res = await exportInventoryGET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/admin/import/products/template", () => {
    it("descarga plantilla vacía", async () => {
      const req = mockRequest("http://localhost:3000/api/admin/import/products/template")
      const res = await importTemplateGET(req)
      expect(res.status).toBe(200)
    })

    it("descarga plantilla con datos de ejemplo", async () => {
      const req = mockRequest("http://localhost:3000/api/admin/import/products/template?withSample=true")
      const res = await importTemplateGET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("POST /api/admin/import/products", () => {
    it("importa productos válidos", async () => {
      const formData = new FormData()
      const blob = new Blob(["mock-file"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      formData.append("file", blob, "productos.xlsx")

      const req = mockPostRequest(formData)
      const res = await importProductsPOST(req)
      expect(res.status).toBe(201)
    })

    it("datos inválidos retorna error de validación", async () => {
      const req = mockPostRequest(new FormData())
      const res = await importProductsPOST(req)
      expect(res.status).toBe(400)
    })
  })
})
