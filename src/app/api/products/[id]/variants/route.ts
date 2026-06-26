import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { variantSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    const variants = await db.productVariant.findMany({
      where: {
        productId: id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      orderBy: { createdAt: "asc" },
    })

    return successResponse(variants.map(v => ({
      ...v,
      gallery: JSON.parse(v.gallery || "[]"),
    })))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const data = variantSchema.parse(body)

    const product = await db.product.findUnique({ where: { id, deletedAt: null } })
    if (!product) return errorResponse("Producto no encontrado", 404)

    const variant = await db.productVariant.create({
      data: {
        productId: id,
        sku: data.sku,
        name: data.name,
        color: data.color,
        colorHex: data.colorHex,
        size: data.size,
        material: data.material,
        price: data.price,
        oldPrice: data.oldPrice,
        stock: data.stock,
        lowStock: data.lowStock,
        weight: data.weight,
        image: data.image,
        gallery: data.gallery,
        inStock: data.inStock,
        active: data.active,
      },
    })

    await db.product.update({
      where: { id },
      data: { hasVariants: true },
    })

    await logCreate(user, "ProductVariant", variant, request)
    return successResponse(variant, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("No autorizado", 401)
    }
    return handleApiError(error)
  }
}
