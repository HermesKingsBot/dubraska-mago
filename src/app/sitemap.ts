import type { MetadataRoute } from "next"
import db from "@/lib/db"

const baseUrl = "https://dubraska-mago.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colecciones`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/envios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/preguntas-frecuentes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/politicas-privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politicas-cambios-devoluciones`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await db.product.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    })
    productPages = products.map((p) => ({
      url: `${baseUrl}/producto/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    // continue without products
  }

  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await db.category.findMany({
      where: { active: true, deletedAt: null },
      select: { slug: true, updatedAt: true },
    })
    categoryPages = categories.map((c) => ({
      url: `${baseUrl}/colecciones?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch {
    // continue without categories
  }

  return [...staticPages, ...productPages, ...categoryPages]
}
