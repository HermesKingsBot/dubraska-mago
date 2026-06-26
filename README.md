# Dubraska Mago — E-Commerce de Joyería Premium

> **Sitio web en producción**: [dubraska-mago.vercel.app](https://dubraska-mago.vercel.app)

Dubraska Mago es una tienda online de joyería premium construida con Next.js 16, TypeScript y Tailwind CSS 4. El proyecto incluye tanto el frontend público como un panel de administración completo (backoffice) para gestionar productos, pedidos, inventario, clientes y más.

---

## Tabla de Contenido

- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Páginas Públicas](#páginas-públicas)
- [Panel de Administración](#panel-de-administración)
- [Base de Datos](#base-de-datos)
- [Instalación y Desarrollo](#instalación-y-desarrollo)
- [API REST](#api-rest)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Arquitectura](#arquitectura)
- [Convenciones de Código](#convenciones-de-código)
- [Licencia](#licencia)

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript (strict mode) |
| **Estilos** | Tailwind CSS 4 (CSS-first config) |
| **Animaciones** | GSAP + Framer Motion |
| **Base de Datos** | SQLite (Prisma ORM 6) |
| **Autenticación** | JWT (cookie httpOnly) |
| **Validación** | Zod |
| **Mapas** | Leaflet + React-Leaflet |
| **Iconos** | Lucide React |
| **Hojas de cálculo** | SheetJS (xlsx) |
| **Testing** | Vitest + React Testing Library + Playwright |
| **CI/CD** | Vercel (deploy automático) |

---

## Características

### Frontend Público

| Sección | Descripción |
|---------|-------------|
| **Inicio** | Hero con video, producto destacados, categorías, guía de colores, testimonios |
| **Catálogo** | Filtros por categoría/color/precio, búsqueda, ordenamiento, cambio de layout (4/2/1 columnas), paginación |
| **Detalle de Producto** | Galería con zoom, variantes (color/talla), precio dinámico, CTA WhatsApp, reseñas, cuidados |
| **Comparador** | Comparación lado a lado de hasta 4 productos |
| **Contacto** | Tarjetas de redes sociales, formulario, mapa Leaflet, CTA animado |
| **Nosotros** | Historia, misión, proceso, estadísticas animadas |
| **FAQ** | 10 preguntas frecuentes con acordeón, búsqueda, botones de copiar |
| **Políticas** | Cambios, devoluciones, envío, higiene |
| **Carrito** | Carrito de compras persistente (localStorage + API sync) |
| **Checkout** | Multi-paso: revisión → dirección → pago → confirmación |
| **Cuenta Cliente** | Registro, login, historial de pedidos, wishlist, direcciones, perfil |
| **SEO** | robots.txt, sitemap.xml, Open Graph dinámico, JSON-LD estructurado, manifest PWA |

### Backoffice (Admin)

| Módulo | Funcionalidad |
|--------|---------------|
| **Dashboard** | Estadísticas, accesos rápidos |
| **Productos** | CRUD completo, variantes (color/talla/material), export/import CSV+Excel |
| **Categorías** | CRUD, activar/desactivar, ordenamiento |
| **Testimonios** | CRUD, aprobar/rechazar, activar |
| **Inventario** | Ajustes stock, historial de movimientos |
| **Pedidos** | Listado, detalle, verificación de pagos |
| **Auditoría** | Log de todas las acciones admin, filtros, detalle con diff |
| **Papelera** | Elementos eliminados (soft delete), restaurar o eliminar permanentemente |
| **Configuración** | Datos empresa, redes sociales, enlaces, contacto |
| **Export/Import** | Exportar/importar CSV+Excel para productos, categorías, testimonios, inventario |
| **Plantillas** | Descargar plantilla vacía o con datos de ejemplo para importación masiva |

### Seguridad

- Autenticación JWT en cookies httpOnly (SameSite=Lax, Secure en producción)
- Autenticación de dos niveles: admin (backoffice) y cliente (frontend)
- Validación Zod en TODAS las rutas API
- Soft delete en todos los modelos (nada se elimina físicamente)
- Auditoría completa de todas las acciones administrativas
- Rate limiting en endpoints críticos
- Protección CSRF

---

## Estructura del Proyecto

```
dubraska-mago/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Rutas de autenticación (login, register)
│   │   ├── api/                      # API REST (30+ endpoints)
│   │   │   ├── admin/                # Admin APIs (export, import, audit, settings)
│   │   │   ├── auth/                 # Customer auth (login, register, me)
│   │   │   ├── customer/             # Customer APIs (cart, orders, wishlist)
│   │   │   ├── products/             # Products + variants CRUD
│   │   │   ├── reviews/              # Reviews moderation
│   │   │   ├── inventory/            # Inventory management
│   │   │   ├── orders/               # Orders management
│   │   │   ├── settings/             # Company settings
│   │   │   └── ...                   # Más rutas
│   │   ├── office/                   # Backoffice pages
│   │   │   ├── productos/            # Product management
│   │   │   ├── categorias/           # Category management
│   │   │   ├── inventario/          # Inventory management
│   │   │   ├── pedidos/              # Order management
│   │   │   ├── auditoria/            # Audit log viewer
│   │   │   ├── papelera/             # Trash (soft-deleted items)
│   │   │   └── configuracion/        # Company settings
│   │   ├── producto/[slug]/          # Product detail page
│   │   ├── colecciones/              # Catalog page
│   │   ├── carrito/                  # Cart page
│   │   ├── checkout/                 # Checkout flow
│   │   ├── contacto/                 # Contact page
│   │   ├── nosotros/                 # About page
│   │   ├── comparar/                 # Product comparison
│   │   ├── preguntas-frecuentes/     # FAQ page
│   │   ├── politicas-cambios-devoluciones/  # Policies
│   │   ├── cuenta/                   # Customer account dashboard
│   │   ├── globals.css               # Tailwind CSS 4 + theme
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # React components
│   │   ├── office/                   # Backoffice components (31 files)
│   │   ├── product/                  # Product detail components (12 files)
│   │   ├── catalog/                  # Catalog components (11 files)
│   │   ├── cart/                     # Cart components
│   │   ├── checkout/                 # Checkout components
│   │   ├── compare/                  # Comparison components
│   │   ├── contact/                  # Contact components
│   │   ├── faq/                      # FAQ components
│   │   ├── nosotros/                 # About components
│   │   ├── politicas/                # Policy components
│   │   └── ...                       # Shared components
│   ├── context/                      # React contexts (auth, cart, settings, etc.)
│   ├── hooks/                        # Custom hooks (useProducts, useVariants, etc.)
│   ├── lib/                          # Utilities (API client, auth, schemas, etc.)
│   └── types/                        # TypeScript type definitions
├── prisma/
│   ├── schema.prisma                 # Database schema (18 modelos)
│   ├── dev.db                        # SQLite database
│   └── migrations/                   # 5 migrations
├── data/                             # Seed data (products, testimonials)
├── e2e/                              # Playwright E2E tests (9 files)
├── public/                           # Static assets
├── src/test/                         # Vitest unit tests (131 tests)
├── run-frontend.sh                   # Frontend agent launcher
├── run-backend.sh                    # Backend agent launcher
├── vercel.json                       # Vercel configuration
├── tsconfig.json                     # TypeScript config
├── vitest.config.ts                  # Vitest config
└── package.json
```

---

## Páginas Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — Hero, destacados, categorías, testimonios |
| `/colecciones` | Catálogo completo con filtros y búsqueda |
| `/producto/[slug]` | Detalle de producto con variantes, reseñas, galería |
| `/comparar` | Comparador de productos (2-4 items) |
| `/contacto` | Contacto, redes sociales, mapa, CTA |
| `/nosotros` | Historia de la marca, misión, proceso |
| `/preguntas-frecuentes` | FAQ con búsqueda y acordeón |
| `/politicas-cambios-devoluciones` | Políticas de envío, devoluciones, higiene |
| `/carrito` | Carrito de compras |
| `/checkout` | Proceso de compra (4 pasos) |
| `/login` / `/register` | Autenticación de clientes |
| `/cuenta` | Dashboard del cliente (pedidos, wishlist, direcciones) |

---

## Panel de Administración

> **Acceso**: `/office` — Requiere credenciales de administrador

| Ruta | Funcionalidad |
|------|---------------|
| `/office/dashboard` | Estadísticas y accesos rápidos |
| `/office/productos` | CRUD productos + variantes + export/import |
| `/office/categorias` | CRUD categorías + export/import |
| `/office/testimonios` | CRUD testimonios + aprobar + export/import |
| `/office/inventario` | Ajustes stock + movimientos + export/import |
| `/office/pedidos` | Gestión pedidos + verificación pagos |
| `/office/auditoría` | Logs de auditoría con filtros y detalle |
| `/office/papelera` | Papelera (soft delete) + restaurar/eliminar |
| `/office/configuración` | Datos empresa, redes sociales, contacto |

---

## Base de Datos

### Modelos Prisma (18 total)

| Modelo | Descripción |
|--------|-------------|
| `User` | Usuarios (admin + customer) |
| `Product` | Productos con soporte para variantes |
| `ProductVariant` | Variantes de producto (color, talla, material, stock, precio) |
| `Category` | Categorías de productos |
| `Testimonial` | Testimonios de clientes |
| `Review` | Reseñas de productos (con moderación) |
| `Order` | Pedidos |
| `OrderItem` | Items de pedido (referencia a variante) |
| `InventoryMovement` | Movimientos de inventario |
| `Address` | Direcciones de clientes |
| `CartItem` | Items del carrito |
| `WishlistItem` | Lista de deseos |
| `Payment` | Pagos (con verificación manual) |
| `ProductComparison` | Comparaciones guardadas |
| `Setting` | Configuración de la empresa |
| `SocialLink` | Enlaces a redes sociales |
| `ActivityLog` | Log de auditoría |
| `CustomerAuth` | Autenticación de clientes |

### Migraciones

1. `customer_system` — Sistema de cuentas de cliente
2. `company_settings` — Configuración de empresa y redes sociales
3. `product_enhancements` — Mejoras de producto (tallas, reseñas, ofertas)
4. `audit_soft_delete` — Sistema de auditoría y borrado lógico
5. `product_variants` — Sistema de variantes de producto

---

## Instalación y Desarrollo

### Requisitos

- Node.js 18+
- npm o pnpm

### Setup

```bash
# Clonar repositorio
git clone https://github.com/HermesKingsBot/dubraska-mago.git
cd dubraska-mago

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Inicializar base de datos
npx prisma migrate dev
npx prisma generate
npm run seed

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# JWT Secret (admin)
JWT_SECRET="tu-secret-seguro"

# Public API
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Vercel (solo para deploy)
VERCEL_TOKEN="tu-token"
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run test` | Tests unitarios (Vitest) |
| `npm run test:coverage` | Tests con cobertura |
| `npm run test:e2e` | Tests E2E (Playwright) |

---

## API REST

> **Base URL**: `/api` — Todas las rutas de admin requieren autenticación (cookie JWT)

### Productos

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/products` | GET | Listar productos (filtros, búsqueda, paginación) |
| `/api/products` | POST | Crear producto (con variantes opcionales) |
| `/api/products/[id]` | GET | Detalle de producto |
| `/api/products/[id]` | PATCH | Actualizar producto |
| `/api/products/[id]` | DELETE | Soft delete |
| `/api/products/filters` | GET | Filtros disponibles |

### Variantes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/products/[id]/variants` | GET | Listar variantes |
| `/api/products/[id]/variants` | POST | Crear variante |
| `/api/products/[id]/variants/bulk` | POST | Crear/reemplazar todas |
| `/api/products/[id]/variants/[vid]` | GET/PATCH/DELETE | CRUD variante |

### Export/Import

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/admin/export/products?format=csv\|xlsx` | GET | Exportar productos |
| `/api/admin/export/categories?format=csv\|xlsx` | GET | Exportar categorías |
| `/api/admin/export/testimonials?format=csv\|xlsx` | GET | Exportar testimonios |
| `/api/admin/export/inventory?format=csv\|xlsx` | GET | Exportar inventario |
| `/api/admin/import/products` | POST | Importar productos (multipart) |
| `/api/admin/import/categories` | POST | Importar categorías |
| `/api/admin/import/testimonials` | POST | Importar testimonios |
| `/api/admin/import/inventory` | POST | Importar inventario |
| `/api/admin/import/products/template` | GET | Plantilla vacía |
| `/api/admin/import/products/template?withSample=true` | GET | Plantilla con ejemplos |

### Otras Rutas

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login cliente |
| `/api/auth/register` | POST | Registro cliente |
| `/api/auth/me` | GET | Usuario actual |
| `/api/customer/cart` | GET/POST/DELETE | Carrito |
| `/api/customer/orders` | GET/POST | Pedidos |
| `/api/customer/wishlist` | GET/POST/DELETE | Wishlist |
| `/api/admin/audit-logs` | GET | Logs de auditoría |
| `/api/admin/audit-logs/stats` | GET | Estadísticas de auditoría |
| `/api/trash` | GET | Elementos eliminados |
| `/api/trash/[type]/[id]` | POST/DELETE | Restaurar/eliminar permanente |

---

## Testing

### Unitarios (Vitest + RTL)

- **131 tests** cubriendo componentes, hooks, y utilidades
- Archivos: `src/test/components/*.test.tsx`, `src/test/hooks/*.test.ts`, `src/test/lib/*.test.ts`

### E2E (Playwright)

- **9 archivos** de pruebas end-to-end
- Cubre: navegación, catálogo, contacto, FAQ, login admin, productos admin, SEO, detalle de producto

```bash
# Ejecutar todos los tests
npm run test

# Tests E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

---

## Despliegue

El proyecto está configurado para deploy automático en Vercel:

```bash
# Build local (verificación)
npm run build

# Deploy a producción
bash /opt/data/scripts/vercel.sh . --prod --yes
```

### Notas de Producción

- SQLite se usa en desarrollo. Para producción con Vercel, se recomienda migrar a PostgreSQL
- Las migraciones se ejecutan automáticamente en el build (`prisma generate && next build`)
- El token de Vercel está en `.env.vercel`

---

## Arquitectura

### Patrón de Agentes

El proyecto se desarrolla con 3 agentes en paralelo:

| Agente | Modelo | Responsabilidad |
|--------|--------|-----------------|
| **Hermes** (orquestador) | owl-alpha | Dirección, revisión, deploy, GitHub sync |
| **Frontend** | mimo-v2.5-free | UI React, componentes, páginas, animaciones |
| **Backend** | deepseek-v4-flash-free | APIs, base de datos, schemas, seguridad |

### Diseño Dark Luxury

- **Colores**: Negro profundo (`#050505`) + Oro 18K (`#D4AF37`) + Rosa (`#E8B4B8`)
- **Tipografía**: Instrument Serif (display) + Inter (body)
- **Animaciones**: GSAP para scroll, Framer Motion para micro-interacciones
- **Logo**: Esquina inferior derecha de cada imagen de producto

### Principios de Diseño

1. **Mobile-first** — Diseño para móvil, escalar hacia desktop
2. **Accesibilidad** — HTML semántico, ARIA labels, navegación por teclado
3. **Performance** — Lazy loading, optimización de imágenes, code splitting
4. **GSAP para scroll, Framer para hover** — No mezclar responsabilidades
5. **Respetar `prefers-reduced-motion`** — Siempre agregar media query

---

## Convenciones de Código

### Reglas Obligatorias

| Regla | Ejemplo |
|-------|---------|
| **Sin puntos y coma** | `const name = "Dubraska"` |
| **Solo comillas dobles** | `"Hola mundo"` |
| **Sin comentarios** | Código auto-documentado |
| **Componentes con `function`** | `function MiComponente(): React.JSX.Element` |
| **Return type** | `React.JSX.Element` |
| **Export default al final** | `export default MiComponente` |
| **Indentación 2 espacios** | No tabs |
| **Variables CSS para colores** | `var(--color-gold)` no `#D4AF37` |
| **Máx 200 líneas por archivo** | Refactorizar si excede |

### ESLint

```json
{
  "rules": {
    "no-semi": ["error", "never"],
    "quotes": ["error", "double"],
    "no-unused-vars": "error"
  }
}
```

---

## Licencia

Proyecto privado — Dubraska Mago 2026
