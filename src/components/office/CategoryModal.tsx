"use client"

import React, { useState, useEffect } from "react"
import type { Category } from "@/types/office"

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  onSave: (cat: Category) => void
  initial?: Category | null
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function CategoryModal({ open, onClose, onSave, initial }: CategoryModalProps): React.JSX.Element | null {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState(1)
  const [active, setActive] = useState(true)
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setSlug(initial.slug)
      setDescription(initial.description)
      setOrder(initial.order)
      setActive(initial.active)
      setAutoSlug(false)
    } else {
      setName("")
      setSlug("")
      setDescription("")
      setOrder(1)
      setActive(true)
      setAutoSlug(true)
    }
  }, [initial, open])

  if (!open) return null

  const handleNameChange = (val: string) => {
    setName(val)
    if (autoSlug) setSlug(generateSlug(val))
  }

  const handleSubmit = () => {
    onSave({
      id: initial?.id ?? `cat-${Date.now()}`,
      name,
      slug,
      description,
      order,
      active,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#333] rounded-lg w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          {initial ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setAutoSlug(false)
              }}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-[var(--color-muted)] mb-1">Orden</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
              />
            </div>
            <div className="flex-1 flex items-end">
              <label className="flex items-center gap-2 text-sm text-[var(--color-muted)] cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${active ? "bg-[var(--color-gold)]" : "bg-[#333]"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
                Activo
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--color-muted)] border border-[#333] rounded hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-[var(--color-gold)] text-black font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {initial ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryModal
