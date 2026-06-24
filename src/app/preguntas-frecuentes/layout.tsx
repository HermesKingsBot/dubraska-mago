import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Dubraska Mago",
  description:
    "Resuelve tus dudas sobre nuestras piezas de joyería: materiales, envíos, garantía, devoluciones, cuidados y pedidos personalizados. Todo lo que necesitas saber sobre acero inoxidable bañado en oro 18K.",
};

export default function PreguntasFrecuentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
