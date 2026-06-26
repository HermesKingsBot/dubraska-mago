"use client"

import React from "react"
import { ACTION_COLORS, ACTION_LABELS, ENTITY_LABELS } from "@/types/audit"
import type { ActivityLog } from "@/types/audit"

interface AuditLogDetailProps {
  log: ActivityLog | null
  onClose: () => void
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function DiffView({ oldValues, newValues }: { oldValues: string | null; newValues: string | null }) {
  let oldObj: Record<string, unknown> = {}
  let newObj: Record<string, unknown> = {}
  try { oldObj = oldValues ? JSON.parse(oldValues) : {} } catch { /* ignore */ }
  try { newObj = newValues ? JSON.parse(newValues) : {} } catch { /* ignore */ }

  const allKeys = [...new Set([...Object.keys(oldObj), ...Object.keys(newObj)])]
  if (allKeys.length === 0) return <p className="text-xs text-[var(--color-muted)]">Sin cambios detallados</p>

  return (
    <div className="space-y-1">
      {allKeys.map((key) => {
        const oldVal = String(oldObj[key] ?? "")
        const newVal = String(newObj[key] ?? "")
        const changed = oldVal !== newVal
        return (
          <div key={key} className={`text-xs p-2 rounded ${changed ? "bg-white/[0.03]" : ""}`}>
            <span className="text-[var(--color-muted)] capitalize">{key}:</span>
            {changed ? (
              <div className="flex gap-2 mt-1">
                <span className="line-through text-red-400/70">{oldVal || "(vacío)"}</span>
                <span className="text-green-400">{newVal || "(vacío)"}</span>
              </div>
            ) : (
              <span className="ml-2 text-white">{oldVal || newVal || "(vacío)"}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AuditLogDetail({ log, onClose }: AuditLogDetailProps): React.JSX.Element | null {
  if (!log) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border-l border-[#222] overflow-y-auto">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#222] px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Detalle del registro
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--color-muted)] hover:text-white text-lg"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${ACTION_COLORS[log.action] || ""}`}>
              {ACTION_LABELS[log.action] || log.action}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-1">Descripción</p>
              <p className="text-sm text-white">{log.description}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-1">Entidad</p>
              <p className="text-sm text-white">
                {ENTITY_LABELS[log.entityType] || log.entityType}
                {log.entityName && <span className="text-[var(--color-muted)]"> — {log.entityName}</span>}
              </p>
            </div>
            {log.entityId && (
              <div>
                <p className="text-xs text-[var(--color-muted)] mb-1">ID</p>
                <p className="text-xs text-white font-mono">{log.entityId}</p>
              </div>
            )}
          </div>

          {(log.oldValues || log.newValues) && (
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-2">Cambios</p>
              <div className="bg-[#111] border border-[#222] rounded-lg p-3">
                <DiffView oldValues={log.oldValues} newValues={log.newValues} />
              </div>
            </div>
          )}

          <div className="space-y-2 pt-4 border-t border-[#222]">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-muted)]">Fecha</span>
              <span className="text-white">{formatDate(log.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-muted)]">Admin</span>
              <span className="text-white">{log.userEmail || "Sistema"}</span>
            </div>
            {log.ipAddress && (
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-muted)]">IP</span>
                <span className="text-white font-mono">{log.ipAddress}</span>
              </div>
            )}
            {log.userAgent && (
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-muted)]">User Agent</span>
                <span className="text-white text-right max-w-[250px] truncate">{log.userAgent}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuditLogDetail
