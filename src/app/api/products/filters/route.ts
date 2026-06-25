import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const categories = await db.category.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { products: true } } },
      orderBy: { order: "asc" },
    })

    const products = await db.product.findMany({
      where: { deletedAt: null },
      select: { color: true, price: true, badge: true },
    })

    const colors = [...new Set(products.map(p => p.color))]
    const badges = [...new Set(products.map(p => p.badge).filter(Boolean))]
    const prices = products.map(p => Number(p.price))

    return successResponse({
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.products,
      })),
      colors: colors.map(c => ({
        value: c,
        count: products.filter(p => p.color === c).length,
      })),
      badges: badges.map(b => ({
        value: b,
        count: products.filter(p => p.badge === b).length,
      })),
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
