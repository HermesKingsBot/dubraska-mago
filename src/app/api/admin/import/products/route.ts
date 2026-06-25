import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"
import { importProductSchema } from "@/lib/schemas"
import { parseImportFile, validateImportFile } from "@/lib/import-utils"

const PRODUCT_FIELD_MAP: Record<string, string> = {
  "Nombre": "name",
  "Slug": "slug",
  "SKU": "sku",
  "Descripción": "description",
  "Precio": "price",
  "Precio Anterior": "oldPrice",
  "Material": "material",
  "Longitud": "length",
  "Diámetro": "diameter",
  "Peso": "weight",
  "Color": "color",
  "Etiqueta": "badge",
  "Imagen URL": "image",
  "En Stock": "inStock",
  "Destacado": "featured",
  "Stock": "stock",
  "Stock Mínimo": "lowStock",
  "Categoría": "categoryName",
  "Tallas (JSON)": "sizes",
  "Grupo Comparación": "compareGroup",
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
    const result = parseImportFile(buffer, importProductSchema, PRODUCT_FIELD_MAP)

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
        let categoryId: string | null = null

        if (item.categoryName) {
          const category = await tx.category.findFirst({
            where: { name: item.categoryName, deletedAt: null },
          })
          if (!category) {
            errors.push({ row: i + 2, message: `Categoría "${item.categoryName}" no encontrada` })
            continue
          }
          categoryId = category.id
        }

        const product = await tx.product.create({
          data: {
            name: item.name,
            slug: item.slug,
            sku: item.sku,
            description: item.description,
            price: item.price,
            oldPrice: item.oldPrice ?? null,
            material: item.material,
            length: item.length ?? null,
            diameter: item.diameter ?? null,
            weight: item.weight ?? null,
            color: item.color,
            badge: item.badge ?? null,
            image: item.image,
            inStock: item.inStock,
            featured: item.featured,
            stock: item.stock,
            lowStock: item.lowStock,
            categoryId: categoryId || "",
            sizes: item.sizes,
            compareGroup: item.compareGroup ?? null,
          },
        })

        created.push({ id: product.id, name: product.name })

        await logCreate(user, "Product", product, request)
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
