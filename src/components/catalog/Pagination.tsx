"use client";

import { PerPageOption } from "@/types/product";
import { PER_PAGE_OPTIONS } from "@/types/product";

interface PaginationProps {
  page: number;
  totalPages: number;
  perPage: PerPageOption;
  total: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: PerPageOption) => void;
}

export default function Pagination({
  page,
  totalPages,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const start = perPage === "all" ? 1 : (page - 1) * (perPage as number) + 1;
  const end = perPage === "all" ? total : Math.min(page * (perPage as number), total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-white/10">
      {/* Results count */}
      <p
        className="text-xs text-[#8A8A8A]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Mostrando {start}–{end} de {total}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-4">
        {/* Per page selector */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-[#8A8A8A]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ver:
          </span>
          <select
            value={perPage === "all" ? "all" : perPage}
            onChange={(e) => {
              const val = e.target.value === "all" ? "all" : Number(e.target.value);
              onPerPageChange(val as PerPageOption);
            }}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0a0a0a]">
                {opt === "all" ? "Todos" : opt}
              </option>
            ))}
          </select>
        </div>

        {/* Page buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 rounded text-xs text-[#8A8A8A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ← Ant
            </button>
            {pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 py-1 text-xs text-[#8A8A8A]"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`min-w-[28px] px-2 py-1 rounded text-xs transition-colors ${
                    page === p
                      ? "bg-[#D4AF37] text-[#050505] font-semibold"
                      : "text-[#8A8A8A] hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 rounded text-xs text-[#8A8A8A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Sig →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
