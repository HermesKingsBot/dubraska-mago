import { NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateTemplateFile, getExportHeaders, Column } from "@/lib/export-utils"

const TEMPLATE_COLUMNS: Column[] = [
  { key: "Producto SKU", header: "Producto SKU", width: 20 },
  { key: "Tipo", header: "Tipo", width: 12 },
  { key: "Cantidad", header: "Cantidad", width: 10 },
  { key: "Razón", header: "Razón", width: 30 },
  { key: "Referencia", header: "Referencia", width: 25 },
]

const SAMPLE_MOVEMENTS = [
  {
    "Producto SKU": "DM-COL-001",
    "Tipo": "STOCK_IN",
    "Cantidad": 20,
    "Razón": "Reabastecimiento inicial",
    "Referencia": "ORD-001",
  },
  {
    "Producto SKU": "DM-PUL-001",
    "Tipo": "STOCK_OUT",
    "Cantidad": 3,
    "Razón": "Venta",
    "Referencia": "ORD-002",
  },
  {
    "Producto SKU": "DM-COL-001",
    "Tipo": "SET",
    "Cantidad": 25,
    "Razón": "Ajuste de inventario",
    "Referencia": "",
  },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const withSample = searchParams.get("withSample") === "true"

    const buffer = generateTemplateFile(
      TEMPLATE_COLUMNS,
      withSample ? SAMPLE_MOVEMENTS : undefined
    )

    const headers = getExportHeaders("xlsx", withSample ? "inventario_ejemplo" : "inventario_plantilla")
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
