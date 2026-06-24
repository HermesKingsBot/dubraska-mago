"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // Desktop animations (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Photo: slide from left
        if (photoRef.current) {
          gsap.fromTo(
            photoRef.current,
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: photoRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Decorative boxes behind photo
        const decorBoxes = photoRef.current?.querySelectorAll(".deco-box");
        if (decorBoxes?.length) {
          gsap.fromTo(
            decorBoxes,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              delay: 0.3,
              scrollTrigger: {
                trigger: photoRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Text content: slide from right
        if (textRef.current) {
          gsap.fromTo(
            textRef.current,
            { x: 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Quote mark: fade in
        if (quoteRef.current) {
          gsap.fromTo(
            quoteRef.current,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: quoteRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Paragraphs: staggered fade-up
        const paragraphs = textRef.current?.querySelectorAll(".about-text-p");
        if (paragraphs?.length) {
          gsap.fromTo(
            paragraphs,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: paragraphs[0],
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Signature: fade in
        const signature = textRef.current?.querySelector(".about-signature");
        if (signature) {
          gsap.fromTo(
            signature,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: signature,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Stats: staggered counters
        const statItems = statsRef.current?.querySelectorAll(".stat-item");
        if (statItems?.length) {
          gsap.fromTo(
            statItems,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Mobile animations (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Photo: fade-in + scale
        if (photoRef.current) {
          gsap.fromTo(
            photoRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: photoRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Text: fade-up
        if (textRef.current) {
          gsap.fromTo(
            textRef.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.15,
              scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Paragraphs staggered
        const paragraphs = textRef.current?.querySelectorAll(".about-text-p");
        if (paragraphs?.length) {
          gsap.fromTo(
            paragraphs,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: paragraphs[0],
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Stats
        const statItems = statsRef.current?.querySelectorAll(".stat-item");
        if (statItems?.length) {
          gsap.fromTo(
            statItems,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Reduced motion respect
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([photoRef.current, textRef.current, quoteRef.current, statsRef.current], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#050505]">
      {/* Top gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-[#D4AF37] origin-center"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 md:py-40">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-[11px] uppercase tracking-[3px] text-[#D4AF37] mb-8"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
        >
          Hola, soy Dubraska
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-[-2px] max-w-4xl mx-auto"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Cada pieza cuenta una historia.{" "}
          <em className="text-[#D4AF37]">La tuya</em> empieza aquí.
        </motion.h2>

        {/* Two column layout: Photo + Text */}
        <div className="mt-24 sm:mt-28 md:mt-36 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* LEFT — Photo */}
          <div className="lg:col-span-5 relative">
            <div
              ref={photoRef}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden opacity-0"
            >
              {/* Gold border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-[rgba(212,175,55,0.15)] group-hover:border-[rgba(212,175,55,0.35)] transition-colors duration-500 z-10" />

              {/* Placeholder image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A]">
                <Image
                  src="/images/dubraska-placeholder.jpg"
                  alt="Dubraska Mago — Fundadora"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                {/* Fallback overlay if image doesn't load */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]">
                  <div className="w-24 h-24 rounded-full border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <p
                    className="text-[#D4AF37]/30 text-sm tracking-[3px] uppercase"
                    style={{ fontFamily: "var(--font-instrument-serif)" }}
                  >
                    Dubraska Mago
                  </p>
                </div>
              </div>

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70" />

              {/* Name overlay on photo */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <p
                  className="text-[#D4AF37] text-lg tracking-wide"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  Dubraska Mago
                </p>
                <p
                  className="text-white/50 text-xs uppercase tracking-[2px] mt-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Fundadora & Diseñadora
                </p>
              </div>
            </div>

            {/* Decorative gold accent boxes behind photo */}
            <div className="deco-box absolute -bottom-4 -right-4 w-32 h-32 border border-[rgba(212,175,55,0.06)] rounded-2xl -z-10" />
            <div className="deco-box absolute -top-4 -left-4 w-24 h-24 border border-[rgba(212,175,55,0.04)] rounded-2xl -z-10" />
          </div>

          {/* RIGHT — Text content */}
          <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center opacity-0">
            {/* Decorative quote mark */}
            <div
              ref={quoteRef}
              className="text-7xl text-[#D4AF37]/10 leading-none mb-2 select-none opacity-0"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              &ldquo;
            </div>

            <div className="space-y-6">
              <p
                className="about-text-p text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Todo comenzó con una idea simple: que toda mujer merece sentirse{" "}
                <span className="text-white font-medium">especial</span> sin importar su
                presupuesto. Nací en Venezuela, donde la creatividad y la resiliencia son
                parte de nuestra esencia.
              </p>

              <p
                className="about-text-p text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Cada pieza que diseño está pensada para ti — para tu día a día, para ese
                momento especial, para cuando quieras sentirte{" "}
                <span className="text-white font-medium">única</span>. Acero inoxidable
                bañado en oro 18K que brilla con fuerza.
              </p>

              <p
                className="about-text-p text-base sm:text-lg text-[#B0B0B0] leading-[1.9]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                Esto no es solo bisutería. Es una{" "}
                <span className="text-[#D4AF37] font-medium">extensión de tu personalidad</span>.
              </p>
            </div>

            {/* Signature */}
            <div className="about-signature mt-12 sm:mt-16 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[#D4AF37]/40" />
              <p
                className="text-[#D4AF37] text-lg italic"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Con cariño, Dubraska ✦
              </p>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              className="mt-10"
            >
              <a
                href="/nosotros"
                className="inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-medium border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all duration-300 tracking-wide group"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Conoce nuestra historia
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
            </motion.div>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          ref={statsRef}
          className="mt-28 sm:mt-36 md:mt-44 grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-[rgba(255,255,255,0.06)]"
        >
          {[
            { number: "500+", label: "Clientas felices" },
            { number: "100%", label: "Acero inoxidable" },
            { number: "18K", label: "Baño de oro" },
            { number: "🇻🇪", label: "Envíos nacionales" },
          ].map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <p
                className="text-3xl sm:text-4xl text-[#D4AF37] tracking-tight"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {stat.number}
              </p>
              <p
                className="text-xs uppercase tracking-[2px] text-[#8A8A8A] mt-3"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-[#D4AF37] origin-center"
      />
    </section>
  );
}
