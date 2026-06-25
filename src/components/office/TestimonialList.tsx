"use client"

import React from "react"
import RestoreButton from "@/components/office/RestoreButton"
import type { Testimonial } from "@/types/office"

interface TestimonialListProps {
  testimonials: Testimonial[]
  onEdit: (t: Testimonial) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
  onRestore?: (id: string) => Promise<boolean>
  showDeleted?: boolean
}

function TestimonialList({ testimonials, onEdit, onDelete, onToggle, onRestore, showDeleted }: TestimonialListProps): React.JSX.Element {
  return (
    <div className="space-y-3">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t.name}</span>
                <span className="text-[var(--color-gold)]">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2">
                {t.text}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-[#222] px-1.5 py-0.5 rounded text-[var(--color-muted)]">
                  {t.productId || "Sin producto"}
                </span>
                <span className="text-[10px] bg-[#222] px-1.5 py-0.5 rounded text-[var(--color-muted)]">
                  {t.date}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {showDeleted && onRestore ? (
                <RestoreButton name={t.name} onRestore={() => onRestore(t.id)} />
              ) : (
                <>
                  <button
                    onClick={() => onToggle(t.id, !t.active)}
                    className="relative"
                    aria-label={t.active ? "Desactivar" : "Activar"}
                  >
                    <div className={`w-9 h-5 rounded-full transition-colors ${t.active ? "bg-[var(--color-gold)]" : "bg-[#333]"}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${t.active ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                    </div>
                  </button>
                  <button
                    onClick={() => onEdit(t)}
                    className="text-xs text-[var(--color-muted)] hover:text-white transition-colors px-2 py-1 border border-[#333] rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
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

      {testimonials.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)] text-sm">
          No hay testimonios
        </div>
      )}
    </div>
  )
}

export default TestimonialList
