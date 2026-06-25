"use client"

import React, { useState } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import CategoryList from "@/components/office/CategoryList"
import CategoryModal from "@/components/office/CategoryModal"
import ToggleSwitch from "@/components/office/ToggleSwitch"
import RestoreButton from "@/components/office/RestoreButton"
import { useCategories } from "@/hooks/useCategories"
import type { Category } from "@/types/office"

function CategoriasPage(): React.JSX.Element {
  const { categories, loaded, showDeleted, setShowDeleted, addCategory, updateCategory, deleteCategory } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSave = (cat: Category) => {
    if (editing) {
      updateCategory(cat.id, cat)
    } else {
      addCategory(cat)
    }
    setEditing(null)
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const confirmDelete = () => {
    if (deletingId) {
      deleteCategory(deletingId)
      setDeletingId(null)
    }
  }

  const handleToggle = (id: string, active: boolean) => {
    updateCategory(id, { active })
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
          <h2 className="text-xl font-semibold">Categorías</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ToggleSwitch checked={showDeleted} onChange={setShowDeleted} size="sm" />
              <span className="text-xs text-[var(--color-muted)]">Mostrar eliminados</span>
            </div>
            <button
              onClick={() => { setEditing(null); setModalOpen(true) }}
              className="px-4 py-2 text-sm bg-[var(--color-gold)] text-black font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Nueva Categoría
            </button>
          </div>
        </div>

        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onRestore={async (id) => {
            const res = await fetch(`/api/trash/Category/${id}`, { method: "POST", credentials: "include" })
            const json = await res.json()
            return json.success
          }}
          showDeleted={showDeleted}
        />

        <CategoryModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditing(null) }}
          onSave={handleSave}
          initial={editing}
        />

        {deletingId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeletingId(null)}>
            <div className="bg-[#111] border border-[#333] rounded-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-2">Eliminar categoría</h3>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                ¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.
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

export default CategoriasPage
