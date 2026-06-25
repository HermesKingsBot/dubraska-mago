import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"
import { importTestimonialSchema } from "@/lib/schemas"
import { parseImportFile, validateImportFile } from "@/lib/import-utils"

const TESTIMONIAL_FIELD_MAP: Record<string, string> = {
  "Nombre": "name",
  "Texto": "text",
  "Valoración": "rating",
  "Producto Slug": "productSlug",
  "Fecha": "date",
  "Activo": "active",
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return errorResponse("No se recibió ningún archivo", 400)
    }

    validateImportFile(file)

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = parseImportFile(buffer, importTestimonialSchema, TESTIMONIAL_FIELD_MAP)

    if (result.errors.length > 0) {
      return successResponse({
        imported: 0,
        errors: result.errors,
        total: result.total,
      }, 207)
    }

    const created: { id: string; name: string }[] = []
    const errors: { row: number; message: string }[] = []

    await db.$transaction(async (tx) => {
      for (let i = 0; i < result.valid.length; i++) {
        const item = result.valid[i]
        let productId: string | null = null

        if (item.productSlug) {
          const product = await tx.product.findFirst({
            where: { slug: item.productSlug, deletedAt: null },
          })
          if (!product) {
            errors.push({ row: i + 2, message: `Producto con slug "${item.productSlug}" no encontrado` })
            continue
          }
          productId = product.id
        }

        const testimonial = await tx.testimonial.create({
          data: {
            name: item.name,
            text: item.text,
            rating: item.rating,
            productId,
            date: item.date ? new Date(item.date) : new Date(),
            active: item.active,
          },
        })

        created.push({ id: testimonial.id, name: testimonial.name })
        await logCreate(user, "Testimonial", testimonial, request)
      }
    })

    return successResponse({
      imported: created.length,
      errors: errors.length > 0 ? errors : undefined,
      total: result.total,
    }, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("No autorizado", 401)
    }
    return handleApiError(error)
  }
}
