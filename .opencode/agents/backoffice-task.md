# TASK: BackOffice / Dubraska Mago — Admin Dashboard

Create a complete admin backoffice for the Dubraska Mago jewelry site. This is a SEPARATE admin area at `/office` with its own auth, layout, and pages. ALL frontend only — no backend API. Use localStorage for auth state and React context for state management. Prefer selects, toggles, switches, and checkboxes over text inputs.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (MUST FOLLOW)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY
- NO comments
- `export default ComponentName` at end of each file
- 2-space indentation
- Function components with `React.JSX.Element` return type
- `var(--color-*)` or OKLCH for colors

## Product Type Extension

Update `src/types/product.ts` to add:
```typescript
export interface Product {
  // ... existing fields ...
  stock: number
  lowStockThreshold: number
  sku: string
}
```

## Architecture

```
/office                    → Login page (guard: redirect to login if not auth)
/office/dashboard          → Overview with stats cards + quick actions
/office/productos           → Product list with CRUD (full page)
/office/inventario         → Stock management page
/office/categorias         → Categories management (future placeholder)
/office/testimonios        → Testimonials management (future placeholder)
```

## Auth System

### Login (`src/app/office/page.tsx` — Server Component for layout)

Simple email + password login stored in localStorage. Hardcoded credentials:
- **Email**: `admin@dubraskamago.com`
- **Password**: `Dubraska2026!`

### Auth Context (`src/context/OfficeAuthContext.tsx`)

```typescript
interface AuthUser {
  email: string
  name: string
  role: "admin"
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}
```

- On mount, check localStorage for `office_auth`
- `login()` validates against hardcoded credentials, stores in localStorage
- `logout()` removes from localStorage
- Wrap entire office area with this provider

### Auth Guard Component (`src/components/office/AuthGuard.tsx`)

```typescript
"use client"
function AuthGuard({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) redirect("/office")
  return <>{children}</>
}
```

## Office Layout (`src/app/office/layout.tsx`)

Wrap office pages with:
- AuthProvider
- Sidebar navigation
- Top bar with user info + logout
- Main content area

**Sidebar:**
- Logo "DUBRASKA MAGO — Admin"
- Nav items: Dashboard, Productos, Inventario, Categorías (próximamente), Testimonios (próximamente)
- Active indicator with gold accent
- Collapsible on mobile
- Bottom: user email + logout button

**Top Bar:**
- Page title
- User avatar (first letter of email)
- Logout button

### Sidebar Nav Items
```typescript
const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/office/dashboard" },
  { label: "Productos", icon: "💎", href: "/office/productos" },
  { label: "Inventario", icon: "📦", href: "/office/inventario" },
  { label: "Categorías", icon: "🏷️", href: "/office/categorias", disabled: true },
  { label: "Testimonios", icon: "⭐", href: "/office/testimonios", disabled: true },
]
```

## Page 1: Login (`src/app/office/page.tsx`)

When NOT authenticated, show the login form (this IS the `/office` route).

**Login Form:**
- Centered card with gold border
- Logo "DUBRASKA MAGO®" at top
- Subtitle: "Panel de Administración"
- Email input (type email)
- Password input (type password, with show/hide toggle)
- "Iniciar sesión" button (gold gradient)
- Error message (red) when wrong credentials
- "¿Olvidaste tu contraseña?" link (decorative, no action)

**GSAP Animations:**
- Card fade-in + slide up
- Input focus glow

When authenticated, redirect to `/office/dashboard`.

## Page 2: Dashboard (`src/app/office/dashboard/page.tsx`)

Stats overview page.

**Stats Cards (4 cards in a row on desktop):**
1. Total Products — count of products
2. Available Stock — sum of all stock
3. Low Stock Alerts — count where stock <= lowStockThreshold
4. Out of Stock — count where stock === 0

Each stat card:
- Icon (SVG, gold)
- Number (large, bold, gold)
- Label (muted)
- GSAP count-up animation on page load

**Quick Actions Section:**
- "Nuevo Producto" button → opens create product modal
- "Ajuste de Inventario" quick links → navigate to inventory section
- "Ver Tienda" link → open new tab to homepage

**Recent Activity Section (placeholder):**
- Static list of 5 mock activities with timestamps
- Activity items: "Producto creado X", "Stock actualizado Y", etc.

## Page 3: Products Page (`src/app/office/productos/page.tsx`)

Full product management page.

**Header:**
- Page title: "Productos"
- "Nuevo Producto" primary button
- Search input (search by name or SKU)
- Category filter dropdown (select)
- Status filter dropdown (select: Todos, Disponible, Agotado, Stock Bajo)

**Product Table/Cards:**

Responsive — table on desktop, cards on mobile.

Each product row shows:
- SKU
- Name
- Category (select to change)
- Color (select to change)
- Price (editable input, number)
- Stock (editable input, number)
- Status badge (Disponible / Stock Bajo / Agotado — auto-calculated)
- Visibility toggle (switch to show/hide in catalog)
- Actions: Edit (opens modal), Delete (confirm dialog)

**Inline Editing:**
When editing a product, the row expands or shows inputs:
- Name text input
- Category select
- Color select
- Price input (number)
- Material text input
- Waterproof toggle (switch)
- Featured toggle (switch)
- Badge select (none, NUEVO, SÚPER VENDIDO, LIMITADO)
- Save / Cancel buttons

**Create Product Modal:**
- Name, Slug (auto-generated from name)
- Category (select)
- Color (select)
- Price (number)
- Old Price (number, optional)
- Material (text)
- Description (textarea)
- Length, Weight (text)
- Waterproof (toggle switch)
- Featured (toggle switch)
- Badge (select)
- Stock initial (number)
- Create / Cancel buttons

## Page 4: Inventory Page (`src/app/office/inventario/page.tsx`)

Stock management page.

**Header:**
- Page title: "Inventario"
- Summary: Total units + Low stock count + Out of stock count

**Inventory List:**

Each product shows:
- Product name + SKU
- Current stock (large number)
- Status badge: ✓ Disponible, ⚠️ Stock Bajo, ✗ Agotado
- Quick stock adjustment: +1, +5, +10 buttons and -1, -5 buttons
- "Ajuste Manual" button → opens modal with number input to set exact stock
- "Hacer Pedido" button → opens modal:

**Order Modal (Hacer Pedido):**
- Product name (read-only)
- Current stock (read-only)
- Supplier/Solicitante (select: Proveedor, Fabricación, Reposición)
- Quantity to order (number input, min 1)
- Notes (textarea, optional)
- Expected date (date picker)
- "Registrar Pedido" button

**Manual Adjustment Modal:**
- Product name
- Current stock
- New stock (number input)
- Reason (select: Conteo físico, Ajuste sistema, Devolución, Otro)
- "Guardar" button

## Shared Components

All go in `src/components/office/`:

### `src/components/office/AuthGuard.tsx`
Auth wrapper — redirects to login if not authenticated.

### `src/components/office/OfficeSidebar.tsx`
Collapsible sidebar with nav items, active state, user info at bottom.

### `src/components/office/StatCard.tsx`
Reusable stat card with icon, number (animated count-up), label.

### `src/components/office/StatusBadge.tsx`
Auto-calculated status badge: Disponible (green), Stock Bajo (yellow), Agotado (red).

### `src/components/office/ConfirmDialog.tsx`
Confirm dialog modal: title, message, confirm/cancel buttons.

### `src/components/office/ToggleSwitch.tsx`
Reusable toggle switch component.

### `src/components/office/ProductModal.tsx`
Create/edit product modal with all form fields.

### `src/components/office/OrderModal.tsx`
Order modal for stock increase.

### `src/components/office/AdjustmentModal.tsx`
Manual stock adjustment modal.

### `src/components/office/OfficeTable.tsx`
Responsive table (desktop) / cards (mobile) component.

## Files to Create

```
src/
├── app/office/
│   ├── layout.tsx                    — Office layout (sidebar + topbar)
│   ├── page.tsx                      → Login page (or redirect to dashboard)
│   ├── dashboard/page.tsx             — Dashboard page
│   ├── productos/page.tsx            — Products list page
│   ├── productos/ProductTable.tsx    — Product table component
│   ├── inventario/page.tsx          — Inventory page
│   ├── categorias/page.tsx          — Placeholder (próximamente)
│   └── testimonios/page.tsx         — Placeholder (próximamente)
├── context/
│   └── OfficeAuthContext.tsx         — Auth provider + hook
├── hooks/
│   └── useProducts.ts                — Products state management hook
├── components/office/
│   ├── AuthGuard.tsx                 — Auth wrapper
│   ├── OfficeSidebar.tsx             — Sidebar navigation
│   ├── OfficeTopBar.tsx              — Top bar with user info
│   ├── StatCard.tsx                  — Stats card
│   ├── StatusBadge.tsx               — Stock status badge
│   ├── ConfirmDialog.tsx             — Confirm modal
│   ├── ToggleSwitch.tsx              — Toggle switch
│   ├── ProductModal.tsx             — Create/edit modal
│   ├── OrderModal.tsx               — Stock order modal
│   ├── AdjustmentModal.tsx           — Manual adjustment modal
│   └── ComingSoon.tsx               — "Próximamente" placeholder
└── types/
    └── office.ts                     — Office-specific types
```

## Data Persistence

Use localStorage for all data:
- `office_auth` — auth state (user + timestamp)
- `office_products` — product data (sync with products.json on init)
- `office_stock_orders` — stock orders history

On first load:
1. Check localStorage for `office_products`
2. If not found, load from `data/products.json` and save to localStorage
3. All subsequent changes update localStorage

## Design

Same Dark Luxury theme (bg #050505, gold #D4AF37, muted #8A8A8A) but:
- Sidebar is dark (#0a0a0a)
- Cards have subtle gold border on hover
- Status colors: green (ok), yellow (low), red (out)
- Forms use selects, switches, toggles wherever possible
- Cards: #111 background, gold border on hover
- Buttons: gold gradient for primary, dark with gold border for secondary

## GSAP Animations
- Page transitions (fade-in)
- Stats count-up
- Sidebar slide-in (mobile)
- Modal open/close (scale + fade)
- Table row stagger entrance

## Steps

1. Update `src/types/product.ts` — add stock fields
2. Create `src/types/office.ts`
3. Create `src/context/OfficeAuthContext.tsx`
4. Create `src/hooks/useProducts.ts`
5. Create `src/app/office/layout.tsx` (with sidebar, topbar)
6. Create `src/app/office/page.tsx` (login)
7. Create shared components (8 files)
8. Create `src/app/office/dashboard/page.tsx`
9. Create `src/app/office/productos/page.tsx`
10. Create `src/app/office/inventario/page.tsx`
11. Create placeholder pages (categorias, testimonios)
12. Run `npm run build`
13. Fix any errors
14. Do NOT deploy

## IMPORTANT

- Component files MUST be max 200 lines
- Break complex components into smaller ones
- Use function declarations with React.JSX.Element
- The product context should manage all product state from localStorage
- Changes to products in the backoffice should persist in localStorage
- The public site reads from products.json; the backoffice reads from localStorage
