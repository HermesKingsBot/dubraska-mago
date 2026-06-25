import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"

const MODEL_MAP: Record<string, { model: string; nameField: string }> = {
  Product: { model: "product", nameField: "name" },
  Category: { model: "category", nameField: "name" },
  Testimonial: { model: "testimonial", nameField: "name" },
  Order: { model: "order", nameField: "orderNumber" },
  SocialLink: { model: "socialLink", nameField: "platform" },
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { type, id } = await params
    const config = MODEL_MAP[type]
    if (!config) return errorResponse("Tipo no válido", 400)

    const prisma = db as any
    const model = prisma[config.model] as {
      findUnique: (args: { where: { id: string } }) => Promise<any | null>
      update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<any>
    }

    const item = await model.findUnique({ where: { id } })
    if (!item) return errorResponse("Elemento no encontrado", 404)
    if (!item.deletedAt) return errorResponse("El elemento no está en la papelera", 400)

    await model.update({
      where: { id },
      data: { deletedAt: null },
    })

    return successResponse({ restored: true })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { type, id } = await params
    const config = MODEL_MAP[type]
    if (!config) return errorResponse("Tipo no válido", 400)

    const prisma = db as any
    const model = prisma[config.model] as {
      findUnique: (args: { where: { id: string } }) => Promise<any | null>
      delete: (args: { where: { id: string } }) => Promise<any>
    }

    const item = await model.findUnique({ where: { id } })
    if (!item) return errorResponse("Elemento no encontrado", 404)

    await model.delete({ where: { id } })

    return successResponse({ deleted: true })
  } catch (error) {
    return handleApiError(error)
  }
}
