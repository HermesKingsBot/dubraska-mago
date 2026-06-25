import type {
  Product,
  Category,
  Testimonial,
  Order,
  PaginatedResponse,
  ApiResponse,
} from "@/types/index"
import type { AuthUser } from "@/types/office"

const BASE = ""

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })
  const json = (await res.json()) as ApiResponse<T>
  if (!json.success) {
    throw new Error(json.error || "API request failed")
  }
  return json.data as T
}

export function getProducts(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : ""
  return request<PaginatedResponse<Product>>(`/api/products${qs}`)
}

export function getProduct(id: string) {
  return request<Product>(`/api/products/${id}`)
}

export function createProduct(data: Partial<Product>) {
  return request<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateProduct(id: string, data: Partial<Product>) {
  return request<Product>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteProduct(id: string) {
  return request<{ message: string }>(`/api/products/${id}`, {
    method: "DELETE",
  })
}

export function getCategories() {
  return request<Category[]>("/api/categories")
}

export function getCategory(id: string) {
  return request<Category>(`/api/categories/${id}`)
}

export function createCategory(data: Partial<Category>) {
  return request<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateCategory(id: string, data: Partial<Category>) {
  return request<Category>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteCategory(id: string) {
  return request<{ message: string }>(`/api/categories/${id}`, {
    method: "DELETE",
  })
}

export function getTestimonials() {
  return request<Testimonial[]>("/api/testimonials")
}

export function getTestimonial(id: string) {
  return request<Testimonial>(`/api/testimonials/${id}`)
}

export function createTestimonial(data: Partial<Testimonial>) {
  return request<Testimonial>("/api/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateTestimonial(id: string, data: Partial<Testimonial>) {
  return request<Testimonial>(`/api/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteTestimonial(id: string) {
  return request<{ message: string }>(`/api/testimonials/${id}`, {
    method: "DELETE",
  })
}

export function getOrders() {
  return request<Order[]>("/api/orders")
}

export function getOrder(id: string) {
  return request<Order>(`/api/orders/${id}`)
}

export function createOrder(data: Record<string, unknown>) {
  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateOrder(id: string, data: Record<string, unknown>) {
  return request<Order>(`/api/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function getInventory() {
  return request<unknown[]>("/api/inventory")
}

export function adjustInventory(data: Record<string, unknown>) {
  return request<unknown>("/api/inventory/adjust", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function login(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function getMe() {
  return request<AuthUser>("/api/auth/me")
}

export function logout() {
  return request<{ message: string }>("/api/auth/logout", {
    method: "POST",
  })
}

export function setCookie(token: string) {
  return request<{ success: boolean }>("/api/auth/set-cookie", {
    method: "POST",
    body: JSON.stringify({ token }),
  })
}

export function clearCookie() {
  return request<{ success: boolean }>("/api/auth/clear-cookie", {
    method: "POST",
  })
}
