"use client"

import React from "react"

interface AuditFiltersProps {
  filters: {
    action: string
    entityType: string
    search: string
    userId: string
    from: string
    to: string
  }
  onUpdate: (updates: Record<string, string>) => void
  onClear: () => void
}

const ACTIONS = ["", "CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "STATUS_CHANGE"]
const ACTION_LABELS: Record<string, string> = {
  "": "Todos",
  CREATE: "Crear",
  UPDATE: "Actualizar",
  DELETE: "Eliminar",
  APPROVE: "Aprobar",
  REJECT: "Rechazar",
  STATUS_CHANGE: "Cambio estado",
}

const ENTITIES = ["", "Product", "Category", "Order", "Review", "User", "Testimonial", "SocialLink", "Payment"]
const ENTITY_LABELS: Record<string, string> = {
  "": "Todos",
  Product: "Producto",
  Category: "Categoría",
  Order: "Pedido",
  Review: "Reseña",
  User: "Usuario",
  Testimonial: "Testimonio",
  SocialLink: "Red Social",
  Payment: "Pago",
}

function AuditFiltersBar({ filters, onUpdate, onClear }: AuditFiltersProps): React.JSX.Element {
  const hasFilters = filters.action || filters.entityType || filters.search || filters.userId || filters.from || filters.to

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a}
            onClick={() => onUpdate({ action: a })}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              filters.action === a
                ? "bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-[#333] text-[var(--color-muted)] hover:border-[#555] hover:text-white"
            }`}
          >
            {ACTION_LABELS[a]}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filters.entityType}
          onChange={(e) => onUpdate({ entityType: e.target.value })}
          className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
        >
          {ENTITIES.map((e) => (
            <option key={e} value={e}>{ENTITY_LABELS[e]}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdate({ search: e.target.value })}
            placeholder="Buscar en descripción..."
            className="w-full pl-9 pr-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
          />
        </div>

        <input
          type="date"
          value={filters.from}
          onChange={(e) => onUpdate({ from: e.target.value })}
          className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => onUpdate({ to: e.target.value })}
          className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] focus:outline-none"
        />

        {hasFilters && (
          <button
            onClick={onClear}
            className="px-3 py-2 text-xs text-[var(--color-muted)] border border-[#333] rounded-lg hover:text-white hover:border-[var(--color-gold)] transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export default AuditFiltersBar
