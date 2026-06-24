"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Product, CatalogFilters, CatalogSearchParams, LayoutColumns, PerPageOption } from "@/types/product"
import { buildSearchParams } from "@/lib/catalog-utils"
import SearchBar from "@/components/catalog/SearchBar"
import FiltersDrawer from "@/components/catalog/FiltersDrawer"
import LayoutToggle from "@/components/catalog/LayoutToggle"
import Pagination from "@/components/catalog/Pagination"
import ProductGrid from "@/components/catalog/ProductGrid"
import EmptyState from "@/components/catalog/EmptyState"

gsap.registerPlugin(ScrollTrigger)

interface CatalogClientProps {
  products: Product[]
  totalProducts: number
  totalPages: number
  initialFilters: CatalogFilters & {
    q: string
    page: number
    perPage: number | "all"
    layout: LayoutColumns
  }
}

export default function CatalogClient({
  products,
  totalProducts,
  totalPages,
  initialFilters,
}: CatalogClientProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateURL = useCallback((newFilters: typeof filters) => {
    const params = buildSearchParams(newFilters)
    const qs = params.toString()
    const url = qs ? `/colecciones?${qs}` : "/colecciones"
    window.history.pushState({}, "", url)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearch = useCallback(
    (q: string) => {
      const newFilters = { ...filters, q, page: 1 }
      setFilters(newFilters)
      updateURL(newFilters)
      scrollToTop()
    },
    [filters, updateURL]
  )

  const handleFilterChange = useCallback(
    (newFilters: Partial<CatalogFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 }
      setFilters(updated)
      updateURL(updated)
      scrollToTop()
    },
    [filters, updateURL]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const newFilters = { ...filters, page }
      setFilters(newFilters)
      updateURL(newFilters)
      scrollToTop()
    },
    [filters, updateURL]
  )

  const handlePerPageChange = useCallback(
    (perPage: PerPageOption) => {
      const newFilters = { ...filters, perPage, page: 1 }
      setFilters(newFilters)
      updateURL(newFilters)
      scrollToTop()
    },
    [filters, updateURL]
  )

  const handleLayoutChange = useCallback(
    (layout: LayoutColumns) => {
      const newFilters = { ...filters, layout }
      setFilters(newFilters)
      updateURL(newFilters)
    },
    [filters, updateURL]
  )

  const clearFilters = useCallback(() => {
    const cleared: typeof filters = {
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
    }
    setFilters(cleared)
    updateURL(cleared)
    scrollToTop()
  }, [updateURL])

  const hasActiveFilters =
    filters.category.length > 0 ||
    filters.color.length > 0 ||
    filters.priceMin !== "" ||
    filters.priceMax !== "" ||
    filters.ofertas ||
    filters.nuevos ||
    filters.limitados

  useGSAP(() => {
    if (!containerRef.current) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReduced) return

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
  }, { scope: containerRef })

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const sp: Record<string, string> = {}
      url.searchParams.forEach((v, k) => (sp[k] = v))
      import("@/lib/catalog-utils").then(({ parseSearchParams }) => {
        setFilters(parseSearchParams(sp as CatalogSearchParams))
      })
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return (
    <div ref={containerRef} className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl text-white mb-3"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Nuestras <em className="text-[var(--color-gold)]">Colecciones</em>
        </h1>
        <p
          className="text-[var(--color-muted)] text-sm sm:text-base"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {totalProducts} {totalProducts === 1 ? "producto" : "productos"} disponibles
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="flex-1 w-full sm:w-auto">
          <SearchBar value={filters.q} onSearch={handleSearch} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm hover:border-[var(--color-gold)]/50 transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 4h12M4 8h8M6 12h4" />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-gold)]" />
            )}
          </button>
          <LayoutToggle layout={filters.layout} onChange={handleLayoutChange} />
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-[var(--color-muted)]" style={{ fontFamily: "var(--font-inter)" }}>
            Filtros activos:
          </span>
          {filters.category.map((c) => (
            <button
              key={c}
              onClick={() =>
                handleFilterChange({
                  category: filters.category.filter((x) => x !== c),
                })
              }
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs hover:bg-[var(--color-gold)]/20 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {c}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>
          ))}
          {filters.color.map((c) => (
            <button
              key={c}
              onClick={() =>
                handleFilterChange({
                  color: filters.color.filter((x) => x !== c),
                })
              }
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-rose)]/10 text-[var(--color-rose)] text-xs hover:bg-[var(--color-rose)]/20 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {c}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>
          ))}
          {filters.ofertas && (
            <button
              onClick={() => handleFilterChange({ ofertas: false })}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs hover:bg-[var(--color-gold)]/20 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Ofertas
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>
          )}
          {filters.nuevos && (
            <button
              onClick={() => handleFilterChange({ nuevos: false })}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs hover:bg-[var(--color-gold)]/20 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Nuevos
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>
          )}
          {filters.limitados && (
            <button
              onClick={() => handleFilterChange({ limitados: false })}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs hover:bg-[var(--color-gold)]/20 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Limitados
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-[var(--color-muted)] hover:text-white transition-colors underline underline-offset-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Products or Empty State */}
      {products.length > 0 ? (
        <>
          <ProductGrid products={products} layout={filters.layout} />
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            perPage={filters.perPage}
            total={totalProducts}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      ) : (
        <EmptyState onClearFilters={clearFilters} />
      )}

      {/* Filters Drawer */}
      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
      />
    </div>
  )
}
