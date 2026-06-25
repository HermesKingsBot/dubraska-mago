"use client"

import React, { useState } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import TestimonialList from "@/components/office/TestimonialList"
import TestimonialModal from "@/components/office/TestimonialModal"
import { useTestimonials } from "@/hooks/useTestimonials"
import type { Testimonial } from "@/types/office"

function TestimoniosPage(): React.JSX.Element {
  const { testimonials, loaded, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSave = (t: Testimonial) => {
    if (editing) {
      updateTestimonial(t.id, t)
    } else {
      addTestimonial(t)
    }
    setEditing(null)
  }

  const handleEdit = (t: Testimonial) => {
    setEditing(t)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const confirmDelete = () => {
    if (deletingId) {
      deleteTestimonial(deletingId)
      setDeletingId(null)
    }
  }

  const handleToggle = (id: string, active: boolean) => {
    updateTestimonial(id, { active })
  }

  if (!loaded) {
    return (
      <AuthGuard>
        <div className="py-12 text-center text-[var(--color-muted)] text-sm">Cargando...</div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Testimonios</h2>
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="px-4 py-2 text-sm bg-[var(--color-gold)] text-black font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Nuevo Testimonio
          </button>
        </div>

        <TestimonialList
          testimonials={testimonials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />

        <TestimonialModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditing(null) }}
          onSave={handleSave}
          initial={editing}
        />

        {deletingId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeletingId(null)}>
            <div className="bg-[#111] border border-[#333] rounded-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-2">Eliminar testimonio</h3>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                ¿Estás seguro de que quieres eliminar este testimonio? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 text-sm text-[var(--color-muted)] border border-[#333] rounded hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

export default TestimoniosPage
