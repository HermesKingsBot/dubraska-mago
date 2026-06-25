"use client"

import React from "react"

interface SoftDeleteConfirmDialogProps {
  open: boolean
  name: string
  affectedCount?: number
  affectedLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function SoftDeleteConfirmDialog({
  open,
  name,
  affectedCount,
  affectedLabel,
  onConfirm,
  onCancel,
}: SoftDeleteConfirmDialogProps): React.JSX.Element | null {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-[#111] border border-[#333] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-inter)" }}>
          ¿Eliminar &ldquo;{name}&rdquo;?
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-2">
          El elemento se moverá a la papelera y puede ser restaurado.
        </p>
        {affectedCount !== undefined && affectedLabel && affectedCount > 0 && (
          <p className="text-sm text-orange-400 mb-4">
            ⚠ Este {affectedLabel} tiene {affectedCount} elemento{affectedCount !== 1 ? "s" : ""} asociado{affectedCount !== 1 ? "s" : ""}
          </p>
        )}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-[#333] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Mover a papelera
          </button>
        </div>
      </div>
    </div>
  )
}

export default SoftDeleteConfirmDialog
