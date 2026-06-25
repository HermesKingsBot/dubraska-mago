import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
