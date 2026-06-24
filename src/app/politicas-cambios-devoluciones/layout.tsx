import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas de Cambios y Devoluciones | Dubraska Mago",
  description:
    "Conoce nuestras políticas de cambios, devoluciones y reembolsos para joyería Dubraska Mago. Información clara sobre plazos, condiciones y procesos para cambios y devoluciones.",
};

export default function PoliticasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
