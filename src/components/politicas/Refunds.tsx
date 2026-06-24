"use client"

interface RefundsProps {
  ref?: React.Ref<HTMLDivElement>
}

function Refunds({ ref }: RefundsProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-28 opacity-0"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Reembolsos
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[var(--color-bg)]/60 p-6">
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Métodos de reembolso
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Transferencia bancaria", "Zelle", "PayPal"].map((method) => (
                  <span
                    key={method}
                    className="inline-block rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[#B0B0B0]"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[var(--color-bg)]/60 p-6">
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Tiempo de procesamiento
              </h3>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                <span className="text-[var(--color-white)] font-medium">3-5 días hábiles</span> después de aprobar la devolución.
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(212,175,55,0.1)] bg-[var(--color-bg)]/60 p-6">
              <h3
                className="text-lg sm:text-xl text-[var(--color-gold)] mb-4"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                ¿Qué se reembolsa?
              </h3>
              <p
                className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                El reembolso incluye el precio del producto (no el envío original, a menos que el error sea nuestro).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Refunds
