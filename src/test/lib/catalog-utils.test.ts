import { describe, it, expect } from "vitest"
import {
  parseSearchParams,
  filterProducts,
  paginateProducts,
  buildWhatsAppLink,
  buildSearchParams,
  buildApiQueryString,
} from "@/lib/catalog-utils"
import { Product, CatalogSearchParams } from "@/types/product"

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Collar Oro",
    slug: "collar-oro",
    description: "Collar de oro",
    price: 29.99,
    oldPrice: 45.99,
    category: "collares",
    color: "dorado",
    badge: "NUEVO",
    image: "/img1.jpg",
    material: "Oro 18K",
    inStock: true,
    featured: true,
    stock: 10,
    lowStockThreshold: 3,
    sku: "C001",
  },
  {
    id: "2",
    name: "Pulsera Plata",
    slug: "pulsera-plata",
    description: "Pulsera de plata",
    price: 19.99,
    oldPrice: null,
    category: "pulseras",
    color: "plateado",
    badge: null,
    image: "/img2.jpg",
    material: "Plata 925",
    inStock: true,
    featured: false,
    stock: 15,
    lowStockThreshold: 3,
    sku: "P001",
  },
  {
    id: "3",
    name: "Aretes Rosa",
    slug: "aretes-rosa",
    description: "Aretes color rosa",
    price: 35.00,
    oldPrice: null,
    category: "aretes",
    color: "rose",
    badge: "LIMITADO",
    image: "/img3.jpg",
    material: "Acero bañado",
    inStock: true,
    featured: false,
    stock: 5,
    lowStockThreshold: 3,
    sku: "A001",
  },
]

describe("parseSearchParams", () => {
  it("parses default params correctly", () => {
    const result = parseSearchParams({})
    expect(result.q).toBe("")
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(12)
    expect(result.layout).toBe(4)
    expect(result.sort).toBe("newest")
    expect(result.category).toEqual([])
    expect(result.color).toEqual([])
  })

  it("parses query string", () => {
    const result = parseSearchParams({ q: "oro" })
    expect(result.q).toBe("oro")
  })

  it("parses comma-separated categories", () => {
    const result = parseSearchParams({ category: "collares,pulseras" })
    expect(result.category).toEqual(["collares", "pulseras"])
  })

  it("parses comma-separated colors", () => {
    const result = parseSearchParams({ color: "dorado,plateado" })
    expect(result.color).toEqual(["dorado", "plateado"])
  })

  it("parses page number", () => {
    const result = parseSearchParams({ page: "3" })
    expect(result.page).toBe(3)
  })

  it("parses perPage as number", () => {
    const result = parseSearchParams({ perPage: "20" })
    expect(result.perPage).toBe(20)
  })

  it("parses perPage as all", () => {
    const result = parseSearchParams({ perPage: "all" })
    expect(result.perPage).toBe("all")
  })

  it("parses layout", () => {
    expect(parseSearchParams({ layout: "2" }).layout).toBe(2)
    expect(parseSearchParams({ layout: "1" }).layout).toBe(1)
  })

  it("defaults layout to 4 for invalid values", () => {
    expect(parseSearchParams({ layout: "5" }).layout).toBe(4)
  })

  it("parses sort option", () => {
    expect(parseSearchParams({ sort: "price_asc" }).sort).toBe("price_asc")
  })

  it("defaults sort to newest for invalid values", () => {
    expect(parseSearchParams({ sort: "invalid" }).sort).toBe("newest")
  })

  it("parses badge filters", () => {
    const result = parseSearchParams({ ofertas: "true", nuevos: "true", limitados: "true" })
    expect(result.ofertas).toBe(true)
    expect(result.nuevos).toBe(true)
    expect(result.limitados).toBe(true)
  })

  it("parses price range", () => {
    const result = parseSearchParams({ priceMin: "20", priceMax: "100" })
    expect(result.priceMin).toBe("20")
    expect(result.priceMax).toBe("100")
  })

  it("defaults page to 1 for invalid values", () => {
    expect(parseSearchParams({ page: "abc" }).page).toBe(1)
  })
})

describe("filterProducts", () => {
  it("returns all products with no filters", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(3)
  })

  it("filters by search query", () => {
    const result = filterProducts(mockProducts, {
      q: "oro",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Collar Oro")
  })

  it("filters by category", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: ["collares"],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe("collares")
  })

  it("filters by multiple categories", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: ["collares", "pulseras"],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(2)
  })

  it("filters by color", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: ["dorado"],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].color).toBe("dorado")
  })

  it("filters by price min", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: [],
      priceMin: "25",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(2)
  })

  it("filters by price max", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "25",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].price).toBe(19.99)
  })

  it("filters by ofertas badge", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: true,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].oldPrice).not.toBeNull()
  })

  it("filters by nuevos badge", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: true,
      limitados: false,
    })
    expect(result).toHaveLength(1)
    expect(result[0].badge).toBe("NUEVO")
  })

  it("filters by limitados badge", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: true,
    })
    expect(result).toHaveLength(1)
    expect(result[0].badge).toBe("LIMITADO")
  })

  it("combines multiple filters", () => {
    const result = filterProducts(mockProducts, {
      q: "",
      category: ["collares"],
      color: ["dorado"],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
    })
    expect(result).toHaveLength(1)
  })
})

describe("paginateProducts", () => {
  it("returns correct slice for page 1", () => {
    const result = paginateProducts(mockProducts, 1, 2)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe("1")
    expect(result.totalPages).toBe(2)
    expect(result.total).toBe(3)
  })

  it("returns correct slice for page 2", () => {
    const result = paginateProducts(mockProducts, 2, 2)
    expect(result.items).toHaveLength(1)
    expect(result.items[0].id).toBe("3")
  })

  it("returns all items for perPage all", () => {
    const result = paginateProducts(mockProducts, 1, "all")
    expect(result.items).toHaveLength(3)
    expect(result.totalPages).toBe(1)
  })

  it("handles empty array", () => {
    const result = paginateProducts([], 1, 12)
    expect(result.items).toHaveLength(0)
    expect(result.totalPages).toBe(1)
    expect(result.total).toBe(0)
  })

  it("clamps page to valid range", () => {
    const result = paginateProducts(mockProducts, 100, 2)
    expect(result.items).toHaveLength(1)
  })
})

describe("buildWhatsAppLink", () => {
  it("builds correct WhatsApp URL", () => {
    const link = buildWhatsAppLink(mockProducts[0])
    expect(link).toContain("wa.me/584141234567")
    expect(link).toContain(encodeURIComponent("Collar Oro"))
    expect(link).toContain("29.99")
  })
})

describe("buildSearchParams", () => {
  it("builds empty params for defaults", () => {
    const params = buildSearchParams({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
      sort: "newest",
    })
    expect(params.toString()).toBe("")
  })

  it("includes q param", () => {
    const params = buildSearchParams({
      q: "oro",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
      sort: "newest",
    })
    expect(params.get("q")).toBe("oro")
  })

  it("includes category as comma-separated", () => {
    const params = buildSearchParams({
      q: "",
      category: ["collares", "pulseras"],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
      sort: "newest",
    })
    expect(params.get("category")).toBe("collares,pulseras")
  })

  it("includes page when > 1", () => {
    const params = buildSearchParams({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 3,
      perPage: 12,
      layout: 4,
      sort: "newest",
    })
    expect(params.get("page")).toBe("3")
  })

  it("excludes page when 1", () => {
    const params = buildSearchParams({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
      sort: "newest",
    })
    expect(params.has("page")).toBe(false)
  })

  it("includes sort when not newest", () => {
    const params = buildSearchParams({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
      sort: "price_asc",
    })
    expect(params.get("sort")).toBe("price_asc")
  })

  it("includes badge filters", () => {
    const params = buildSearchParams({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: true,
      nuevos: true,
      limitados: false,
      page: 1,
      perPage: 12,
      layout: 4,
      sort: "newest",
    })
    expect(params.get("ofertas")).toBe("true")
    expect(params.get("nuevos")).toBe("true")
  })
})

describe("buildApiQueryString", () => {
  it("builds query string with default limit", () => {
    const qs = buildApiQueryString({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("limit=20")
  })

  it("includes q param", () => {
    const qs = buildApiQueryString({
      q: "oro",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("q=oro")
  })

  it("maps priceMin to minPrice", () => {
    const qs = buildApiQueryString({
      q: "",
      category: [],
      color: [],
      priceMin: "20",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("minPrice=20")
  })

  it("maps priceMax to maxPrice", () => {
    const qs = buildApiQueryString({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "100",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("maxPrice=100")
  })

  it("maps ofertas to badge OFERTA", () => {
    const qs = buildApiQueryString({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: true,
      nuevos: false,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("badge=OFERTA")
  })

  it("maps nuevos to badge NUEVO", () => {
    const qs = buildApiQueryString({
      q: "",
      category: [],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: true,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("badge=NUEVO")
  })

  it("includes category as comma-separated", () => {
    const qs = buildApiQueryString({
      q: "",
      category: ["collares", "pulseras"],
      color: [],
      priceMin: "",
      priceMax: "",
      ofertas: false,
      nuevos: false,
      limitados: false,
      page: 1,
      sort: "newest",
    })
    expect(qs).toContain("category=collares%2Cpulseras")
  })
})
