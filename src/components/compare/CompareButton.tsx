"use client"

import { useCompare } from "@/context/CompareContext"

interface CompareButtonProps {
  productId: string
}

export default function CompareButton({ productId }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareCount } = useCompare()
  const inCompare = isInCompare(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(productId)
    } else if (compareCount < 4) {
      addToCompare(productId)
    }
  }

  return (
    <button
      onClick={handleClick}
      title={inCompare ? "Quitar del comparador" : "Agregar al comparador"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        inCompare
          ? "bg-[var(--color-gold)] text-[var(--color-bg)]"
          : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v6m0 0H3m6 0h12M3 9v10a2 2 0 002 2h4m-6-12h12m0 0v10a2 2 0 01-2 2h-4" />
      </svg>
    </button>
  )
}
