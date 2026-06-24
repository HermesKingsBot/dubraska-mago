"use client"

interface ShippingReturnsProps {
  ref?: React.Ref<HTMLDivElement>
}

function ShippingReturns(props: ShippingReturnsProps): React.JSX.Element {
  const { ref } = props
  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
      {[
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          ),
          title: "Envío gratis",
          desc: "En compras superiores a $100",
        },
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          ),
          title: "Devoluciones",
          desc: "7 días para devolver tu compra",
        },
        {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          ),
          title: "Garantía",
          desc: "6 meses de garantía",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-5 rounded-xl bg-[var(--color-dark-card)] border border-white/5"
        >
          <div className="shrink-0">{item.icon}</div>
          <div>
            <h3
              className="text-sm font-medium text-white mb-1"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.title}
            </h3>
            <p
              className="text-xs text-[var(--color-muted)]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShippingReturns
