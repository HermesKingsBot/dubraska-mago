export default function DevolucionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {children}
    </main>
  )
}
