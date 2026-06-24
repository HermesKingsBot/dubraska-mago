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

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Colecciones", href: "/colecciones" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
]

function searchProducts(query: string, allProducts: Product[]) {
  if (query.length < 2) return { products: [] as Product[], categories: [] as typeof CATEGORIES }

  const q = query.toLowerCase()
  const matchedProducts = allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1
      return aStarts - bStarts
    })
    .slice(0, 8)

  const matchedCategories = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(q)
  )

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

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const headerRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { products: matchedProducts, categories: matchedCategories } =
    searchProducts(debouncedQuery, products as Product[])

  const totalSuggestions = matchedProducts.length + matchedCategories.length

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [debouncedQuery])

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [searchOpen])

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    setQuery("")
    setDebouncedQuery("")
    setSelectedIndex(-1)
  }, [])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setQuery("")
    setDebouncedQuery("")
    setSelectedIndex(-1)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch()
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < totalSuggestions - 1 ? prev + 1 : 0
        )
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : totalSuggestions - 1
        )
      }
      if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        if (selectedIndex < matchedProducts.length) {
          const product = matchedProducts[selectedIndex]
          window.location.href = `/producto/${product.slug}`
        } else {
          const catIdx = selectedIndex - matchedProducts.length
          const cat = matchedCategories[catIdx]
          if (cat) window.location.href = cat.href
        }
      }
    },
    [closeSearch, totalSuggestions, selectedIndex, matchedProducts, matchedCategories]
  )

  useGSAP(
    () => {
      if (!overlayRef.current) return

      if (searchOpen) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        )
      }
    },
    { dependencies: [searchOpen], scope: overlayRef }
  )

  useGSAP(
    () => {
      if (!suggestionsRef.current) return
      const items = suggestionsRef.current.querySelectorAll("[data-suggestion]")
      if (items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            stagger: 0.04,
            ease: "power2.out",
          }
        )
      }
    },
    { dependencies: [debouncedQuery], scope: suggestionsRef }
  )

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-bg)]/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 sm:px-8 sm:py-6 max-w-7xl mx-auto">
          <a
            href="/"
            className="text-2xl md:text-3xl tracking-tight text-[var(--color-gold)] hover:text-[oklch(0.84_0.12_85)] transition-colors duration-300"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            DUBRASKA MAGO<sup className="text-xs">®</sup>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-[var(--color-muted)] hover:text-white transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={openSearch}
              className="p-2 rounded-full hover:bg-white/5 transition-colors duration-300"
              aria-label="Buscar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--color-muted)] hover:text-white transition-colors"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <a
              href="/colecciones"
              className="hidden sm:inline-flex rounded-full px-6 py-2.5 text-sm font-medium bg-[var(--color-gold)] text-[var(--color-bg)] cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Catálogo
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[var(--color-bg)]/98 backdrop-blur-md">
            <nav className="flex flex-col px-6 py-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="py-3 text-sm text-[var(--color-muted)] hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "var(--font-inter)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/colecciones"
                className="mt-3 text-center rounded-full px-6 py-3 text-sm font-medium bg-[var(--color-gold)] text-[var(--color-bg)]"
                style={{ fontFamily: "var(--font-inter)" }}
                onClick={() => setMobileOpen(false)}
              >
                Catálogo
              </a>
            </nav>
          </div>
        )}
      </header>

      {searchOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-[var(--color-bg)] flex flex-col items-center"
        >
          <div className="w-full max-w-2xl mx-auto px-6 pt-20">
            <div className="relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar productos, categorías..."
                className="w-full pl-12 pr-12 py-4 bg-[var(--color-dark-accent)] border border-white/10 rounded-2xl text-white text-lg placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)] focus:outline-none transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <button
                onClick={closeSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={suggestionsRef} className="mt-4">
              {debouncedQuery.length >= 2 && matchedCategories.length > 0 && (
                <div className="mb-4">
                  <p
                    className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-2"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Categorías
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchedCategories.map((cat, i) => (
                      <a
                        key={cat.label}
                        data-suggestion
                        href={cat.href}
                        className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                          selectedIndex === matchedProducts.length + i
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                            : "border-white/10 bg-white/5 text-[var(--color-muted)] hover:border-white/20 hover:text-white"
                        }`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {highlightMatch(cat.label, debouncedQuery)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {debouncedQuery.length >= 2 && matchedProducts.length > 0 && (
                <div>
                  <p
                    className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-3"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Productos
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {matchedProducts.map((product, i) => (
                      <a
                        key={product.id}
                        data-suggestion
                        href={`/producto/${product.slug}`}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          selectedIndex === i
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                            : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-[var(--color-dark-accent)] flex items-center justify-center overflow-hidden flex-shrink-0">
                          <span className="text-[var(--color-muted)] text-xs">
                            {product.category.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm text-white truncate"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {highlightMatch(product.name, debouncedQuery)}
                          </p>
                          <p
                            className="text-xs text-[var(--color-gold)]"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {debouncedQuery.length >= 2 &&
                matchedProducts.length === 0 &&
                matchedCategories.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="mx-auto mb-4 text-[var(--color-muted)]"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <p
                      className="text-[var(--color-muted)]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      No se encontraron resultados para &ldquo;{debouncedQuery}&rdquo;
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p
              className="text-xs text-[var(--color-muted)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">ESC</kbd> para cerrar
            </p>
          </div>
        </div>
      )}
    </>
  )
}
