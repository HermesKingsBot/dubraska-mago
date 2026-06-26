import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, errorResponse, handleApiError } from "@/lib/api"
import { requireAuth } from "@/lib/auth"
import { logCreate } from "@/lib/audit"
import { inventoryMovementSchema } from "@/lib/schemas"
import { parseImportFile, validateImportFile } from "@/lib/import-utils"
import { checkRateLimit, RATE_LIMITS, createRateLimitResponse } from "@/lib/rate-limit"

const INVENTORY_FIELD_MAP: Record<string, string> = {
  "Producto SKU": "productSku",
  "Tipo": "type",
  "Cantidad": "quantity",
  "Razón": "reason",
  "Referencia": "reference",
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireAuth(request)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const importResult = checkRateLimit(ip, RATE_LIMITS.import)
    if (!importResult.success) {
      return createRateLimitResponse(importResult)
    }
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return errorResponse("No se recibió ningún archivo", 400)
    }

    validateImportFile(file)

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = parseImportFile(buffer, inventoryMovementSchema, INVENTORY_FIELD_MAP)

    if (result.errors.length > 0) {
      return successResponse({
        imported: 0,
        errors: result.errors,
        total: result.total,
      }, 207)
    }

    const movements: { id: string; productSku: string }[] = []
    const errors: { row: number; message: string }[] = []

    await db.$transaction(async (tx) => {
      for (let i = 0; i < result.valid.length; i++) {
        const item = result.valid[i]

        const product = await tx.product.findFirst({
          where: { sku: item.productSku, deletedAt: null },
        })

        if (!product) {
          errors.push({ row: i + 2, message: `Producto con SKU "${item.productSku}" no encontrado` })
          continue
        }

        let newStock = product.stock
        if (item.type === "STOCK_IN") {
          newStock = product.stock + item.quantity
        } else if (item.type === "STOCK_OUT") {
          newStock = product.stock - item.quantity
        } else if (item.type === "SET") {
          newStock = item.quantity
        }

        if (newStock < 0) {
          errors.push({ row: i + 2, message: `Stock insuficiente para el producto "${product.name}"` })
          continue
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: newStock },
        })

        const movement = await tx.inventoryMovement.create({
          data: {
            productId: product.id,
            type: item.type,
            quantity: item.quantity,
            reason: item.reason ?? null,
            reference: item.reference ?? null,
            previousStock: product.stock,
            newStock,
            createdBy: user.email,
          },
        })

        movements.push({ id: movement.id, productSku: product.sku ?? "" })
        await logCreate(user, "InventoryMovement", { id: movement.id, name: product.sku ?? "" }, request)
      }
    })

    return successResponse({
      imported: movements.length,
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
