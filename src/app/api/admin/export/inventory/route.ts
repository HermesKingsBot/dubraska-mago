import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { generateExportFile, getExportHeaders, Column } from "@/lib/export-utils"

const INVENTORY_COLUMNS: Column[] = [
  { key: "productName", header: "Producto", width: 30 },
  { key: "productSku", header: "SKU", width: 15 },
  { key: "type", header: "Tipo", width: 12 },
  { key: "quantity", header: "Cantidad", width: 10 },
  { key: "reason", header: "Razón", width: 30 },
  { key: "reference", header: "Referencia", width: 25 },
  { key: "previousStock", header: "Stock Anterior", width: 15 },
  { key: "newStock", header: "Nuevo Stock", width: 12 },
  { key: "createdBy", header: "Creado por", width: 20 },
  { key: "createdAt", header: "Fecha", width: 15 },
]

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    requireAuth(request)
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") === "csv" ? "csv" : "xlsx"

    const movements = await db.inventoryMovement.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    })

    const data = movements.map(m => ({
      productName: m.product.name,
      productSku: m.product.sku,
      type: m.type,
      quantity: m.quantity,
      reason: m.reason ?? "",
      reference: m.reference ?? "",
      previousStock: m.previousStock,
      newStock: m.newStock,
      createdBy: m.createdBy ?? "",
      createdAt: m.createdAt.toISOString().split("T")[0],
    }))

    const buffer = generateExportFile({
      filename: "inventario",
      sheetName: "Movimientos",
      data,
      columns: INVENTORY_COLUMNS,
      format,
    })

    const headers = getExportHeaders(format, `inventario_${new Date().toISOString().split("T")[0]}`)
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    return handleApiError(error)
  }
}
