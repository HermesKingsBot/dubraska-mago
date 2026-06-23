"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STORE_LINKS = [
  { label: "Collares", href: "/colecciones/collares" },
  { label: "Pulseras", href: "/colecciones/pulseras" },
  { label: "Aretes", href: "/colecciones/aretes" },
  { label: "Anillos", href: "/colecciones/anillos" },
  { label: "Sets completos", href: "/colecciones/sets" },
  { label: "Más vendidos", href: "/colecciones?filter=best-sellers" },
];

const INFO_LINKS = [
  { label: "Sobre mí", href: "/nosotros" },
  { label: "Preguntas frecuentes", href: "/faq" },
  { label: "Envíos", href: "/envios" },
  { label: "Cambios y devoluciones", href: "/devoluciones" },
  { label: "Contacto", href: "/contacto" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cols = footerRef.current?.querySelectorAll(".footer-col");
        if (cols?.length) {
          gsap.fromTo(
            cols,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const _fc = footerRef.current?.querySelectorAll(".footer-col");
        if (_fc) gsap.set(_fc, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="relative w-full bg-[#050505] border-t border-[rgba(255,255,255,0.04)]">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Column 1 — Logo */}
          <div className="footer-col col-span-2 md:col-span-1">
            <a
              href="/"
              className="text-2xl text-[#D4AF37] tracking-tight hover:text-[#E8C96A] transition-colors duration-300"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              DUBRASKA MAGO<sup className="text-[10px]">®</sup>
            </a>
            <p
              className="text-sm text-[#8A8A8A] mt-4 leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Acero inoxidable bañado en oro 18K. Piezas diseñadas para mujeres que brillan con fuerza.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://wa.me/58XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#8A8A8A" className="hover:fill-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/dubraskamago"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#8A8A8A">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Tienda */}
          <div className="footer-col">
            <h4
              className="text-xs uppercase tracking-[1.5px] text-white font-semibold mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Tienda
            </h4>
            <ul className="space-y-3">
              {STORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#8A8A8A] hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Información */}
          <div className="footer-col">
            <h4
              className="text-xs uppercase tracking-[1.5px] text-white font-semibold mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Información
            </h4>
            <ul className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#8A8A8A] hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div className="footer-col">
            <h4
              className="text-xs uppercase tracking-[1.5px] text-white font-semibold mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              No te pierdas nada
            </h4>
            <p
              className="text-sm text-[#8A8A8A] mb-4"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Sé la primera en conocer nuevos lanzamientos.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-2.5 rounded-lg bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] text-white text-sm placeholder:text-[#555] focus:border-[#D4AF37] focus:outline-none transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#050505] text-sm font-semibold hover:brightness-110 transition-all duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Suscribirme
              </button>
            </form>
            <p
              className="text-[11px] text-[#555] mt-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Puedes cancelar cuando quieras.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-[rgba(255,255,255,0.04)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p
            className="text-[11px] text-[#555]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            © 2026 Dubraska Mago. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="/terminos"
              className="text-[11px] text-[#8A8A8A] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Términos y condiciones
            </a>
            <a
              href="/privacidad"
              className="text-[11px] text-[#8A8A8A] hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
