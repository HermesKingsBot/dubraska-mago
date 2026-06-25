import { CatalogSearchParams } from "@/types/product"
import { parseSearchParams, filterProducts, paginateProducts } from "@/lib/catalog-utils"
import type { Product } from "@/types/product"
import CatalogClient from "./CatalogClient"

interface PageProps {
  searchParams: Promise<CatalogSearchParams>
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/products?limit=200`,
      { cache: "no-store" }
    )
    const json = await res.json()
    if (!json.success) return []
    const items = json.data.items || []
    return items.map((p: Record<string, unknown>) => {
      const cat = p.category as Record<string, unknown> | undefined
      const catName = cat?.name ? String(cat.name) : ""
      return {
        id: String(p.id),
        name: String(p.name),
        slug: String(p.slug),
        description: String(p.description),
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        category: catName || String(p.categoryId || ""),
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
      } as Product
    })
  } catch {
    return []
  }
}

export default async function ColeccionesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters = parseSearchParams(params)
  const products = await fetchProducts()
  const filtered = filterProducts(products, filters)
  const { items, totalPages, total } = paginateProducts(
    filtered,
    filters.page,
    filters.perPage
  )

  return (
    <CatalogClient
      products={items}
      totalProducts={total}
      totalPages={totalPages}
      initialFilters={filters}
    />
  )
}
