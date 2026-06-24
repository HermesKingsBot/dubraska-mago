import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Dubraska Mago",
  description:
    "Contáctanos para pedidos personalizados, consultas y colaboraciones. Joyería de lujo en acero inoxidable bañado en oro 18K. Atención directa por WhatsApp, Instagram y email.",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
