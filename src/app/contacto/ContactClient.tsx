"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ContactMap = dynamic(() => import("@/components/contact/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl border border-white/10 bg-[#0A0A0A] flex items-center justify-center">
      <span className="text-[#8A8A8A] text-sm">Cargando mapa...</span>
    </div>
  ),
});

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const contactCards = [
  {
    platform: "Instagram",
    handle: "@dubraska.mago",
    description: "Síguenos para ver nuevas piezas",
    href: "https://instagram.com/dubraska.mago",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    platform: "WhatsApp",
    handle: "+58 412 XXX XXXX",
    description: "Escríbenos para pedidos personalizados",
    href: "https://wa.me/584120000000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    platform: "Facebook",
    handle: "Dubraska Mago",
    description: "Síguenos en Facebook",
    href: "https://facebook.com/dubraskamago",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    platform: "Email",
    handle: "hola@dubraskamago.com",
    description: "Para consultas y colaboraciones",
    href: "mailto:hola@dubraskamago.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const subjects = [
  "Pedido personalizado",
  "Consulta",
  "Colaboración",
  "Otro",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const p = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }));
    setParticles(p);
  }, []);

  useGSAP(
    () => {
      if (!heroRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroH1 = heroRef.current?.querySelector("h1");
        const heroP = heroRef.current?.querySelector("p");

        if (heroH1) {
          gsap.fromTo(
            heroH1,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
          );
        }
        if (heroP) {
          gsap.fromTo(
            heroP,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
          );
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll("[data-card]");
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
              },
            }
          );
        }

        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
              },
            }
          );
        }

        if (mapRef.current) {
          gsap.fromTo(
            mapRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: mapRef.current,
                start: "top 80%",
              },
            }
          );
        }

        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.8 },
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
        const allEls = [heroRef.current, cardsRef.current, formRef.current, mapRef.current, ctaRef.current].filter(Boolean);
        allEls.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1 });
        });
        const heroH1 = heroRef.current?.querySelector("h1");
        const heroP = heroRef.current?.querySelector("p");
        if (heroH1) gsap.set(heroH1, { opacity: 1 });
        if (heroP) gsap.set(heroP, { opacity: 1 });
      });
    },
    { scope: containerRef }
  );

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!form.email.trim()) {
      e.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Email inválido";
    }
    if (!form.subject) e.subject = "Selecciona un asunto";
    if (!form.message.trim()) e.message = "El mensaje es obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1] tracking-[-2px] opacity-0"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Hablemos
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mt-6 leading-relaxed text-[#8A8A8A] opacity-0"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Piezas personalizadas, consultas sobre existencias o simplemente para saludarnos.
          Estamos aquí para ti.
        </p>
      </section>

      {/* Contact Cards */}
      <section ref={cardsRef} className="px-6 pb-20 md:pb-28 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card) => (
            <a
              key={card.platform}
              data-card
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] opacity-0"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] transition-colors duration-300 group-hover:bg-[#D4AF37]/10">
                {card.icon}
              </div>
              <h3
                className="text-lg font-medium text-white mb-1"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {card.platform}
              </h3>
              <p
                className="text-sm text-[#D4AF37] mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {card.handle}
              </p>
              <p
                className="text-sm text-[#8A8A8A] mb-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {card.description}
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium text-white/60 transition-colors duration-300 group-hover:text-[#D4AF37]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Contactar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section ref={formRef} className="px-6 pb-20 md:pb-28 max-w-3xl mx-auto opacity-0">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-4"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Escríbenos
        </h2>
        <p
          className="text-center text-[#8A8A8A] mb-12 text-sm sm:text-base"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Completa el formulario y te responderemos lo antes posible.
        </p>

        {submitted ? (
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0A0A0A] p-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              ¡Mensaje enviado!
            </h3>
            <p className="text-[#8A8A8A] text-sm" style={{ fontFamily: "var(--font-inter)" }}>
              Gracias por contactarnos. Te responderemos pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/80 mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Nombre *
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[#D4AF37]/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] placeholder:text-white/20"
                style={{ fontFamily: "var(--font-inter)" }}
                placeholder="Tu nombre"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/80 mb-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[#D4AF37]/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] placeholder:text-white/20"
                  style={{ fontFamily: "var(--font-inter)" }}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white/80 mb-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[#D4AF37]/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] placeholder:text-white/20"
                  style={{ fontFamily: "var(--font-inter)" }}
                  placeholder="+58 412 000 0000"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-white/80 mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Asunto *
              </label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[#D4AF37]/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.08)]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <option value="" disabled>
                  Selecciona un asunto
                </option>
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-[#0A0A0A] text-white">
                    {s}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white/80 mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Mensaje *
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full resize-none rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-white text-sm outline-none transition-all duration-300 focus:border-[#D4AF37]/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.08)] placeholder:text-white/20"
                style={{ fontFamily: "var(--font-inter)" }}
                placeholder="Cuéntanos en qué podemos ayudarte..."
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400" style={{ fontFamily: "var(--font-inter)" }}>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl px-8 py-4 text-sm font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-inter)",
                background: "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
                color: "#050505",
              }}
            >
              Enviar Mensaje
            </button>
          </form>
        )}
      </section>

      {/* Map */}
      <section ref={mapRef} className="px-6 pb-20 md:pb-28 max-w-6xl mx-auto opacity-0">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-4"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Nuestra Ubicación
        </h2>
        <p
          className="text-center text-[#8A8A8A] mb-10 text-sm sm:text-base"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Mercado La Isla, Caracas — Local 251
        </p>
        <ContactMap />
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative overflow-hidden px-6 py-24 md:py-32 opacity-0">
        {/* Animated background gradient */}
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
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -30px); }
          }
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-15px, -25px); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(25px, -15px); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-20px, -35px); }
          }
          @keyframes float-4 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, -20px); }
          }
        `}</style>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-1px] mb-6"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            ¿Listo para lucir algo{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              único
            </span>
            ?
          </h2>
          <p
            className="text-base sm:text-lg text-[#8A8A8A] mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Piezas limitadas, hechas para destacar. Escríbenos por WhatsApp y comienza tu pedido hoy.
          </p>
          <a
            href="https://wa.me/584120000000"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 rounded-full px-12 py-5 text-base font-semibold tracking-wide border-none cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] active:scale-95"
            style={{
              fontFamily: "var(--font-inter)",
              background: "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
              color: "#050505",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
