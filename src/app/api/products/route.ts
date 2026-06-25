import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { createProductSchema } from "@/lib/schemas"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const categories = searchParams.get("category")?.split(",").filter(Boolean) || []
    const colors = searchParams.get("color")?.split(",").filter(Boolean) || []
    const featured = searchParams.get("featured") === "true"
    const inStock = searchParams.get("inStock") === "true"
    const badge = searchParams.get("badge") || undefined
    const minPrice = searchParams.get("minPrice") || undefined
    const maxPrice = searchParams.get("maxPrice") || undefined
    const search = searchParams.get("q") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const sort = searchParams.get("sort") || "newest"

    const where: Prisma.ProductWhereInput = {}
    if (categories.length > 0) where.categoryId = { in: categories }
    if (colors.length > 0) where.color = { in: colors }
    if (featured) where.featured = true
    if (inStock) where.inStock = true
    if (badge) where.badge = badge
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ]
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    switch (sort) {
      case "oldest": orderBy.createdAt = "asc"; break
      case "price_asc": orderBy.price = "asc"; break
      case "price_desc": orderBy.price = "desc"; break
      case "name_asc": orderBy.name = "asc"; break
      default: orderBy.createdAt = "desc"
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    const itemsWithGallery = items.map((p) => {
      const reviewRatings = p.reviews.map(r => r.rating)
      const reviewCount = reviewRatings.length
      const averageRating = reviewCount > 0
        ? reviewRatings.reduce((a, b) => a + b, 0) / reviewCount
        : 0
      const { reviews, ...rest } = p
      return {
        ...rest,
        gallery: JSON.parse(p.gallery || "[]"),
        sizes: JSON.parse(p.sizes || "[]"),
        reviewCount,
        averageRating: Math.round(averageRating * 10) / 10,
      }
    })

    return successResponse({
      items: itemsWithGallery,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
      availableFilters: {
        categories: [...new Set(items.map(p => p.category?.name).filter(Boolean))],
        colors: [...new Set(items.map(p => p.color).filter(Boolean))],
        priceRange: {
          min: items.length > 0 ? Math.min(...items.map(p => Number(p.price))) : 0,
          max: items.length > 0 ? Math.max(...items.map(p => Number(p.price))) : 0,
        },
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const data = createProductSchema.parse(body)
    const gallery = data.gallery || []
    const product = await db.product.create({
      data: {
        ...data,
        gallery: JSON.stringify(gallery),
      },
    })
    return successResponse({ ...product, gallery }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
