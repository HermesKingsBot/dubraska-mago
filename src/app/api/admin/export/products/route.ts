import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateExportFile, getExportHeaders, Column } from "@/lib/export-utils"

const PRODUCT_COLUMNS: Column[] = [
  { key: "name", header: "Nombre", width: 30 },
  { key: "slug", header: "Slug", width: 25 },
  { key: "sku", header: "SKU", width: 15 },
  { key: "description", header: "Descripción", width: 50 },
  { key: "price", header: "Precio", width: 12 },
  { key: "oldPrice", header: "Precio Anterior", width: 15 },
  { key: "material", header: "Material", width: 20 },
  { key: "length", header: "Longitud", width: 15 },
  { key: "diameter", header: "Diámetro", width: 12 },
  { key: "weight", header: "Peso", width: 10 },
  { key: "color", header: "Color", width: 12 },
  { key: "badge", header: "Etiqueta", width: 15 },
  { key: "image", header: "Imagen URL", width: 40 },
  { key: "inStock", header: "En Stock", width: 10 },
  { key: "featured", header: "Destacado", width: 10 },
  { key: "stock", header: "Stock", width: 8 },
  { key: "lowStock", header: "Stock Mínimo", width: 12 },
  { key: "categoryName", header: "Categoría", width: 20 },
  { key: "sizes", header: "Tallas (JSON)", width: 25 },
  { key: "compareGroup", header: "Grupo Comparación", width: 15 },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") === "csv" ? "csv" : "xlsx"
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    const products = await db.product.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })

    const data = products.map(p => ({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice ?? "",
      material: p.material,
      length: p.length ?? "",
      diameter: p.diameter ?? "",
      weight: p.weight ?? "",
      color: p.color,
      badge: p.badge ?? "",
      image: p.image,
      inStock: p.inStock ? "Sí" : "No",
      featured: p.featured ? "Sí" : "No",
      stock: p.stock,
      lowStock: p.lowStock,
      categoryName: p.category?.name ?? "",
      sizes: p.sizes,
      compareGroup: p.compareGroup ?? "",
    }))

    const buffer = generateExportFile({
      filename: "productos",
      sheetName: "Productos",
      data,
      columns: PRODUCT_COLUMNS,
      format,
    })

    const headers = getExportHeaders(format, `productos_${new Date().toISOString().split("T")[0]}`)
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
