"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { useCompare } from "@/context/CompareContext"
import { Product } from "@/types/product"
import CompareTable from "@/components/compare/CompareTable"
import CompareEmptyState from "@/components/compare/CompareEmptyState"

export default function ComparePage() {
  const { compareIds, clearCompare, removeFromCompare } = useCompare()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (compareIds.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all(
      compareIds.map((id) =>
        fetch(`/api/products/${id}`, { credentials: "include" })
          .then((r) => r.json())
          .then((json) => (json.success ? json.data : null))
          .catch(() => null)
      )
    ).then((results) => {
      setProducts(results.filter(Boolean) as Product[])
      setLoading(false)
    })
  }, [compareIds])

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-8" style={{ fontFamily: "var(--font-dm-sans)" }}>
          <a href="/" className="hover:text-white transition-colors">Inicio</a>
          <span>/</span>
          <span className="text-white">Comparar</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl sm:text-4xl text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Comparar <em className="text-[var(--color-gold)]">Productos</em>
          </h1>
          {compareIds.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-4 py-2 text-xs text-[var(--color-muted)] hover:text-white border border-white/10 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Limpiar todo
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : compareIds.length === 0 ? (
          <CompareEmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CompareTable products={products} />

            <div className="flex items-center justify-center gap-4 mt-8">
              <a
                href="/colecciones"
                className="px-6 py-2.5 rounded-full border border-white/10 text-sm text-[var(--color-muted)] hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Agregar más
              </a>
              <button
                onClick={clearCompare}
                className="px-6 py-2.5 rounded-full border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Limpiar todo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
