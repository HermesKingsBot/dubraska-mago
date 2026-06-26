"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import products from "../../data/products.json"

interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  image: string
}

const CATEGORIES = [
  { label: "Collares", href: "/colecciones?category=collares" },
  { label: "Pulseras", href: "/colecciones?category=pulseras" },
  { label: "Aretes", href: "/colecciones?category=aretes" },
  { label: "Sets", href: "/colecciones?category=sets" },
]

function searchProducts(query: string, allProducts: Product[]) {
  if (query.length < 2) return { products: [] as Product[], categories: [] as typeof CATEGORIES }
  const q = query.toLowerCase()
  const matchedProducts = allProducts
    .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1
      return aStarts - bStarts
    })
    .slice(0, 8)
  const matchedCategories = CATEGORIES.filter((c) => c.label.toLowerCase().includes(q))
  return { products: matchedProducts, categories: matchedCategories }
}

function highlightMatch(text: string, query: string): React.JSX.Element {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--color-gold)] font-semibold">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  )
}

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { products: matchedProducts, categories: matchedCategories } =
    searchProducts(debouncedQuery, products as Product[])
  const totalSuggestions = matchedProducts.length + matchedCategories.length

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [debouncedQuery])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setQuery("")
      setDebouncedQuery("")
      setSelectedIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => prev < totalSuggestions - 1 ? prev + 1 : 0)
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : totalSuggestions - 1)
      }
      if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        if (selectedIndex < matchedProducts.length) {
          window.location.href = `/producto/${matchedProducts[selectedIndex].slug}`
        } else {
          const cat = matchedCategories[selectedIndex - matchedProducts.length]
          if (cat) window.location.href = cat.href
        }
      }
    },
    [onClose, totalSuggestions, selectedIndex, matchedProducts, matchedCategories]
  )

  useGSAP(() => {
    if (!overlayRef.current || !isOpen) return
    gsap.fromTo(overlayRef.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" })
  }, { dependencies: [isOpen], scope: overlayRef })

  useGSAP(() => {
    if (!suggestionsRef.current) return
    const items = suggestionsRef.current.querySelectorAll("[data-suggestion]")
    if (items.length) {
      gsap.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.04, ease: "power2.out" })
    }
  }, { dependencies: [debouncedQuery], scope: suggestionsRef })

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar productos"
      className="fixed inset-0 z-[100] bg-[var(--color-bg)] flex flex-col items-center"
    >
      <div className="w-full max-w-2xl mx-auto px-6 pt-20">
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar productos, categorías..."
            role="combobox"
            aria-expanded={totalSuggestions > 0}
            aria-controls="search-suggestions"
            aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
            className="w-full pl-12 pr-12 py-4 bg-[var(--color-dark-accent)] border border-white/10 rounded-2xl text-white text-lg placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none transition-colors duration-300"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Cerrar búsqueda">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div ref={suggestionsRef} id="search-suggestions" role="listbox" aria-label="Resultados de búsqueda">
          {debouncedQuery.length >= 2 && matchedCategories.length > 0 && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>Categorías</p>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map((cat, i) => (
                  <a
                    key={cat.label}
                    id={`suggestion-${matchedProducts.length + i}`}
                    data-suggestion
                    role="option"
                    aria-selected={selectedIndex === matchedProducts.length + i}
                    href={cat.href}
                    className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${selectedIndex === matchedProducts.length + i ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]" : "border-white/10 bg-white/5 text-[var(--color-muted)] hover:border-white/20 hover:text-white"}`}
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >{highlightMatch(cat.label, debouncedQuery)}</a>
                ))}
              </div>
            </div>
          )}

          {debouncedQuery.length >= 2 && matchedProducts.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>Productos</p>
              <div className="grid grid-cols-2 gap-3">
                {matchedProducts.map((product, i) => (
                  <a
                    key={product.id}
                    id={`suggestion-${i}`}
                    data-suggestion
                    role="option"
                    aria-selected={selectedIndex === i}
                    href={`/producto/${product.slug}`}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${selectedIndex === i ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10" : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"}`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-accent)] flex items-center justify-center overflow-hidden flex-shrink-0" aria-hidden="true"><span className="text-[var(--color-muted)] text-xs">{product.category.charAt(0).toUpperCase()}</span></div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>{highlightMatch(product.name, debouncedQuery)}</p>
                      <p className="text-xs text-[var(--color-gold)]" style={{ fontFamily: "var(--font-dm-sans)" }}>${product.price.toFixed(2)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {debouncedQuery.length >= 2 && matchedProducts.length === 0 && matchedCategories.length === 0 && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 text-[var(--color-muted)]" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <p className="text-[var(--color-muted)]" style={{ fontFamily: "var(--font-dm-sans)" }}>No se encontraron resultados para &ldquo;{debouncedQuery}&rdquo;</p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-dm-sans)" }}>Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">ESC</kbd> para cerrar</p>
      </div>
    </div>
  )
}
