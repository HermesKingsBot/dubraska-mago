import React from "react"

interface ComingSoonProps {
  title: string
  icon: string
}

function ComingSoon({ title, icon }: ComingSoonProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-6 opacity-50">{icon}</div>
      <h2
        className="text-2xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
      <p className="text-[var(--color-muted)] max-w-sm">
        Esta sección está en desarrollo. Próximamente podrás gestionar{" "}
        {title.toLowerCase()} desde aquí.
      </p>
      <div className="mt-8 px-6 py-2 rounded-full border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-sm">
        Próximamente
      </div>
    </div>
  )
}

export default ComingSoon
