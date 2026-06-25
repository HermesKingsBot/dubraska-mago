# Frontend — Audit Log Viewer + Soft Delete UI

## Objective
1. Create admin page to view audit logs with filters, search, and detail view
2. Update all admin list pages to show soft-deleted items (with restore option)
3. Add confirmation dialogs for delete actions
4. Add "Papelera" (trash) section to restore deleted items

## Design System
- Dark Luxury: `var(--color-bg)`, `var(--color-gold)`, `var(--color-muted)`, `var(--color-white)`, `var(--color-dark-card)`, `var(--color-dark-accent)`
- Fonts: `var(--font-instrument-serif)` headings, `var(--font-inter)` body
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent, max 200 lines/file

## What to Build

### 1. `src/app/office/auditoria/page.tsx` — Audit Log Main Page

Full audit log viewer with:

**Header:**
- Title: "Registro de Actividad"
- Date range picker (from/to)
- Export to CSV button

**Filters Bar:**
- Action type buttons: Todos, Crear, Actualizar, Eliminar, Aprobar, Rebar, Cambiar Estado
- Entity type dropdown: Todos, Producto, Categoría, Pedido, Reseña, Usuario, Testimonio, Red Social, Pago
- Search input (searches in description + entity name)
- Admin user dropdown (filter by who did it)

**Stats Cards (top):**
- Total acciones hoy
- Total acciones esta semana
- Total acciones este mes
- Acción más común

**Log Table:**
- Columns: Fecha/Hora, Admin, Acción, Entidad, Descripción
- Color-coded action badges:
  - CREATE → green
  - UPDATE → blue
  - DELETE → red
  - APPROVE → green
  - REJECT → orange
  - STATUS_CHANGE → purple
- Click row → opens detail modal/panel
- Pagination (50 per page)

**Detail Panel (slide-over or modal):**
- Full description
- Old values vs New values (diff view)
- Entity ID
- IP address
- User agent
- Timestamp

### 2. Create `src/components/office/AuditLogTable.tsx`

The main table component:
- Responsive (horizontal scroll on mobile)
- Sortable columns
- Row click handler
- Empty state

### 3. Create `src/components/office/AuditLogDetail.tsx`

Detail slide-over panel:
- Shows full log entry
- Diff view for old vs new values (side-by-side or inline)
- Color-coded changes (red for removed, green for added)
- Close button

### 4. Create `src/components/office/AuditFilters.tsx`

Filter bar component:
- Action type pills/buttons
- Entity type select
- Date range inputs
- Search input
- Admin select
- "Limpiar filtros" button

### 5. Create `src/components/office/AuditStats.tsx`

Stats cards:
- 4 cards: Hoy, Semana, Mes, Total
- Animated counters (GSAP)
- Icons per stat

### 6. Create `src/components/office/SoftDeleteConfirmDialog.tsx`

Confirmation dialog for soft deletes:
- "¿Estás seguro de eliminar [nombre]?"
- Warning: "El elemento se moverá a la papelera y puede ser restaurado"
- Show what will be affected (e.g., "Este producto tiene 3 reseñas asociadas")
- Confirm/Cancel buttons

### 7. Create `src/components/office/TrashBadge.tsx`

Badge showing count of soft-deleted items:
- Shows "Papelera (X)" in sidebar
- Red badge with count
- Only shows if there are deleted items

### 8. Update Admin List Pages for Soft Delete

#### Update `src/app/office/productos/page.tsx`
- Add toggle switch: "Mostrar eliminados"
- When ON: show soft-deleted products with "Restaurar" button
- When OFF: show only active (default)
- Delete button → soft delete (with confirmation dialog)
- Add "Papelera" tab/section

#### Update `src/app/office/categorias/page.tsx`
- Same pattern: toggle + restore

#### Update `src/app/office/testimonios/page.tsx`
- Same pattern

#### Update `src/app/office/pedidos/page.tsx`
- Show deleted orders with restore option

### 9. Create `src/app/office/papelera/page.tsx` — Trash/Recycle Bin

Centralized trash page showing ALL soft-deleted items:
- Tabs: Productos, Categorías, Testimonios, Pedidos, Redes Sociales
- Each tab shows deleted items with:
  - Name, deletion date, deleted by
  - "Restaurar" button
  - "Eliminar permanentemente" button (hard delete, admin only)
- Empty state: "La papelera está vacía"
- "Vaciar papelera" button (hard delete all, with confirmation)

### 10. Create `src/components/office/RestoreButton.tsx`

Reusable restore button:
- Icon: rotate-left or undo
- Confirmation: "¿Restaurar [nombre]?"
- Success toast: "[Nombre] restaurado correctamente"

### 11. Create `src/components/office/DeleteButton.tsx`

Reusable soft delete button:
- Icon: trash
- Opens SoftDeleteConfirmDialog
- Success toast: "[Nombre] movido a la papelera"

### 12. Update Office Sidebar

#### Update `src/components/office/OfficeSidebar.tsx`
Add new nav items:
- "Auditoría" (clipboard/list icon) — after Configuración
- "Papelera" (trash icon) — after Auditoría, with badge count

### 13. Create `src/hooks/useAuditLogs.ts`

Hook for fetching audit logs:
- `logs: ActivityLog[]`
- `loading, error`
- `filters` state
- `pagination` state
- `refetch()`
- `stats` data

### 14. Create `src/hooks/useTrash.ts`

Hook for trash management:
- `trashedItems: Record<string, any[]>`
- `trashCount: number`
- `restore(type, id)`
- `hardDelete(type, id)`
- `emptyTrash(type)`

### 15. Add Types (`src/types/audit.ts`)

```typescript
export interface ActivityLog {
  id: string
  userId: string | null
  userEmail: string | null
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "STATUS_CHANGE" | "LOGIN" | "LOGOUT"
  entityType: string
  entityId: string | null
  entityName: string | null
  oldValues: string | null
  newValues: string | null
  description: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface AuditStats {
  today: number
  week: number
  month: number
  total: number
  byAction: Record<string, number>
  byEntity: Record<string, number>
}

export const ACTION_COLORS: Record<string, string> = {
  CREATE: "green",
  UPDATE: "blue",
  DELETE: "red",
  APPROVE: "green",
  REJECT: "orange",
  STATUS_CHANGE: "purple",
  LOGIN: "gray",
  LOGOUT: "gray",
}

export const ACTION_LABELS: Record<string, string> = {
  CREATE: "Crear",
  UPDATE: "Actualizar",
  DELETE: "Eliminar",
  APPROVE: "Aprobar",
  REJECT: "Rechazar",
  STATUS_CHANGE: "Cambio estado",
  LOGIN: "Login",
  LOGOUT: "Logout",
}
```

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file
- Use `'use client'` for interactive components
- GSAP for scroll animations, Framer Motion for UI transitions
- Respect `prefers-reduced-motion`
- All text in Spanish
- Mobile-first responsive

## Files to Read First
- `src/app/office/layout.tsx` — Office layout
- `src/components/office/OfficeSidebar.tsx` — Add nav items
- `src/app/office/productos/page.tsx` — Update for soft delete
- `src/app/office/categorias/page.tsx` — Update for soft delete
- `src/app/office/testimonios/page.tsx` — Update for soft delete
- `src/app/office/pedidos/page.tsx` — Update for soft delete
- `src/components/office/ConfirmDialog.tsx` — Reference for dialog pattern
- `src/components/office/StatusBadge.tsx` — Reference for badges

## Verification
After all changes:
1. `npm run build` — must pass
2. Visit `/office/auditoria` — see audit logs with filters
3. Delete a product → goes to trash, not actually deleted
4. Visit `/office/papelera` — see deleted items, can restore
5. Toggle "Mostrar eliminados" on product list — see deleted products
6. Click audit log row — see detail panel with old/new values
7. Mobile: all responsive
