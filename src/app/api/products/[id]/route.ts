import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { updateProductSchema } from "@/lib/schemas"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) return errorResponse("Product not found", 404)
    return successResponse({ ...product, gallery: JSON.parse(product.gallery || "[]") })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateProductSchema.parse(body)
    const gallery = data.gallery ? JSON.stringify(data.gallery) : undefined
    const product = await db.product.update({
      where: { id },
      data: { ...data, gallery },
    })
    return successResponse({ ...product, gallery: JSON.parse(product.gallery || "[]") })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    return handleApiError(error)
  }
}
