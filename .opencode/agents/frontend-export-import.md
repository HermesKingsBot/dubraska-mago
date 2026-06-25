# FRONTEND TASK: Export/Import UI for Backoffice

## Objective
Add export/import functionality to 4 admin pages: Productos, Categorías, Testimonios, and Inventario. This includes CSV/Excel export buttons, Excel import with drag-and-drop, and template download buttons.

## Critical Context

### Working Directory
`/opt/data/projects/dubraska-mago/`

### Tech Stack
- Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript
- No semicolons, double quotes only, no comments, function components with React.JSX.Element return type, export default at end, 2-space indent
- CSS variables: `--color-bg: #050505`, `--color-gold: #D4AF37`, `--color-muted: #8A8A8A`
- All UI text in Spanish (Venezuelan)

### Existing Files You MUST Read Before Editing
- `src/app/office/productos/page.tsx` — Product admin page (add export/import buttons here)
- `src/app/office/categorias/page.tsx` — Category admin page  
- `src/app/office/testimonios/page.tsx` — Testimonial admin page
- `src/app/office/inventario/page.tsx` — Inventory admin page
- `src/components/office/OfficeSidebar.tsx` — Sidebar navigation
- `src/lib/api-client.ts` — API client service
- `src/types/office.ts` — Type definitions
- `package.json` — Current dependencies

### Backend API Endpoints (being built by backend agent simultaneously)
These endpoints will exist when your code runs:

1. **GET `/api/admin/export/products`** — Downloads all products as CSV (`?format=csv`) or Excel (`?format=xlsx`)
2. **GET `/api/admin/export/categories`** — Downloads categories CSV/Excel
3. **GET `/api/admin/export/testimonials`** — Downloads testimonials CSV/Excel
4. **GET `/api/admin/export/inventory`** — Downloads inventory CSV/Excel
5. **POST `/api/admin/import/products`** — Upload Excel file for bulk product import (`multipart/form-data`, field name: `file`)
6. **POST `/api/admin/import/categories`** — Upload Excel for categories
7. **POST `/api/admin/import/testimonials`** — Upload Excel for testimonials
8. **POST `/api/admin/import/inventory`** — Upload Excel for inventory movements
9. **GET `/api/admin/import/products/template`** — Downloads empty template Excel
10. **GET `/api/admin/import/products/template?withSample=true`** — Downloads template with 3 sample rows
11. Same `/template` and `/template?withSample=true` for categories, testimonials, inventory

All export endpoints return a file download (Content-Disposition header).
All import endpoints accept `multipart/form-data` with field `file` and return:
```json
{ "success": true, "data": { "imported": 5, "errors": [{ "row": 2, "field": "price", "message": "Must be positive number" }] } }
```

## What To Build

### 1. Shared ExportImportButtons Component
File: `src/components/office/ExportImportButtons.tsx`

A reusable component that shows:
- **Export dropdown** (CSV / Excel buttons) — triggers download via fetch to the API
- **Import button** — opens a modal
- **Download template dropdown** (Plantilla vacía / Plantilla con ejemplos)

Props:
```typescript
interface ExportImportButtonsProps {
  entity: "products" | "categories" | "testimonials" | "inventory"
  onImportComplete?: () => void
}
```

The export download should work like:
```typescript
async function handleExport(format: "csv" | "xlsx") {
  const res = await fetch(`/api/admin/export/${entity}?format=${format}`, { credentials: "include" })
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${entity}-${new Date().toISOString().slice(0, 10)}.${format === "csv" ? "csv" : "xlsx"}`
  a.click()
  URL.revokeObjectURL(url)
}
```

Template download:
```typescript
async function handleDownloadTemplate(withSample: boolean) {
  const url = `/api/admin/import/${entity}/template${withSample ? "?withSample=true" : ""}`
  const res = await fetch(url, { credentials: "include" })
  const blob = await res.blob()
  // same download logic
}
```

Style: Dark luxury theme matching the rest of the office. Gold accents on buttons.

### 2. ImportModal Component
File: `src/components/office/ImportModal.tsx`

A modal with:
- Drag-and-drop zone for Excel files (.xlsx, .xls)
- File list showing selected file name and size
- Upload progress indicator (if possible, or at least loading state)
- Results display after import: "5 registros importados exitosamente" + error list if any
- Close button

Props:
```typescript
interface ImportModalProps {
  open: boolean
  entity: "products" | "categories" | "testimonials" | "inventory"
  onClose: () => void
  onImportComplete: () => void
}
```

Import logic:
```typescript
const formData = new FormData()
formData.append("file", selectedFile)
const res = await fetch(`/api/admin/import/${entity}`, {
  method: "POST",
  credentials: "include",
  body: formData,
})
```

### 3. Update 4 Existing Pages

Add `<ExportImportButtons entity="..." onImportComplete={refreshFunction} />` to the header area (near the "+ Nuevo" button) of each page:

- `src/app/office/productos/page.tsx` — Add near the "Nuevo Producto" button
- `src/app/office/categorias/page.tsx` — Add near the "Nueva Categoría" button
- `src/app/office/testimonios/page.tsx` — Add near the "Nuevo Testimonio" button
- `src/app/office/inventario/page.tsx` — Add near the top actions area

Each page should also add the `<ImportModal>` component.

### 4. Install xlsx dependency for client-side file validation (optional)
If you want to validate the Excel file client-side before upload, install xlsx:
```bash
npm install xlsx
```
But it's NOT required — server-side validation is sufficient.

## Design Details

### ExportImportButtons Layout
```
[📋 Exportar ▾] [📥 Importar] [📝 Plantilla ▾]
```

- Export dropdown: CSV, Excel (two options)
- Import button: opens ImportModal
- Template dropdown: "Plantilla vacía", "Plantilla con datos de ejemplo"

### ImportModal Layout
```
┌──────────────────────────────────────┐
│  Importar Productos                  │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │                                  │ │
│  │   📁 Arrastra tu archivo Excel   │ │
│  │      aquí o haz clic para        │ │
│  │      seleccionar                 │ │
│  │                                  │
│  │   Acepta: .xlsx, .xls           │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ℹ️ Descarga la plantilla para ver    │
│     el formato correcto               │
│                                       │
│  ─── Resultados ───                   │
│  ✅ 5 registros importados            │
│  ❌ Fila 3: "price" debe ser positivo │
│                                       │
│          [Cancelar] [Importar]        │
└──────────────────────────────────────┘
```

### Colors & Styling
- Background: `bg-[#111]` or darker
- Borders: `border-[#333]`
- Gold accents: `var(--color-gold)`
- Drop zone: dashed border gold when dragging, `border-[#333]` normally
- Success: green accent
- Error: red accent
- Use `lucide-react` icons if possible (Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle)

## Code Rules (MANDATORY)
1. NO semicolons
2. Double quotes only
3. NO comments
4. Function components with `React.JSX.Element` return type
5. `export default ComponentName` at end of file
6. 2-space indentation
7. Use `var(--color-*)` CSS variables, NOT hex colors
8. All user-facing text in Spanish

## Verification
After making all changes, run:
```bash
npx next build 2>&1 | tail -30
```
The build MUST succeed with zero errors.