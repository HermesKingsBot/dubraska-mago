import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { variantSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logUpdate } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const { variants, replaceExisting } = body

    const product = await db.product.findUnique({ where: { id, deletedAt: null } })
    if (!product) return errorResponse("Producto no encontrado", 404)

    const result = await db.$transaction(async (tx) => {
      if (replaceExisting) {
        await tx.productVariant.updateMany({
          where: { productId: id },
          data: { deletedAt: new Date() },
        })
      }

      const created = []
      for (const v of variants) {
        const data = variantSchema.parse(v)
        const variant = await tx.productVariant.create({
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
        created.push(variant)
      }

      await tx.product.update({
        where: { id },
        data: { hasVariants: created.length > 0 },
      })

      return created
    })

    await logUpdate(user, "Product", product, {}, { variantsCount: result.length }, request)
    return successResponse({ variants: result, count: result.length })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("No autorizado", 401)
    }
    return handleApiError(error)
  }
}
