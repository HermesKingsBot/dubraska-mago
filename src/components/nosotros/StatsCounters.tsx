"use client"

import { forwardRef } from "react"

interface StatsCountersProps {
  counters: { clientes: number; piezas: number; anos: number }
}

const StatsCounters = forwardRef<HTMLDivElement, StatsCountersProps>(function StatsCounters(
  { counters },
  ref
) {
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
                className="text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] tracking-tight"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs uppercase tracking-[2px] text-[#8A8A8A] mt-4"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default StatsCounters
