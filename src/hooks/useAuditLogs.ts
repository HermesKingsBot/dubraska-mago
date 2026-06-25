"use client"

import { useState, useCallback } from "react"
import type { ActivityLog, AuditStats } from "@/types/audit"

interface AuditFilters {
  action: string
  entityType: string
  search: string
  userId: string
  from: string
  to: string
}

interface AuditData {
  logs: ActivityLog[]
  total: number
  page: number
  totalPages: number
  stats: AuditStats & { mostCommon: string | null }
}

export function useAuditLogs() {
  const [data, setData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AuditFilters>({
    action: "",
    entityType: "",
    search: "",
    userId: "",
    from: "",
    to: "",
  })
  const [page, setPage] = useState(1)

  const fetchLogs = useCallback(async (customFilters?: Partial<AuditFilters>, customPage?: number) => {
    setLoading(true)
    try {
      const f = { ...filters, ...customFilters }
      const p = customPage ?? page
      const params = new URLSearchParams()
      if (f.action) params.set("action", f.action)
      if (f.entityType) params.set("entityType", f.entityType)
      if (f.search) params.set("q", f.search)
      if (f.userId) params.set("userId", f.userId)
      if (f.from) params.set("from", f.from)
      if (f.to) params.set("to", f.to)
      params.set("page", String(p))
      params.set("limit", "50")

      const res = await fetch(`/api/audit?${params}`, { credentials: "include" })
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  const updateFilters = useCallback((updates: Partial<AuditFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
    setPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ action: "", entityType: "", search: "", userId: "", from: "", to: "" })
    setPage(1)
  }, [])

  return {
    data,
    loading,
    filters,
    page,
    setPage,
    updateFilters,
    clearFilters,
    fetchLogs,
  }
}
