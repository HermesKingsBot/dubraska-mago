import type { Metadata } from "next"
import { CatalogSearchParams } from "@/types/product"
import type { AvailableFilters } from "@/types/product"
import { parseSearchParams, buildApiQueryString } from "@/lib/catalog-utils"
import type { Product } from "@/types/product"
import CatalogClient from "./CatalogClient"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Colecciones | Dubraska Mago®",
    description: "Explora nuestra colección de joyería de lujo. Collares, pulseras, aretes, anillos y sets en acero inoxidable bañado en oro 18K.",
    openGraph: {
      title: "Colecciones | Dubraska Mago®",
      description: "Explora nuestra colección de joyería de lujo.",
      type: "website",
    },
  }
}

interface PageProps {
  searchParams: Promise<CatalogSearchParams>
}

interface ApiProduct {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice: number | null
  category?: { name: string; slug: string }
  categoryId: string
  color: string
  badge: string | null
  image: string
  material: string
  length?: string
  diameter?: string
  weight?: string
  inStock: boolean
  featured: boolean
  stock: number
  lowStock: number
  sku: string
}

function mapProduct(p: ApiProduct): Product {
  const catName = p.category?.name || ""
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
  }
}

export default async function ColeccionesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters = parseSearchParams(params)
  const queryString = buildApiQueryString(filters)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  let products: Product[] = []
  let totalProducts = 0
  let totalPages = 1
  let availableFilters: AvailableFilters = {
    categories: [],
    colors: [],
    badges: [],
    priceRange: { min: 0, max: 0 },
  }

  try {
    const [productsRes, filtersRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?${queryString}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/products/filters`, { next: { revalidate: 300 } }),
    ])

    const productsJson = await productsRes.json()
    if (productsJson.success) {
      const data = productsJson.data
      products = (data.items || []).map(mapProduct)
      totalProducts = data.total || 0
      totalPages = data.totalPages || 1
      if (data.availableFilters) {
        availableFilters = {
          categories: data.availableFilters.categories || [],
          colors: data.availableFilters.colors || [],
          badges: data.availableFilters.badges || [],
          priceRange: data.availableFilters.priceRange || { min: 0, max: 0 },
        }
      }
    }

    const filtersJson = await filtersRes.json()
    if (filtersJson.success) {
      availableFilters = {
        categories: filtersJson.data.categories || availableFilters.categories,
        colors: filtersJson.data.colors || availableFilters.colors,
        badges: filtersJson.data.badges || availableFilters.badges,
        priceRange: filtersJson.data.priceRange || availableFilters.priceRange,
      }
    }
  } catch {
    products = []
  }

  return (
    <CatalogClient
      products={products}
      totalProducts={totalProducts}
      totalPages={totalPages}
      initialFilters={filters}
      availableFilters={availableFilters}
    />
  )
}
