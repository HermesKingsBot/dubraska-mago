# Backend — Company Settings & Configuration System

## Objective
Create a complete company settings system so admins can manage all company data from the backoffice. The frontend will consume this data from the API instead of hardcoded values.

## What to Do

### 1. Add Setting Model to Prisma Schema (`prisma/schema.prisma`)

Add these models at the end:

```prisma
model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  group     String   @default("general") // general, social, contact, payment, shipping
  label     String?
  type      String   @default("text") // text, textarea, email, url, phone, toggle, image, select
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SocialLink {
  id        String   @id @default(cuid())
  platform  String   // Instagram, Facebook, WhatsApp, TikTok, Twitter/X, YouTube, Pinterest, LinkedIn
  url       String
  handle    String?  // @dubraska.mago, +58 412 XXX XXXX
  active    Boolean  @default(true)
  order     Int      @default(0)
  icon      String?  // SVG path or icon identifier
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Create Migration
```bash
npx prisma migrate dev --name company_settings
npx prisma generate
```

### 3. Update Seed (`src/app/api/seed/route.ts`)

Add default settings and social links:

```typescript
// Default company settings
const defaultSettings = [
  // General
  { key: "company_name", value: "Dubraska Mago", group: "general", label: "Nombre de la empresa", type: "text", order: 0 },
  { key: "company_slogan", value: "Joyería de Lujo en Acero y Oro 18K", group: "general", label: "Slogan", type: "text", order: 1 },
  { key: "company_description", value: "Piezas mínimas, atemporales y hechas para tu día a día.", group: "general", label: "Descripción corta", type: "textarea", order: 2 },
  { key: "logo_url", value: "", group: "general", label: "Logo URL", type: "image", order: 3 },
  { key: "favicon_url", value: "", group: "general", label: "Favicon URL", type: "image", order: 4 },
  
  // Contact
  { key: "email", value: "hola@dubraskamago.com", group: "contact", label: "Email de contacto", type: "email", order: 0 },
  { key: "phone", value: "+58 412 000 0000", group: "contact", label: "Teléfono", type: "phone", order: 1 },
  { key: "whatsapp", value: "584120000000", group: "contact", label: "WhatsApp (solo números)", type: "phone", order: 2 },
  { key: "address", value: "Mercado La Isla, Local 251", group: "contact", label: "Dirección física", type: "textarea", order: 3 },
  { key: "city", value: "Caracas", group: "contact", label: "Ciudad", type: "text", order: 4 },
  { key: "state", value: "Distrito Capital", group: "contact", label: "Estado", type: "text", order: 5 },
  { key: "country", value: "Venezuela", group: "contact", label: "País", type: "text", order: 6 },
  { key: "map_lat", value: "10.5061", group: "contact", label: "Latitud (mapa)", type: "text", order: 7 },
  { key: "map_lng", value: "-66.9134", group: "contact", label: "Longitud (mapa)", type: "text", order: 8 },
  { key: "schedule", value: "Lunes a Viernes: 9am - 5pm / Sábados: 9am - 2pm", group: "contact", label: "Horario de atención", type: "textarea", order: 9 },
  
  // Social
  { key: "instagram_url", value: "https://instagram.com/dubraska.mago", group: "social", label: "Instagram URL", type: "url", order: 0 },
  { key: "facebook_url", value: "https://facebook.com/dubraskamago", group: "social", label: "Facebook URL", type: "url", order: 1 },
  { key: "tiktok_url", value: "https://tiktok.com/@dubraskamago", group: "social", label: "TikTok URL", type: "url", order: 2 },
  { key: "twitter_url", value: "", group: "social", label: "Twitter/X URL", type: "url", order: 3 },
  { key: "youtube_url", value: "", group: "social", label: "YouTube URL", type: "url", order: 4 },
  { key: "pinterest_url", value: "", group: "social", label: "Pinterest URL", type: "url", order: 5 },
  
  // Payment info
  { key: "bank_name", value: "Banco Mercantil", group: "payment", label: "Nombre del banco", type: "text", order: 0 },
  { key: "bank_account", value: "0105-XXXX-XX-XXXXXXXXXX", group: "payment", label: "Número de cuenta", type: "text", order: 1 },
  { key: "bank_holder", value: "Dubraska Mago CA", group: "payment", label: "Titular de la cuenta", type: "text", order: 2 },
  { key: "bank_rif", value: "J-XXXXXXX-X", group: "payment", label: "RIF", type: "text", order: 3 },
  { key: "pago_movil_phone", value: "04120000000", group: "payment", label: "Pago Móvil (teléfono)", type: "phone", order: 4 },
  { key: "pago_movil_bank", value: "Banesco", group: "payment", label: "Pago Móvil (banco)", type: "select", order: 5 },
  { key: "pago_movil_ci", value: "V-XXXXXXXX", group: "payment", label: "Pago Móvil (CI)", type: "text", order: 6 },
  { key: "zelle_email", value: "", group: "payment", label: "Zelle (email)", type: "email", order: 7 },
  { key: "paypal_email", value: "", group: "payment", label: "PayPal (email)", type: "email", order: 8 },
  
  // Shipping
  { key: "shipping_enabled", value: "true", group: "shipping", label: "Mostrar envíos", type: "toggle", order: 0 },
  { key: "shipping_info", value: "Envíos a toda Venezuela a través de Zoom, MRW y DHL", group: "shipping", label: "Información de envíos", type: "textarea", order: 1 },
  { key: "cashea_enabled", value: "true", group: "shipping", label: "Mostrar Cashea", type: "toggle", order: 2 },
  
  // Features
  { key: "cashea_info", value: "Aceptamos pagos flexibles con Cashea", group: "features", label: "Info Cashea", type: "textarea", order: 0 },
  { key: "free_shipping_above", value: "50", group: "features", label: "Envío gratis sobre (USD)", type: "text", order: 1 },
  { key: "return_days", value: "7", group: "features", label: "Días para devolución", type: "text", order: 2 },
]

// Default social links
const defaultSocialLinks = [
  { platform: "Instagram", url: "https://instagram.com/dubraska.mago", handle: "@dubraska.mago", active: true, order: 0 },
  { platform: "Facebook", url: "https://facebook.com/dubraskamago", handle: "Dubraska Mago", active: true, order: 1 },
  { platform: "WhatsApp", url: "https://wa.me/584120000000", handle: "+58 412 000 0000", active: true, order: 2 },
  { platform: "TikTok", url: "https://tiktok.com/@dubraskamago", handle: "@dubraskamago", active: false, order: 3 },
]
```

### 4. Create Settings API Routes

#### `src/app/api/settings/route.ts`
- `GET /api/settings` — Public route, returns all settings keyed by `key`
  - Return format: `{ success: true, data: { company_name: "...", email: "...", ... } }`
- `GET /api/settings?group=contact`  — Filter by group
- `POST /api/settings` — Admin only, bulk update
  - Body: `{ settings: [{ key, value }] }`
  - Upsert each setting

#### `src/app/api/settings/[key]/route.ts`
- `PATCH` — Admin only, update single setting

### 5. Create Social Links API Routes

#### `src/app/api/social-links/route.ts`
- `GET /api/social-links` — Public, returns `?active=true` by default (only active for frontend)
- `GET /api/social-links?all=true` — Admin, returns all
- `POST /api/social-links` — Admin only, create new
- `PATCH /api/social-links/reorder` — Admin, bulk reorder

#### `src/app/api/social-links/[id]/route.ts`
- `GET` — Public, get single
- `PATCH` — Admin, update `{ platform, url, handle, active, order }`
- `DELETE` — Admin, remove

### 6. Create `src/lib/settings.ts`

Helper functions:
```typescript
// Get a single setting with fallback
export async function getSetting(key: string, fallback = ""): Promise<string>

// Get all settings as a typed object
export async function getAllSettings(): Promise<Record<string, string>>

// Get settings grouped
export async function getSettingsByGroup(group: string): Promise<Array<{ key, value, label }>>

// Get active social links
export async function getActiveSocialLinks(): Promise<SocialLink[]>

// Get all social links (admin)
export async function getAllSocialLinks(): Promise<SocialLink[]>

// In-memory cache (simple, 5 min TTL)
let cachedSettings: { data: Record<string, string>, expiry: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

export async function getCachedSettings(): Promise<Record<string, string>>
export function clearSettingsCache(): void
```

### 7. Add to `src/lib/schemas.ts`

```typescript
export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
})

export const bulkUpdateSettingsSchema = z.object({
  settings: z.array(updateSettingSchema).min(1),
})

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("URL inválida"),
  handle: z.string().optional(),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
})

export const updateSocialLinkSchema = socialLinkSchema.partial()
```

### 8. Create Default Settings Fallback (`src/lib/defaults.ts`)

Export a fallback object so the frontend NEVER breaks even if API is down:

```typescript
export const COMPANY_DEFAULTS = {
  company_name: "Dubraska Mago",
  company_slogan: "Joyería de Lujo en Acero y Oro 18K",
  company_description: "Piezas mínimas, atemporales y hechas para tu día a día.",
  email: "hola@dubraskamago.com",
  phone: "+58 412 000 0000",
  whatsapp: "584120000000",
  address: "Mercado La Isla, Local 251",
  city: "Caracas",
  state: "Distrito Capital",
  country: "Venezuela",
  schedule: "Lunes a Viernes: 9am - 5pm",
  map_lat: "10.5061",
  map_lng: "-66.9134",
  instagram_url: "https://instagram.com/dubraska.mago",
  facebook_url: "https://facebook.com/dubraskamago",
  tiktok_url: "",
  twitter_url: "",
  youtube_url: "",
  pinterest_url: "",
  bank_name: "Banco Mercantil",
  bank_account: "",
  bank_holder: "Dubraska Mago CA",
  bank_rif: "",
  pago_movil_phone: "",
  pago_movil_bank: "",
  pago_movil_ci: "",
  zelle_email: "",
  paypal_email: "",
  shipping_enabled: "true",
  shipping_info: "Envíos a toda Venezuela",
  cashea_enabled: "true",
  cashea_info: "Aceptamos pagos flexibles con Cashea",
  free_shipping_above: "50",
  return_days: "7",
}

export const SOCIAL_DEFAULTS: Array<{
  platform: string
  url: string
  handle: string
  active: boolean
}> = [
  { platform: "Instagram", url: "https://instagram.com/dubraska.mago", handle: "@dubraska.mago", active: true },
  { platform: "WhatsApp", url: "https://wa.me/584120000000", handle: "+58 412 000 0000", active: true },
  { platform: "Facebook", url: "https://facebook.com/dubraskamago", handle: "Dubraska Mago", active: true },
]
```

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file
- All settings routes that modify data require admin auth
- GET routes are public (frontend consumes them)

## Files to Read First
- `prisma/schema.prisma`
- `src/lib/schemas.ts`
- `src/lib/api.ts`
- `src/app/api/seed/route.ts`
- `src/lib/auth.ts`

## Verification
1. `npx prisma migrate dev --name company_settings` — success
2. `npx prisma generate` — success
3. `npm run build` — success
4. `curl http://localhost:3000/api/settings` — returns settings key-value map
5. `curl http://localhost:3000/api/social-links` — returns active social links
