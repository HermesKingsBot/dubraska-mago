import type { Metadata } from "next"
import FAQClient from "./FAQClient"
import StructuredData from "@/components/StructuredData"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Dubraska Mago®",
  description: "Respuestas a las preguntas más frecuentes sobre envíos, pagos, devoluciones, cuidados de joyería y más.",
}

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿De qué material están hechas las piezas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Todas nuestras piezas están hechas de acero inoxidable 316L bañado en oro 18K. Es un material hipogénico, resistente a la corrosión y perfecto para uso diario sin perder el brillo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Las piezas se ponen negras o se despintan con el tiempo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. El baño en oro 18K de alta calidad mantiene su color y brillo durante años con los cuidados adecuados. Evitamos el contacto con químicos fuertes, perfumes y cloro para prolongar su vida útil.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hacen envíos a todo el país?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, realizamos envíos a toda Venezuela a través de MRW, Zoom y Domesa. El tiempo de entrega varía entre 2 a 7 días hábiles según la zona.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el envío?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El costo del envío depende del destino y la agencia seleccionada. Los precios van desde $3 hasta $8 para envíos nacionales. Envíos gratis en compras superiores a $100.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo devolver o cambiar una pieza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, aceptamos devoluciones dentro de los primeros 7 días posteriores a la recepción, siempre que la pieza esté sin usar y en su empaque original. Los cambios por talla o defecto son sin costo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Ofrecen garantía en las piezas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Todas nuestras piezas tienen garantía de 6 meses contra defectos de fabricación. Si presenta algún problema, te reponemos la pieza sin costo adicional.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hacen piezas personalizadas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "¡Sí! Trabajamos con diseños personalizados. Envíanos tu idea o referencia y te enviamos una cotización en 24-48 horas. Perfecto para regalos especiales o piezas únicas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo cuido mis piezas para que duren más?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Guárdalas en su empaque original o en una bolsa suave. Evita contacto con agua salada, cloro, perfumes y cremas. Límpialas con un paño seco de microfibra después de cada uso.",
      },
    },
    {
      "@type": "Question",
      name: "¿Tienen tienda física o solo venden online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Actualmente operamos 100% online, lo que nos permite ofrecer precios más competitivos sin sacrificar calidad. Puedes seguirnos en Instagram para ver nuestras piezas en vivo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo hacer un pedido?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes hacer tu pedido directamente por WhatsApp, Instagram o a través de nuestro catálogo online. Aceptamos pagos por transferencia, Zelle, PayPal o efectivo contra entrega (según zona).",
      },
    },
  ],
}

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <FAQClient />
      <StructuredData data={faqData} />
    </>
  )
}
