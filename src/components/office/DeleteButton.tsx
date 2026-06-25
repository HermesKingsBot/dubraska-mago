"use client"

import React, { useState } from "react"
import SoftDeleteConfirmDialog from "./SoftDeleteConfirmDialog"

interface DeleteButtonProps {
  name: string
  onDelete: () => Promise<boolean> | void
  affectedCount?: number
  affectedLabel?: string
}

function DeleteButton({ name, onDelete, affectedCount, affectedLabel }: DeleteButtonProps): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    const result = onDelete()
    if (result instanceof Promise) await result
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-2 py-1 rounded border border-[#333] text-[var(--color-muted)] hover:border-red-500 hover:text-red-400 transition-colors"
      >
        🗑
      </button>
      <SoftDeleteConfirmDialog
        open={open}
        name={name}
        affectedCount={affectedCount}
        affectedLabel={affectedLabel}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

export default DeleteButton
