"use client"

import { forwardRef } from "react"
import FAQItem, { FAQItemData } from "@/components/faq/FAQItem"

interface FAQListProps {
  filteredFAQs: FAQItemData[]
  searchQuery: string
  openItems: Record<number, boolean>
  copiedId: number | null
  feedback: Record<number, "up" | "down" | null>
  onToggle: (id: number) => void
  onCopy: (id: number, text: string) => void
  onFeedback: (id: number, type: "up" | "down") => void
}

const FAQList = forwardRef<HTMLDivElement, FAQListProps>(function FAQList(
  { filteredFAQs, searchQuery, openItems, copiedId, feedback, onToggle, onCopy, onFeedback },
  ref
) {
  if (filteredFAQs.length === 0) {
    return (
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
          No encontramos resultados para &ldquo
          <span className="text-white">{searchQuery}</span>&rdquo
        </p>
        <p
          className="text-[#8A8A8A]/60 text-sm mt-2"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          Intenta con otras palabras clave
        </p>
      </div>
    )
  }

  return (
    <div ref={ref}>
      {filteredFAQs.map((item) => (
        <FAQItem
          key={item.id}
          item={item}
          isOpen={!!openItems[item.id]}
          isCopied={copiedId === item.id}
          feedbackType={feedback[item.id] ?? null}
          onToggle={() => onToggle(item.id)}
          onCopy={() => onCopy(item.id, item.question)}
          onFeedback={(type) => onFeedback(item.id, type)}
        />
      ))}
    </div>
  )
})

export default FAQList
