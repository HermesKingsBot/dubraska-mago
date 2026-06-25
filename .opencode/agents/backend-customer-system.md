# Backend — Full E-Commerce Customer System

## Objective
Implement complete customer-facing e-commerce system: customer accounts with roles, shopping cart, wishlist, checkout flow with shipping details, payment proof upload, and order tracking.

## Current State
- `AdminUser` model exists for backoffice auth
- `Order`/`OrderItem` models exist but are admin-only
- Auth uses JWT in httpOnly cookies
- Login only checks `AdminUser` table
- No customer registration, cart, wishlist, or checkout

## What to Do

### 1. Update Prisma Schema (`prisma/schema.prisma`)

Add new models and update existing ones:

```prisma
// REPLACE AdminUser with a unified User model
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String
  password      String
  role          String   @default("CUSTOMER") // "ADMIN" | "CUSTOMER"
  phone         String?
  active        Boolean  @default(true)
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  addresses     Address[]
  orders        Order[]
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
  payments      Payment[]
}

model Address {
  id           String  @id @default(cuid())
  userId       String
  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  label        String  @default("Casa") // Casa, Trabajo, Otro
  fullName     String
  phone        String
  street       String
  city         String
  state        String
  zipCode      String?
  // Shipping carrier info
  carrier      String? // "Zoom", "MRW", "DHL", "FedEx", "Otro"
  officeCode   String? // Codigo de oficina Zoom/MRW
  reference    String? // Punto de referencia
  isDefault    Boolean @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  orders       Order[]
}

model CartItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@unique([userId, productId])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

model Payment {
  id              String   @id @default(cuid())
  orderId         String   @unique
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  amount          Float
  method          String   // "transferencia", "pago_movil", "zelle", "paypal", "efectivo"
  reference       String?  // Transaction reference number
  proofImageUrl   String?  // URL to uploaded payment screenshot
  status          String   @default("PENDING") // PENDING, APPROVED, REJECTED
  adminNote       String?  // Admin notes about the payment
  paidAt          DateTime?
  verifiedAt      DateTime?
  verifiedBy      String?  // Admin who verified
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// UPDATE Order model to support customer flow
model Order {
  id              String     @id @default(cuid())
  orderNumber     String     @unique
  status          String     @default("PENDING") // PENDING, PAYMENT_PENDING, PAYMENT_SUBMITTED, PAYMENT_APPROVED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  userId          String?
  user            User?      @relation(fields: [userId], references: [id])
  // Shipping address snapshot (copied from Address at checkout)
  shippingName    String
  shippingPhone   String
  shippingStreet  String
  shippingCity    String
  shippingState   String
  shippingZip     String?
  shippingCarrier String?
  shippingOffice  String?
  shippingRef     String?
  // Order totals
  subtotal        Float
  shippingCost    Float      @default(0)
  total           Float
  notes           String?
  items           OrderItem[]
  payment         Payment?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

**IMPORTANT**: Keep existing models (Category, Product, Testimonial, OrderItem, InventoryMovement) as-is. Remove old `AdminUser` model and replace with `User`. Update `Order` model fields.

### 2. Update Zod Schemas (`src/lib/schemas.ts`)

Add new schemas:

```typescript
// Customer registration
export const registerSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
})

// Address
export const addressSchema = z.object({
  label: z.string().default("Casa"),
  fullName: z.string().min(1, "Nombre requerido"),
  phone: z.string().min(1, "Teléfono requerido"),
  street: z.string().min(1, "Dirección requerida"),
  city: z.string().min(1, "Ciudad requerida"),
  state: z.string().min(1, "Estado requerido"),
  zipCode: z.string().optional(),
  carrier: z.string().optional(),
  officeCode: z.string().optional(),
  reference: z.string().optional(),
  isDefault: z.boolean().default(false),
})

// Cart
export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0), // 0 = remove
})

// Checkout
export const checkoutSchema = z.object({
  addressId: z.string().min(1),
  notes: z.string().optional(),
  shippingCarrier: z.string().min(1),
  shippingOffice: z.string().optional(),
  shippingCost: z.number().default(0),
})

// Payment
export const paymentSchema = z.object({
  orderId: z.string().min(1),
  method: z.enum(["transferencia", "pago_movil", "zelle", "paypal", "efectivo"]),
  reference: z.string().optional(),
  amount: z.number().positive(),
})
```

### 3. Update Auth (`src/lib/auth.ts`)

Update to work with unified `User` model:
- `verifyToken` → check `User` table instead of `AdminUser`
- Support both `ADMIN` and `CUSTOMER` roles
- Add `requireCustomer(request)` and `requireAdmin(request)` helpers

### 4. Create New API Routes

#### `src/app/api/auth/register/route.ts`
- POST: Create new customer account
- Validate with `registerSchema`
- Check if email already exists
- Hash password with bcrypt
- Create user with role "CUSTOMER"
- Return token + user (same format as login)

#### `src/app/api/auth/login/route.ts` (UPDATE)
- Check `User` table instead of `AdminUser`
- Support both ADMIN and CUSTOMER roles
- Return user with role field

#### `src/app/api/auth/me/route.ts` (UPDATE)
- Return user from `User` table

#### `src/app/api/cart/route.ts`
- GET: Get all cart items for logged-in user (with product details)
- POST: Add item to cart (or update quantity if exists)
- DELETE: Clear entire cart

#### `src/app/api/cart/[productId]/route.ts`
- PATCH: Update quantity (0 = remove)
- DELETE: Remove item from cart

#### `src/app/api/wishlist/route.ts`
- GET: Get all wishlist items for logged-in user (with product details)
- POST: Add item to wishlist `{ productId }`
- DELETE: Clear entire wishlist

#### `src/app/api/wishlist/[productId]/route.ts`
- DELETE: Remove item from wishlist
- GET: Check if product is in wishlist (returns { inWishlist: boolean })

#### `src/app/api/addresses/route.ts`
- GET: Get all addresses for logged-in user
- POST: Create new address

#### `src/app/api/addresses/[id]/route.ts`
- GET: Get single address
- PATCH: Update address
- DELETE: Remove address
- PATCH `/addresses/[id]/default` → set as default

#### `src/app/api/orders/route.ts` (UPDATE)
- GET: If customer, return only their orders. If admin, return all.
- POST: Create order from cart (checkout flow)
  - Get user's cart items
  - Validate stock availability
  - Calculate subtotal + shipping
  - Create order with shipping address snapshot
  - Clear cart after order creation
  - Return order with payment instructions

#### `src/app/api/orders/[id]/route.ts` (UPDATE)
- GET: Get order detail (customer can only see their own)
- PATCH: Admin can update status (add payment validation statuses)

#### `src/app/api/orders/[id]/pay/route.ts` (NEW)
- POST: Submit payment proof
  - Accept `{ method, reference, amount, proofImageUrl }`
  - Create Payment record
  - Update order status to "PAYMENT_SUBMITTED"

#### `src/app/api/payments/route.ts` (NEW)
- GET: Admin gets all payments (filter by status)
- Admin can list pending payments to verify

#### `src/app/api/payments/[id]/route.ts` (NEW)
- PATCH: Admin approves/rejects payment
  - `{ status: "APPROVED" | "REJECTED", adminNote? }`
  - If approved → order status → "PAYMENT_APPROVED"
  - If rejected → order status → "PAYMENT_PENDING" (customer must resubmit)

#### `src/app/api/account/route.ts` (NEW)
- GET: Get customer profile
- PATCH: Update profile (name, phone, email)

#### `src/app/api/account/password/route.ts` (NEW)
- PATCH: Change password (requires current password)

#### `src/app/api/seed/route.ts` (UPDATE)
- Update seed to use `User` model instead of `AdminUser`
- Keep admin user creation

### 5. Create `src/lib/cart-utils.ts`

Utility functions for cart operations:
- `calculateCartTotal(items)` → subtotal
- `validateStock(items)` → check all items have enough stock
- `generateOrderNumber()` → unique order number

### 6. Update `src/lib/api-client.ts`

Add client-side methods for:
- `register(data)`, `login(data)`, `getMe()`
- `getCart()`, `addToCart(productId, quantity)`, `updateCartItem(productId, quantity)`, `removeFromCart(productId)`, `clearCart()`
- `getWishlist()`, `addToWishlist(productId)`, `removeFromWishlist(productId)`, `isInWishlist(productId)`
- `getAddresses()`, `createAddress(data)`, `updateAddress(id, data)`, `deleteAddress(id)`
- `getOrders()`, `getOrder(id)`, `createOrder(data)`, `submitPayment(orderId, data)`
- `getPayments()`, `approvePayment(id, data)` (admin)

### 7. Create `src/context/CartContext.tsx`

Client-side context for cart state:
- `cartItems: CartItem[]`
- `addToCart(productId, quantity)`
- `removeFromCart(productId)`
- `updateQuantity(productId, quantity)`
- `clearCart()`
- `cartCount: number` (total items)
- `cartTotal: number`
- Persist to localStorage for guests, sync to API when logged in

### 8. Create `src/context/WishlistContext.tsx`

Client-side context for wishlist:
- `wishlistItems: WishlistItem[]`
- `addToWishlist(productId)`
- `removeFromWishlist(productId)`
- `isInWishlist(productId): boolean`
- `wishlistCount: number`
- Persist to localStorage for guests, sync to API when logged in

### 9. Create `src/context/AuthContext.tsx` (Customer Auth)

Separate from OfficeAuthContext:
- `user: { id, name, email, role, phone } | null`
- `login(email, password)`
- `register(data)`
- `logout()`
- `isAuthenticated`
- `isCustomer`
- Cookie-based (same pattern as office auth)

## Code Rules (MUST FOLLOW)
- NO semicolons
- Double quotes only
- NO comments
- `export default` at end of file
- 2-space indentation
- Max 200 lines per file
- Use Prisma types for type safety
- All routes that need auth must verify token from cookie

## Files to Read First
- `prisma/schema.prisma` — Current schema
- `src/lib/schemas.ts` — Current schemas
- `src/lib/auth.ts` — Current auth
- `src/lib/api.ts` — API helpers
- `src/lib/db.ts` — Prisma client
- `src/app/api/auth/login/route.ts` — Current login
- `src/app/api/orders/route.ts` — Current orders
- `src/lib/api-client.ts` — Current API client
- `src/context/OfficeAuthContext.tsx` — Reference for auth pattern

## Verification
After all changes:
1. Run `npx prisma migrate dev --name customer_system` — must succeed
2. Run `npx prisma generate` — must succeed
3. Run `npm run build` — must pass
4. Test register: `curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"123456"}'`
5. Test login: `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"123456"}'`
