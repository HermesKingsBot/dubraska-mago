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

export function getOrders(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : ""
  return request<Order[]>(`/api/orders${qs}`)
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

export function submitPayment(orderId: string, data: Record<string, unknown>) {
  return request<unknown>(`/api/orders/${orderId}/pay`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function getPayments(params?: Record<string, string>) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : ""
  return request<unknown[]>(`/api/payments${qs}`)
}

export function approvePayment(id: string, data: Record<string, unknown>) {
  return request<unknown>(`/api/payments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function getCart() {
  return request<unknown[]>("/api/cart")
}

export function addToCart(productId: string, quantity = 1) {
  return request<unknown>("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  })
}

export function updateCartItem(productId: string, quantity: number) {
  return request<unknown>(`/api/cart/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  })
}

export function removeFromCart(productId: string) {
  return request<{ message: string }>(`/api/cart/${productId}`, {
    method: "DELETE",
  })
}

export function clearCart() {
  return request<{ message: string }>("/api/cart", {
    method: "DELETE",
  })
}

export function getWishlist() {
  return request<unknown[]>("/api/wishlist")
}

export function addToWishlist(productId: string) {
  return request<unknown>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  })
}

export function removeFromWishlist(productId: string) {
  return request<{ message: string }>(`/api/wishlist/${productId}`, {
    method: "DELETE",
  })
}

export function isInWishlist(productId: string) {
  return request<{ inWishlist: boolean }>(`/api/wishlist/${productId}`)
}

export function getAddresses() {
  return request<unknown[]>("/api/addresses")
}

export function createAddress(data: Record<string, unknown>) {
  return request<unknown>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateAddress(id: string, data: Record<string, unknown>) {
  return request<unknown>(`/api/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function deleteAddress(id: string) {
  return request<{ message: string }>(`/api/addresses/${id}`, {
    method: "DELETE",
  })
}

export function getAccount() {
  return request<unknown>("/api/account")
}

export function updateAccount(data: Record<string, unknown>) {
  return request<unknown>("/api/account", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function changePassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>("/api/account/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function register(data: Record<string, unknown>) {
  return request<{ token: string; user: unknown }>("/api/auth/register", {
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
