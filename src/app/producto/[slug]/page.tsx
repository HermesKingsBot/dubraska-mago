import { notFound } from "next/navigation"
import type { Product } from "@/types/product"
import ProductDetailClient from "./ProductDetailClient"

interface ApiProduct extends Product {
  gallery: string[]
  waterResistant: boolean
  details: string
  careInstructions: string
  dimensions: string
  relatedIds: string[]
  categoryId: string
}

async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/products?limit=200`,
      { cache: "no-store" }
    )
    const json = await res.json()
    if (!json.success) return []
    const items = json.data.items || []
    return items.map((p: Record<string, unknown>) => {
      const cat = p.category as Record<string, unknown> | undefined
      const catName = cat?.name ? String(cat.name) : ""
      const rawGallery = p.gallery
      const gallery = Array.isArray(rawGallery)
        ? rawGallery
        : typeof rawGallery === "string"
          ? JSON.parse(rawGallery)
          : []
      return {
        id: String(p.id),
        name: String(p.name),
        slug: String(p.slug),
        description: String(p.description),
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        category: catName || String(p.categoryId || ""),
        color: String(p.color),
        badge: p.badge ? String(p.badge) : null,
        image: String(p.image),
        material: String(p.material),
        length: p.length ? String(p.length) : undefined,
        diameter: p.diameter ? String(p.diameter) : undefined,
        weight: p.weight ? String(p.weight) : undefined,
        pieces: undefined,
        inStock: Boolean(p.inStock),
        featured: Boolean(p.featured),
        stock: Number(p.stock),
        lowStockThreshold: Number(p.lowStock) || 5,
        sku: String(p.sku),
        gallery,
        waterResistant: false,
        details: "",
        careInstructions: "",
        dimensions: "",
        relatedIds: [],
        categoryId: String(p.categoryId),
      } as ApiProduct
    })
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const products = await fetchProducts()
  return products.map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const products = await fetchProducts()
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const products = await fetchProducts()
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1
          className="text-3xl text-white"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Producto no encontrado
        </h1>
        <p
          className="text-[var(--color-muted)] text-sm"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          El producto que buscas no existe o fue removido.
        </p>
        <a
          href="/colecciones"
          className="mt-4 px-6 py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-medium hover:bg-[oklch(0.72_0.12_85)] transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Ver catálogo
        </a>
      </div>
    )
  }

  const relatedProducts = products.filter((p) =>
    product.relatedIds.includes(p.id)
  )
  const fallbackProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
  const displayRelated =
    relatedProducts.length >= 3 ? relatedProducts.slice(0, 3) : fallbackProducts

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={displayRelated}
    />
  )
}
