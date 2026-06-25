# Frontend — Company Settings Admin + Dynamic Data Consumption

## Objective
1. Create admin page to manage all company settings (name, logo, contact, social links, payment info, shipping)
2. Replace ALL hardcoded company data in the frontend with API-fetched settings
3. Always use fallback defaults so the site NEVER breaks if API is down

## Design System
- Dark Luxury: `var(--color-bg)`, `var(--color-gold)`, `var(--color-muted)`, `var(--color-white)`, `var(--color-dark-card)`, `var(--color-dark-accent)`
- Fonts: `var(--font-instrument-serif)` headings, `var(--font-inter)` body
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent, max 200 lines/file

## Part 1: Admin Settings Pages

### Create `src/app/office/configuracion/page.tsx` — Company Settings Main Page

Tabbed interface with sections:

**Tab 1: General**
- Company name, slogan, description
- Logo URL (with preview)
- Favicon URL

**Tab 2: Contacto**
- Email, phone, WhatsApp
- Address, city, state, country
- Schedule (textarea)
- Map coordinates (lat, lng)

**Tab 3: Redes Sociales**
- List of social links with toggle (active/inactive)
- Add new social link (platform dropdown + URL + handle)
- Drag to reorder
- Delete social link
- Platforms: Instagram, Facebook, WhatsApp, TikTok, Twitter/X, YouTube, Pinterest, LinkedIn

**Tab 4: Pagos**
- Bank info (name, account, holder, RIF)
- Pago Móvil (phone, bank, CI)
- Zelle email
- PayPal email

**Tab 5: Envíos y Features**
- Toggle: show/hide shipping info
- Shipping info text
- Toggle: show/hide Cashea
- Cashea info text
- Free shipping threshold
- Return days

### Create `src/components/office/SettingsForm.tsx`
Reusable form component for settings:
- Renders fields based on config (type, label, key)
- Supports: text, textarea, email, url, phone, toggle, image, select
- Auto-saves or has "Guardar" button
- Shows success/error toast

### Create `src/components/office/SocialLinksManager.tsx`
Social links CRUD:
- List with platform icon, handle, URL, toggle switch
- Add new: platform select + URL + handle inputs
- Toggle active/inactive per link
- Delete with confirmation
- Reorder buttons (up/down)

### Create `src/components/office/ImageUpload.tsx`
Image URL input with preview:
- URL input field
- Image preview (loads from URL)
- Clear button
- Used for logo/favicon

### Create `src/components/office/Tabs.tsx`
Tab navigation for settings page:
- Horizontal tabs with gold accent on active
- Animated indicator
- Responsive (scrollable on mobile)

## Part 2: Dynamic Data Hook

### Create `src/hooks/useSettings.ts`

```typescript
interface UseSettingsReturn {
  settings: Record<string, string>
  socialLinks: SocialLink[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Fetches from /api/settings and /api/social-links
// Falls back to COMPANY_DEFAULTS and SOCIAL_DEFAULTS on error
// Caches for 5 minutes
```

### Create `src/context/SettingsContext.tsx`

Provider that fetches settings once and makes them available app-wide:

```typescript
interface SettingsContextType {
  settings: Record<string, string>
  socialLinks: SocialLink[]
  loading: boolean
  getSetting: (key: string, fallback?: string) => string
  getActiveSocials: () => SocialLink[]
  refresh: () => Promise<void>
}
```

Wrap the root layout's `<body>` with this provider so ALL pages have access.

## Part 3: Replace Hardcoded Data

### Update `src/components/Footer.tsx`
Replace ALL hardcoded values with `useSettings()`:
- Company name → `getSetting("company_name")`
- Slogan → `getSetting("company_slogan")`
- Email → `getSetting("email")`
- Phone → `getSetting("phone")`
- Social links → `getActiveSocials()` (render dynamically)
- Address → `getSetting("address")`
- Schedule → `getSetting("schedule")`

### Update `src/components/contact/ContactCards.tsx`
Replace hardcoded contact cards with dynamic data:
- Instagram card → from socialLinks where platform="Instagram" AND active
- WhatsApp card → from socialLinks where platform="WhatsApp" AND active
- Facebook card → from socialLinks where platform="Facebook" AND active
- Email card → from `getSetting("email")`
- Only render cards for ACTIVE social links
- If no social links active, show email card only

### Update `src/components/contact/ContactMap.tsx`
Replace hardcoded coordinates:
- lat → `getSetting("map_lat", "10.5061")`
- lng → `getSetting("map_lng", "-66.9134")`
- Popup text → `getSetting("company_name")` + `getSetting("address")`

### Update `src/components/contact/ContactCTA.tsx`
Replace hardcoded WhatsApp link:
- href → `https://wa.me/${getSetting("whatsapp")}`

### Update `src/components/HeroSection.tsx`
Replace hardcoded badges:
- "Envíos a toda Venezuela" → only if `getSetting("shipping_enabled") === "true"`
- "Aceptamos Cashea" → only if `getSetting("cashea_enabled") === "true"`
- Address badge → `getSetting("address")`

### Update `src/components/NavigationBar.tsx`
- Logo alt text → `getSetting("company_name")`

### Update `src/app/layout.tsx`
- Title → `getSetting("company_name")` with template
- Description → `getSetting("company_description")`
- OG title → `getSetting("company_name")` + `getSetting("company_slogan")`

### Update `src/app/colecciones/page.tsx`
- WhatsApp link in products → `https://wa.me/${getSetting("whatsapp")}`

### Update `src/app/checkout/page.tsx`
- Payment instructions → use settings:
  - Bank name, account, holder, RIF
  - Pago Móvil phone, bank, CI
  - Zelle email
  - PayPal email

### Update `src/components/product/ProductCTA.tsx`
- WhatsApp link → `https://wa.me/${getSetting("whatsapp")}?text=...`

### Update `src/components/catalog/ProductCard.tsx`
- WhatsApp link → `https://wa.me/${getSetting("whatsapp")}?text=...`

### Update `src/components/contact/ContactForm.tsx`
- Success message email → `getSetting("email")`

### Update `src/app/producto/[slug]/page.tsx`
- WhatsApp CTA → `https://wa.me/${getSetting("whatsapp")}?text=...`

## Part 4: Server-Side Settings Fetch

For pages that need settings at build/render time (SEO, metadata):

### Create `src/lib/server-settings.ts`

```typescript
// Server-side settings fetch with fallback
export async function getServerSettings(): Promise<Record<string, string>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 300 } // 5 min cache
    })
    if (!res.ok) throw new Error("Settings fetch failed")
    const json = await res.json()
    return json.data || {}
  } catch {
    return COMPANY_DEFAULTS
  }
}

export async function getServerSocialLinks(): Promise<SocialLink[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/social-links`, {
      next: { revalidate: 300 }
    })
    if (!res.ok) throw new Error("Social links fetch failed")
    const json = await res.json()
    return json.data || SOCIAL_DEFAULTS
  } catch {
    return SOCIAL_DEFAULTS
  }
}
```

### Update `src/app/layout.tsx` (Server Component)
Use `getServerSettings()` for metadata:
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings()
  return {
    title: `${settings.company_name} | ${settings.company_slogan}`,
    description: settings.company_description,
    openGraph: { ... },
    twitter: { ... },
  }
}
```

## Part 5: Settings Link in Office Sidebar

### Update `src/components/office/OfficeSidebar.tsx`
Add "Configuración" link at the bottom of the nav (after Testimonios):
- Icon: gear/cog SVG
- Link: `/office/configuracion`
- Only visible to ADMIN role

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file — split into multiple components
- Use `'use client'` for interactive components
- GSAP for scroll animations, Framer Motion for UI transitions
- Respect `prefers-reduced-motion`
- All text in Spanish
- Mobile-first responsive

## Files to Read First
- `src/components/Footer.tsx` — Hardcoded data to replace
- `src/components/contact/ContactCards.tsx` — Hardcoded social cards
- `src/components/contact/ContactMap.tsx` — Hardcoded coordinates
- `src/components/contact/ContactCTA.tsx` — Hardcoded WhatsApp
- `src/components/HeroSection.tsx` — Hardcoded badges
- `src/components/NavigationBar.tsx` — Hardcoded logo alt
- `src/app/layout.tsx` — Hardcoded metadata
- `src/app/checkout/page.tsx` — Hardcoded payment info
- `src/components/product/ProductCTA.tsx` — Hardcoded WhatsApp
- `src/components/catalog/ProductCard.tsx` — Hardcoded WhatsApp
- `src/components/office/OfficeSidebar.tsx` — Add settings link
- `src/app/office/layout.tsx` — Office layout reference
- `src/lib/defaults.ts` — Default fallback values (created by backend agent)

## Verification
After all changes:
1. `npm run build` — must pass
2. Visit `/office/configuracion` — settings page works
3. Edit a setting → save → frontend reflects change
4. Toggle social link active → appears/disappears on contact page
5. Kill API → frontend still works with defaults
6. All pages show dynamic data (no hardcoded values)
