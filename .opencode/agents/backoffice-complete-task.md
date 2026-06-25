# TASK: Complete Office — Categories, Testimonials, Mobile Responsive

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (MUST FOLLOW)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY
- NO comments
- `export default ComponentName` at end
- 2-space indentation
- Function components with `React.JSX.Element`
- `var(--color-*)` or OKLCH for colors
- Max 200 lines per component file

## Context

The office layout is already separate from the public site. It has:
- `OfficeSidebar` (fixed, collapsible, 240px wide)
- `OfficeTopBar` (shows page title + user avatar)
- `OfficeLayout` (wraps sidebar + topbar + main content)

The office does NOT have the public NavigationBar or Footer — this is already correct.

## What to Do

### 1. Fix Mobile Responsiveness — Hamburger Menu in OfficeTopBar

Currently the sidebar is fixed at 240px and doesn't work on mobile. Fix this:

**Update `src/components/office/OfficeTopBar.tsx`:**
- Add a hamburger menu button (☰) visible ONLY on mobile/tablet (< md)
- Clicking it toggles the sidebar (overlay mode on mobile)
- The hamburger should toggle an `onToggleSidebar` callback passed from OfficeLayout

**Update `src/components/office/OfficeLayout.tsx`:**
- Add state for `sidebarOpen` (mobile)
- Pass `setSidebarOpen` to OfficeTopBar
- On mobile: sidebar slides in as overlay with backdrop
- On mobile: clicking a nav item closes the sidebar
- On desktop: sidebar always visible, hamburger hidden

**Update `src/components/office/OfficeSidebar.tsx`:**
- Accept `open: boolean` and `onClose: () => void` props
- On mobile: when `open` is true, show sidebar as overlay with dark backdrop
- On mobile: clicking backdrop closes sidebar
- On desktop: ignore `open`/`onClose`, always visible
- Add close (X) button at top of sidebar for mobile

### 2. Create Categories Page (`src/app/office/categorias/page.tsx`)

Full categories management page.

**Data Model (`src/types/office.ts`):**
```typescript
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  active: boolean
  order: number
}
```

**Initial categories** (hardcoded, stored in localStorage):
```typescript
const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Collares", slug: "collares", description: "Collares y gargantillas de oro 18K", active: true, order: 1 },
  { id: "cat-2", name: "Pulseras", slug: "pulseras", description: "Pulseras, tobilleras y cadenas", active: true, order: 2 },
  { id: "cat-3", name: "Aretes", slug: "aretes", description: "Aretes, zarcillos y piercings", active: true, order: 3 },
  { id: "cat-4", name: "Sets", slug: "sets", description: "Sets completos collar + pulsera", active: true, order: 4 },
  { id: "cat-5", name: "Anillos", slug: "anillos", description: "Anillos y alianzas", active: false, order: 5 },
]
```

**Page Features:**
- Header: "Categorías" title + "Nueva Categoría" button
- Category list as cards/table (responsive)
- Each category shows: Name, Slug, Description, Order (number), Active toggle (switch)
- Inline edit: click edit button → row expands with inputs
- Create modal: Name (text), Slug (auto-generated from name), Description (textarea), Order (number), Active (toggle)
- Delete confirmation dialog
- localStorage persistence (`office_categories`)

**Components to create:**
- `src/components/office/CategoryModal.tsx` — Create/edit modal
- `src/components/office/CategoryList.tsx` — Responsive list/table

### 3. Create Testimonials Page (`src/app/office/testimonios/page.tsx`)

Full testimonials management page.

**Data Model (`src/types/office.ts`):**
```typescript
export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  productId: string
  date: string
  active: boolean
}
```

**Initial data:** Load from `data/testimonials.json` on first visit.

**Page Features:**
- Header: "Testimonios" title + "Nuevo Testimonio" button
- Testimonial list as cards (responsive)
- Each testimonial shows: Name, Text (truncated), Rating (stars), Product (select), Date, Active toggle (switch)
- Inline edit: click edit → expand with full form
- Create modal: Name (text), Text (textarea), Rating (select 1-5), Product (select from existing products), Date (date), Active (toggle)
- Delete confirmation dialog
- localStorage persistence (`office_testimonials`)

**Components to create:**
- `src/components/office/TestimonialModal.tsx` — Create/edit modal
- `src/components/office/TestimonialList.tsx` — Responsive list/cards

### 4. Update Sidebar Nav Items

Update `NAV_ITEMS` in `src/components/office/OfficeSidebar.tsx`:
- Remove `disabled: true` from Categorías and Testimonios
- They are now functional pages

### 5. Add Product/Testimonial Select Helpers

Create a hook or utility to get products for select dropdowns:
- `src/hooks/useProducts.ts` — already exists, use it for product select in testimonials

### 6. Update Types

Add to `src/types/office.ts`:
```typescript
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  active: boolean
  order: number
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  productId: string
  date: string
  active: boolean
}
```

## Files to Create/Modify

### Create (8 files):
1. `src/components/office/CategoryModal.tsx`
2. `src/components/office/CategoryList.tsx`
3. `src/components/office/TestimonialModal.tsx`
4. `src/components/office/TestimonialList.tsx`
5. `src/hooks/useCategories.ts`
6. `src/hooks/useTestimonials.ts`

### Modify (5 files):
1. `src/components/office/OfficeTopBar.tsx` — Add hamburger button
2. `src/components/office/OfficeLayout.tsx` — Mobile sidebar toggle state
3. `src/components/office/OfficeSidebar.tsx` — Mobile overlay mode + close button
4. `src/types/office.ts` — Add Category & Testimonial types
5. `src/app/office/categorias/page.tsx` — Full page (replace placeholder)
6. `src/app/office/testimonios/page.tsx` — Full page (replace placeholder)

## Mobile Behavior

**Sidebar on mobile (< 768px):**
- Hidden by default (off-screen to the left)
- Hamburger button (☰) visible in OfficeTopBar
- Clicking hamburger: sidebar slides in from left + dark backdrop behind
- Clicking backdrop: sidebar slides out
- Clicking a nav item: navigate + close sidebar
- Close (X) button at top-right of sidebar

**Sidebar on desktop (>= 768px):**
- Always visible, fixed left
- Collapse button (‹) at right edge shrinks to icon-only
- No hamburger button visible

## Steps

1. Update `src/types/office.ts` — add Category & Testimonial types
2. Create `src/hooks/useCategories.ts`
3. Create `src/hooks/useTestimonials.ts`
4. Update `src/components/office/OfficeLayout.tsx` — mobile toggle state
5. Update `src/components/office/OfficeTopBar.tsx` — hamburger button
6. Update `src/components/office/OfficeSidebar.tsx` — mobile overlay + close
7. Create `src/components/office/CategoryModal.tsx`
8. Create `src/components/office/CategoryList.tsx`
9. Create `src/components/office/TestimonialModal.tsx`
10. Create `src/components/office/TestimonialList.tsx`
11. Update `src/app/office/categorias/page.tsx`
12. Update `src/app/office/testimonios/page.tsx`
13. Run `npm run build`
14. Fix any errors
15. Do NOT deploy

## IMPORTANT

- The office must be COMPLETELY separate from the public site
- No NavigationBar, no public Footer in /office routes
- The hamburger button is ONLY for the office sidebar, not the public nav
- All forms prefer selects, toggles, switches over text inputs
- localStorage for all office data persistence
- Responsive: sidebar overlay on mobile, fixed on desktop
- Max 200 lines per component
