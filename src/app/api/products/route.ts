import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { createProductSchema, createProductWithVariantsSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"

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
    const includeDeleted = searchParams.get("includeDeleted") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const sort = searchParams.get("sort") || "newest"

    const where: Prisma.ProductWhereInput = includeDeleted ? {} : { deletedAt: null }
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
          variants: {
            where: { deletedAt: null, active: true },
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
      const { reviews, variants, ...rest } = p
      return {
        ...rest,
        gallery: JSON.parse(p.gallery || "[]"),
        sizes: JSON.parse(p.sizes || "[]"),
        variantAttributes: JSON.parse(p.variantAttributes || "[]"),
        variants: variants.map(v => ({
          ...v,
          gallery: JSON.parse(v.gallery || "[]"),
        })),
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
          min: items.length > 0 ? Math.min(...items.map(p => Number(p.price)).filter(n => n > 0)) : 0,
          max: items.length > 0 ? Math.max(...items.map(p => Number(p.price)).filter(n => n > 0)) : 0,
        },
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const hasVariants = body.hasVariants === true

    if (hasVariants) {
      const data = createProductWithVariantsSchema.parse(body)
      const gallery = data.gallery || []
      const variantsData = data.variants || []

      const product = await db.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            price: data.price,
            oldPrice: data.oldPrice ?? null,
            material: data.material,
            length: data.length ?? null,
            diameter: data.diameter ?? null,
            weight: data.weight ?? null,
            color: data.color,
            badge: data.badge ?? null,
            image: data.image,
            gallery: JSON.stringify(gallery),
            inStock: data.inStock,
            featured: data.featured,
            stock: data.stock,
            lowStock: data.lowStock,
            sku: data.sku,
            categoryId: data.categoryId,
            sizes: data.sizes,
            compareGroup: data.compareGroup ?? null,
            hasVariants: true,
            variantAttributes: data.variantAttributes,
          },
        })

        for (const v of variantsData) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku,
              name: v.name,
              color: v.color,
              colorHex: v.colorHex,
              size: v.size,
              material: v.material,
              price: v.price,
              oldPrice: v.oldPrice,
              stock: v.stock,
              lowStock: v.lowStock,
              weight: v.weight,
              image: v.image,
              gallery: v.gallery,
              inStock: v.inStock,
              active: v.active,
            },
          })
        }

        return product
      })

      await logCreate(user, "Product", product, request)
      return successResponse({ ...product, gallery }, 201)
    }

    const data = createProductSchema.parse(body)
    const gallery = data.gallery || []
    const product = await db.product.create({
      data: {
        ...data,
        gallery: JSON.stringify(gallery),
      },
    })
    await logCreate(user, "Product", product, request)
    return successResponse({ ...product, gallery }, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return handleApiError(error)
    }
    return handleApiError(error)
  }
}
