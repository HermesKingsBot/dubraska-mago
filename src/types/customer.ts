import { Order } from "./index"

export interface CustomerUser {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomerAddress {
  id: string
  userId: string
  label: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string | null
  carrier: string | null
  officeCode: string | null
  reference: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product?: import("./index").Product
  createdAt: string
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  product?: import("./index").Product
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  method: string
  reference: string | null
  proofImageUrl: string | null
  status: string
  adminNote: string | null
  paidAt: string | null
  verifiedAt: string | null
  verifiedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CustomerOrder extends Order {
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
  payment?: Payment
}

export interface CustomerJwtPayload {
  id: string
  email: string
  role: "customer"
}
