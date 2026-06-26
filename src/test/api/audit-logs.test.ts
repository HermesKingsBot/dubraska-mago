import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    activityLog: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}))

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn(() => ({
    userId: "admin-1",
    email: "admin@test.com",
    role: "ADMIN",
  })),
}))

import db from "@/lib/db"
import { GET as auditLogsGET } from "@/app/api/admin/audit-logs/route"
import { GET as auditStatsGET } from "@/app/api/admin/audit-logs/stats/route"

function mockRequest(url: string) {
  return {
    url,
    method: "GET",
    json: async () => ({}),
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

describe("Audit Logs API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/admin/audit-logs", () => {
    it("lista logs con paginación", async () => {
      vi.mocked(db.activityLog.findMany).mockResolvedValue([
        {
          id: "log-1",
          action: "CREATE",
          entityType: "Product",
          description: "Creación de producto",
          userEmail: "admin@test.com",
          createdAt: new Date(),
        },
      ])
      vi.mocked(db.activityLog.count).mockResolvedValue(1)

      const req = mockRequest("http://localhost:3000/api/admin/audit-logs")
      const res = await auditLogsGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.items).toHaveLength(1)
      expect(json.data.total).toBe(1)
    })

    it("filtra por tipo de acción", async () => {
      vi.mocked(db.activityLog.findMany).mockResolvedValue([])
      vi.mocked(db.activityLog.count).mockResolvedValue(0)

      const req = mockRequest("http://localhost:3000/api/admin/audit-logs?action=CREATE")
      const res = await auditLogsGET(req)
      expect(res.status).toBe(200)
    })

    it("filtra por usuario", async () => {
      vi.mocked(db.activityLog.findMany).mockResolvedValue([])
      vi.mocked(db.activityLog.count).mockResolvedValue(0)

      const req = mockRequest("http://localhost:3000/api/admin/audit-logs?userId=admin-1")
      const res = await auditLogsGET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("GET /api/admin/audit-logs/stats", () => {
    it("retorna estadísticas de auditoría", async () => {
      vi.mocked(db.activityLog.count).mockResolvedValue(5)
      vi.mocked(db.activityLog.groupBy).mockResolvedValue([
        { action: "CREATE", _count: 3 },
        { action: "UPDATE", _count: 2 },
      ] as any)
      vi.mocked(db.activityLog.findMany).mockResolvedValue([])

      const req = mockRequest("http://localhost:3000/api/admin/audit-logs/stats")
      const res = await auditStatsGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.today).toBe(5)
      expect(json.data.actionsByType).toHaveLength(2)
    })
  })
})
