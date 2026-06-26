"use client"

import { useState, useRef, useEffect } from "react"
import { SortOption, SORT_OPTIONS } from "@/types/product"

interface SortDropdownProps {
  value: SortOption
  onChange: (sort: SortOption) => void
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label || "Ordenar"

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm hover:border-[var(--color-gold)]/50 transition-colors"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h12M3 18h6" />
        </svg>
        {currentLabel}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-white/10 bg-[var(--color-bg)] shadow-xl z-40 overflow-hidden">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === opt.value
                  ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : "text-[var(--color-muted)] hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
