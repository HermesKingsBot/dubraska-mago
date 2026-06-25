## Step 8: Auth Middleware (`src/lib/auth.ts`)

```typescript
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dubraska-secret-key-change-in-production"

interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const token = authHeader.split(" ")[1]
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function requireAuth(request: NextRequest): JwtPayload {
  const user = verifyToken(request)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
```

## Step 9: Environment File (`.env`)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="dubraska-secret-change-this-in-production"
```

## Step 10: Update `.gitignore`

Add:
```
prisma/dev.db
prisma/dev.db-journal
*.db
```

## Step 11: Seed Script (`src/scripts/seed.ts`)

For running `npx ts-node src/scripts/seed.ts` to populate the database.

## Step 12: Verification

After all files are created:

1. Run: `npx prisma migrate dev --name init`
2. Run: `npx prisma generate`
3. Run: `npm run build`
4. If build passes, the backend is ready

## File Structure Summary

```
src/
├── app/api/
│   ├── products/route.ts
│   ├── products/[id]/route.ts
│   ├── categories/route.ts
│   ├── categories/[id]/route.ts
│   ├── testimonials/route.ts
│   ├── testimonials/[id]/route.ts
│   ├── orders/route.ts
│   ├── orders/[id]/route.ts
│   ├── inventory/route.ts
│   ├── inventory/adjust/route.ts
│   ├── auth/login/route.ts
│   ├── auth/me/route.ts
│   ├── auth/logout/route.ts
│   └── seed/route.ts
├── lib/
│   ├── db.ts
│   ├── api.ts
│   ├── schemas.ts
│   └── auth.ts
├── types/
│   └── index.ts
prisma/
├── schema.prisma
└── migrations/
.env
```
