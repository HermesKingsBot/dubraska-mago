"use client"

interface WebSeguraProps {
  ref?: React.Ref<HTMLDivElement>
}

function WebSegura({ ref }: WebSeguraProps): React.JSX.Element {
  return (
    <section ref={ref} className="relative w-full py-16 sm:py-20 md:py-28 opacity-0">
      <div className="max-w-4xl mx-auto px-6">
        <div className="rounded-2xl border border-[rgba(212,175,55,0.12)] bg-[var(--color-bg)] p-8 sm:p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[var(--color-bg)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-[var(--color-white)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Web segura
            </h2>
          </div>

          <div className="rounded-xl border border-[rgba(212,175,55,0.08)] bg-[oklch(0.1_0_0)] p-6 sm:p-8 mb-6">
            <ul className="space-y-4">
              {[
                "Conexión segura con certificado SSL/TLS (cifrado de extremo a extremo)",
                "Hosting en Vercel con infraestructura global y protección DDoS",
                "Base de datos PostgreSQL en Neon con cifrado en reposo y backups automáticos",
                "Autenticación JWT con tokens httpOnly — inaccesibles desde JavaScript del navegador",
                "Acceso restringido al panel de administración con roles y permisos por empleado",
                "Monitoreo continuo de seguridad y actualizaciones regulares de dependencias",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  <span
                    className="text-sm sm:text-base text-[#B0B0B0] leading-[1.9]"
                    style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.15)] bg-[oklch(0.08_0_0)] px-4 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span
                className="text-xs text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                SSL/TLS Activo
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.15)] bg-[oklch(0.08_0_0)] px-4 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span
                className="text-xs text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Vercel
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.15)] bg-[oklch(0.08_0_0)] px-4 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <span
                className="text-xs text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Neon PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WebSegura
