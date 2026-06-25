import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
})

export const addressSchema = z.object({
  label: z.string().default("Casa"),
  fullName: z.string().min(1, "Nombre requerido"),
  phone: z.string().min(1, "Teléfono requerido"),
  street: z.string().min(1, "Dirección requerida"),
  city: z.string().min(1, "Ciudad requerida"),
  state: z.string().min(1, "Estado requerido"),
  zipCode: z.string().optional(),
  carrier: z.string().optional(),
  officeCode: z.string().optional(),
  reference: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
})

export const checkoutSchema = z.object({
  addressId: z.string().min(1),
  notes: z.string().optional(),
  shippingCarrier: z.string().min(1),
  shippingOffice: z.string().optional(),
  shippingCost: z.number().default(0),
})

export const paymentSchema = z.object({
  orderId: z.string().min(1),
  method: z.enum(["transferencia", "pago_movil", "zelle", "paypal", "efectivo"]),
  reference: z.string().optional(),
  amount: z.number().positive(),
})

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
  price: z.number().positive(),
  oldPrice: z.number().positive().nullable().optional(),
  material: z.string().default(""),
  length: z.string().nullable().optional(),
  diameter: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  color: z.string().default(""),
  badge: z.string().nullable().optional(),
  image: z.string().default(""),
  gallery: z.string().default("[]"),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  stock: z.number().int().default(0),
  lowStock: z.number().int().default(5),
  sku: z.string().default(""),
  categoryId: z.string().min(1),
})

export const updateProductSchema = createProductSchema.partial()

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().default(""),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
})

export const updateCategorySchema = createCategorySchema.partial()

export const createTestimonialSchema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  productId: z.string().nullable().optional(),
  date: z.string().optional(),
  active: z.boolean().default(true),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
})

export const inventoryAdjustmentSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(["STOCK_IN", "STOCK_OUT", "SET"]),
  quantity: z.number().int().positive(),
  reason: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
})
