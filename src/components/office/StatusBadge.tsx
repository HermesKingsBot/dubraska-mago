import React from "react"

interface StatusBadgeProps {
  stock: number
  threshold: number
}

function StatusBadge({ stock, threshold }: StatusBadgeProps): React.JSX.Element {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">
        ✗ Agotado
      </span>
    )
  }
  if (stock <= threshold) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
        ⚠ Stock Bajo
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20">
      ✓ Disponible
    </span>
  )
}

export default StatusBadge
