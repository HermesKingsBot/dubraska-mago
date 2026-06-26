import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/office/", "/office/*", "/cuenta/", "/checkout/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/office/", "/office/*", "/cuenta/", "/checkout/"],
      },
    ],
    sitemap: "https://dubraska-mago.vercel.app/sitemap.xml",
    host: "https://dubraska-mago.vercel.app",
  }
}
