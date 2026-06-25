import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateProductSchema } from "@/lib/schemas"
import { requireAuth } from "@/lib/auth"
import { logUpdate, logDelete } from "@/lib/audit"

type RouteParams = { params: Promise<{ id: string }> }

async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id, deletedAt: null },
      include: { category: true },
    })
    if (!product) {
      return errorResponse("Product not found", 404)
    }
    return successResponse({
      ...product,
      gallery: JSON.parse(product.gallery || "[]"),
      sizes: JSON.parse(product.sizes || "[]"),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const data = updateProductSchema.parse(body)
    const existing = await db.product.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse("Product not found", 404)
    }
    const oldValues: Record<string, unknown> = {}
    for (const key of Object.keys(data)) {
      ;(oldValues as any)[key] = (existing as any)[key]
    }
    const gallery = data.gallery || JSON.parse(existing.gallery || "[]")
    const updateData: Record<string, unknown> = { ...data, gallery: JSON.stringify(gallery) }
    if (body.sizes !== undefined) {
      updateData.sizes = JSON.stringify(body.sizes)
    }
    const product = await db.product.update({
      where: { id },
      data: updateData,
    })
    await logUpdate(user, "Product", existing, oldValues, data as any, request)
    return successResponse({ ...product, gallery, sizes: JSON.parse(product.sizes || "[]") })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAuth(request)
    const { id } = await params
    const existing = await db.product.findUnique({ where: { id, deletedAt: null } })
    if (!existing) {
      return errorResponse("Product not found", 404)
    }
    await db.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    await logDelete(user, "Product", existing, { name: existing.name, price: existing.price }, request)
    return successResponse({ message: "Product deleted" })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401)
    }
    return handleApiError(error)
  }
}

export { GET, PATCH, DELETE }
export default { GET, PATCH, DELETE }
