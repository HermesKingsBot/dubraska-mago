---
name: nextjs-ecommerce-patterns
description: "Next.js e-commerce patterns — cart, wishlist, checkout, product variants, order flow, customer auth, rate limiting, loading skeletons, SEO per product. Use when building any Next.js e-commerce store, regardless of design or industry."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [nextjs, ecommerce, cart, checkout, seo, rate-limiting, skeletons, testing]
    related_skills: [nextjs, tailwind-css4, web-a11y, opencode-frontend-agent]
---

# Next.js E-Commerce Patterns

Generic patterns for any Next.js e-commerce project. Not specific to any brand or design.

## Product Page SEO

Every product page needs:

```typescript
// src/app/producto/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return { title: "Producto no encontrado" }

  const siteUrl = process.env.SITE_URL || "https://example.com"
  const imageUrl = product.image || `${siteUrl}/api/og?title=${encodeURIComponent(product.name)}`

  return {
    title: `${product.name} | Brand®`,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: `${product.name} | Brand®`,
      description: product.description?.slice(0, 160),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
      type: "product",
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: `${siteUrl}/producto/${slug}` },
  }
}

export async function generateStaticParams() {
  const products = await db.product.findMany({ where: { deletedAt: null }, select: { slug: true } })
  return products.map((p) => ({ slug: p.slug }))
}
```

## Loading Skeletons

Every page route needs a `loading.tsx` with Suspense:

```
src/app/
├── colecciones/loading.tsx      → ProductGridSkeleton + FilterBarSkeleton
├── producto/[slug]/loading.tsx  → ProductGallerySkeleton + ProductInfoSkeleton
├── carrito/loading.tsx          → CartPageSkeleton
├── checkout/loading.tsx         → CheckoutFormSkeleton
├── cuenta/loading.tsx           → ProfileSkeleton
├── [every-page]/loading.tsx     → Appropriate skeleton
```

Skeleton pattern (shimmer + Framer Motion):

```tsx
'use client'
import { motion } from "motion/react"

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--color-dark-card)" }}>
      <div className="relative aspect-square overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)", backgroundSize: "200% 100%" }}
          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 rounded bg-[rgba(255,255,255,0.05)] w-3/4" />
        <div className="h-4 rounded bg-[rgba(255,255,255,0.05)] w-1/2" />
      </div>
    </div>
  )
}
```

## Sitemap Dinámico

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://example.com"

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ]

  const products = await db.product.findMany({ where: { deletedAt: null }, select: { slug: true, updatedAt: true } })
  const productPages = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
```

## Robots.txt Dinámico

```typescript
// src/app/robots.ts
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || "https://example.com"
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin/", "/api/", "/account/", "/checkout/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

## OpenGraph Image Dinámico

```typescript
// src/app/api/og/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") || "Tienda"

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#050505"/>
    <text x="600" y="315" text-anchor="middle" fill="#D4AF37" font-size="48" font-family="serif">${title}</text>
  </svg>`

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
  })
}
```

## Rate Limiting (In-Memory)

```typescript
// src/lib/rate-limit.ts
const store = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, windowMs: number, maxRequests: number): { success: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || entry.resetTime < now) {
    store.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((entry.resetTime - now) / 1000) }
  }

  entry.count++
  return { success: true, remaining: maxRequests - entry.count }
}

// Usage in API route:
// const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
// const result = checkRateLimit(ip, 15 * 60 * 1000, 10)  // 10 req per 15 min
// if (!result.success) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(result.retryAfter) } })
```

## next/image Migration

Always guard against nullable `src`:

```tsx
// ❌ CRASHES if product.image is undefined
<Image src={product.image} alt={product.name} width={400} height={400} />

// ✅ Safe
{product.image ? (
  <Image src={product.image} alt={product.name} width={400} height={400} sizes="(max-width: 640px) 100vw, 25vw" />
) : (
  <div className="flex items-center justify-center text-muted">Sin imagen</div>
)}
```

Config in `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}
```

## Testing Patterns

Mock `next/image` globally in `src/test/setup.ts`:

```typescript
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, className, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} className={className} {...rest} />
  },
}))
```

Mock `next/navigation`:

```typescript
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))
```

## CI/CD Pipeline (GitHub Actions + Husky)

```
.github/workflows/ci.yml    → test-unit + test-e2e + build-verification
.husky/pre-commit           → npx lint-staged
package.json lint-staged    → src/**/*.test.{ts,tsx} ONLY (not *.{ts,tsx})
scripts/deploy.sh           → test → build → vercel deploy
```

Critical: lint-staged MUST target `*.test.{ts,tsx}` or commits fail with "No test files found".

## Pre-Commit Quick Reference

After EVERY agent session:
1. `npx next build` — verify no errors
2. `npx vitest run` — verify tests pass
3. `git add -A && git commit` — commit
4. `git push` — push to GitHub

## Common Post-Agent Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Type 'string \| undefined' not assignable` | next/image src is nullable | Guard: `{image ? <Image .../> : fallback}` |
| `Expected '</', got 'ident'` | JSX lines merged by patch tool | Re-read patched file, fix manually |
| `Another next build process is running` | Two agents collided on `.next/build.lock` | `rm -f .next/build.lock && pkill -f "next build"` |
| `No test files found` (code 1) | lint-staged passes non-test files to vitest | Change glob to `*.test.{ts,tsx}` |
| `NextResponse` type mismatch | Rate limit helper returns `Response` not `NextResponse` | Use `NextResponse.json(...)` instead of `new Response(...)` |
| Build succeeds but tests fail | Agent wrote code but didn't update mocks | Add `vi.mock("next/image")` to test files |
