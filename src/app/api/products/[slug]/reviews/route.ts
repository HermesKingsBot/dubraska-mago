import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { createReviewSchema } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"

type RouteParams = { params: Promise<{ slug: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const product = await db.product.findUnique({ where: { slug, deletedAt: null } })
    if (!product) {
      return errorResponse("Producto no encontrado", 404)
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "newest"

    const orderBy: Record<string, string> = {}
    switch (sort) {
      case "helpful": orderBy.helpful = "desc"; break
      case "rating": orderBy.rating = "desc"; break
      default: orderBy.createdAt = "desc"
    }

    const where = { productId: product.id, status: "APPROVED" }

    const [items, total] = await Promise.all([
      db.review.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.review.count({ where }),
    ])

    const allRatings = await db.review.findMany({
      where: { productId: product.id, status: "APPROVED" },
      select: { rating: true },
    })

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0
    for (const r of allRatings) {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1
      totalRating += r.rating
    }

    const itemsParsed = items.map((r) => ({
      ...r,
      images: JSON.parse(r.images || "[]"),
    }))

    return successResponse({
      items: itemsParsed,
      total,
      averageRating: allRatings.length > 0 ? totalRating / allRatings.length : 0,
      ratingDistribution,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const product = await db.product.findUnique({ where: { slug, deletedAt: null } })
    if (!product) {
      return errorResponse("Producto no encontrado", 404)
    }

    const body = await request.json()
    const data = createReviewSchema.parse({ ...body, productId: product.id })

    const user = verifyToken(request)

    const existingReview = await db.review.findFirst({
      where: {
        productId: product.id,
        OR: [
          ...(user ? [{ userId: user.userId }] : []),
          ...(data.email ? [{ email: data.email }] : []),
        ],
      },
    })
    if (existingReview) {
      return errorResponse("Ya has dejado una reseña para este producto", 400)
    }

    const review = await db.review.create({
      data: {
        productId: product.id,
        userId: user?.userId || null,
        name: data.name,
        email: data.email || null,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment,
        images: JSON.stringify(data.images),
        status: "PENDING",
      },
    })

    return successResponse({
      ...review,
      images: JSON.parse(review.images || "[]"),
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, POST }
export default { GET, POST }
