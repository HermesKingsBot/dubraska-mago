import type { MetadataRoute } from "next"

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
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/preguntas-frecuentes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || baseUrl}/api/products?limit=200`,
      { cache: "no-store" }
    )
    const json = await res.json()
    if (json.success && json.data?.items) {
      productPages = json.data.items.map(
        (product: { slug: string; updatedAt: string }) => ({
          url: `${baseUrl}/producto/${product.slug}`,
          lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })
      )
    }
  } catch {
    // sitemap without product pages
  }

  return [...staticPages, ...productPages]
}
