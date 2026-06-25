"use client"

import React from "react"
import { ACTION_COLORS, ACTION_LABELS, ENTITY_LABELS } from "@/types/audit"
import type { ActivityLog } from "@/types/audit"

interface AuditLogTableProps {
  logs: ActivityLog[]
  onRowClick: (log: ActivityLog) => void
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function AuditLogTable({ logs, onRowClick }: AuditLogTableProps): React.JSX.Element {
  if (logs.length === 0) {
    return (
      <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-12 text-center">
        <svg className="mx-auto mb-4 text-[var(--color-muted)]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
        <p className="text-[var(--color-muted)] text-sm">No hay registros de actividad.</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl overflow-hidden">
      <div className="hidden md:grid grid-cols-[160px_120px_120px_120px_1fr] gap-4 px-4 py-2 text-xs text-[var(--color-muted)] border-b border-[#222]">
        <span>Fecha/Hora</span>
        <span>Admin</span>
        <span>Acción</span>
        <span>Entidad</span>
        <span>Descripción</span>
      </div>
      <div className="divide-y divide-[#222]">
        {logs.map((log) => (
          <button
            key={log.id}
            onClick={() => onRowClick(log)}
            className="w-full text-left grid grid-cols-1 md:grid-cols-[160px_120px_120px_120px_1fr] gap-2 md:gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-xs text-[var(--color-muted)]">
              {formatDate(log.createdAt)}
            </span>
            <span className="text-xs text-white truncate">
              {log.userEmail || "Sistema"}
            </span>
            <span>
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${ACTION_COLORS[log.action] || "text-[var(--color-muted)] bg-white/5 border-[#333]"}`}>
                {ACTION_LABELS[log.action] || log.action}
              </span>
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              {ENTITY_LABELS[log.entityType] || log.entityType}
            </span>
            <span className="text-xs text-white truncate">
              {log.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AuditLogTable
