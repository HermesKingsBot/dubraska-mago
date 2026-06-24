"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FAQ_DATA = [
  {
    id: 1,
    question: "¿De qué material están hechas las piezas?",
    answer:
      "Todas nuestras piezas están hechas de acero inoxidable 316L bañado en oro 18K. Es un material hipogénico, resistente a la corrosión y perfecto para uso diario sin perder el brillo.",
  },
  {
    id: 2,
    question: "¿Las piezas se ponen negras o se despintan con el tiempo?",
    answer:
      "No. El baño en oro 18K de alta calidad mantiene su color y brillo durante años con los cuidados adecuados. Evitamos el contacto con químicos fuertes, perfumes y cloro para prolongar su vida útil.",
  },
  {
    id: 3,
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Sí, realizamos envíos a toda Venezuela a través de MRW, Zoom y Domesa. El tiempo de entrega varía entre 2 a 7 días hábiles según la zona.",
  },
  {
    id: 4,
    question: "¿Cuánto cuesta el envío?",
    answer:
      "El costo del envío depende del destino y la agencia seleccionada. Los precios van desde $3 hasta $8 para envíos nacionales. Envíos gratis en compras superiores a $100.",
  },
  {
    id: 5,
    question: "¿Puedo devolver o cambiar una pieza?",
    answer:
      "Sí, aceptamos devoluciones dentro de los primeros 7 días posteriores a la recepción, siempre que la pieza esté sin usar y en su empaque original. Los cambios por talla o defecto son sin costo.",
  },
  {
    id: 6,
    question: "¿Ofrecen garantía en las piezas?",
    answer:
      "Todas nuestras piezas tienen garantía de 6 meses contra defectos de fabricación. Si presenta algún problema, te reponemos la pieza sin costo adicional.",
  },
  {
    id: 7,
    question: "¿Hacen piezas personalizadas?",
    answer:
      "¡Sí! Trabajamos con diseños personalizados. Envíanos tu idea o referencia y te enviamos una cotización en 24-48 horas. Perfecto para regalos especiales o piezas únicas.",
  },
  {
    id: 8,
    question: "¿Cómo cuido mis piezas para que duren más?",
    answer:
      "Guárdalas en su empaque original o en una bolsa suave. Evita contacto con agua salada, cloro, perfumes y cremas. Límpialas con un paño seco de microfibra después de cada uso.",
  },
  {
    id: 9,
    question: "¿Tienen tienda física o solo venden online?",
    answer:
      "Actualmente operamos 100% online, lo que nos permite ofrecer precios más competitivos sin sacrificar calidad. Puedes seguirnos en Instagram para ver nuestras piezas en vivo.",
  },
  {
    id: 10,
    question: "¿Cómo puedo hacer un pedido?",
    answer:
      "Puedes hacer tu pedido directamente por WhatsApp, Instagram o a través de nuestro catálogo online. Aceptamos pagos por transferencia, Zelle, PayPal o efectivo contra entrega (según zona).",
  },
];

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.3s ease",
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ThumbsUpIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={active ? "#D4AF37" : "none"}
      stroke={active ? "#D4AF37" : "#8A8A8A"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbsDownIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={active ? "#8A8A8A" : "none"}
      stroke={active ? "#8A8A8A" : "#8A8A8A"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  );
}

function FAQItem({
  item,
  isOpen,
  isCopied,
  feedbackType,
  onToggle,
  onCopy,
  onFeedback,
}: {
  item: (typeof FAQ_DATA)[number];
  isOpen: boolean;
  isCopied: boolean;
  feedbackType: "up" | "down" | null;
  onToggle: () => void;
  onCopy: () => void;
  onFeedback: (type: "up" | "down") => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!answerRef.current || !contentRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isOpen) {
      const height = contentRef.current.scrollHeight;
      if (prefersReduced) {
        answerRef.current.style.height = "auto";
        answerRef.current.style.opacity = "1";
      } else {
        gsap.fromTo(
          answerRef.current,
          { height: 0, opacity: 0 },
          {
            height,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              if (answerRef.current) answerRef.current.style.height = "auto";
            },
          }
        );
      }
    } else {
      if (prefersReduced) {
        answerRef.current.style.height = "0px";
        answerRef.current.style.opacity = "0";
      } else {
        gsap.to(answerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isOpen]);

  return (
    <div
      data-faq-item
      className="border-b border-[rgba(212,175,55,0.1)] opacity-0"
    >
      <div className="flex items-center gap-3 py-5 sm:py-6">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between gap-4 text-left cursor-pointer group"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <span className="text-base sm:text-lg text-white group-hover:text-[#D4AF37] transition-colors duration-300">
            {item.question}
          </span>
          <ChevronIcon isOpen={isOpen} />
        </button>
        <button
          onClick={onCopy}
          className="flex-shrink-0 p-2 rounded-lg text-[#8A8A8A] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-200 cursor-pointer"
          title={isCopied ? "¡Copiado!" : "Copiar pregunta"}
        >
          {isCopied ? (
            <span className="text-[10px] text-[#D4AF37] font-semibold whitespace-nowrap">
              ✓ Copiado!
            </span>
          ) : (
            <CopyIcon />
          )}
        </button>
      </div>

      <div
        ref={answerRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div ref={contentRef} className="pb-6 pl-0 sm:pl-2">
          <p
            className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed max-w-3xl"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            {item.answer}
          </p>
          <div className="flex items-center gap-4 mt-5">
            <span
              className="text-[11px] text-[#8A8A8A]/60 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ¿Fue útil?
            </span>
            <button
              onClick={() => onFeedback("up")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer border ${
                feedbackType === "up"
                  ? "bg-[rgba(212,175,55,0.15)] border-[rgba(212,175,55,0.3)] text-[#D4AF37]"
                  : "bg-transparent border-[rgba(255,255,255,0.06)] text-[#8A8A8A] hover:border-[rgba(212,175,55,0.2)] hover:text-[#D4AF37]"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <ThumbsUpIcon active={feedbackType === "up"} />
              Sí
            </button>
            <button
              onClick={() => onFeedback("down")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer border ${
                feedbackType === "down"
                  ? "bg-[rgba(138,138,138,0.15)] border-[rgba(138,138,138,0.3)] text-[#8A8A8A]"
                  : "bg-transparent border-[rgba(255,255,255,0.06)] text-[#8A8A8A] hover:border-[rgba(138,138,138,0.2)]"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <ThumbsDownIcon active={feedbackType === "down"} />
              No me ayudó
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<
    Record<number, "up" | "down" | null>
  >({});
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const p = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }));
    setParticles(p);
  }, []);

  const filteredFAQs = FAQ_DATA.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
    );
  });

  const toggleItem = useCallback((id: number) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCopy = useCallback(async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleFeedback = useCallback((id: number, type: "up" | "down") => {
    setFeedback((prev) => {
      const current = prev[id];
      if (current === type) return { ...prev, [id]: null };
      return { ...prev, [id]: type };
    });
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (searchRef.current) {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!prefersReduced) {
        gsap.to(searchRef.current, {
          boxShadow: "0 0 0 2px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, []);

  const handleSearchBlur = useCallback(() => {
    if (searchRef.current) {
      gsap.to(searchRef.current, {
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (heroRef.current) {
          const heroH1 = heroRef.current.querySelector("h1");
          const heroP = heroRef.current.querySelector("p");

          if (heroH1) {
            gsap.fromTo(
              heroH1,
              { opacity: 0, y: 60, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.4,
                ease: "power3.out",
              }
            );
          }
          if (heroP) {
            gsap.fromTo(
              heroP,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" }
            );
          }
        }

        if (heroLineRef.current) {
          gsap.fromTo(
            heroLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              delay: 0.8,
              ease: "power2.inOut",
            }
          );
        }

        if (faqSectionRef.current) {
          const items =
            faqSectionRef.current.querySelectorAll("[data-faq-item]");
          if (items.length) {
            gsap.fromTo(
              items,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: faqSectionRef.current,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        }

        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
              },
            }
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const allEls = [
          heroRef.current,
          heroLineRef.current,
          faqSectionRef.current,
          ctaRef.current,
        ].filter(Boolean);
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
        });
        const heroH1 = heroRef.current?.querySelector("h1");
        const heroP = heroRef.current?.querySelector("p");
        if (heroH1) gsap.set(heroH1, { opacity: 1, y: 0, scale: 1 });
        if (heroP) gsap.set(heroP, { opacity: 1, y: 0 });
        if (heroLineRef.current)
          gsap.set(heroLineRef.current, { scaleX: 1 });
        const faqItems =
          faqSectionRef.current?.querySelectorAll("[data-faq-item]");
        faqItems?.forEach((item) => gsap.set(item, { opacity: 1, y: 0 }));
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* ===== SECTION 1: HERO ===== */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 md:pt-44 md:pb-24"
      >
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1] tracking-[-2px] opacity-0"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            background:
              "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Preguntas Frecuentes
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mt-8 leading-relaxed text-[#8A8A8A] opacity-0"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Todo lo que necesitas saber sobre nuestras piezas
        </p>
        <div
          ref={heroLineRef}
          className="mt-12 w-20 h-[1px] bg-[#D4AF37] origin-center"
        />
      </section>

      {/* ===== SECTION 2: SEARCH BAR ===== */}
      <section className="w-full px-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Buscar pregunta..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[#0A0A0A] text-white text-sm sm:text-base placeholder:text-[#8A8A8A]/50 focus:outline-none transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#8A8A8A] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all duration-200 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FAQ ACCORDION ===== */}
      <section className="w-full px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8A8A8A"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 opacity-40"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p
                className="text-[#8A8A8A] text-base sm:text-lg"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                No encontramos resultados para &ldquo;
                <span className="text-white">{searchQuery}</span>&rdquo;
              </p>
              <p
                className="text-[#8A8A8A]/60 text-sm mt-2"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Intenta con otras palabras clave
              </p>
            </div>
          ) : (
            <div ref={faqSectionRef}>
              {filteredFAQs.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={!!openItems[item.id]}
                  isCopied={copiedId === item.id}
                  feedbackType={feedback[item.id] ?? null}
                  onToggle={() => toggleItem(item.id)}
                  onCopy={() => handleCopy(item.id, item.question)}
                  onFeedback={(type) => handleFeedback(item.id, type)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION 4: CTA BANNER ===== */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden px-6 py-24 md:py-32 opacity-0"
      >
        {/* Radial gold glow */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(5,5,5,0) 70%)",
          }}
        />

        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#D4AF37]/30 pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animation: `float-${p.id % 5} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <style jsx>{`
          @keyframes float-0 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(20px, -30px);
            }
          }
          @keyframes float-1 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(-15px, -25px);
            }
          }
          @keyframes float-2 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(25px, -15px);
            }
          }
          @keyframes float-3 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(-20px, -35px);
            }
          }
          @keyframes float-4 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            50% {
              transform: translate(10px, -20px);
            }
          }
        `}</style>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] mb-6"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            ¿Tienes más{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              dudas
            </span>
            ?
          </h2>
          <p
            className="text-base sm:text-lg text-[#8A8A8A] mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Escríbenos por WhatsApp y te respondemos al instante
          </p>

          <a
            href="https://wa.me/584141234567?text=Hola,%20tengo%20una%20pregunta"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
            style={{
              fontFamily: "var(--font-inter)",
              background:
                "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
              color: "#050505",
            }}
          >
            <WhatsAppIcon />
            Escribir por WhatsApp
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
