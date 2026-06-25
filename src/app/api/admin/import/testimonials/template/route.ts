import { NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateTemplateFile, getExportHeaders, Column } from "@/lib/export-utils"

const TEMPLATE_COLUMNS: Column[] = [
  { key: "Nombre", header: "Nombre", width: 30 },
  { key: "Texto", header: "Texto", width: 60 },
  { key: "Valoración", header: "Valoración", width: 12 },
  { key: "Producto Slug", header: "Producto Slug", width: 25 },
  { key: "Fecha", header: "Fecha", width: 15 },
  { key: "Activo", header: "Activo", width: 10 },
]

const SAMPLE_TESTIMONIALS = [
  {
    "Nombre": "María García",
    "Texto": "Hermoso collar, llegó en perfecto estado. El baño de oro se ve muy elegante.",
    "Valoración": 5,
    "Producto Slug": "collar-cadena-dorado-sample",
    "Fecha": "2025-01-15",
    "Activo": "Sí",
  },
  {
    "Nombre": "Carlos López",
    "Texto": "Muy buena calidad, compré la pulsera para regalo y encantó.",
    "Valoración": 5,
    "Producto Slug": "pulsera-eslabones-sample",
    "Fecha": "2025-02-20",
    "Activo": "Sí",
  },
  {
    "Nombre": "Ana Martínez",
    "Texto": "Los aretes son lindos pero el color es un poco diferente al de la foto.",
    "Valoración": 4,
    "Producto Slug": "",
    "Fecha": "2025-03-10",
    "Activo": "Sí",
  },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const withSample = searchParams.get("withSample") === "true"

    const buffer = generateTemplateFile(
      TEMPLATE_COLUMNS,
      withSample ? SAMPLE_TESTIMONIALS : undefined
    )

    const headers = getExportHeaders("xlsx", withSample ? "testimonios_ejemplo" : "testimonios_plantilla")
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
