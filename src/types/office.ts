export interface AuthUser {
  email: string
  name: string
  role: "admin"
}

export interface OfficeProduct {
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
  visible: boolean
}

export interface StockOrder {
  id: string
  productId: string
  productName: string
  supplier: string
  quantity: number
  notes: string
  expectedDate: string
  createdAt: string
}

export interface StockAdjustment {
  id: string
  productId: string
  productName: string
  previousStock: number
  newStock: number
  reason: string
  createdAt: string
}

export type OrderSupplier = "Proveedor" | "Fabricación" | "Reposición"

export type AdjustmentReason = "Conteo físico" | "Ajuste sistema" | "Devolución" | "Otro"

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  active: boolean
  order: number
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  productId: string
  date: string
  active: boolean
}
