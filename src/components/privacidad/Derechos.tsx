"use client"

interface DerechosProps {
  ref?: React.Ref<HTMLDivElement>
}

function Derechos({ ref }: DerechosProps): React.JSX.Element {
  const derechos = [
    {
      titulo: "Acceso",
      desc: "Tienes derecho a saber qué datos personales tenemos sobre ti y cómo los utilizamos. Solicita una copia completa en cualquier momento.",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    },
    {
      titulo: "Rectificación",
      desc: "Si algún dato es incorrecto o está desactualizado, puedes solicitar que lo corrijamos de inmediato.",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      titulo: "Cancelación",
      desc: "Puedes solicitar la eliminación total de tu cuenta y datos personales en cualquier momento, salvo obligaciones legales.",
      icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    },
    {
      titulo: "Oposición",
      desc: "Puedes oponerte al uso de tus datos para fines de marketing directo o cualquier otro tratamiento que consideres indebido.",
      icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    },
  ]

  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Tus derechos
            </h2>
          </div>

          <p
            className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9] mb-8"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Conforme a la legislación venezolana de protección de datos personales, tienes los siguientes derechos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {derechos.map((d, i) => (
              <div
                key={i}
                className="group rounded-xl border border-[rgba(212,175,55,0.08)] bg-[oklch(0.1_0_0)] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-[rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[var(--color-bg)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-base font-medium text-[var(--color-white)] mb-1"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {d.titulo}
                    </h3>
                    <p
                      className="text-sm text-[#B0B0B0] leading-relaxed"
                      style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                    >
                      {d.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-sm text-[#B0B0B0] leading-[1.9] mt-8"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
          >
            Para ejercer cualquiera de estos derechos, contáctanos por WhatsApp o email. Responderemos en un plazo máximo de 48 horas hábiles.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Derechos
