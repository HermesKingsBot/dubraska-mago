"use client"

import { motion } from "motion/react"
import { PerPageOption } from "@/types/product"
import { PER_PAGE_OPTIONS } from "@/types/product"

interface PaginationProps {
  page: number
  totalPages: number
  perPage: PerPageOption
  total: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: PerPageOption) => void
}

export default function Pagination({
  page,
  totalPages,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const pages: (number | "...")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push("...")
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push("...")
    pages.push(totalPages)
  }

  const start = perPage === "all" ? 1 : (page - 1) * (perPage as number) + 1
  const end = perPage === "all" ? total : Math.min(page * (perPage as number), total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/10">
      <p
        className="text-xs text-[var(--color-muted)]"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Mostrando {start}–{end} de {total}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Ver:
          </span>
          <select
            value={perPage === "all" ? "all" : perPage}
            onChange={(e) => {
              const val = e.target.value === "all" ? "all" : Number(e.target.value)
              onPerPageChange(val as PerPageOption)
            }}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[var(--color-bg)]">
                {opt === "all" ? "Todos" : opt}
              </option>
            ))}
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 rounded text-xs text-[var(--color-muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              ← Ant
            </motion.button>
            {pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 py-1 text-xs text-[var(--color-muted)]"
                >
                  …
                </span>
              ) : (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPageChange(p)}
                  className={`min-w-[28px] px-2 py-1 rounded text-xs transition-colors ${
                    page === p
                      ? "bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold"
                      : "text-[var(--color-muted)] hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {p}
                </motion.button>
              )
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 rounded text-xs text-[var(--color-muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Sig →
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
