"use client"

import React, { useState } from "react"

interface RestoreButtonProps {
  name: string
  onRestore: () => Promise<boolean>
}

function RestoreButton({ name, onRestore }: RestoreButtonProps): React.JSX.Element {
  const [loading, setLoading] = useState(false)

  const handleRestore = async () => {
    if (!confirm(`¿Restaurar "${name}"?`)) return
    setLoading(true)
    const ok = await onRestore()
    setLoading(false)
    if (ok) alert(`"${name}" restaurado correctamente`)
  }

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      className="text-xs px-2 py-1 rounded border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "↻ Restaurar"}
    </button>
  )
}

export default RestoreButton
