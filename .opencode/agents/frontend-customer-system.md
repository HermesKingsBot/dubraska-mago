# Frontend — Full Customer E-Commerce Experience

## Objective
Build the complete customer-facing UI for: registration/login, shopping cart, wishlist, checkout flow, payment submission, and order tracking. Plus admin order/payment management.

## Design System
- Dark Luxury: `var(--color-bg)`, `var(--color-gold)`, `var(--color-muted)`, `var(--color-white)`, `var(--color-rose)`, `var(--color-dark-card)`, `var(--color-dark-accent)`
- Fonts: `var(--font-instrument-serif)` headings, `var(--font-inter)` body
- Animations: Framer Motion for page transitions/micro, GSAP for scroll
- Pattern: `function Component(): React.JSX.Element`, `export default` at end
- NO semicolons, double quotes, NO comments, 2-space indent, max 200 lines/file

## What to Build

### 1. Customer Auth Pages

#### `src/app/(auth)/login/page.tsx`
- Login form (email + password)
- Link to register page
- Link to "olvide mi contraseña" (placeholder)
- On success: redirect to `/cuenta` or intended page
- Premium dark design with gold accents
- Error messages in Spanish

#### `src/app/(auth)/register/page.tsx`
- Registration form (name, email, password, confirm password, phone optional)
- Terms checkbox
- On success: auto-login and redirect to `/cuenta`
- Link to login page

**Create `src/app/(auth)/layout.tsx`** — Auth layout (NO NavigationBar/Footer, centered form, dark bg, gold ornament)

### 2. Customer Account Area

#### `src/app/cuenta/page.tsx` — Account Dashboard
- Welcome message with user name
- Quick links: Mis Pedidos, Mi Wishlist, Direcciones, Configuración
- Recent orders preview
- Logout button

#### `src/app/cuenta/layout.tsx` — Account Layout
- Has NavigationBar + Footer (public layout)
- Sidebar or tabs for account sections
- Auth guard: redirect to `/login` if not authenticated

#### `src/app/cuenta/pedidos/page.tsx` — Order History
- List of all user orders with status badges
- Filter by status
- Click to see order detail

#### `src/app/cuenta/pedidos/[orderNumber]/page.tsx` — Order Detail
- Order info (number, date, status timeline)
- Items list with product images
- Shipping address
- Payment status + proof
- If PAYMENT_PENDING: show "Subir comprobante" button
- If PAYMENT_SUBMITTED: show "Esperando verificación del admin"
- Status timeline visual (pending → submitted → approved → shipped → delivered)

#### `src/app/cuenta/wishlist/page.tsx` — Wishlist
- Grid of wishlisted products
- "Agregar al carrito" button on each
- "Eliminar" button (heart icon)
- Empty state with CTA to catalog

#### `src/app/cuenta/direcciones/page.tsx` — Address Book
- List of saved addresses
- Add new address form
- Edit/delete addresses
- Set default address
- Fields: label, fullName, phone, street, city, state, zipCode, carrier (Zoom/MRW/DHL), officeCode, reference

#### `src/app/cuenta/configuracion/page.tsx` — Account Settings
- Edit profile (name, email, phone)
- Change password form

### 3. Shopping Cart

#### `src/app/carrito/page.tsx` — Cart Page
- List of cart items with image, name, price, quantity controls (+/-)
- Remove item button
- Subtotal calculation
- "Continuar al checkout" button
- Empty state with CTA to catalog
- "Seguir comprando" link

#### Create `src/components/cart/CartItem.tsx`
- Product image, name, price
- Quantity stepper (+/-)
- Remove button
- Line total

#### Create `src/components/cart/CartSummary.tsx`
- Subtotal, shipping estimate, total
- "Proceder al checkout" button
- Trust badges (secure payment, etc.)

#### Create `src/components/cart/CartDrawer.tsx` (slide-out cart)
- Mini cart that slides from right
- Shows cart items summary
- "Ver carrito" and "Checkout" buttons
- Triggered by cart icon in NavigationBar

### 4. Wishlist UI

#### Update `src/components/catalog/ProductCard.tsx`
- Add heart icon button (top-right corner)
- Filled heart if in wishlist, outline if not
- Toggle on click (add/remove from wishlist)
- Animation on toggle (scale pulse)
- If not logged in: clicking heart redirects to `/login`

#### Create `src/components/wishlist/HeartButton.tsx`
- Reusable heart toggle button
- Props: `productId`, `size`, `className`
- Animated toggle with Framer Motion
- Shows tooltip "Agregar a favoritos" / "Quitar de favoritos"

### 5. Checkout Flow (Multi-Step)

#### `src/app/checkout/page.tsx` — Checkout Orchestrator
Multi-step form with progress indicator:

**Step 1: Cart Review**
- Review items, quantities, totals
- Edit quantities or remove items
- "Continuar" button

**Step 2: Shipping Address**
- Select saved address OR add new
- Address form: fullName, phone, street, city, state, zipCode
- Shipping carrier dropdown: Zoom, MRW, DHL, FedEx, Otro
- If Zoom/MRW: show office code input
- Reference point input
- Shipping cost display

**Step 3: Payment Method**
- Select method: Transferencia, Pago Móvil, Zelle, PayPal, Efectivo
- Show payment instructions based on method:
  - Transferencia: bank account details
  - Pago Móvil: phone + CI
  - Zelle: email
  - PayPal: email
  - Efectivo: instructions
- Order summary (items + shipping + total)

**Step 4: Confirmation**
- Order created successfully
- Show order number
- "Subir comprobante de pago" button
- Link to order detail page

#### Create `src/components/checkout/CheckoutProgress.tsx`
- Step indicator (4 steps with icons)
- Current step highlighted in gold
- Completed steps with checkmark

#### Create `src/components/checkout/AddressForm.tsx`
- All address fields
- Carrier selection with conditional office code field
- Validation with error messages

#### Create `src/components/checkout/PaymentMethodSelector.tsx`
- Radio/card selection of payment method
- Shows relevant instructions per method
- Bank details stored in env/config

#### Create `src/components/checkout/OrderSummary.tsx`
- Compact order review (items, shipping, total)
- Read-only during checkout

### 6. Payment Upload

#### `src/app/cuenta/pedidos/[orderNumber]/pago/page.tsx` — Payment Upload Page
- Upload payment screenshot (file input with preview)
- Select payment method
- Enter reference number
- Enter amount paid
- Submit button
- Instructions based on selected method
- After submit: redirect to order detail with success message

#### Create `src/components/payment/PaymentUpload.tsx`
- File upload with drag-and-drop
- Image preview
- Method selector
- Reference input
- Amount input
- Submit with loading state

### 7. NavigationBar Updates

#### Update `src/components/NavigationBar.tsx`
- Add cart icon with badge (item count)
- Add heart icon with badge (wishlist count) — links to /cuenta/wishlist
- Add user avatar/icon when logged in → dropdown with:
  - Mi Cuenta
  - Mis Pedidos
  - Mi Wishlist
  - Cerrar Sesión
- When not logged in: "Iniciar Sesión" button
- Mobile responsive

### 8. Admin Order Management (Office)

#### Update `src/app/office/dashboard/page.tsx`
- Add recent orders widget
- Stats: pending payments, orders to ship, revenue

#### Create `src/app/office/pedidos/page.tsx` — Admin Order Management
- List all orders with filters (status, date, search)
- Click to see order detail
- Update order status
- View payment proof
- Approve/reject payment

#### Create `src/app/office/pedidos/[id]/page.tsx` — Admin Order Detail
- Full order info
- Customer details
- Items list
- Shipping address
- Payment proof (image viewer)
- Payment approval buttons (Approve/Reject)
- Status update dropdown
- Add tracking number

#### Create `src/components/office/PaymentVerification.tsx`
- View payment proof image
- Payment details (method, reference, amount)
- Approve/Reject buttons
- Admin note textarea
- Confirmation dialog

### 9. Context Providers

#### Create `src/context/CartContext.tsx`
- Cart state management
- Persist to localStorage for guests
- Sync to API when logged in
- Methods: addItem, removeItem, updateQuantity, clearCart
- Computed: cartCount, cartTotal

#### Create `src/context/WishlistContext.tsx`
- Wishlist state management
- Persist to localStorage for guests
- Sync to API when logged in
- Methods: toggleWishlist, isInWishlist
- Computed: wishlistCount

#### Create `src/context/CustomerAuthContext.tsx`
- Customer authentication state
- Methods: login, register, logout, updateProfile
- Persist session via cookie (same pattern as OfficeAuthContext)
- On mount: call /api/auth/me to restore session

### 10. Protected Routes

#### Create `src/components/auth/CustomerAuthGuard.tsx`
- Wraps customer pages
- Redirects to /login if not authenticated
- Shows loading state while checking auth

## New Routes Summary
```
/(auth)/login
/(auth)/register
/cuenta
/cuenta/pedidos
/cuenta/pedidos/[orderNumber]
/cuenta/pedidos/[orderNumber]/pago
/cuenta/wishlist
/cuenta/direcciones
/cuenta/configuracion
/carrito
/checkout
/office/pedidos
/office/pedidos/[id]
```

## Code Rules (MUST FOLLOW)
- NO semicolons, double quotes, NO comments, export default at end, 2-space indent
- Max 200 lines per file — split into multiple components
- Use `'use client'` for interactive components
- GSAP for scroll animations, Framer Motion for UI transitions
- Respect `prefers-reduced-motion`
- All text in Spanish
- Mobile-first responsive

## Files to Read First
- `src/context/OfficeAuthContext.tsx` — Auth pattern reference
- `src/components/NavigationBar.tsx` — Current nav (needs cart/wishlist icons)
- `src/components/catalog/ProductCard.tsx` — Needs heart button
- `src/lib/api-client.ts` — Current API client (needs new methods)
- `src/app/colecciones/CatalogClient.tsx` — Reference for product grid
- `src/app/office/layout.tsx` — Office layout reference
- `src/types/product.ts` — Product types
- `src/types/index.ts` — Global types

## Verification
After all changes:
1. Run `npm run build` — must pass
2. Test full flow: register → login → add to cart → checkout → payment upload
3. Test admin: view orders → approve payment → update status
4. Test wishlist: add/remove → add to cart from wishlist
5. Test mobile: all pages responsive
