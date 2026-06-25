import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateExportFile, getExportHeaders, Column } from "@/lib/export-utils"

const CATEGORY_COLUMNS: Column[] = [
  { key: "name", header: "Nombre", width: 30 },
  { key: "slug", header: "Slug", width: 25 },
  { key: "description", header: "Descripción", width: 50 },
  { key: "active", header: "Activo", width: 10 },
  { key: "order", header: "Orden", width: 8 },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") === "csv" ? "csv" : "xlsx"
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    const categories = await db.category.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { order: "asc" },
    })

    const data = categories.map(c => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      active: c.active ? "Sí" : "No",
      order: c.order,
    }))

    const buffer = generateExportFile({
      filename: "categorias",
      sheetName: "Categorías",
      data,
      columns: CATEGORY_COLUMNS,
      format,
    })

    const headers = getExportHeaders(format, `categorias_${new Date().toISOString().split("T")[0]}`)
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
