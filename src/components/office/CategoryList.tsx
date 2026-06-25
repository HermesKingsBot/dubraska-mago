"use client"

import React from "react"
import RestoreButton from "@/components/office/RestoreButton"
import type { Category } from "@/types/office"

interface CategoryListProps {
  categories: Category[]
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
  onRestore?: (id: string) => Promise<boolean>
  showDeleted?: boolean
}

function CategoryList({ categories, onEdit, onDelete, onToggle, onRestore, showDeleted }: CategoryListProps): React.JSX.Element {
  const sorted = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-3">
      {sorted.map((cat) => (
        <div
          key={cat.id}
          className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-[10px] bg-[#222] px-1.5 py-0.5 rounded text-[var(--color-muted)]">
                  #{cat.order}
                </span>
                <span className="text-[10px] bg-[#222] px-1.5 py-0.5 rounded text-[var(--color-muted)]">
                  /{cat.slug}
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1 truncate">
                {cat.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {showDeleted && onRestore ? (
                <RestoreButton name={cat.name} onRestore={() => onRestore(cat.id)} />
              ) : (
                <>
                  <button
                    onClick={() => onToggle(cat.id, !cat.active)}
                    className="relative"
                    aria-label={cat.active ? "Desactivar" : "Activar"}
                  >
                    <div className={`w-9 h-5 rounded-full transition-colors ${cat.active ? "bg-[var(--color-gold)]" : "bg-[#333]"}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${cat.active ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                    </div>
                  </button>
                  <button
                    onClick={() => onEdit(cat)}
                    className="text-xs text-[var(--color-muted)] hover:text-white transition-colors px-2 py-1 border border-[#333] rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-xs text-[var(--color-muted)] hover:text-red-400 transition-colors px-2 py-1 border border-[#333] rounded"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {sorted.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)] text-sm">
          No hay categorías
        </div>
      )}
    </div>
  )
}

export default CategoryList
