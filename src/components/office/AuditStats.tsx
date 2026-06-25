"use client"

import React from "react"
import type { AuditStats } from "@/types/audit"

interface AuditStatsCardsProps {
  stats: AuditStats & { mostCommon: string | null }
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Crear",
  UPDATE: "Actualizar",
  DELETE: "Eliminar",
  APPROVE: "Aprobar",
  REJECT: "Rechazar",
  STATUS_CHANGE: "Cambio estado",
}

function AuditStatsCards({ stats }: AuditStatsCardsProps): React.JSX.Element {
  const cards = [
    { label: "Hoy", value: stats.today, icon: "📅" },
    { label: "Semana", value: stats.week, icon: "📊" },
    { label: "Mes", value: stats.month, icon: "📈" },
    { label: "Total", value: stats.total, icon: "📋" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--color-muted)]">{card.label}</span>
            <span className="text-base">{card.icon}</span>
          </div>
          <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-inter)" }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}

export default AuditStatsCards
