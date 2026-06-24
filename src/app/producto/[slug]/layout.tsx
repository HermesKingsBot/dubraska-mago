import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Dubraska Mago",
    default: "Dubraska Mago",
  },
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
