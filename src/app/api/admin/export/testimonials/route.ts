import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateExportFile, getExportHeaders, Column } from "@/lib/export-utils"
import { checkRateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit"

const TESTIMONIAL_COLUMNS: Column[] = [
  { key: "name", header: "Nombre", width: 30 },
  { key: "text", header: "Texto", width: 60 },
  { key: "rating", header: "Valoración", width: 12 },
  { key: "productId", header: "Producto ID", width: 25 },
  { key: "date", header: "Fecha", width: 15 },
  { key: "active", header: "Activo", width: 10 },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const exportResult = checkRateLimit(ip, RATE_LIMITS.export)
    if (!exportResult.success) {
      return createRateLimitResponse(exportResult)
    }
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") === "csv" ? "csv" : "xlsx"
    const includeDeleted = searchParams.get("includeDeleted") === "true"

    const testimonials = await db.testimonial.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { date: "desc" },
    })

    const data = testimonials.map(t => ({
      name: t.name,
      text: t.text,
      rating: t.rating,
      productId: t.productId ?? "",
      date: t.date.toISOString().split("T")[0],
      active: t.active ? "Sí" : "No",
    }))

    const buffer = generateExportFile({
      filename: "testimonios",
      sheetName: "Testimonios",
      data,
      columns: TESTIMONIAL_COLUMNS,
      format,
    })

    const headers = getExportHeaders(format, `testimonios_${new Date().toISOString().split("T")[0]}`)
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
