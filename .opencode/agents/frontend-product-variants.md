# FRONTEND TASK: Product Variants UI

## Objective
Build the complete UI for managing product variants in the backoffice and displaying them on the product detail page. This includes a variant matrix editor in admin and variant selectors (color swatches, size buttons) on the product page.

## Critical Context

### Working Directory
`/opt/data/projects/dubraska-mago/`

### Tech Stack
- Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript
- GSAP for scroll animations, Framer Motion for micro-interactions
- No semicolons, double quotes only, no comments, function components with React.JSX.Element return type, export default at end, 2-space indent
- CSS variables: `--color-bg: #050505`, `--color-gold: #D4AF37`, `--color-muted: #8A8A8A`, `--color-rose: #E8B4B8`
- All UI text in Spanish (Venezuelan)

### Existing Files You MUST Read Before Editing
- `src/app/producto/[slug]/ProductDetailClient.tsx` — Main product detail page client component
- `src/app/producto/[slug]/page.tsx` — Product detail server component (data fetching)
- `src/components/product/ProductInfo.tsx` — Displays product name, price, color, size selector
- `src/components/product/ProductCTA.tsx` — Quantity selector + WhatsApp CTA button
- `src/components/product/ProductGallery.tsx` — Image gallery with zoom
- `src/app/office/productos/page.tsx` — Admin products list
- `src/components/office/ProductForm.tsx` — Admin product form
- `src/components/office/ProductModal.tsx` — Admin product modal
- `src/lib/api-client.ts` — API client service
- `src/types/product.ts` — Product type definitions
- `src/types/office.ts` — Office type definitions
- `src/hooks/useProducts.ts` — Products hook

### Backend API Routes (being built by backend agent simultaneously)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET | Now includes `variants` array and `hasVariants` flag |
| `/api/products/[id]` | GET | Now includes `variants` array |
| `/api/products/[id]/variants` | GET | List all variants for a product |
| `/api/products/[id]/variants` | POST | Create a new variant |
| `/api/products/[id]/variants/bulk` | POST | Bulk create/replace all variants |
| `/api/products/[id]/variants/[variantId]` | GET | Single variant detail |
| `/api/products/[id]/variants/[variantId]` | PATCH | Update variant |
| `/api/products/[id]/variants/[variantId]` | DELETE | Soft delete variant |

Variant data shape:
```typescript
interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  color: string | null
  colorHex: string | null
  size: string | null
  material: string | null
  price: number | null
  oldPrice: number | null
  stock: number
  lowStock: number
  weight: string | null
  image: string | null
  gallery: string[]
  inStock: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}
```

Product data shape (updated):
```typescript
interface Product {
  // ... existing fields now optional: color, size, price, oldPrice, stock, sku, image, gallery, weight, material
  hasVariants: boolean
  variantAttributes: string[]  // e.g., ["color", "size"]
  variants: ProductVariant[]
}
```

## What To Build

### 1. Variant Color Selector Component
File: `src/components/product/VariantColorSelector.tsx`

A row of small color swatches that let the user pick a variant by color.
- Shows small circles (24-32px) with the color
- Selected swatch has a gold ring/border
- On hover: tooltip with color name
- When a color is selected, updates the main product image to the variant's image
- Fades between images using CSS transitions

Props:
```typescript
interface VariantColorSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string | null
  onSelectVariant: (variantId: string) => void
}
```

Design: Dark theme, color swatches with 2px border, gold accent when selected.

### 2. Variant Size Selector Component
File: `src/components/product/VariantSizeSelector.tsx`

Updated/enhanced size selector that shows available sizes from variants.
- Buttons for each available size
- Disabled/out-of-stock sizes shown with strikethrough or muted style
- Selected size has gold border
- Shows price for that specific variant (if variant has its own price)

Props:
```typescript
interface VariantSizeSelectorProps {
  variants: ProductVariant[]
  selectedColor: string | null
  selectedSize: string | null
  onSelectSize: (size: string) => void
}
```

### 3. Variant Matrix Editor (Admin)
File: `src/components/office/VariantMatrix.tsx`

A premium UI for creating/editing variants in the product admin form.
- Shows a grid/matrix: rows = colors, columns = sizes
- Each cell: SKU, price, stock inputs
- "Generar variantes" button: auto-generates all combinations from selected colors and sizes
- Color picker with presets (Dorado, Plateado, Rosé, Negro) + custom color input
- Size input: comma-separated sizes (e.g., "S, M, L")
- Individual variant cards showing: image, SKU, price, stock, active toggle
- Delete variant button (soft delete)
- Add individual variant button

Props:
```typescript
interface VariantMatrixProps {
  variants: ProductVariant[]
  basePrice: number
  baseSku: string
  onVariantsChange: (variants: ProductVariant[]) => void
  categoryName: string
}
```

Use `PRODUCT_SIZE_MAP` from `@/types/product` for default sizes per category.

### 4. Variant Form Component (for individual variant editing)
File: `src/components/office/VariantForm.tsx`

A compact inline form for editing a single variant's fields:
- SKU
- Name
- Color (dropdown from COLORS)
- Color Hex (color picker input)
- Size
- Price (optional, falls back to product price)
- Stock
- Image URL
- Active toggle

Each field uses the same input style as ProductForm.

### 5. Update ProductDetailClient
File: `src/app/producto/[slug]/ProductDetailClient.tsx`

- Add state for `selectedVariantId`
- When `product.hasVariants` is true:
  - Color selector variant → filters available sizes
  - Size selector → selects the variant
  - Image gallery shows selected variant's image/ gallery
  - Price shows selected variant's price (if variant has price override)
  - WhatsApp message includes variant info (color + size if selected)
  - Stock status reflects selected variant's stock
- When `product.hasVariants` is false:
  - Show existing behavior (size selector from product.sizes, product.color)
- Auto-select first variant on load

### 6. Update ProductDetail Server Component
File: `src/app/producto/[slug]/page.tsx`

No changes needed — variants are already included in the API response. Just make sure the ApiProduct type includes variants.

### 7. Update Product Admin Form
File: `src/components/office/ProductForm.tsx`

- Add a toggle for `hasVariants` (using existing ToggleSwitch component)
- When `hasVariants` is true:
  - Hide the single color/size/price/stock fields (they're per-variant)
  - Show the `VariantMatrix` component instead
  - Show `variantAttributes` selection (checkboxes for Color, Size, Material)
- When `hasVariants` is false:
  - Show existing behavior (single color selector, sizes array, single price/stock)

### 8. Update Product API Client
File: `src/lib/api-client.ts` (if it has variant methods, use them)

Or add to existing hooks. Check `src/hooks/useProducts.ts`:
- Add variant management functions or a dedicated `useVariants` hook

File: `src/hooks/useVariants.ts`

```typescript
export function useVariants(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!productId) return
    fetch(`/api/products/${productId}/variants`, { credentials: "include" })
      .then(r => r.json())
      .then(j => { if (j.success) setVariants(j.data) })
      .finally(() => setLoading(false))
  }, [productId])
  
  const createVariant = async (data: Partial<ProductVariant>) => {
    const res = await fetch(`/api/products/${productId}/variants`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (json.success) setVariants(prev => [...prev, json.data])
    return json
  }
  
  const bulkUpdate = async (variants: Partial<ProductVariant>[], replaceExisting = false) => {
    const res = await fetch(`/api/products/${productId}/variants/bulk`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variants, replaceExisting }),
    })
    const json = await res.json()
    if (json.success) setVariants(json.data.variants)
    return json
  }
  
  const deleteVariant = async (variantId: string) => {
    await fetch(`/api/products/${productId}/variants/${variantId}`, {
      method: "DELETE",
      credentials: "include",
    })
    setVariants(prev => prev.filter(v => v.id !== variantId))
  }
  
  return { variants, loading, createVariant, bulkUpdate, deleteVariant }
}
```

### 9. Update Product Types
File: `src/types/product.ts`

Add:
```typescript
export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  color: string | null
  colorHex: string | null
  size: string | null
  material: string | null
  price: number | null
  oldPrice: number | null
  stock: number
  lowStock: number
  weight: string | null
  image: string | null
  gallery: string[]
  inStock: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}
```

Update Product interface:
- Make these fields optional since they move to variants: color, price, oldPrice, stock, lowStock, sku, image, gallery, weight, material, sizes
- Add: `hasVariants?: boolean`
- Add: `variantAttributes?: string[]`
```

Also update `src/types/office.ts` if needed for the admin form data shape.

## Design Details

### VariantColorSelector
```
[Selecciona un color]
  ●  ●  ●  ●    (color swatches)
Dorado Plateado Rosé Negro
```
- Swatches: 28px circles, 2px border, smooth 200ms transition
- Selected: gold scale(1.15) + ring shadow
- Tooltip on hover with color name
- Out of stock: opacity 0.3 + red X

### VariantSizeSelector (inside product detail)
```
[Selecciona una talla]
  [40] [45] [50]    (sizes for selected color)
  Precio: $85.00     (variant-specific if override)
```
- Same style as existing size selector
- Only shows sizes available for the selected color
- Auto-selects first available

### VariantMatrix (Admin)
```
┌─────────────────────────────────────────────┐
│  🔀 Variantes de Producto                    │
│  ☑ Color  ☑ Size  ☐ Material                 │
│                                              │
│  Colores: [Dorado●] [Plateado●] [+Agregar]  │
│  Tallas:  [40] [45] [50] [+Agregar]          │
│                                              │
│  [🔄 Generar todas las combinaciones]        │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │  Combinaciones generadas: 6             │ │
│  │                                          │ │
│  │  Dorado + 40                            │ │
│  │  SKU: [DM-COL-ADO-40    ]              │ │
│  │  Precio: [85.00     ] Stock: [10]      │ │
│  │  Imagen: [+ Agregar URL]                │ │
│  │  [Activo: ●] [🗑 Eliminar]             │ │
│  │                                          │ │
│  │  Dorado + 45                            │ │
│  │  SKU: [DM-COL-ADO-45    ]              │ │
│  │  ...                                    │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Code Rules (MANDATORY)
1. NO semicolons
2. Double quotes only
3. NO comments
4. Function components with `React.JSX.Element` return type
5. `export default ComponentName` at end of file
6. 2-space indentation
7. Use `var(--color-*)` CSS variables, NOT hex colors
8. All user-facing text in Spanish
9. Respect `prefers-reduced-motion` for GSAP animations
10. Max 200 lines per file — split into sub-components if needed

## Verification
After making all changes, run:
```bash
npx next build 2>&1 | tail -40
```
The build MUST succeed with zero errors.