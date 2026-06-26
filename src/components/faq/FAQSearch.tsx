"use client"

import gsap from "gsap"

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

interface FAQSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  ref?: React.Ref<HTMLInputElement>
}

function FAQSearch({ searchQuery, onSearchChange, ref }: FAQSearchProps): React.JSX.Element {
  const handleFocus = () => {
    if (ref && typeof ref === "object" && ref.current) {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (!prefersReduced) {
        gsap.to(ref.current, {
          boxShadow: "0 0 0 2px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.1)",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }

  const handleBlur = () => {
    if (ref && typeof ref === "object" && ref.current) {
      gsap.to(ref.current, {
        boxShadow: "none",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  return (
    <section className="w-full px-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            ref={ref}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Buscar pregunta..."
            className="w-full pl-12 pr-12 py-4 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[oklch(0.145 0 0)] text-white text-sm sm:text-base placeholder:text-[var(--color-muted)]/50 focus:outline-none transition-colors duration-300"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--color-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all duration-200 cursor-pointer"
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
  )
}

export default FAQSearch
