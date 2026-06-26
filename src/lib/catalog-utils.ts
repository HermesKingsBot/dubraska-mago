import { Product, CatalogFilters, CatalogSearchParams, SortOption } from "@/types/product"

export function parseSearchParams(searchParams: CatalogSearchParams): CatalogFilters & {
  q: string
  page: number
  perPage: number | "all"
  layout: 4 | 2 | 1
  sort: SortOption
} {
  const q = searchParams.q ?? ""
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)
  const perPageRaw = searchParams.perPage ?? "12"
  const perPage = perPageRaw === "all" ? "all" : Math.min(100, Math.max(1, parseInt(perPageRaw, 10) || 12))
  const layout = ([4, 2, 1].includes(parseInt(searchParams.layout ?? "4", 10))
    ? parseInt(searchParams.layout ?? "4", 10)
    : 4) as 4 | 2 | 1
  const sort = (["newest", "oldest", "price_asc", "price_desc", "name_asc"].includes(searchParams.sort ?? "")
    ? searchParams.sort
    : "newest") as SortOption

  const category = searchParams.category
    ? searchParams.category.split(",").filter(Boolean)
    : []
  const color = searchParams.color
    ? searchParams.color.split(",").filter(Boolean)
    : []

  return {
    q,
    category,
    color,
    priceMin: searchParams.priceMin ?? "",
    priceMax: searchParams.priceMax ?? "",
    ofertas: searchParams.ofertas === "true",
    nuevos: searchParams.nuevos === "true",
    limitados: searchParams.limitados === "true",
    page,
    perPage,
    layout,
    sort,
  }
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters & { q: string }
): Product[] {
  return products.filter((p) => {
    if (filters.q) {
      const q = filters.q.toLowerCase()
      const searchable = `${p.name} ${p.description} ${p.category} ${p.color} ${p.material}`.toLowerCase()
      if (!searchable.includes(q)) return false
    }

    if (filters.category.length > 0 && !filters.category.includes(p.category)) return false
    if (filters.color.length > 0 && !filters.color.includes(p.color ?? "")) return false

    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin)
      if (!isNaN(min) && (p.price ?? 0) < min) return false
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax)
      if (!isNaN(max) && (p.price ?? 0) > max) return false
    }

    if (filters.ofertas && !p.oldPrice) return false
    if (filters.nuevos && p.badge !== "NUEVO") return false
    if (filters.limitados && p.badge !== "LIMITADO") return false

    return true
  })
}

export function paginateProducts<T>(
  products: T[],
  page: number,
  perPage: number | "all"
): { items: T[]; totalPages: number; total: number } {
  const total = products.length
  if (perPage === "all") {
    return { items: products, totalPages: 1, total }
  }
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * perPage
  const items = products.slice(start, start + perPage)
  return { items, totalPages, total }
}

export function buildWhatsAppLink(product: Product): string {
  const msg = encodeURIComponent(
    `Hola, me interesa el producto: ${product.name} — $${(product.price ?? 0).toFixed(2)} USD. ¿Está disponible?`
  )
  return `https://wa.me/584141234567?text=${msg}`
}

export function buildSearchParams(
  filters: CatalogFilters & { q: string; page: number; perPage: number | "all"; layout: 4 | 2 | 1; sort: SortOption }
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q) params.set("q", filters.q)
  if (filters.category.length > 0) params.set("category", filters.category.join(","))
  if (filters.color.length > 0) params.set("color", filters.color.join(","))
  if (filters.priceMin) params.set("priceMin", filters.priceMin)
  if (filters.priceMax) params.set("priceMax", filters.priceMax)
  if (filters.ofertas) params.set("ofertas", "true")
  if (filters.nuevos) params.set("nuevos", "true")
  if (filters.limitados) params.set("limitados", "true")
  if (filters.page > 1) params.set("page", String(filters.page))
  if (filters.perPage !== 12) params.set("perPage", String(filters.perPage))
  if (filters.layout !== 4) params.set("layout", String(filters.layout))
  if (filters.sort !== "newest") params.set("sort", filters.sort)
  return params
}

export function buildApiQueryString(
  filters: CatalogFilters & { q: string; page: number; sort: SortOption }
): string {
  const params = new URLSearchParams()
  if (filters.q) params.set("q", filters.q)
  if (filters.category.length > 0) params.set("category", filters.category.join(","))
  if (filters.color.length > 0) params.set("color", filters.color.join(","))
  if (filters.priceMin) params.set("minPrice", filters.priceMin)
  if (filters.priceMax) params.set("maxPrice", filters.priceMax)
  if (filters.ofertas) params.set("badge", "OFERTA")
  if (filters.nuevos) params.set("badge", "NUEVO")
  if (filters.limitados) params.set("badge", "LIMITADO")
  if (filters.page > 1) params.set("page", String(filters.page))
  params.set("limit", "20")
  if (filters.sort) params.set("sort", filters.sort)
  return params.toString()
}
