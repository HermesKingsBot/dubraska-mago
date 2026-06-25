import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"
import { importCategorySchema } from "@/lib/schemas"
import { parseImportFile, validateImportFile } from "@/lib/import-utils"

const CATEGORY_FIELD_MAP: Record<string, string> = {
  "Nombre": "name",
  "Slug": "slug",
  "Descripción": "description",
  "Activo": "active",
  "Orden": "order",
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
    const result = parseImportFile(buffer, importCategorySchema, CATEGORY_FIELD_MAP)

    if (result.errors.length > 0) {
      return successResponse({
        imported: 0,
        errors: result.errors,
        total: result.total,
      }, 207)
    }

    const created: { id: string; name: string }[] = []

    await db.$transaction(async (tx) => {
      for (const item of result.valid) {
        const category = await tx.category.create({
          data: {
            name: item.name,
            slug: item.slug,
            description: item.description,
            active: item.active,
            order: item.order,
          },
        })

        created.push({ id: category.id, name: category.name })
        await logCreate(user, "Category", category, request)
      }
    })

    return successResponse({
      imported: created.length,
      total: result.total,
    }, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return errorResponse("No autorizado", 401)
    }
    return handleApiError(error)
  }
}
