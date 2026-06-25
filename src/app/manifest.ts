import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dubraska Mago® — Joyería de Lujo",
    short_name: "Dubraska Mago",
    description: "Joyería de lujo en acero inoxidable bañado en oro 18K",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#D4AF37",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["shopping", "lifestyle"],
    lang: "es-VE",
  }
}
