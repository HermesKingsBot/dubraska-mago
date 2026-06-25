import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { saveComparisonSchema } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"

async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")
    if (!idsParam) {
      return errorResponse("Se requieren IDs de productos", 400)
    }
    const ids = idsParam.split(",").filter(Boolean)
    if (ids.length < 2) {
      return errorResponse("Mínimo 2 productos", 400)
    }
    if (ids.length > 4) {
      return errorResponse("Máximo 4 productos", 400)
    }
    const products = await db.product.findMany({
      where: { id: { in: ids } },
      include: { category: true },
    })
    if (products.length !== ids.length) {
      return errorResponse("Algunos productos no fueron encontrados", 404)
    }
    const items = products.map((p) => ({
      ...p,
      gallery: JSON.parse(p.gallery || "[]"),
      sizes: JSON.parse(p.sizes || "[]"),
    }))
    return successResponse({ items })
  } catch (error) {
    return handleApiError(error)
  }
}

async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = saveComparisonSchema.parse(body)
    const user = verifyToken(request)
    if (user) {
      const existing = await db.productComparison.findFirst({
        where: { userId: user.userId },
      })
      if (existing) {
        const updated = await db.productComparison.update({
          where: { id: existing.id },
          data: { productIds: JSON.stringify(data.productIds) },
        })
        return successResponse(updated)
      }
      const comparison = await db.productComparison.create({
        data: {
          userId: user.userId,
          productIds: JSON.stringify(data.productIds),
        },
      })
      return successResponse(comparison, 201)
    }
    const sessionId = request.headers.get("x-session-id") || crypto.randomUUID()
    const existing = await db.productComparison.findFirst({
      where: { sessionId },
    })
    if (existing) {
      const updated = await db.productComparison.update({
        where: { id: existing.id },
        data: { productIds: JSON.stringify(data.productIds) },
      })
      return successResponse(updated)
    }
    const comparison = await db.productComparison.create({
      data: {
        sessionId,
        productIds: JSON.stringify(data.productIds),
      },
    })
    return successResponse(comparison, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

async function DELETE(request: NextRequest) {
  try {
    const user = verifyToken(request)
    const sessionId = request.headers.get("x-session-id")
    if (user) {
      const existing = await db.productComparison.findFirst({
        where: { userId: user.userId },
      })
      if (existing) {
        await db.productComparison.delete({ where: { id: existing.id } })
      }
    } else if (sessionId) {
      const existing = await db.productComparison.findFirst({
        where: { sessionId },
      })
      if (existing) {
        await db.productComparison.delete({ where: { id: existing.id } })
      }
    }
    return successResponse({ message: "Comparación eliminada" })
  } catch (error) {
    return handleApiError(error)
  }
}

export { GET, POST, DELETE }
export default { GET, POST, DELETE }
