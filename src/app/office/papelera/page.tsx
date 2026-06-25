"use client"

import React, { useState } from "react"
import AuthGuard from "@/components/office/AuthGuard"
import RestoreButton from "@/components/office/RestoreButton"
import { useTrash } from "@/hooks/useTrash"

const TABS = ["Productos", "Categorías", "Testimonios", "Pedidos", "Redes Sociales"]
const TAB_KEYS = ["products", "categories", "testimonials", "orders", "socialLinks"] as const

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" })
}

function PapeleraPage(): React.JSX.Element {
  const { data, loading, trashCount, restore, hardDelete } = useTrash()
  const [activeTab, setActiveTab] = useState(0)

  const currentItems = data ? (data[TAB_KEYS[activeTab]] || []) : []

  const handleHardDelete = async (type: string, id: string, name: string) => {
    if (!confirm(`¿Eliminar permanentemente "${name}"? Esta acción NO se puede deshacer.`)) return
    const ok = await hardDelete(type, id)
    if (ok) alert(`"${name}" eliminado permanentemente`)
  }

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-instrument-serif)" }}>
            Papelera {trashCount > 0 && <span className="text-sm font-normal text-[var(--color-muted)]">({trashCount} elementos)</span>}
          </h1>
        </div>

        <div className="flex gap-1 border-b border-[#222] overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                activeTab === i
                  ? "text-[var(--color-gold)] border-b-2 border-[var(--color-gold)]"
                  : "text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-8 text-center">
            <p className="text-[var(--color-muted)] text-sm">Cargando...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl p-12 text-center">
            <p className="text-[var(--color-muted)] text-sm">La papelera está vacía</p>
          </div>
        ) : (
          <div className="bg-[var(--color-dark-card)] border border-[#222] rounded-xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_120px_120px] gap-4 px-4 py-2 text-xs text-[var(--color-muted)] border-b border-[#222]">
              <span>Nombre</span>
              <span>Eliminado</span>
              <span>Acciones</span>
            </div>
            <div className="divide-y divide-[#222]">
              {currentItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px] gap-2 sm:gap-4 px-4 py-3 items-center">
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-xs text-[var(--color-muted)]">{formatDate(item.deletedAt)}</span>
                  <div className="flex gap-2">
                    <RestoreButton
                      name={item.name}
                      onRestore={() => restore(item.entityType, item.id)}
                    />
                    <button
                      onClick={() => handleHardDelete(item.entityType, item.id, item.name)}
                      className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

export default PapeleraPage
