# TASK: Dubraska Mago — Full Backend Implementation

Build the complete backend for the Dubraska Mago jewelry e-commerce site using Next.js API Routes + Prisma ORM with SQLite.

## Working Directory
`/opt/data/projects/dubraska-mago/`

## Code Rules (MUST FOLLOW)
- NO semicolons (except for-loop headers, type annotations, CSS-in-JS)
- Double quotes ONLY
- NO comments in code
- `export default ModuleName` at end
- 2-space indentation
- Function components with `React.JSX.Element`
- `var(--color-*)` or OKLCH for colors

## Architecture Decision: API Routes vs Server Actions

Use BOTH approaches based on the use case:

### Use Next.js API Routes (`/src/app/api/*/route.ts`) when:
- External clients need to consume the data (mobile apps, third-party)
- Webhooks from payment providers
- Public product listing for SEO/rendering
- Any endpoint that should be accessible without authentication context

### Use Server Actions (`use server` in action files) when:
- Forms that mutate data from client components
- Operations that need auth context from the session
- Admin operations (create/update/delete products, inventory adjustments)
- Operations that redirect after completion

## Tech Stack
- **Runtime**: Next.js 16 API Routes (App Router)
- **ORM**: Prisma ORM
- **Database**: SQLite (file: `./dev.db`)
- **Validation**: Zod schemas
- **Auth**: JWT (jsonwebtoken) + bcrypt for admin routes
- **File Upload**: multer + sharp for image processing

## Step 1: Initialize Project

```bash
cd /opt/data/projects/dubraska-mago
npm install prisma @prisma/client jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs @types/multer
npx prisma init --datasource-provider sqlite
```

## Step 2: Configure Prisma Schema

Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  price       Float
  oldPrice    Float?
  material    String
  length      String?
  diameter    String?
  weight      String?
  color       String
  badge       String?
  image       String
  gallery     String   @default("[]")
  inStock     Boolean  @default(true)
  featured    Boolean  @default(false)
  stock       Int      @default(0)
  lowStock    Int      @default(5)
  sku         String   @unique
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([slug])
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  active      Boolean  @default(true)
  order       Int      @default(0)
  products    Product[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  text      String   @db.Text
  rating    Int
  productId String?
  date      DateTime
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id            String        @id @default(cuid())
  orderNumber   String        @unique
  status        String        @default("PENDING")
  customerName  String
  customerEmail String
  customerPhone String?
  total         Float
  notes         String?       @db.Text
  items         OrderItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

model InventoryMovement {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  type      String
  quantity  Int
  reason    String?
  reference String?
  createdAt DateTime @default(now())
  createdBy String?
}

model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("ADMIN")
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Run: `npx prisma migrate dev --name init` then `npx prisma generate`
