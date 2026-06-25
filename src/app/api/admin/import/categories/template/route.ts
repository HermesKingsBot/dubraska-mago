import { NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateTemplateFile, getExportHeaders, Column } from "@/lib/export-utils"

const TEMPLATE_COLUMNS: Column[] = [
  { key: "Nombre", header: "Nombre", width: 30 },
  { key: "Slug", header: "Slug", width: 25 },
  { key: "Descripción", header: "Descripción", width: 50 },
  { key: "Activo", header: "Activo", width: 10 },
  { key: "Orden", header: "Orden", width: 8 },
]

const SAMPLE_CATEGORIES = [
  {
    "Nombre": "Collares",
    "Slug": "collares",
    "Descripción": "Collares de acero inoxidable bañados en oro",
    "Activo": "Sí",
    "Orden": 1,
  },
  {
    "Nombre": "Pulseras",
    "Slug": "pulseras",
    "Descripción": "Pulseras de acero inoxidable",
    "Activo": "Sí",
    "Orden": 2,
  },
  {
    "Nombre": "Aretes",
    "Slug": "aretes",
    "Descripción": "Aretes y pendientes",
    "Activo": "Sí",
    "Orden": 3,
  },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const withSample = searchParams.get("withSample") === "true"

    const buffer = generateTemplateFile(
      TEMPLATE_COLUMNS,
      withSample ? SAMPLE_CATEGORIES : undefined
    )

    const headers = getExportHeaders("xlsx", withSample ? "categorias_ejemplo" : "categorias_plantilla")
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
