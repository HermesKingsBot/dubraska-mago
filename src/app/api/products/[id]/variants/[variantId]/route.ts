import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateVariantSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logUpdate, logDelete } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string; variantId: string }> }

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { variantId } = await params
    const variant = await db.productVariant.findUnique({
      where: { id: variantId, deletedAt: null },
    })
    if (!variant) return errorResponse("Variante no encontrada", 404)

    return successResponse({
      ...variant,
      gallery: JSON.parse(variant.gallery || "[]"),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const { variantId } = await params
    const body = await request.json()
    const data = updateVariantSchema.parse(body)

    const existing = await db.productVariant.findUnique({
      where: { id: variantId, deletedAt: null },
    })
    if (!existing) return errorResponse("Variante no encontrada", 404)

    const variant = await db.productVariant.update({
      where: { id: variantId },
      data,
    })

    const oldValues: Record<string, unknown> = {}
    for (const key of Object.keys(data)) {
      ;(oldValues as Record<string, unknown>)[key] = (existing as Record<string, unknown>)[key]
    }

    await logUpdate(user, "ProductVariant", existing, oldValues, data as unknown as Record<string, unknown>, request)
    return successResponse(variant)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("No autorizado", 401)
    }
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const { variantId } = await params

    const existing = await db.productVariant.findUnique({
      where: { id: variantId, deletedAt: null },
    })
    if (!existing) return errorResponse("Variante no encontrada", 404)

    await db.productVariant.update({
      where: { id: variantId },
      data: { deletedAt: new Date() },
    })

    await logDelete(user, "ProductVariant", existing, { sku: existing.sku, name: existing.name }, request)
    return successResponse({ message: "Variante eliminada" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("No autorizado", 401)
    }
    return handleApiError(error)
  }
}
