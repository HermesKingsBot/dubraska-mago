export interface SocialLink {
  id: string
  platform: string
  url: string
  handle: string
  active: boolean
  order: number
}

export const COMPANY_DEFAULTS: Record<string, string> = {
  company_name: 'Dubraska Mago',
  company_slogan: 'Joyería de Lujo en Acero y Oro 18K',
  company_description: 'Piezas mínimas, atemporales y hechas para tu día a día.',
  email: 'hola@dubraskamago.com',
  phone: '+58 412 000 0000',
  whatsapp: '584120000000',
  address: 'Mercado La Isla, Local 251',
  city: 'Caracas',
  state: 'Distrito Capital',
  country: 'Venezuela',
  schedule: 'Lunes a Viernes: 9am - 5pm',
  map_lat: '10.5061',
  map_lng: '-66.9134',
  instagram_url: 'https://instagram.com/dubraska.mago',
  facebook_url: 'https://facebook.com/dubraskamago',
  tiktok_url: '',
  twitter_url: '',
  youtube_url: '',
  pinterest_url: '',
  bank_name: 'Banco Mercantil',
  bank_account: '',
  bank_holder: 'Dubraska Mago CA',
  bank_rif: '',
  pago_movil_phone: '',
  pago_movil_bank: '',
  pago_movil_ci: '',
  zelle_email: '',
  paypal_email: '',
  shipping_enabled: 'true',
  shipping_info: 'Envíos a toda Venezuela',
  cashea_enabled: 'true',
  cashea_info: 'Aceptamos pagos flexibles con Cashea',
  free_shipping_above: '50',
  return_days: '7',
}

export const PRODUCT_SIZE_DEFAULTS: Record<string, string[]> = {
  collares: ["40cm", "45cm", "50cm"],
  pulseras: ["S", "M", "L"],
  aretes: ["Único"],
  sets: ["Único"],
  anillos: ["48", "50", "52", "54", "56"],
}

export const SOCIAL_DEFAULTS: SocialLink[] = [
  { id: 'instagram', platform: 'Instagram', url: 'https://instagram.com/dubraska.mago', handle: '@dubraska.mago', active: true, order: 0 },
  { id: 'whatsapp', platform: 'WhatsApp', url: 'https://wa.me/584120000000', handle: '+58 412 000 0000', active: true, order: 1 },
  { id: 'facebook', platform: 'Facebook', url: 'https://facebook.com/dubraskamago', handle: 'Dubraska Mago', active: true, order: 2 },
]
