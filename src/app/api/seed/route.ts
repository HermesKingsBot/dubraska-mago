import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import * as bcrypt from "bcryptjs"
import products from "../../../../data/products.json"
import testimonials from "../../../../data/testimonials.json"

async function POST(request: NextRequest) {
  try {
    await db.payment.deleteMany({})
    await db.wishlistItem.deleteMany({})
    await db.cartItem.deleteMany({})
    await db.address.deleteMany({})
    await db.inventoryMovement.deleteMany({})
    await db.orderItem.deleteMany({})
    await db.order.deleteMany({})
    await db.testimonial.deleteMany({})
    await db.product.deleteMany({})
    await db.category.deleteMany({})
    await db.user.deleteMany({})

    const categoryMap: Record<string, string> = {}
    const categoryNames: string[] = []
    for (const p of products as Array<{ category: string }>) {
      if (!categoryNames.includes(p.category)) {
        categoryNames.push(p.category)
      }
    }
    for (let i = 0; i < categoryNames.length; i++) {
      const catName = categoryNames[i]
      const slug = catName.toLowerCase().replace(/\s+/g, "-")
      const category = await db.category.create({
        data: {
          name: catName,
          slug,
          description: catName,
          active: true,
          order: i,
        },
      })
      categoryMap[catName] = category.id
    }

    for (const product of products as Array<{
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
      length: string | null
      weight: string | null
      inStock: boolean
      featured: boolean
      gallery: string[]
      stock: number
      lowStockThreshold: number
      sku: string
    }>) {
      await db.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          material: product.material,
          length: product.length,
          weight: product.weight,
          color: product.color,
          badge: product.badge,
          image: product.image,
          gallery: JSON.stringify(product.gallery),
          inStock: product.inStock,
          featured: product.featured,
          stock: product.stock,
          lowStock: product.lowStockThreshold,
          sku: product.sku,
          categoryId: categoryMap[product.category],
        },
      })
    }

    for (const testimonial of testimonials as Array<{
      name: string
      text: string
      rating: number
      productId: string | null
      date: string
      active: boolean
    }>) {
      await db.testimonial.create({
        data: {
          name: testimonial.name,
          text: testimonial.text,
          rating: testimonial.rating,
          productId: testimonial.productId,
          date: new Date(testimonial.date),
          active: testimonial.active,
        },
      })
    }

    const hashedPassword = await bcrypt.hash("admin123", 10)
    await db.user.create({
      data: {
        email: "admin@dubraskamago.com",
        password: hashedPassword,
        name: "Admin",
        role: "ADMIN",
        active: true,
      },
    })

    return successResponse({
      message: "Database seeded successfully",
      categories: categoryNames.length,
      products: products.length,
      testimonials: testimonials.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
