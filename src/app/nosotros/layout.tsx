import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestra Historia | Dubraska Mago",
  description:
    "Conoce la historia de Dubraska Mago: pasión por la joyería, raíces venezolanas y compromiso con la calidad. Descubre cómo cada pieza cuenta una historia de artesanía y belleza atemporal.",
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050505]">
      {children}
    </main>
  );
}
