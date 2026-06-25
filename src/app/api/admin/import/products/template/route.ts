import { NextRequest, NextResponse } from "next/server"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateTemplateFile, getExportHeaders, Column } from "@/lib/export-utils"

const TEMPLATE_COLUMNS: Column[] = [
  { key: "Nombre", header: "Nombre", width: 30 },
  { key: "Slug", header: "Slug", width: 25 },
  { key: "SKU", header: "SKU", width: 15 },
  { key: "Descripción", header: "Descripción", width: 50 },
  { key: "Precio", header: "Precio", width: 12 },
  { key: "Precio Anterior", header: "Precio Anterior", width: 15 },
  { key: "Material", header: "Material", width: 20 },
  { key: "Longitud", header: "Longitud", width: 15 },
  { key: "Diámetro", header: "Diámetro", width: 12 },
  { key: "Peso", header: "Peso", width: 10 },
  { key: "Color", header: "Color", width: 12 },
  { key: "Etiqueta", header: "Etiqueta", width: 15 },
  { key: "Imagen URL", header: "Imagen URL", width: 40 },
  { key: "En Stock", header: "En Stock", width: 10 },
  { key: "Destacado", header: "Destacado", width: 10 },
  { key: "Stock", header: "Stock", width: 8 },
  { key: "Stock Mínimo", header: "Stock Mínimo", width: 12 },
  { key: "Categoría", header: "Categoría", width: 20 },
  { key: "Tallas (JSON)", header: "Tallas (JSON)", width: 25 },
  { key: "Grupo Comparación", header: "Grupo Comparación", width: 15 },
]

const SAMPLE_PRODUCTS = [
  {
    "Nombre": "Collar Cadena Dorado",
    "Slug": "collar-cadena-dorado-sample",
    "SKU": "DM-COL-001",
    "Descripción": "Acero inoxidable bañado en oro 18K",
    "Precio": 85.00,
    "Precio Anterior": "",
    "Material": "Acero inoxidable + Oro 18K",
    "Longitud": "45cm",
    "Diámetro": "",
    "Peso": "12g",
    "Color": "dorado",
    "Etiqueta": "SÚPER VENDIDO",
    "Imagen URL": "/images/products/collar-sample.jpg",
    "En Stock": "Sí",
    "Destacado": "Sí",
    "Stock": 15,
    "Stock Mínimo": 5,
    "Categoría": "Collares",
    "Tallas (JSON)": "[]",
    "Grupo Comparación": "collares-dorados",
  },
  {
    "Nombre": "Pulsera Eslabones",
    "Slug": "pulsera-eslabones-sample",
    "SKU": "DM-PUL-001",
    "Descripción": "Acero inoxidable bañado en oro 18K",
    "Precio": 65.00,
    "Precio Anterior": 75.00,
    "Material": "Acero inoxidable + Oro 18K",
    "Longitud": "18cm + 3cm extensor",
    "Diámetro": "",
    "Peso": "8g",
    "Color": "dorado",
    "Etiqueta": "NUEVO",
    "Imagen URL": "/images/products/pulsera-sample.jpg",
    "En Stock": "Sí",
    "Destacado": "No",
    "Stock": 10,
    "Stock Mínimo": 3,
    "Categoría": "Pulseras",
    "Tallas (JSON)": "[\"S\",\"M\",\"L\"]",
    "Grupo Comparación": "pulseras-doradas",
  },
  {
    "Nombre": "Aretes Candonga Rosé",
    "Slug": "aretes-candonga-rose-sample",
    "SKU": "DM-ARE-001",
    "Descripción": "Acero inoxidable bañado en oro rosé 18K",
    "Precio": 55.00,
    "Precio Anterior": "",
    "Material": "Acero inoxidable + Oro Rosé 18K",
    "Longitud": "",
    "Diámetro": "2cm",
    "Peso": "5g",
    "Color": "rosé",
    "Etiqueta": "",
    "Imagen URL": "/images/products/aretes-sample.jpg",
    "En Stock": "Sí",
    "Destacado": "No",
    "Stock": 8,
    "Stock Mínimo": 3,
    "Categoría": "Aretes",
    "Tallas (JSON)": "[]",
    "Grupo Comparación": "",
  },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const withSample = searchParams.get("withSample") === "true"

    const buffer = generateTemplateFile(
      TEMPLATE_COLUMNS,
      withSample ? SAMPLE_PRODUCTS : undefined
    )

    const headers = getExportHeaders("xlsx", withSample ? "productos_ejemplo" : "productos_plantilla")
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
