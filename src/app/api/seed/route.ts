import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { successResponse, handleApiError } from "@/lib/api"
import * as bcrypt from "bcryptjs"
import products from "../../../../data/products.json"
import testimonials from "../../../../data/testimonials.json"

async function POST(request: NextRequest) {
  try {
    await db.payment.deleteMany({})
    await db.wishlistItem.deleteMany({})
    await db.cartItem.deleteMany({})
    await db.address.deleteMany({})
    await db.inventoryMovement.deleteMany({})
    await db.orderItem.deleteMany({})
    await db.order.deleteMany({})
    await db.testimonial.deleteMany({})
    await db.product.deleteMany({})
    await db.category.deleteMany({})
    await db.user.deleteMany({})
    await db.activityLog.deleteMany({})

    const categoryMap: Record<string, string> = {}
    const categoryNames: string[] = []
    for (const p of products as Array<{ category: string }>) {
      if (!categoryNames.includes(p.category)) {
        categoryNames.push(p.category)
      }
    }
    for (let i = 0; i < categoryNames.length; i++) {
      const catName = categoryNames[i]
      const slug = catName.toLowerCase().replace(/\s+/g, "-")
      const category = await db.category.create({
        data: {
          name: catName,
          slug,
          description: catName,
          active: true,
          order: i,
        },
      })
      categoryMap[catName] = category.id
    }

    const categorySizes: Record<string, string[]> = {
      collares: ["40cm", "45cm", "50cm"],
      pulseras: ["S", "M", "L"],
      aretes: ["Único"],
      sets: ["Único"],
    }

    const createdProducts: Array<{ id: string; name: string; slug: string }> = []
    for (const product of products as Array<{
      name: string
      slug: string
      description: string
      price: number
      oldPrice: number | null
      category: string
      color: string
      badge: string | null
      image: string
      material: string
      length: string | null
      weight: string | null
      inStock: boolean
      featured: boolean
      gallery: string[]
      stock: number
      lowStockThreshold: number
      sku: string
    }>) {
      const created = await db.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          material: product.material,
          length: product.length,
          weight: product.weight,
          color: product.color,
          badge: product.badge,
          image: product.image,
          gallery: JSON.stringify(product.gallery),
          inStock: product.inStock,
          featured: product.featured,
          stock: product.stock,
          lowStock: product.lowStockThreshold,
          sku: product.sku,
          sizes: JSON.stringify(categorySizes[product.category] || []),
          categoryId: categoryMap[product.category],
        },
      })
      createdProducts.push({ id: created.id, name: created.name, slug: created.slug })
    }

    const sampleReviews = [
      { name: "María G.", email: "maria@example.com", rating: 5, title: "Hermoso", comment: "La calidad es impresionante, el dorado se ve espectacular. Muy feliz con mi compra.", verified: true },
      { name: "Carlos R.", email: "carlos@example.com", rating: 4, title: "Muy bonito", comment: "El diseño es hermoso, solo que el tamaño era un poco más grande de lo que esperaba. Aún así lo recomiendo.", verified: true },
      { name: "Ana P.", email: "ana@example.com", rating: 5, title: "Regalo perfecto", comment: "Lo compré como regalo para mi mamá y le encantó. Los detalles son preciosos.", verified: true },
      { name: "José M.", email: "jose@example.com", rating: 5, title: "Excelente producto", comment: "Llegó antes de lo esperado y en perfectas condiciones. La cadena es resistente y brillante.", verified: false },
      { name: "Laura S.", email: "laura@example.com", rating: 3, title: "Está bien", comment: "El producto es bonito pero esperaba un poco más de brillo. Para el precio está bien.", verified: true },
    ]
    for (const review of sampleReviews) {
      const targetProduct = createdProducts.find(p => p.slug === "collar-cadena-dorado") || createdProducts[0]
      await db.review.create({
        data: {
          ...review,
          images: "[]",
          productId: targetProduct.id,
          status: "APPROVED",
        },
      })
    }
    const review2Target = createdProducts.find(p => p.slug === "pulsera-eslabones") || createdProducts[1]
    await db.review.create({
      data: {
        name: "Diana L.", email: "diana@example.com", rating: 5, title: "Me encanta",
        comment: "La pulsera es preciosa, el baño de oro se ve de alta calidad. La uso a diario.", verified: true,
        images: "[]", productId: review2Target.id, status: "APPROVED",
      },
    })

    for (const testimonial of testimonials as Array<{
      name: string
      text: string
      rating: number
      productId: string | null
      date: string
      active: boolean
    }>) {
      await db.testimonial.create({
        data: {
          name: testimonial.name,
          text: testimonial.text,
          rating: testimonial.rating,
          productId: testimonial.productId,
          date: new Date(testimonial.date),
          active: testimonial.active,
        },
      })
    }

    const hashedPassword = await bcrypt.hash("admin123", 10)
    await db.user.create({
      data: {
        email: "admin@dubraskamago.com",
        password: hashedPassword,
        name: "Admin",
        role: "ADMIN",
        active: true,
      },
    })

    const defaultSettings = [
      { key: 'company_name', value: 'Dubraska Mago', group: 'general', label: 'Nombre de la empresa', type: 'text', order: 0 },
      { key: 'company_slogan', value: 'Joyería de Lujo en Acero y Oro 18K', group: 'general', label: 'Slogan', type: 'text', order: 1 },
      { key: 'company_description', value: 'Piezas mínimas, atemporales y hechas para tu día a día.', group: 'general', label: 'Descripción corta', type: 'textarea', order: 2 },
      { key: 'logo_url', value: '', group: 'general', label: 'Logo URL', type: 'image', order: 3 },
      { key: 'favicon_url', value: '', group: 'general', label: 'Favicon URL', type: 'image', order: 4 },
      { key: 'email', value: 'hola@dubraskamago.com', group: 'contact', label: 'Email de contacto', type: 'email', order: 0 },
      { key: 'phone', value: '+58 412 000 0000', group: 'contact', label: 'Teléfono', type: 'phone', order: 1 },
      { key: 'whatsapp', value: '584120000000', group: 'contact', label: 'WhatsApp (solo números)', type: 'phone', order: 2 },
      { key: 'address', value: 'Mercado La Isla, Local 251', group: 'contact', label: 'Dirección física', type: 'textarea', order: 3 },
      { key: 'city', value: 'Caracas', group: 'contact', label: 'Ciudad', type: 'text', order: 4 },
      { key: 'state', value: 'Distrito Capital', group: 'contact', label: 'Estado', type: 'text', order: 5 },
      { key: 'country', value: 'Venezuela', group: 'contact', label: 'País', type: 'text', order: 6 },
      { key: 'map_lat', value: '10.5061', group: 'contact', label: 'Latitud (mapa)', type: 'text', order: 7 },
      { key: 'map_lng', value: '-66.9134', group: 'contact', label: 'Longitud (mapa)', type: 'text', order: 8 },
      { key: 'schedule', value: 'Lunes a Viernes: 9am - 5pm / Sábados: 9am - 2pm', group: 'contact', label: 'Horario de atención', type: 'textarea', order: 9 },
      { key: 'instagram_url', value: 'https://instagram.com/dubraska.mago', group: 'social', label: 'Instagram URL', type: 'url', order: 0 },
      { key: 'facebook_url', value: 'https://facebook.com/dubraskamago', group: 'social', label: 'Facebook URL', type: 'url', order: 1 },
      { key: 'tiktok_url', value: 'https://tiktok.com/@dubraskamago', group: 'social', label: 'TikTok URL', type: 'url', order: 2 },
      { key: 'twitter_url', value: '', group: 'social', label: 'Twitter/X URL', type: 'url', order: 3 },
      { key: 'youtube_url', value: '', group: 'social', label: 'YouTube URL', type: 'url', order: 4 },
      { key: 'pinterest_url', value: '', group: 'social', label: 'Pinterest URL', type: 'url', order: 5 },
      { key: 'bank_name', value: 'Banco Mercantil', group: 'payment', label: 'Nombre del banco', type: 'text', order: 0 },
      { key: 'bank_account', value: '0105-XXXX-XX-XXXXXXXXXX', group: 'payment', label: 'Número de cuenta', type: 'text', order: 1 },
      { key: 'bank_holder', value: 'Dubraska Mago CA', group: 'payment', label: 'Titular de la cuenta', type: 'text', order: 2 },
      { key: 'bank_rif', value: 'J-XXXXXXX-X', group: 'payment', label: 'RIF', type: 'text', order: 3 },
      { key: 'pago_movil_phone', value: '04120000000', group: 'payment', label: 'Pago Móvil (teléfono)', type: 'phone', order: 4 },
      { key: 'pago_movil_bank', value: 'Banesco', group: 'payment', label: 'Pago Móvil (banco)', type: 'select', order: 5 },
      { key: 'pago_movil_ci', value: 'V-XXXXXXXX', group: 'payment', label: 'Pago Móvil (CI)', type: 'text', order: 6 },
      { key: 'zelle_email', value: '', group: 'payment', label: 'Zelle (email)', type: 'email', order: 7 },
      { key: 'paypal_email', value: '', group: 'payment', label: 'PayPal (email)', type: 'email', order: 8 },
      { key: 'shipping_enabled', value: 'true', group: 'shipping', label: 'Mostrar envíos', type: 'toggle', order: 0 },
      { key: 'shipping_info', value: 'Envíos a toda Venezuela a través de Zoom, MRW y DHL', group: 'shipping', label: 'Información de envíos', type: 'textarea', order: 1 },
      { key: 'cashea_enabled', value: 'true', group: 'shipping', label: 'Mostrar Cashea', type: 'toggle', order: 2 },
      { key: 'cashea_info', value: 'Aceptamos pagos flexibles con Cashea', group: 'features', label: 'Info Cashea', type: 'textarea', order: 0 },
      { key: 'free_shipping_above', value: '50', group: 'features', label: 'Envío gratis sobre (USD)', type: 'text', order: 1 },
      { key: 'return_days', value: '7', group: 'features', label: 'Días para devolución', type: 'text', order: 2 },
    ]

    for (const s of defaultSettings) {
      await db.setting.upsert({
        where: { key: s.key },
        update: s,
        create: s,
      })
    }

    const defaultSocialLinks = [
      { platform: 'Instagram', url: 'https://instagram.com/dubraska.mago', handle: '@dubraska.mago', active: true, order: 0 },
      { platform: 'Facebook', url: 'https://facebook.com/dubraskamago', handle: 'Dubraska Mago', active: true, order: 1 },
      { platform: 'WhatsApp', url: 'https://wa.me/584120000000', handle: '+58 412 000 0000', active: true, order: 2 },
      { platform: 'TikTok', url: 'https://tiktok.com/@dubraskamago', handle: '@dubraskamago', active: false, order: 3 },
    ]

    await db.socialLink.deleteMany({})
    for (const link of defaultSocialLinks) {
      await db.socialLink.create({ data: link })
    }

    await db.activityLog.create({
      data: {
        action: "CREATE",
        entityType: "Seed",
        description: "Base de datos inicializada con datos de demostración",
      },
    })

    return successResponse({
      message: "Database seeded successfully",
      categories: categoryNames.length,
      products: products.length,
      testimonials: testimonials.length,
      settings: defaultSettings.length,
      socialLinks: defaultSocialLinks.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export { POST }
export default { POST }
