"use client"

import React, { useState, useEffect } from "react"
import type { Testimonial } from "@/types/office"
import { useProducts } from "@/hooks/useProducts"

interface TestimonialModalProps {
  open: boolean
  onClose: () => void
  onSave: (t: Testimonial) => void
  initial?: Testimonial | null
}

function TestimonialModal({ open, onClose, onSave, initial }: TestimonialModalProps): React.JSX.Element | null {
  const { products } = useProducts()
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [productId, setProductId] = useState("")
  const [date, setDate] = useState("")
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setText(initial.text)
      setRating(initial.rating)
      setProductId(initial.productId)
      setDate(initial.date)
      setActive(initial.active)
    } else {
      setName("")
      setText("")
      setRating(5)
      setProductId("")
      setDate(new Date().toISOString().split("T")[0])
      setActive(true)
    }
  }, [initial, open])

  if (!open) return null

  const handleSubmit = () => {
    onSave({
      id: initial?.id ?? `t-${Date.now()}`,
      name,
      text,
      rating,
      productId,
      date,
      active,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#333] rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          {initial ? "Editar Testimonio" : "Nuevo Testimonio"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Texto</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-[var(--color-muted)] mb-1">Calificación</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} ★</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[var(--color-muted)] mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Producto</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[var(--color-gold)] outline-none"
            >
              <option value="">Seleccionar producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
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

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--color-muted)] border border-[#333] rounded hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !text.trim()}
            className="px-4 py-2 text-sm bg-[var(--color-gold)] text-black font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {initial ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestimonialModal
