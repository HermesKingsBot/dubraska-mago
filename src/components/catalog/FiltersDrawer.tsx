"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CatalogFilters, AvailableFilters } from "@/types/product"
import PriceRangeSlider from "./PriceRangeSlider"

interface FiltersDrawerProps {
  open: boolean
  onClose: () => void
  filters: CatalogFilters
  onFilterChange: (filters: Partial<CatalogFilters>) => void
  onClear: () => void
  availableFilters: AvailableFilters
}

const COLOR_HEX: Record<string, string> = {
  dorado: "#D4AF37",
  plateado: "#C0C0C0",
  rose: "#E8B4B8",
  negro: "#1a1a1a",
}

export default function FiltersDrawer({
  open,
  onClose,
  filters,
  onFilterChange,
  onClear,
  availableFilters,
}: FiltersDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, handleEscape])

  const activeCount =
    filters.category.length +
    filters.color.length +
    (filters.ofertas ? 1 : 0) +
    (filters.nuevos ? 1 : 0) +
    (filters.limitados ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0)

  const categories = availableFilters.categories.length > 0
    ? availableFilters.categories
    : []

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-sm bg-[var(--color-bg)] border-r border-white/10 overflow-y-auto max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-w-full max-md:rounded-t-2xl max-md:border-r-0 max-md:border-t border-white/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2
                  className="text-white text-lg"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Filtros
                </h2>
                {activeCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold)] text-xs"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[var(--color-muted)] hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Categoría
                </h3>
                <div className="space-y-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <label
                        key={cat.slug}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            filters.category.includes(cat.slug)
                              ? "bg-[var(--color-gold)] border-[var(--color-gold)]"
                              : "border-white/20 group-hover:border-white/40"
                          }`}
                        >
                          {filters.category.includes(cat.slug) && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#050505" strokeWidth="2">
                              <path d="M2 5l2.5 2.5L8 3" />
                            </svg>
                          )}
                        </span>
                        <span
                          className="text-sm text-[var(--color-muted)] group-hover:text-white transition-colors flex-1"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {cat.name}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]/60">{cat.count}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      Cargando categorías...
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Color
                </h3>
                <div className="space-y-2">
                  {availableFilters.colors.map((col) => (
                    <label
                      key={col.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          filters.color.includes(col.value)
                            ? "border-[var(--color-gold)]"
                            : "border-white/20 group-hover:border-white/40"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: COLOR_HEX[col.value] || col.value }}
                        />
                      </span>
                      <span
                        className="text-sm text-[var(--color-muted)] group-hover:text-white transition-colors flex-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {col.value}
                      </span>
                      <span className="text-xs text-[var(--color-muted)]/60">{col.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Rango de precio
                </h3>
                <PriceRangeSlider
                  min={availableFilters.priceRange.min}
                  max={availableFilters.priceRange.max}
                  valueMin={filters.priceMin}
                  valueMax={filters.priceMax}
                  onChange={(min, max) => onFilterChange({ priceMin: min, priceMax: max })}
                />
              </div>

              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Especiales
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "ofertas" as const, label: "Solo ofertas" },
                    { key: "nuevos" as const, label: "Solo nuevos" },
                    { key: "limitados" as const, label: "Solo limitados" },
                  ].map((toggle) => (
                    <label
                      key={toggle.key}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span
                        className="text-sm text-[var(--color-muted)] group-hover:text-white transition-colors"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {toggle.label}
                      </span>
                      <button
                        onClick={() =>
                          onFilterChange({
                            [toggle.key]: !filters[toggle.key],
                          })
                        }
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          filters[toggle.key] ? "bg-[var(--color-gold)]" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            filters[toggle.key] ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-6 border-t border-white/10 bg-[var(--color-bg)]">
              <div className="flex gap-3">
                <button
                  onClick={onClear}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Limpiar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-medium hover:bg-[oklch(0.87_0.12_90)] transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
