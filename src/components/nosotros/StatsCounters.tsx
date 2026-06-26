"use client"

interface StatsCountersProps {
  counters: { clientes: number; piezas: number; anos: number }
  ref?: React.Ref<HTMLDivElement>
}

function StatsCounters({ counters, ref }: StatsCountersProps): React.JSX.Element {
  return (
    <section
      ref={ref}
      className="relative w-full py-20 sm:py-28 md:py-36"
      style={{ background: "#0A0A0A" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {[
            { value: `+${counters.clientes}`, label: "Clientes satisfechos" },
            { value: `+${counters.piezas.toLocaleString()}`, label: "Piezas creadas" },
            { value: "100%", label: "Acero inoxidable premium" },
            { value: `+${counters.anos}`, label: "Años de experiencia" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-4xl sm:text-5xl md:text-6xl text-[var(--color-gold)] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs uppercase tracking-[2px] text-[var(--color-muted)] mt-4"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsCounters
