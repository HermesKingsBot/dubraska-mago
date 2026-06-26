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
  "Tiene Variantes": "hasVariants",
  "Variante SKU": "variantSku",
  "Variante Nombre": "variantName",
  "Variante Color": "variantColor",
  "Variante Color Hex": "variantColorHex",
  "Variante Talla": "variantSize",
  "Variante Material": "variantMaterial",
  "Variante Precio": "variantPrice",
  "Variante Stock": "variantStock",
  "Variante Stock Mínimo": "variantLowStock",
  "Variante Peso": "variantWeight",
  "Variante Imagen URL": "variantImage",
  "Variante Disponible": "variantInStock",
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

    const groups = new Map<string, typeof result.valid>()
    for (const item of result.valid) {
      const existing = groups.get(item.slug) || []
      existing.push(item)
      groups.set(item.slug, existing)
    }

    await db.$transaction(async (tx) => {
      for (const [slug, rows] of groups) {
        const first = rows[0]
        let categoryId: string | null = null

        if (first.categoryName) {
          const category = await tx.category.findFirst({
            where: { name: first.categoryName, deletedAt: null },
          })
          if (!category) {
            errors.push({ row: 1, message: `Categoría "${first.categoryName}" no encontrada para slug "${slug}"` })
            continue
          }
          categoryId = category.id
        }

        const hasVariantRows = rows.some(r => r.variantSku)

        const product = await tx.product.create({
          data: {
            name: first.name,
            slug: first.slug,
            sku: first.sku,
            description: first.description,
            price: first.price,
            oldPrice: first.oldPrice ?? null,
            material: first.material,
            length: first.length ?? null,
            diameter: first.diameter ?? null,
            weight: first.weight ?? null,
            color: first.color,
            badge: first.badge ?? null,
            image: first.image,
            inStock: first.inStock,
            featured: first.featured,
            stock: first.stock,
            lowStock: first.lowStock,
            categoryId: categoryId || "",
            sizes: first.sizes,
            compareGroup: first.compareGroup ?? null,
            hasVariants: hasVariantRows,
            variantAttributes: hasVariantRows ? JSON.stringify(["color", "size"]) : "[]",
          },
        })

        if (hasVariantRows) {
          for (const row of rows) {
            if (!row.variantSku) continue
            await tx.productVariant.create({
              data: {
                productId: product.id,
                sku: row.variantSku,
                name: row.variantName || `${row.name} - ${row.variantColor || row.variantSize || ""}`.trim(),
                color: row.variantColor ?? null,
                colorHex: row.variantColorHex ?? null,
                size: row.variantSize ?? null,
                material: row.variantMaterial ?? null,
                price: row.variantPrice ?? null,
                stock: row.variantStock,
                lowStock: row.variantLowStock,
                weight: row.variantWeight ?? null,
                image: row.variantImage ?? null,
                inStock: row.variantInStock,
                active: true,
              },
            })
          }
        }

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
