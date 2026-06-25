import { Prisma } from "@prisma/client"

type SoftDeleteModels = "product" | "category" | "testimonial" | "review" | "order" | "socialLink"

export function withSoftDelete<T extends Record<string, unknown>>(where: T): T {
  return { ...where, deletedAt: null }
}

export async function softDelete(model: SoftDeleteModels, id: string): Promise<void> {
  const db = (await import("./db")).default
  await (db[model] as any).update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export async function restore(model: SoftDeleteModels, id: string): Promise<void> {
  const db = (await import("./db")).default
  await (db[model] as any).update({
    where: { id },
    data: { deletedAt: null },
  })
}
