"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Product, CatalogFilters, CatalogSearchParams, LayoutColumns, PerPageOption, SortOption, AvailableFilters } from "@/types/product"
import { buildSearchParams, buildApiQueryString } from "@/lib/catalog-utils"
import SearchBar from "@/components/catalog/SearchBar"
import FiltersDrawer from "@/components/catalog/FiltersDrawer"
import LayoutToggle from "@/components/catalog/LayoutToggle"
import Pagination from "@/components/catalog/Pagination"
import ProductGrid from "@/components/catalog/ProductGrid"
import EmptyState from "@/components/catalog/EmptyState"
import FilterChips from "@/components/catalog/FilterChips"
import SortDropdown from "@/components/catalog/SortDropdown"
import ProductSkeleton from "@/components/catalog/ProductSkeleton"

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
    sort: SortOption
  }
  availableFilters: AvailableFilters
}

function mapApiProduct(p: Record<string, unknown>): Product {
  const cat = p.category as Record<string, unknown> | undefined
  return {
    id: String(p.id),
    name: String(p.name),
    slug: String(p.slug),
    description: String(p.description),
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    category: cat?.name ? String(cat.name) : String(p.categoryId || ""),
    color: String(p.color),
    badge: p.badge ? String(p.badge) : null,
    image: String(p.image),
    material: String(p.material),
    length: p.length ? String(p.length) : undefined,
    diameter: p.diameter ? String(p.diameter) : undefined,
    weight: p.weight ? String(p.weight) : undefined,
    pieces: undefined,
    inStock: Boolean(p.inStock),
    featured: Boolean(p.featured),
    stock: Number(p.stock),
    lowStockThreshold: Number(p.lowStock) || 5,
    sku: String(p.sku),
  }
}

export default function CatalogClient({
  products: initialProducts,
  totalProducts: initialTotal,
  totalPages: initialTotalPages,
  initialFilters,
  availableFilters: initialAvailableFilters,
}: CatalogClientProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [products, setProducts] = useState(initialProducts)
  const [totalProducts, setTotalProducts] = useState(initialTotal)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [availableFilters, setAvailableFilters] = useState(initialAvailableFilters)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchProducts = useCallback(async (newFilters: typeof filters) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const qs = buildApiQueryString(newFilters)
      const res = await fetch(`/api/products?${qs}`, {
        cache: "no-store",
        signal: controller.signal,
      })
      const json = await res.json()
      if (!controller.signal.aborted && json.success) {
        const data = json.data
        setProducts((data.items || []).map(mapApiProduct))
        setTotalProducts(data.total || 0)
        setTotalPages(data.totalPages || 1)
        if (data.availableFilters) {
          setAvailableFilters({
            categories: data.availableFilters.categories || [],
            colors: data.availableFilters.colors || [],
            badges: data.availableFilters.badges || [],
            priceRange: data.availableFilters.priceRange || { min: 0, max: 0 },
          })
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        setProducts([])
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

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
      fetchProducts(newFilters)
      scrollToTop()
    },
    [filters, updateURL, fetchProducts]
  )

  const handleFilterChange = useCallback(
    (newFilters: Partial<CatalogFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 }
      setFilters(updated)
      updateURL(updated)
      fetchProducts(updated)
      scrollToTop()
    },
    [filters, updateURL, fetchProducts]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      const newFilters = { ...filters, page }
      setFilters(newFilters)
      updateURL(newFilters)
      fetchProducts(newFilters)
      scrollToTop()
    },
    [filters, updateURL, fetchProducts]
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

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      const newFilters = { ...filters, sort, page: 1 }
      setFilters(newFilters)
      updateURL(newFilters)
      fetchProducts(newFilters)
      scrollToTop()
    },
    [filters, updateURL, fetchProducts]
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
      sort: "newest",
    }
    setFilters(cleared)
    updateURL(cleared)
    fetchProducts(cleared)
    scrollToTop()
  }, [updateURL, fetchProducts])

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
        const newFilters = parseSearchParams(sp as CatalogSearchParams)
        setFilters(newFilters)
        fetchProducts(newFilters)
      })
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [fetchProducts])

  return (
    <div ref={containerRef} className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
          {loading ? "Buscando..." : `${totalProducts} ${totalProducts === 1 ? "producto" : "productos"} disponibles`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="flex-1 w-full sm:w-auto">
          <SearchBar value={filters.q} onSearch={handleSearch} />
        </div>
        <div className="flex items-center gap-3">
          <SortDropdown value={filters.sort} onChange={handleSortChange} />
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

      {hasActiveFilters && (
        <FilterChips
          filters={filters}
          onRemoveCategory={(c) =>
            handleFilterChange({ category: filters.category.filter((x) => x !== c) })
          }
          onRemoveColor={(c) =>
            handleFilterChange({ color: filters.color.filter((x) => x !== c) })
          }
          onRemoveBadge={(key) => handleFilterChange({ [key]: false })}
          onRemovePrice={(key) => handleFilterChange({ [key]: "" })}
          onClearAll={clearFilters}
        />
      )}

      {loading ? (
        <ProductSkeleton layout={filters.layout} />
      ) : products.length > 0 ? (
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

      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
        availableFilters={availableFilters}
      />
    </div>
  )
}
