import { notFound } from "next/navigation"
import fs from "fs/promises"
import path from "path"
import ProductDetailClient from "./ProductDetailClient"

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string
  price: number
  oldPrice: number | null
  category: string
  color: string
  badge: string | null
  image: string
  material: string
  length?: string
  diameter?: string
  weight?: string
  pieces?: number
  inStock: boolean
  featured: boolean
  gallery: string[]
  waterResistant: boolean
  details: string
  careInstructions: string
  dimensions: string
  relatedIds: string[]
}

async function getProducts(): Promise<ProductDetail[]> {
  const filePath = path.join(process.cwd(), "data", "products.json")
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw) as ProductDetail[]
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const products = await getProducts()
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
  const products = await getProducts()
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
