"use client"

import { CatalogFilters } from "@/types/product"

interface FilterChipsProps {
  filters: CatalogFilters
  onRemoveCategory: (category: string) => void
  onRemoveColor: (color: string) => void
  onRemoveBadge: (key: "ofertas" | "nuevos" | "limitados") => void
  onRemovePrice: (key: "priceMin" | "priceMax") => void
  onClearAll: () => void
}

function Chip({
  label,
  colorClass,
  onRemove,
}: {
  label: string
  colorClass: string
  onRemove: () => void
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${colorClass}`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:opacity-70 transition-opacity"
        aria-label={`Quitar filtro ${label}`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l6 6M8 2l-6 6" />
        </svg>
      </button>
    </span>
  )
}

export default function FilterChips({
  filters,
  onRemoveCategory,
  onRemoveColor,
  onRemoveBadge,
  onRemovePrice,
  onClearAll,
}: FilterChipsProps) {
  const chipCount =
    filters.category.length +
    filters.color.length +
    (filters.ofertas ? 1 : 0) +
    (filters.nuevos ? 1 : 0) +
    (filters.limitados ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0)

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span
        className="text-xs text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Filtros activos:
      </span>

      {filters.category.map((c) => (
        <Chip
          key={`cat-${c}`}
          label={c}
          colorClass="bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20"
          onRemove={() => onRemoveCategory(c)}
        />
      ))}

      {filters.color.map((c) => (
        <Chip
          key={`col-${c}`}
          label={c}
          colorClass="bg-[var(--color-rose)]/10 text-[var(--color-rose)] hover:bg-[var(--color-rose)]/20"
          onRemove={() => onRemoveColor(c)}
        />
      ))}

      {filters.ofertas && (
        <Chip
          label="Ofertas"
          colorClass="bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20"
          onRemove={() => onRemoveBadge("ofertas")}
        />
      )}

      {filters.nuevos && (
        <Chip
          label="Nuevos"
          colorClass="bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20"
          onRemove={() => onRemoveBadge("nuevos")}
        />
      )}

      {filters.limitados && (
        <Chip
          label="Limitados"
          colorClass="bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20"
          onRemove={() => onRemoveBadge("limitados")}
        />
      )}

      {filters.priceMin && (
        <Chip
          label={`Min $${filters.priceMin}`}
          colorClass="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          onRemove={() => onRemovePrice("priceMin")}
        />
      )}

      {filters.priceMax && (
        <Chip
          label={`Max $${filters.priceMax}`}
          colorClass="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          onRemove={() => onRemovePrice("priceMax")}
        />
      )}

      {chipCount >= 2 && (
        <button
          onClick={onClearAll}
          className="text-xs text-[var(--color-muted)] hover:text-white transition-colors underline underline-offset-2"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Limpiar todo
        </button>
      )}
    </div>
  )
}
