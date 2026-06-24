# PROMPT: Página de Catálogo / Tienda Completa

## Objetivo
Crear la página de catálogo `/colecciones` completa para Dubraska Mago. Debe ser una experiencia premium, ultra animada, 100% responsive, con filtrado, búsqueda, paginación y cambio de layout. Los datos vienen de un JSON estático (sin backend por ahora).

## Estructura de Archivos a Crear

```
src/
├── app/
│   └── colecciones/
│       ├── page.tsx              # Server Component — lee products.json, pasa al cliente
│       └── layout.tsx            # Layout con breadcrumb + título
├── components/
│   └── catalog/
│       ├── CatalogClient.tsx     # Client Component principal (toda la lógica)
│       ├── ProductCard.tsx       # Card individual de producto
│       ├── FiltersDrawer.tsx     # Drawer lateral de filtros
│       ├── SearchBar.tsx         # Barra de búsqueda
│       ├── Pagination.tsx        # Paginación con selector de cantidad
│       ├── LayoutToggle.tsx      # Botón para cambiar 4/2/1 columnas
│       ├── ProductGrid.tsx       # Grid responsivo
│       └── EmptyState.tsx        # Estado sin resultados
└── data/
    └── products.json             # Ya existe — 20 productos
```

## Flujo de Datos (Next.js Best Practices)

1. **Server Component** (`page.tsx`): Lee `data/products.json` con `fs/promises` y pasa los productos como prop al Client Component
2. **Client Component** (`CatalogClient.tsx`): Toda la lógica de estado (filtros, búsqueda, paginación, layout)
3. **URL Sync**: Cada cambio de filtro/búsqueda/página actualiza la URL con `useRouter().push()` usando searchParams

## Diseño y Estilo

### Colores (marca)
- Fondo: `#050505` (negro profundo)
- Dorado: `#D4AF37` (acentos, badges, bordes)
- Texto: `#FFFFFF` / `#8A8A8A` (muted)
- Rosé: `#E8B4B8` (acento secundario)
- Card fondo: `#0A0A0A` con borde `rgba(212,175,55,0.08)`

### Tipografía
- Títulos: `Instrument Serif` → `style={{ fontFamily: "var(--font-instrument-serif)" }}`
- Body: `Inter` → `style={{ fontFamily: "var(--font-inter)" }}`

### Cards de Producto
- Imagen placeholder con gradiente + icono SVG decorativo
- Badge (SÚPER VENDIDO, NUEVO, OFERTA, LIMITADO) con colores distintos
- Nombre, descripción corta, precio (con precio tachado si hay oferta)
- Punto de color indicando el color del producto
- Botón "Comprar por WhatsApp" con número placeholder
- Hover: scale(1.02), border dorado más visible, glow sutil
- Animación de entrada: fade-up con stagger

### Grid de Productos
- **4 columnas** por defecto (desktop)
- **2 columnas** en tablet
- **1 columna** en mobile
- Gap: `gap-6` (mobile), `gap-8` (desktop)
- Animación de cambio de layout: GSAP fade entre transiciones

### Filtros (Drawer)
- **Tipo**: Drawer overlay desde la izquierda con backdrop blur
- **Opciones de filtro**:
  - Categoría: Collares, Pulseras, Aretes, Sets
  - Color: Dorado, Plateado, Rosé, Negro
  - Precio: Rango con inputs (min/max)
  - Estado: En oferta, Nuevo, Limitado
- **Animación**: Slide-in desde izquierda con GSAP, stagger en opciones
- **Botón de abrir**: Icono de filtro fijo en esquina superior izquierda del catálogo
- **Botón de cerrar**: X dentro del drawer
- **Aplicar**: Los filtros se aplican al instante (sin botón "aplicar")
- **Limpiar filtros**: Botón "Limpiar todo"

### Búsqueda
- Barra de búsqueda fija en la parte superior del catálogo
- Busca en: nombre, descripción, categoría, material
- Debounce de 300ms
- Icono de lupa, placeholder "Buscar piezas..."
- Al buscar, la URL se actualiza: `/colecciones?q=busqueda`

### Paginación
- **Selector de productos por página**: 8, 12, 20, "Ver todos"
- **Botones**: Anterior / Siguiente + números de página
- **Animación**: Fade al cambiar de página
- **URL**: `/colecciones?page=2&perPage=8`
- **Scroll top**: Al cambiar página, scroll suave al inicio del catálogo

### Layout Toggle
- 3 botones/iconos: 4 columnas | 2 columnas | 1 columna
- Estado activo: borde dorado
- Ubicación: esquina superior derecha, antes de los productos
- Animación de transición: GSAP grid animation

## URL Structure

Todas las acciones deben reflejarse en la URL:

```
/colecciones                          # Todos los productos
/colecciones?category=collares       # Filtrado por categoría
/colecciones?color=dorado             # Filtrado por color
/colecciones?q=cadena                # Búsqueda
/colecciones?page=2&perPage=12       # Paginación
/colecciones?layout=2                 # Layout 2 columnas
/colecciones?category=pulseras&color=rose&page=1  # Combinado
```

## Animaciones GSAP

1. **Entrada inicial**: Hero con fade-up, productos con stagger fade-up
2. **Filtro change**: Elementos que salen con fade-out, nuevos con fade-in + stagger
3. **Página change**: Fade-out rápido, scroll top, fade-in con stagger
4. **Layout change**: Reflow animation con GSAP
5. **Drawer open**: Slide-in desde izquierda + backdrop fade
6. **Card hover**: Scale sutil + border glow
7. **Scroll**: Parallax suave en hero de la página

## Responsive

- **Mobile (< 640px)**: 1 columna, drawer full-width, búsqueda colapsable
- **Tablet (640-1023px)**: 2 columnas, drawer 80% width
- **Desktop (1024+)**: 4 columnas (default), drawer 320px fijo

## Placeholders

- **Imágenes**: Usar gradientes con SVG decorativo (como BestSellers actual)
- **WhatsApp**: Link a `https://wa.me/58XXXXXXXXXX?text=Hola%20Dubraska,%20me%20interesa%20[NOMBRE_PRODUCTO]`

## Reglas Importantes

1. **Server Component** para lectura de datos (products.json)
2. **Client Component** para toda la interactividad
3. **"use client"** en todos los componentes de catalog/
4. **GSAP useGSAP** hook para animaciones
5. **prefers-reduced-motion** siempre respetado
6. **Idioma**: Todo en español venezolano
7. **Tailwind CSS 4** — no config file, todo en CSS o clases
8. **No backend** — datos hardcodeados en products.json
9. **TypeScript estricto** — tipos definidos para todo

## TypeScript Types

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  category: 'collares' | 'pulseras' | 'aretes' | 'sets';
  color: 'dorado' | 'plateado' | 'rose' | 'negro';
  badge: 'SÚPER VENDIDO' | 'NUEVO' | 'OFERTA' | 'LIMITADO' | null;
  image: string;
  material: string;
  inStock: boolean;
  featured: boolean;
}

interface Filters {
  category: string | null;
  color: string | null;
  search: string;
  minPrice: number | null;
  maxPrice | null;
  onlyOffers: boolean;
  onlyNew: boolean;
  onlyLimited: boolean;
}
```

## Orden de Implementación

1. Crear tipos TypeScript
2. Crear `app/colecciones/layout.tsx`
3. Crear `app/colecciones/page.tsx` (Server Component)
4. Crear `components/catalog/ProductCard.tsx`
5. Crear `components/catalog/FiltersDrawer.tsx`
6. Crear `components/catalog/SearchBar.tsx`
7. Crear `components/catalog/Pagination.tsx`
8. Crear `components/catalog/LayoutToggle.tsx`
9. Crear `components/catalog/ProductGrid.tsx`
10. Crear `components/catalog/EmptyState.tsx`
11. Crear `components/catalog/CatalogClient.tsx` (orquestador)
12. Actualizar `src/app/page.tsx` para que el CTA "Ver Catálogo" funcione
13. Actualizar NavigationBar para que "Colecciones" apunte a `/colecciones`
14. Probar build y deploy

## Notas Finales

- Calidad > Velocidad. Tómate el tiempo necesario.
- Cada animación debe sentirse premium y fluida.
- El diseño debe ser consistente con el home ya existente.
- Piensa en mobile primero, escala hacia desktop.
- Los filtros deben ser intuitivos y rápidos.
- La paginación debe ser suave sin saltos bruscos.
