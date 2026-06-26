"use client"

import React, { useEffect, useState } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import AuditStatsCards from "@/components/office/AuditStats"
import AuditFiltersBar from "@/components/office/AuditFilters"
import AuditLogTable from "@/components/office/AuditLogTable"
import AuditLogDetail from "@/components/office/AuditLogDetail"
import { useAuditLogs } from "@/hooks/useAuditLogs"
import type { ActivityLog } from "@/types/audit"

function AuditoriaPage(): React.JSX.Element {
  const { data, loading, filters, page, setPage, updateFilters, clearFilters, fetchLogs } = useAuditLogs()
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleExportCSV = () => {
    if (!data?.logs.length) return
    const headers = ["Fecha", "Admin", "Acción", "Entidad", "Descripción"]
    const rows = data.logs.map((l) => [
      new Date(l.createdAt).toLocaleString("es-VE"),
      l.userEmail || "Sistema",
      l.action,
      l.entityType,
      `"${l.description.replace(/"/g, '""')}"`,
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Registro de Actividad
          </h1>
          <button
            onClick={handleExportCSV}
            disabled={!data?.logs.length}
            className="px-4 py-2 text-sm rounded-lg border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-40"
          >
            Exportar CSV
          </button>
        </div>

        {data?.stats && <AuditStatsCards stats={data.stats} />}

        <AuditFiltersBar
          filters={filters}
          onUpdate={updateFilters}
          onClear={clearFilters}
        />

        {loading ? (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl divide-y divide-[#222]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-4 py-4 flex items-center gap-4 animate-pulse">
                <div className="h-3 w-32 bg-white/10 rounded" />
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-5 w-20 bg-white/10 rounded-full" />
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="flex-1 h-3 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <AuditLogTable logs={data?.logs || []} onRowClick={setSelectedLog} />

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--color-muted)]">
                  Página {data.page} de {data.totalPages} ({data.total} registros)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPage(page - 1); fetchLogs({}, page - 1) }}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-xs rounded border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-white transition-colors disabled:opacity-30"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => { setPage(page + 1); fetchLogs({}, page + 1) }}
                    disabled={page >= data.totalPages}
                    className="px-3 py-1.5 text-xs rounded border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-white transition-colors disabled:opacity-30"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <AuditLogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
      </div>
    </AuthGuard>
  )
}

export default AuditoriaPage
