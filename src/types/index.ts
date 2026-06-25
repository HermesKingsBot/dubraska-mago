export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice: number | null
  material: string
  length: string | null
  diameter: string | null
  weight: string | null
  color: string
  badge: string | null
  image: string
  gallery: string[]
  inStock: boolean
  featured: boolean
  stock: number
  lowStock: number
  sku: string
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  productId: string | null
  date: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  status: string
  userId: string | null
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingName: string
  shippingPhone: string
  shippingStreet: string
  shippingCity: string
  shippingState: string
  shippingZip: string | null
  shippingCarrier: string | null
  shippingOffice: string | null
  shippingRef: string | null
  subtotal: number
  shippingCost: number
  total: number
  notes: string | null
  items: OrderItem[]
  payment?: unknown
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface CatalogFilters {
  category?: string
  color?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  inStock?: boolean
  search?: string
}
