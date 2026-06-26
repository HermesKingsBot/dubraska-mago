import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data (order matters for FK constraints)
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.inventoryMovement.deleteMany()
  await prisma.review.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.socialLink.deleteMany()
  await prisma.address.deleteMany()
  await prisma.productComparison.deleteMany()
  await prisma.user.deleteMany()

  // === CATEGORIES ===
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Collares",
        slug: "collares",
        description: "Collares de acero inoxidable bañados en oro 18K. Elegancia y durabilidad para tu día a día.",
        active: true,
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "Pulseras",
        slug: "pulseras",
        description: "Pulseras minimalistas y llamativas. El complemento perfecto para cualquier outfit.",
        active: true,
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: "Aretes",
        slug: "aretes",
        description: "Aretes desde argollas hasta diseños únicos. Brilla con cada movimiento.",
        active: true,
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "Anillos",
        slug: "anillos",
        description: "Anillos ajustables y de diseños exclusivos. Pequeños detalles que marcan la diferencia.",
        active: true,
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: "Sets Completos",
        slug: "sets-completos",
        description: "Sets de collar + pulsera + aretes. El regalo perfecto para ti o para alguien especial.",
        active: true,
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: "Más Vendidos",
        slug: "mas-vendidos",
        description: "Las piezas que todas quieren. Las favoritas de nuestras clientas.",
        active: true,
        order: 6,
      },
    }),
  ])

  const [collares, pulseras, aretes, anillos, sets, masVendidos] = categories

  // === PRODUCTS ===
  const products = await Promise.all([
    // 1. Collar Cadena Dorado (featured, best seller)
    prisma.product.create({
      data: {
        name: "Collar Cadena Dorado",
        slug: "collar-cadena-dorado",
        description: "Collar de eslabones bañado en oro 18K. Perfecto para usar solo o con colgante. Acero inoxidable de alta calidad que no se despinta ni irrita la piel. Largo: 45 cm + 5 cm de extensión.",
        price: 85,
        oldPrice: 100,
        material: "Acero inoxidable + Oro 18K",
        length: "45cm + 5cm extensión",
        weight: "12g",
        color: "Dorado",
        badge: "SÚPER VENDIDO",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
          "https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=800&h=800&fit=crop",
        ]),
        inStock: true,
        featured: true,
        stock: 25,
        lowStock: 5,
        sku: "COL-001",
        categoryId: collares.id,
        sizes: JSON.stringify(["45cm", "50cm"]),
        compareGroup: "collares",
      },
    }),
    // 2. Pulsera Eslabones
    prisma.product.create({
      data: {
        name: "Pulsera Eslabones",
        slug: "pulsera-eslabones",
        description: "Pulsera de eslabones bañada en oro 18K. Diseño clásico y elegante que combina con todo. Cierre de langosta seguro. Largo: 18cm + 3cm extensión.",
        price: 65,
        material: "Acero inoxidable + Oro 18K",
        length: "18cm + 3cm extensión",
        weight: "8g",
        color: "Dorado",
        badge: "NUEVO",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
        ]),
        inStock: true,
        featured: true,
        stock: 30,
        lowStock: 5,
        sku: "PUL-001",
        categoryId: pulseras.id,
        sizes: JSON.stringify(["16cm", "18cm", "20cm"]),
        compareGroup: "pulseras",
      },
    }),
    // 3. Aretes Argolla Grande
    prisma.product.create({
      data: {
        name: "Aretes Argolla Grande",
        slug: "aretes-argolla-grande",
        description: "Aretes de argolla grande bañados en oro 18K. Diámetro de 4cm. Ligeros y cómodos para uso diario. Cierre de bisagra seguro.",
        price: 45,
        material: "Acero inoxidable + Oro 18K",
        diameter: "4cm",
        weight: "4g",
        color: "Dorado",
        badge: "SÚPER VENDIDO",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
        ]),
        inStock: true,
        featured: true,
        stock: 40,
        lowStock: 5,
        sku: "ARE-001",
        categoryId: aretes.id,
        sizes: JSON.stringify(["3cm", "4cm", "5cm"]),
        compareGroup: "aretes",
      },
    }),
    // 4. Set Collar + Pulsera
    prisma.product.create({
      data: {
        name: "Set Collar + Pulsera",
        slug: "set-collar-pulsera",
        description: "Set completo de collar + pulsera bañados en oro 18K. El regalo perfecto. Incluye empaque de regalo premium.",
        price: 130,
        oldPrice: 150,
        material: "Acero inoxidable + Oro 18K",
        color: "Dorado",
        badge: "OFERTA",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop",
        ]),
        inStock: true,
        featured: true,
        stock: 15,
        lowStock: 3,
        sku: "SET-001",
        categoryId: sets.id,
        sizes: JSON.stringify(["Talla única"]),
        compareGroup: "sets",
      },
    }),
    // 5. Collar Minimalista Plateado
    prisma.product.create({
      data: {
        name: "Collar Minimalista Plateado",
        slug: "collar-minimalista-plateado",
        description: "Collar fino y minimalista bañado en plateado. Perfecto para el día a día. Largo: 40cm + 5cm extensión.",
        price: 55,
        material: "Acero inoxidable + Plateado",
        length: "40cm + 5cm extensión",
        weight: "6g",
        color: "Plateado",
        image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=600&h=600&fit=crop",
        gallery: JSON.stringify([]),
        inStock: true,
        featured: false,
        stock: 20,
        lowStock: 5,
        sku: "COL-002",
        categoryId: collares.id,
        sizes: JSON.stringify(["40cm", "45cm"]),
        compareGroup: "collares",
      },
    }),
    // 6. Aretes Perla Rosé
    prisma.product.create({
      data: {
        name: "Aretes Perla Rosé",
        slug: "aretes-perla-rose",
        description: "Aretes con perla artificial bañados en rosé gold. Elegantes y femeninos. Perfectos para ocasiones especiales.",
        price: 50,
        material: "Acero inoxidable + Rosé Gold",
        weight: "5g",
        color: "Rosé",
        badge: "NUEVO",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop",
        gallery: JSON.stringify([]),
        inStock: true,
        featured: false,
        stock: 18,
        lowStock: 5,
        sku: "ARE-002",
        categoryId: aretes.id,
        sizes: JSON.stringify(["Talla única"]),
        compareGroup: "aretes",
      },
    }),
    // 7. Anillo Ajustable Corazón
    prisma.product.create({
      data: {
        name: "Anillo Ajustable Corazón",
        slug: "anillo-ajustable-corazon",
        description: "Anillo ajustable con diseño de corazón bañado en oro 18K. Ideal para regalo. Se ajusta a cualquier dedo.",
        price: 35,
        material: "Acero inoxidable + Oro 18K",
        color: "Dorado",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
        gallery: JSON.stringify([]),
        inStock: true,
        featured: false,
        stock: 35,
        lowStock: 5,
        sku: "ANI-001",
        categoryId: anillos.id,
        sizes: JSON.stringify(["Ajustable"]),
        compareGroup: "anillos",
      },
    }),
    // 8. Pulsera Brillitos
    prisma.product.create({
      data: {
        name: "Pulsera Brillitos",
        slug: "pulsera-brillitos",
        description: "Pulsera de cristal con brillitos bañada en oro 18K. Llena de brillo y elegancia. Cierre de imán.",
        price: 70,
        oldPrice: 85,
        material: "Acero inoxidable + Oro 18K + Cristal",
        length: "17cm + 3cm extensión",
        weight: "10g",
        color: "Dorado",
        badge: "OFERTA",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop",
        gallery: JSON.stringify([]),
        inStock: true,
        featured: false,
        stock: 12,
        lowStock: 3,
        sku: "PUL-002",
        categoryId: pulseras.id,
        sizes: JSON.stringify(["16cm", "18cm"]),
        compareGroup: "pulseras",
      },
    }),
  ])

  const [
    collarCadena,
    pulseraEslabones,
    aretesArgolla,
    setCollarPulsera,
    collarMinimalista,
    aretesPerla,
    anilloCorazon,
    pulseraBrillitos,
  ] = products

  // === PRODUCT VARIANTS (for Collar Cadena Dorado) ===
  await prisma.productVariant.createMany({
    data: [
      {
        productId: collarCadena.id,
        sku: "COL-001-DOR-45",
        name: "Collar Cadena Dorado - 45cm",
        color: "Dorado",
        colorHex: "#D4AF37",
        size: "45cm",
        price: 85,
        stock: 15,
        inStock: true,
        active: true,
      },
      {
        productId: collarCadena.id,
        sku: "COL-001-DOR-50",
        name: "Collar Cadena Dorado - 50cm",
        color: "Dorado",
        colorHex: "#D4AF37",
        size: "50cm",
        price: 90,
        stock: 10,
        inStock: true,
        active: true,
      },
    ],
  })

  // Update product to enable variants
  await prisma.product.update({
    where: { id: collarCadena.id },
    data: {
      hasVariants: true,
      variantAttributes: JSON.stringify(["color", "size"]),
    },
  })

  // === TESTIMONIALS ===
  await prisma.testimonial.createMany({
    data: [
      {
        name: "María González",
        text: "Me encanta mi collar! La calidad es increíble y no se ha despintado nada. Llevo 3 meses usándolo todos los días y sigue como nuevo. 100% recomendado!",
        rating: 5,
        active: true,
      },
      {
        name: "Ana Rodríguez",
        text: "Compré el set de collar + pulsera para regalo de mi mamá y le encantó. El empaque es hermoso y la calidad superó mis expectativas. Volveré a comprar!",
        rating: 5,
        active: true,
      },
      {
        name: "Carolina Pérez",
        text: "Los aretes argolla son mis favoritos. Son ligeros, cómodos y combinan con todo. Ya tengo el dorado y el plateado. El servicio al cliente es excelente!",
        rating: 5,
        active: true,
      },
      {
        name: "Laura Martínez",
        text: "Pedí la pulsera brillitos para mi cumpleaños y llegó rapidísimo. El acabado es precioso y brilla muchísimo. Dubraska siempre tiene las mejores piezas.",
        rating: 4,
        active: true,
      },
      {
        name: "Valentina Sánchez",
        text: "Compré 3 collares para mis hermanas y todas están encantadas. La calidad-precio es insuperable. Ya soy clienta fiel de Dubraska! 💕",
        rating: 5,
        active: true,
      },
    ],
  })

  // === SETTINGS ===
  await prisma.setting.createMany({
    data: [
      { key: "company_name", value: "Dubraska Mago", group: "general", label: "Nombre de la empresa", type: "text", order: 1 },
      { key: "company_slogan", value: "Joyería de Lujo en Acero y Oro 18K", group: "general", label: "Eslogan", type: "text", order: 2 },
      { key: "company_description", value: "Piezas mínimas, atemporales y hechas para tu día a día. Acero inoxidable bañado en oro 18K.", group: "general", label: "Descripción", type: "textarea", order: 3 },
      { key: "company_email", value: "dubraskamago@gmail.com", group: "contact", label: "Email de contacto", type: "text", order: 1 },
      { key: "company_phone", value: "+58 412-123-4567", group: "contact", label: "Teléfono", type: "text", order: 2 },
      { key: "company_address", value: "Mercado La Isla, Local 251, Caracas, Venezuela", group: "contact", label: "Dirección", type: "text", order: 3 },
      { key: "whatsapp_number", value: "584121234567", group: "social", label: "WhatsApp", type: "text", order: 1 },
      { key: "instagram_handle", value: "@dubraskamago", group: "social", label: "Instagram", type: "text", order: 2 },
      { key: "facebook_page", value: "Dubraska Mago Joyería", group: "social", label: "Facebook", type: "text", order: 3 },
      { key: "tiktok_handle", value: "@dubraskamago", group: "social", label: "TikTok", type: "text", order: 4 },
      { key: "shipping_cost_caracas", value: "5", group: "shipping", label: "Costo envío Caracas", type: "text", order: 1 },
      { key: "shipping_cost_nacional", value: "10", group: "shipping", label: "Costo envío Nacional", type: "text", order: 2 },
      { key: "free_shipping_min", value: "200", group: "shipping", label: "Envío gratis desde", type: "text", order: 3 },
      { key: "currency_symbol", value: "Bs.", group: "general", label: "Símbolo de moneda", type: "text", order: 4 },
      { key: "hero_title", value: "Diseños que brillan más cuando TÚ los llevas puestos.", group: "homepage", label: "Título principal", type: "text", order: 1 },
      { key: "hero_subtitle", value: "Joyería de lujo accesible para toda mujer.", group: "homepage", label: "Subtítulo", type: "text", order: 2 },
    ],
  })

  // === SOCIAL LINKS ===
  await prisma.socialLink.createMany({
    data: [
      { platform: "Instagram", url: "https://instagram.com/dubraskamago", handle: "@dubraskamago", active: true, order: 1, icon: "instagram" },
      { platform: "WhatsApp", url: "https://wa.me/584121234567", handle: "+58 412-123-4567", active: true, order: 2, icon: "whatsapp" },
      { platform: "Facebook", url: "https://facebook.com/dubraskamagojoyeria", handle: "Dubraska Mago Joyería", active: true, order: 3, icon: "facebook" },
      { platform: "TikTok", url: "https://tiktok.com/@dubraskamago", handle: "@dubraskamago", active: true, order: 4, icon: "tiktok" },
    ],
  })

  // === ADMIN USER ===
  const hashedPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.create({
    data: {
      email: "admin@dubraskamago.com",
      name: "Dubraska Mago",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+58 412-123-4567",
      active: true,
    },
  })

  // === CUSTOMER USER (for testing) ===
  const customerPassword = await bcrypt.hash("customer123", 10)
  const customer = await prisma.user.create({
    data: {
      email: "cliente@test.com",
      name: "Cliente Prueba",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+58 414-987-6543",
      active: true,
    },
  })

  // === REVIEWS ===
  await prisma.review.createMany({
    data: [
      {
        productId: collarCadena.id,
        userId: customer.id,
        name: "Cliente Prueba",
        email: "cliente@test.com",
        rating: 5,
        title: "Hermoso collar",
        comment: "La calidad es increíble, no se despinta y es muy elegante. Lo uso todos los días.",
        verified: true,
        status: "APPROVED",
        images: JSON.stringify([]),
        helpful: 12,
      },
      {
        productId: pulseraEslabones.id,
        userId: customer.id,
        name: "Cliente Prueba",
        email: "cliente@test.com",
        rating: 5,
        title: "Me encanta",
        comment: "Preciosa pulsera, muy bien acabada. El oro se ve muy real.",
        verified: true,
        status: "APPROVED",
        images: JSON.stringify([]),
        helpful: 8,
      },
      {
        productId: aretesArgolla.id,
        name: "María G.",
        email: "maria@test.com",
        rating: 4,
        title: "Bonitos pero un poco pesados",
        comment: "Son muy bonitos, solo un poco más pesados de lo que esperaba. Pero la calidad es buena.",
        verified: false,
        status: "APPROVED",
        images: JSON.stringify([]),
        helpful: 3,
      },
    ],
  })

  // === INVENTORY MOVEMENTS ===
  await prisma.inventoryMovement.createMany({
    data: [
      { productId: collarCadena.id, type: "INITIAL_STOCK", quantity: 25, reason: "Stock inicial", previousStock: 0, newStock: 25, createdBy: "system" },
      { productId: pulseraEslabones.id, type: "INITIAL_STOCK", quantity: 30, reason: "Stock inicial", previousStock: 0, newStock: 30, createdBy: "system" },
      { productId: aretesArgolla.id, type: "INITIAL_STOCK", quantity: 40, reason: "Stock inicial", previousStock: 0, newStock: 40, createdBy: "system" },
      { productId: setCollarPulsera.id, type: "INITIAL_STOCK", quantity: 15, reason: "Stock inicial", previousStock: 0, newStock: 15, createdBy: "system" },
    ],
  })

  console.log("✅ Seed completed successfully!")
  console.log(`  - ${categories.length} categories`)
  console.log(`  - ${products.length} products`)
  console.log(`  - 2 product variants`)
  console.log(`  - 5 testimonials`)
  console.log(`  - 15 settings`)
  console.log(`  - 4 social links`)
  console.log(`  - 2 users (admin + customer)`)
  console.log(`  - 3 reviews`)
  console.log(`  - 4 inventory movements`)
  console.log("")
  console.log("🔑 Admin login: admin@dubraskamago.com / admin123")
  console.log("🔑 Customer login: cliente@test.com / customer123")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
