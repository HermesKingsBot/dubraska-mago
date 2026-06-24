"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"

export interface FAQItemData {
  id: number
  question: string
  answer: string
}

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
  )
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
  )
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
  )
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
  )
}

interface FAQItemProps {
  item: FAQItemData
  isOpen: boolean
  isCopied: boolean
  feedbackType: "up" | "down" | null
  onToggle: () => void
  onCopy: () => void
  onFeedback: (type: "up" | "down") => void
}

export default function FAQItem({
  item,
  isOpen,
  isCopied,
  feedbackType,
  onToggle,
  onCopy,
  onFeedback,
}: FAQItemProps) {
  const answerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!answerRef.current || !contentRef.current) return
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (isOpen) {
      const height = contentRef.current.scrollHeight
      if (prefersReduced) {
        answerRef.current.style.height = "auto"
        answerRef.current.style.opacity = "1"
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
              if (answerRef.current) answerRef.current.style.height = "auto"
            },
          }
        )
      }
    } else {
      if (prefersReduced) {
        answerRef.current.style.height = "0px"
        answerRef.current.style.opacity = "0"
      } else {
        gsap.to(answerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        })
      }
    }
  }, [isOpen])

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
  )
}
