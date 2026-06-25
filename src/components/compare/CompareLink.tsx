"use client"

import { useCompare } from "@/context/CompareContext"

export default function CompareLink() {
  const { compareCount } = useCompare()

  if (compareCount === 0) return null

  return (
    <a
      href="/comparar"
      className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
      aria-label="Comparar productos"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)] hover:text-white transition-colors">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v6m0 0H3m6 0h12M3 9v10a2 2 0 002 2h4m-6-12h12m0 0v10a2 2 0 01-2 2h-4" />
      </svg>
      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--color-gold)] text-[var(--color-bg)] text-[9px] font-bold flex items-center justify-center">
        {compareCount}
      </span>
    </a>
  )
}
