# SEO Optimization — Dubraska Mago

## Objective
Implement complete SEO for the Dubraska Mago jewelry e-commerce site. This includes sitemap, robots.txt, structured data (JSON-LD), meta tags, Open Graph, Twitter Cards, and page-level metadata.

## What to Create/Update

### 1. `src/app/robots.ts` — Robots.txt
```typescript
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/office/", "/office/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/office/", "/office/*"],
      },
    ],
    sitemap: "https://dubraska-mago.vercel.app/sitemap.xml",
    host: "https://dubraska-mago.vercel.app",
  }
}
```

### 2. `src/app/sitemap.ts` — Dynamic Sitemap
Generate a sitemap with all public pages including product pages:

```typescript
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dubraska-mago.vercel.app"
  
  // Static pages
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

  // Fetch products from API for dynamic product pages
  let productPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || baseUrl}/api/products?limit=200`, {
      cache: "no-store"
    })
    const json = await res.json()
    if (json.success && json.data?.items) {
      productPages = json.data.items.map((product: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/producto/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    }
  } catch {
    // Fallback: sitemap without product pages
  }

  return [...staticPages, ...productPages]
}
```

### 3. Update `src/app/layout.tsx` — Enhanced Root Metadata
Replace the current metadata with comprehensive SEO metadata:

```typescript
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://dubraska-mago.vercel.app"),
  title: {
    default: "Dubraska Mago® | Joyería de Lujo en Acero y Oro 18K",
    template: "%s | Dubraska Mago®",
  },
  description:
    "Descubre la colección de joyería de lujo Dubraska Mago. Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y hechas para tu día a día. Envíos a toda Venezuela.",
  keywords: [
    "joyería de lujo",
    "acero inoxidable oro 18k",
    "collares",
    "pulseras",
    "aretes",
    "sets de joyería",
    "joyería venezolana",
    "Dubraska Mago",
    "joyería minimalista",
    "regalos para ella",
    "joyería online venezuela",
    "comprar joyas online",
  ],
  authors: [{ name: "Dubraska Mago", url: "https://dubraska-mago.vercel.app" }],
  creator: "Dubraska Mago",
  publisher: "Dubraska Mago",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: "https://dubraska-mago.vercel.app",
    languages: {
      "es-VE": "https://dubraska-mago.vercel.app",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://dubraska-mago.vercel.app",
    siteName: "Dubraska Mago®",
    title: "Dubraska Mago® | Joyería de Lujo en Acero y Oro 18K",
    description:
      "Descubre la colección de joyería de lujo Dubraska Mago. Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales y hechas para tu día a día.",
    images: [
      {
        url: "https://dubraska-mago.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dubraska Mago® — Joyería de Lujo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dubraska Mago® | Joyería de Lujo",
    description:
      "Acero inoxidable bañado en oro 18K. Piezas mínimas, atemporales.",
    images: ["https://dubraska-mago.vercel.app/og-image.jpg"],
    creator: "@dubraskamago",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "shopping",
  classification: "Jewelry Store",
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
  },
}
```

### 4. Create `src/app/opengraph-image.tsx` — Dynamic OG Image
Generate a dynamic Open Graph image using Next.js ImageResponse:

```typescript
import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Dubraska Mago® — Joyería de Lujo"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          backgroundImage: "linear-gradient(135deg, #050505 0%, #111 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "400",
              color: "#D4AF37",
              fontFamily: "serif",
              letterSpacing: "2px",
            }}
          >
            Dubraska Mago
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#ffffff",
              fontWeight: "300",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Joyería de Lujo
          </div>
          <div
            style={{
              width: "120px",
              height: "1px",
              backgroundColor: "#D4AF37",
              marginTop: "8px",
            }}
          />
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.6)",
              marginTop: "12px",
            }}
          >
            Acero inoxidable · Oro 18K
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### 5. Create `src/app/manifest.ts` — PWA Manifest
```typescript
import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dubraska Mago® — Joyería de Lujo",
    short_name: "Dubraska Mago",
    description: "Joyería de lujo en acero inoxidable bañado en oro 18K",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#D4AF37",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["shopping", "lifestyle"],
    lang: "es-VE",
  }
}
```

### 6. Create Structured Data Component (`src/components/StructuredData.tsx`)
A reusable component for JSON-LD structured data:

```typescript
interface StructuredDataProps {
  data: Record<string, unknown>
}

function StructuredData({ data }: StructuredDataProps): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default StructuredData
```

### 7. Add Structured Data to Home Page (`src/app/page.tsx`)
Add Organization and WebSite structured data:

```typescript
// In the home page component, add before the closing tag:
const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dubraska Mago",
  url: "https://dubraska-mago.vercel.app",
  logo: "https://dubraska-mago.vercel.app/logo.png",
  description: "Joyería de lujo en acero inoxidable bañado en oro 18K",
  address: {
    "@type": "PostalAddress",
    addressCountry: "VE",
    addressLocality: "Venezuela",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+58-414-123-4567",
    contactType: "sales",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    "https://instagram.com/dubraskamago",
    "https://facebook.com/dubraskamago",
  ],
}

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dubraska Mago",
  url: "https://dubraska-mago.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://dubraska-mago.vercel.app/colecciones?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}
```

### 8. Add Product Structured Data to Product Detail Page
In `src/app/producto/[slug]/page.tsx`, add Product schema:

```typescript
const productData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  brand: {
    "@type": "Brand",
    name: "Dubraska Mago",
  },
  offers: {
    "@type": "Offer",
    url: `https://dubraska-mago.vercel.app/producto/${product.slug}`,
    priceCurrency: "USD",
    price: product.price,
    availability: product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: {
      "@type": "Organization",
      name: "Dubraska Mago",
    },
  },
  category: product.category,
}
```

### 9. Add BreadcrumbList Structured Data to Product Page
```typescript
const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://dubraska-mago.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Colecciones",
      item: "https://dubraska-mago.vercel.app/colecciones",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: product.name,
      item: `https://dubraska-mago.vercel.app/producto/${product.slug}`,
    },
  ],
}
```

### 10. Update Each Page with Unique Metadata

**Colecciones page** (`src/app/colecciones/page.tsx` or `layout.tsx`):
```typescript
export const metadata: Metadata = {
  title: "Colección Completa | Dubraska Mago®",
  description: "Explora toda nuestra colección de joyería de lujo. Collares, pulseras, aretes y sets en acero inoxidable bañado en oro 18K.",
  openGraph: {
    title: "Colección Completa | Dubraska Mago®",
    description: "Explora toda nuestra colección de joyería de lujo.",
  },
}
```

**Nosotros page**:
```typescript
export const metadata: Metadata = {
  title: "Nuestra Historia | Dubraska Mago®",
  description: "Conoce la historia detrás de Dubraska Mago. Piezas creadas con pasión y dedicación en Venezuela.",
}
```

**Contacto page**:
```typescript
export const metadata: Metadata = {
  title: "Contacto | Dubraska Mago®",
  description: "Contáctanos para consultas, pedidos personalizados o soporte. Estamos aquí para ayudarte.",
}
```

**FAQ page**:
```typescript
export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Dubraska Mago®",
  description: "Respuestas a las preguntas más frecuentes sobre envíos, cuidados, devoluciones y más.",
}
```

**Políticas page**:
```typescript
export const metadata: Metadata = {
  title: "Políticas de Cambios y Devoluciones | Dubraska Mago®",
  description: "Conoce nuestras políticas de cambios, devoluciones, envíos y cuidados de las piezas.",
}
```

### 11. Create FAQ Structured Data for FAQ Page
```typescript
const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿De qué material están hechas las joyas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nuestras joyas están hechas de acero inoxidable bañado en oro 18K...",
      },
    },
    // ... more FAQ items
  ],
}
```

### 12. Create `public/robots.txt` (static fallback)
Even though we have robots.ts, create a static fallback:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /office/
Disallow: /office/*

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /office/

Sitemap: https://dubraska-mago.vercel.app/sitemap.xml
Host: https://dubraska-mago.vercel.app
```

### 13. Add Canonical URLs
Ensure every page has proper canonical URL in metadata. The `metadataBase` in root layout handles this, but verify each page.

### 14. Create `src/components/CanonicalLink.tsx`
A component that renders `<link rel="canonical">` for dynamic pages:
```typescript
interface CanonicalLinkProps {
  path: string
}

function CanonicalLink({ path }: CanonicalLinkProps): React.JSX.Element | null {
  const baseUrl = "https://dubraska-mago.vercel.app"
  return <link rel="canonical" href={`${baseUrl}${path}`} />
}

export default CanonicalLink
```

## Code Rules (MUST FOLLOW)
- NO semicolons
- Double quotes only
- NO comments
- `export default` at end of file
- 2-space indentation
- Use `function` components with `React.JSX.Element` return type
- Max 200 lines per file

## Files to Read First
- `src/app/layout.tsx` — Current root layout with metadata
- `src/app/page.tsx` — Home page
- `src/app/colecciones/page.tsx` — Catalog page
- `src/app/producto/[slug]/page.tsx` — Product detail page
- `src/app/nosotros/page.tsx` — About page
- `src/app/contacto/page.tsx` — Contact page
- `src/app/preguntas-frecuentes/page.tsx` — FAQ page
- `src/app/politicas-cambios-devoluciones/page.tsx` — Policies page
- `src/app/globals.css` — Global styles
- `public/` — Public assets directory

## Verification
After all changes:
1. Run `npm run build` — must pass
2. Verify `https://dubraska-mago.vercel.app/robots.txt` returns robots
3. Verify `https://dubraska-mago.vercel.app/sitemap.xml` returns sitemap
4. Verify `https://dubraska-mago.vercel.app/opengraph-image` returns OG image
5. Check all pages have unique title + description in `<head>`
6. Verify structured data with Google Rich Results Test
