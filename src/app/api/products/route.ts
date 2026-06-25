import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import { createProductSchema } from "@/lib/schemas"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const color = searchParams.get("color") || undefined
    const featured = searchParams.get("featured") === "true"
    const inStock = searchParams.get("inStock") === "true"
    const search = searchParams.get("q") || undefined
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Record<string, unknown> = {}
    if (category) where.categoryId = category
    if (color) where.color = color
    if (featured) where.featured = true
    if (inStock) where.inStock = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ]
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    const itemsWithGallery = items.map((p) => ({
      ...p,
      gallery: JSON.parse(p.gallery || "[]"),
    }))

    return successResponse({
      items: itemsWithGallery,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
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
