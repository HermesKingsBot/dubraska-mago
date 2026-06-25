# BACKEND TASK: Export/Import API Endpoints

## Objective
Build complete CSV and Excel export/import API endpoints for 4 entities: Products, Categories, Testimonials, and Inventory. Include template downloads (empty and with sample data).

## Critical Context

### Working Directory
`/opt/data/projects/dubraska-mago/`

### Current Stack
- Next.js 16 (App Router) with API routes in `src/app/api/`
- Prisma 6 + SQLite (`prisma/schema.prisma`)
- Zod for validation (`src/lib/schemas.ts`)
- Auth via `requireAuth()` from `src/lib/auth.ts`
- Audit logging via `logCreate`, `logUpdate`, `logDelete` from `src/lib/audit.ts`
- Soft delete pattern: `deletedAt DateTime?` on models, queries filter `deletedAt: null`

### EXISTING Files You MUST Read
- `prisma/schema.prisma` — Full database schema with all models
- `src/lib/db.ts` — Database helper
- `src/lib/api.ts` — Response helpers: `successResponse()`, `errorResponse()`, `handleApiError()`
- `src/lib/auth.ts` — `requireAuth(request)` for admin auth
- `src/lib/schemas.ts` — Zod schemas for all entities
- `src/lib/audit.ts` — Audit logging helpers
- `src/app/api/products/route.ts` — Example of existing API pattern
- `src/app/api/categories/route.ts` — Categories API
- `src/app/api/testimonials/route.ts` — Testimonials API
- `src/app/api/inventory/adjust/route.ts` — Inventory adjustment API
- `package.json` — Current dependencies

### IMPORTANT: Prisma Schema Fields

**Product model fields for export:**
- name, slug, description, price, oldPrice, material, length, diameter, weight, color, badge, image, gallery (JSON string), inStock, featured, stock, lowStock, sku, categoryId, sizes (JSON string), compareGroup

**Category model fields:**
- name, slug, description, active, order

**Testimonial model fields:**
- name, text, rating, productId, date, active

**Inventory (InventoryMovement) model fields:**
- productId, type, quantity, reason, reference, previousStock, newStock, createdBy

## What To Build

### Step 1: Install xlsx Package
```bash
cd /opt/data/projects/dubraska-mago/
npm install xlsx
```
This is the `SheetJS` library — works in Node.js, creates Excel files, parses Excel uploads, and can also generate CSV. It's the industry standard and works perfectly with Next.js API routes.

### Step 2: Create Export Utility
File: `src/lib/export-utils.ts`

This utility handles generating CSV and Excel (XLSX) buffers from data arrays.

```typescript
import * as XLSX from "xlsx"

interface ExportOptions {
  filename: string
  sheetName: string
  data: Record<string, unknown>[]
  columns: { key: string; header: string; width?: number }[]
  format: "csv" | "xlsx"
}

function generateExportFile(options: ExportOptions): Buffer {
  const { filename, sheetName, data, columns, format } = options
  
  const rows = data.map(item => {
    const row: Record<string, unknown> = {}
    columns.forEach(col => {
      row[col.header] = item[col.key]
    })
    return row
  })
  
  const ws = XLSX.utils.json_to_sheet(rows, { header: columns.map(c => c.header) })
  
  // Set column widths
  ws["!cols"] = columns.map(c => ({ wch: c.width || 20 }))
  
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  
  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(ws)
    return Buffer.from(csv, "utf-8")
  }
  
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  return Buffer.from(buf)
}
```

Export it along with helper functions.

### Step 3: Create Import Utility
File: `src/lib/import-utils.ts`

This utility parses uploaded Excel/CSV files and validates rows against Zod schemas.

```typescript
import * as XLSX from "xlsx"
import { ZodSchema, ZodError } from "zod"

interface ImportResult<T> {
  valid: T[]
  errors: { row: number; field?: string; message: string }[]
  total: number
  imported: number
}

function parseImportFile<T>(
  buffer: Buffer,
  schema: ZodSchema<T>,
  fieldMapping?: Record<string, string>
): ImportResult<T> {
  const wb = XLSX.read(buffer, { type: "buffer" })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
  
  const valid: T[] = []
  const errors: { row: number; field?: string; message: string }[] = []
  
  rows.forEach((rawRow, index) => {
    // Apply field mapping if provided (e.g., "Nombre" -> "name")
    let mappedRow = rawRow
    if (fieldMapping) {
      mappedRow = {}
      Object.entries(rawRow).forEach(([key, value]) => {
        const mappedKey = fieldMapping[key] || key
        mappedRow[mappedKey] = value
      })
    }
    
    const result = schema.safeParse(mappedRow)
    if (result.success) {
      valid.push(result.data)
    } else {
      result.error.issues.forEach(issue => {
        errors.push({
          row: index + 2,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })
      })
    }
  })
  
  return {
    valid,
    errors,
    total: rows.length,
    imported: valid.length,
  }
}
```

### Step 4: Create Export API Routes

File: `src/app/api/admin/export/products/route.ts`
- GET handler
- `?format=csv` or `?format=xlsx` (default: xlsx)
- Requires admin auth (`requireAuth`)
- Fetches all products with category included
- Maps to flat rows
- Returns file download with proper headers

```typescript
// Column definitions for products export
const PRODUCT_COLUMNS = [
  { key: "name", header: "Nombre", width: 30 },
  { key: "slug", header: "Slug", width: 25 },
  { key: "sku", header: "SKU", width: 15 },
  { key: "description", header: "Descripción", width: 50 },
  { key: "price", header: "Precio", width: 12 },
  { key: "oldPrice", header: "Precio Anterior", width: 15 },
  { key: "material", header: "Material", width: 20 },
  { key: "length", header: "Longitud", width: 15 },
  { key: "diameter", header: "Diámetro", width: 12 },
  { key: "weight", header: "Peso", width: 10 },
  { key: "color", header: "Color", width: 12 },
  { key: "badge", header: "Etiqueta", width: 15 },
  { key: "image", header: "Imagen URL", width: 40 },
  { key: "inStock", header: "En Stock", width: 10 },
  { key: "featured", header: "Destacado", width: 10 },
  { key: "stock", header: "Stock", width: 8 },
  { key: "lowStock", header: "Stock Mínimo", width: 12 },
  { key: "categoryName", header: "Categoría", width: 20 },
  { key: "sizes", header: "Tallas (JSON)", width: 25 },
  { key: "compareGroup", header: "Grupo Comparación", width: 15 },
]
```

Similar files for:
- `src/app/api/admin/export/categories/route.ts`
- `src/app/api/admin/export/testimonials/route.ts`
- `src/app/api/admin/export/inventory/route.ts`

For inventory, export `InventoryMovement` records with product name included.

Response headers for file download:
```typescript
const headers = format === "csv" 
  ? {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    }
  : {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
    }

return new NextResponse(buffer, { status: 200, headers })
```

### Step 5: Create Import API Routes

File: `src/app/api/admin/import/products/route.ts`
- POST handler
- Parse multipart form data (use `request.formData()`)
- Get the file from `formData.get("file")`
- Validate it's .xlsx or .xls
- Parse with import utility
- Create products in bulk via Prisma
- Use a transaction for atomicity
- Return results: `{ imported: N, errors: [...] }`
- Log the import action via audit

Field mapping for products import (Spanish headers → English field names):
```typescript
const PRODUCT_FIELD_MAP: Record<string, string> = {
  "Nombre": "name",
  "Slug": "slug",
  "SKU": "sku",
  "Descripción": "description",
  "Precio": "price",
  "Precio Anterior": "oldPrice",
  "Material": "material",
  "Longitud": "length",
  "Diámetro": "diameter",
  "Peso": "weight",
  "Color": "color",
  "Etiqueta": "badge",
  "Imagen URL": "image",
  "En Stock": "inStock",
  "Destacado": "featured",
  "Stock": "stock",
  "Stock Mínimo": "lowStock",
  "Categoría": "categoryName",
  "Tallas (JSON)": "sizes",
  "Grupo Comparación": "compareGroup",
}
```

For the import schema, create a **loose** version that allows partial data (missing fields get defaults). The strict validation happens on the Zod schema but we need a separate import schema:

```typescript
const importProductSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),
  sku: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().positive("Precio debe ser positivo"),
  oldPrice: z.coerce.number().positive().nullable().optional(),
  material: z.string().default(""),
  length: z.string().nullable().optional(),
  diameter: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  color: z.string().default(""),
  badge: z.string().nullable().optional(),
  image: z.string().default(""),
  inStock: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  categoryName: z.string().default(""),
  sizes: z.string().default("[]"),
  compareGroup: z.string().nullable().optional(),
})
```

When creating the product, look up the category by name to get the `categoryId`. If not found, skip with error.

Similar files:
- `src/app/api/admin/import/categories/route.ts`
- `src/app/api/admin/import/testimonials/route.ts`
- `src/app/api/admin/import/inventory/route.ts`

### Step 6: Create Template Download Routes

File: `src/app/api/admin/import/products/template/route.ts`
- GET handler
- `?withSample=true` for template with sample data
- Uses the same column definitions as export
- Empty template: just headers row
- Sample template: 3 rows of realistic jewelry data

Sample data for products:
```typescript
const SAMPLE_PRODUCTS = [
  {
    name: "Collar Cadena Dorado",
    slug: "collar-cadena-dorado-sample",
    sku: "DM-COL-001",
    description: "Acero inoxidable bañado en oro 18K",
    price: 85.00,
    oldPrice: "",
    material: "Acero inoxidable + Oro 18K",
    length: "45cm",
    diameter: "",
    weight: "12g",
    color: "dorado",
    badge: "SÚPER VENDIDO",
    image: "/images/products/collar-sample.jpg",
    inStock: "Sí",
    featured: "Sí",
    stock: 15,
    lowStock: 5,
    categoryName: "Collares",
    sizes: "[]",
    compareGroup: "collares-dorados",
  },
  {
    name: "Pulsera Eslabones",
    slug: "pulsera-eslabones-sample",
    sku: "DM-PUL-001",
    description: "Acero inoxidable bañado en oro 18K",
    price: 65.00,
    oldPrice: 75.00,
    material: "Acero inoxidable + Oro 18K",
    length: "18cm + 3cm extensor",
    diameter: "",
    weight: "8g",
    color: "dorado",
    badge: "NUEVO",
    image: "/images/products/pulsera-sample.jpg",
    inStock: "Sí",
    featured: "No",
    stock: 10,
    lowStock: 3,
    categoryName: "Pulseras",
    sizes: "[\"S\",\"M\",\"L\"]",
    compareGroup: "pulseras-doradas",
  },
  {
    name: "Aretes Candonga Rosé",
    slug: "aretes-candonga-rose-sample",
    sku: "DM-ARE-001",
    description: "Acero inoxidable bañado en oro rosé 18K",
    price: 55.00,
    oldPrice: "",
    material: "Acero inoxidable + Oro Rosé 18K",
    length: "",
    diameter: "2cm",
    weight: "5g",
    color: "rosé",
    badge: "",
    image: "/images/products/aretes-sample.jpg",
    inStock: "Sí",
    featured: "No",
    stock: 8,
    lowStock: 3,
    categoryName: "Aretes",
    sizes: "[]",
    compareGroup: "",
  },
]
```

Similar template routes for:
- `src/app/api/admin/import/categories/template/route.ts` (columns: name, slug, description, active, order)
- `src/app/api/admin/import/testimonials/template/route.ts` (columns: name, text, rating, productId, date, active)
- `src/app/api/admin/import/inventory/template/route.ts` (columns: productSku, type, quantity, reason, reference)

### Step 7: Add Import Schemas to schemas.ts

Add to `src/lib/schemas.ts`:

```typescript
export const importProductSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),
  sku: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().positive("Precio debe ser positivo"),
  oldPrice: z.coerce.number().positive().nullable().optional(),
  material: z.string().default(""),
  length: z.string().nullable().optional(),
  diameter: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  color: z.string().default(""),
  badge: z.string().nullable().optional(),
  image: z.string().default(""),
  inStock: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
  stock: z.coerce.number().int().default(0),
  lowStock: z.coerce.number().int().default(5),
  categoryName: z.string().default(""),
  sizes: z.string().default("[]"),
  compareGroup: z.string().nullable().optional(),
})

export const importCategorySchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z.string().min(1, "Slug requerido"),
  description: z.string().default(""),
  active: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
})

export const importTestimonialSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  text: z.string().min(1, "Texto requerido"),
  rating: z.coerce.number().int().min(1).max(5),
  productSlug: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  active: z.coerce.boolean().default(true),
})

export const inventoryMovementSchema = z.object({
  productSku: z.string().min(1, "SKU de producto requerido"),
  type: z.enum(["STOCK_IN", "STOCK_OUT", "SET"]),
  quantity: z.coerce.number().int().positive("Cantidad debe ser positiva"),
  reason: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
})
```

## File Structure After Changes

```
src/app/api/admin/
├── export/
│   ├── products/route.ts     — GET export products
│   ├── categories/route.ts   — GET export categories
│   ├── testimonials/route.ts — GET export testimonials
│   └── inventory/route.ts    — GET export inventory movements
├── import/
│   ├── products/
│   │   ├── route.ts           — POST import products
│   │   └── template/route.ts  — GET download template
│   ├── categories/
│   │   ├── route.ts
│   │   └── template/route.ts
│   ├── testimonials/
│   │   ├── route.ts
│   │   └── template/route.ts
│   └── inventory/
│       ├── route.ts
│       └── template/route.ts
src/lib/
├── export-utils.ts    — Export file generation utilities
└── import-utils.ts    — Import file parsing utilities
```

## Code Rules (MANDATORY)
1. NO semicolons
2. Double quotes only  
3. NO comments
4. 2-space indentation
5. TypeScript strict types — no `any`
6. All error messages in Spanish
7. Use `requireAuth(request)` on ALL admin routes
8. Use `logCreate`/`logUpdate`/etc for audit logging on imports
9. Use Prisma transactions for bulk imports
10. Filter `deletedAt: null` when exporting (only active records by default)

## Security
- ALL routes must call `requireAuth(request)` 
- Import files limited to 5MB max size
- Only .xlsx and .xls file extensions accepted
- Validate ALL data with Zod before inserting
- Use Prisma transactions for atomic imports
- Log import actions to audit log

## Verification
After making all changes, run:
```bash
npx prisma generate && npm run build 2>&1 | tail -40
```
The build MUST succeed with zero errors.