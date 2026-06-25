export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice: number | null
  category: string
  color: string
  badge: string | null
  image: string
  material: string
  length?: string
  diameter?: string
  weight?: string
  pieces?: number
  inStock: boolean
  featured: boolean
  stock: number
  lowStockThreshold: number
  sku: string
}

export type LayoutColumns = 4 | 2 | 1

export type PerPageOption = number | "all"

export interface CatalogFilters {
  category: string[]
  color: string[]
  priceMin: string
  priceMax: string
  ofertas: boolean
  nuevos: boolean
  limitados: boolean
}

export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc"

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name_asc", label: "Nombre A-Z" },
]

export interface AvailableFilters {
  categories: { id: string; name: string; slug: string; count: number }[]
  colors: { value: string; count: number }[]
  badges: { value: string; count: number }[]
  priceRange: { min: number; max: number }
}

export interface CatalogSearchParams {
  q?: string
  category?: string
  color?: string
  priceMin?: string
  priceMax?: string
  ofertas?: string
  nuevos?: string
  limitados?: string
  page?: string
  perPage?: string
  layout?: string
  sort?: string
}

export const CATEGORIES = [
  { value: "collares", label: "Collares" },
  { value: "pulseras", label: "Pulseras" },
  { value: "aretes", label: "Aretes" },
  { value: "sets", label: "Sets" },
] as const

export const COLORS = [
  { value: "dorado", label: "Dorado", hex: "#D4AF37" },
  { value: "plateado", label: "Plateado", hex: "#C0C0C0" },
  { value: "rose", label: "Rosé", hex: "#E8B4B8" },
  { value: "negro", label: "Negro", hex: "#1a1a1a" },
] as const

export const PER_PAGE_OPTIONS: PerPageOption[] = [8, 12, 20, "all"]

export const WHATSAPP_BASE = "https://wa.me/584141234567?text="
