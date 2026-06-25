import db from "@/lib/db"

export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
}

export async function validateStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []
  for (const item of items) {
    const product = await db.product.findUnique({
      where: { id: item.productId },
      select: { id: true, name: true, stock: true },
    })
    if (!product) {
      errors.push(`Producto no encontrado: ${item.productId}`)
      continue
    }
    if (product.stock < item.quantity) {
      errors.push(`Stock insuficiente para "${product.name}": disponible ${product.stock}, solicitado ${item.quantity}`)
    }
  }
  return { valid: errors.length === 0, errors }
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${ts}-${rand}`
}
