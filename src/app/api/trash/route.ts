import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"

export async function GET(): Promise<NextResponse> {
  try {
    const [products, categories, testimonials, orders, socialLinks] = await Promise.all([
      db.product.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true, name: true, deletedAt: true },
        orderBy: { deletedAt: "desc" },
      }),
      db.category.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true, name: true, deletedAt: true },
        orderBy: { deletedAt: "desc" },
      }),
      db.testimonial.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true, name: true, deletedAt: true },
        orderBy: { deletedAt: "desc" },
      }),
      db.order.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true, orderNumber: true, deletedAt: true },
        orderBy: { deletedAt: "desc" },
      }),
      db.socialLink.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true, platform: true, deletedAt: true },
        orderBy: { deletedAt: "desc" },
      }),
    ])

    const totalCount = products.length + categories.length + testimonials.length + orders.length + socialLinks.length

    return successResponse({
      products: products.map((p) => ({ ...p, entityType: "Product" })),
      categories: categories.map((c) => ({ ...c, entityType: "Category" })),
      testimonials: testimonials.map((t) => ({ ...t, entityType: "Testimonial" })),
      orders: orders.map((o) => ({ ...o, name: o.orderNumber, entityType: "Order" })),
      socialLinks: socialLinks.map((s) => ({ ...s, name: s.platform, entityType: "SocialLink" })),
      totalCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
