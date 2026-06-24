"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CatalogFilters } from "@/types/product";
import { CATEGORIES, COLORS } from "@/types/product";

interface FiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: CatalogFilters;
  onFilterChange: (filters: Partial<CatalogFilters>) => void;
  onClear: () => void;
}

export default function FiltersDrawer({
  open,
  onClose,
  filters,
  onFilterChange,
  onClear,
}: FiltersDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  const activeCount =
    filters.category.length +
    filters.color.length +
    (filters.ofertas ? 1 : 0) +
    (filters.nuevos ? 1 : 0) +
    (filters.limitados ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-sm bg-[#0a0a0a] border-r border-white/10 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2
                  className="text-white text-lg"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Filtros
                </h2>
                {activeCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#8A8A8A] hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Category */}
              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Categoría
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          filters.category.includes(cat.value)
                            ? "bg-[#D4AF37] border-[#D4AF37]"
                            : "border-white/20 group-hover:border-white/40"
                        }`}
                      >
                        {filters.category.includes(cat.value) && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            stroke="#050505"
                            strokeWidth="2"
                          >
                            <path d="M2 5l2.5 2.5L8 3" />
                          </svg>
                        )}
                      </span>
                      <span
                        className="text-sm text-[#8A8A8A] group-hover:text-white transition-colors"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Color
                </h3>
                <div className="space-y-2">
                  {COLORS.map((col) => (
                    <label
                      key={col.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          filters.color.includes(col.value)
                            ? "border-[#D4AF37]"
                            : "border-white/20 group-hover:border-white/40"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: col.hex }}
                        />
                      </span>
                      <span
                        className="text-sm text-[#8A8A8A] group-hover:text-white transition-colors"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {col.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Rango de precio
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) =>
                        onFilterChange({ priceMin: e.target.value })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#8A8A8A] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                  <span className="text-[#8A8A8A] text-xs">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) =>
                        onFilterChange({ priceMax: e.target.value })
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#8A8A8A] focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div>
                <h3
                  className="text-white text-sm font-medium mb-4"
                  style={{ fontFamily: "var(--font-inter)" }}
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
                        className="text-sm text-[#8A8A8A] group-hover:text-white transition-colors"
                        style={{ fontFamily: "var(--font-inter)" }}
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
                          filters[toggle.key] ? "bg-[#D4AF37]" : "bg-white/10"
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

            {/* Footer */}
            <div className="sticky bottom-0 p-6 border-t border-white/10 bg-[#0a0a0a]">
              <div className="flex gap-3">
                <button
                  onClick={onClear}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Limpiar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-[#D4AF37] text-[#050505] text-sm font-medium hover:bg-[#E8C96A] transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
