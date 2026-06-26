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

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
})

export const bulkUpdateSettingsSchema = z.object({
  settings: z.array(updateSettingSchema).min(1),
})

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("URL inválida"),
  handle: z.string().optional(),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
})

export const updateSocialLinkSchema = socialLinkSchema.partial()

export const updateProductSizesSchema = z.object({
  sizes: z.array(z.string()).default([]),
})

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Nombre muy corto").max(50),
  email: z.string().email("Email inválido").optional(),
  rating: z.number().int().min(1, "Mínimo 1 estrella").max(5, "Máximo 5 estrellas"),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, "Mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres"),
  images: z.array(z.string()).default([]),
})

export const updateReviewSchema = createReviewSchema.partial().extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
})

export const saveComparisonSchema = z.object({
  productIds: z.array(z.string()).min(2, "Mínimo 2 productos").max(4, "Máximo 4 productos"),
})

export const auditLogQuerySchema = z.object({
  action: z.enum(["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "STATUS_CHANGE", "LOGIN", "LOGOUT"]).optional(),
  entityType: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(100).default(50),
})

export const importProductSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),
  sku: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().positive("Precio debe ser positivo"),
  oldPrice: z.coerce.number().positive().nullable().optional(),
  material: z.string().default(""),
  length: z.string().nullable().optional(),
  diameter: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  color: z.string().default(""),
  badge: z.string().nullable().optional(),
  image: z.string().default(""),
  inStock: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  categoryName: z.string().default(""),
  sizes: z.string().default("[]"),
  compareGroup: z.string().nullable().optional(),
  hasVariants: z.coerce.boolean().default(false),
  variantSku: z.string().optional(),
  variantName: z.string().optional(),
  variantColor: z.string().optional(),
  variantColorHex: z.string().optional(),
  variantSize: z.string().optional(),
  variantMaterial: z.string().optional(),
  variantPrice: z.coerce.number().nullable().optional(),
  variantStock: z.coerce.number().int().default(0),
  variantLowStock: z.coerce.number().int().default(5),
  variantWeight: z.string().nullable().optional(),
  variantImage: z.string().nullable().optional(),
  variantInStock: z.coerce.boolean().default(true),
  variantActive: z.coerce.boolean().default(true),
})

export const importCategorySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),
  description: z.string().default(""),
  active: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
})

export const importTestimonialSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  text: z.string().min(1, "Texto requerido"),
  rating: z.coerce.number().int().min(1).max(5),
  productSlug: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  active: z.coerce.boolean().default(true),
})

export const inventoryMovementSchema = z.object({
  productSku: z.string().min(1, "SKU de producto requerido"),
  type: z.enum(["STOCK_IN", "STOCK_OUT", "SET"]),
  quantity: z.coerce.number().int().positive("Cantidad debe ser positiva"),
  reason: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
})

export const variantSchema = z.object({
  sku: z.string().min(1, "SKU requerido"),
  name: z.string().min(1, "Nombre requerido"),
  color: z.string().nullable().optional(),
  colorHex: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  oldPrice: z.number().positive().nullable().optional(),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  weight: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.string().default("[]"),
  inStock: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),
})

export const updateVariantSchema = variantSchema.partial()

export const createProductWithVariantsSchema = z.object({
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
  sizes: z.string().default("[]"),
  compareGroup: z.string().nullable().optional(),
  hasVariants: z.boolean().default(false),
  variantAttributes: z.string().default("[]"),
  variants: z.array(variantSchema).default([]),
})

export const updateProductWithVariantsSchema = createProductWithVariantsSchema.partial()

export const variantImportSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  color: z.string().nullable().optional(),
  colorHex: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  price: z.coerce.number().positive().nullable().optional(),
  oldPrice: z.coerce.number().positive().nullable().optional(),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  weight: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.string().default("[]"),
  inStock: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),
})
