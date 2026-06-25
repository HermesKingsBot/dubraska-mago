"use client"

import { useState, useRef, useEffect } from "react"

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const btn = containerRef.current.querySelector(
      `[data-tab="${activeTab}"]`
    ) as HTMLElement | null
    if (btn) {
      setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }, [activeTab])

  return (
    <div ref={containerRef} className="relative flex gap-1 overflow-x-auto scrollbar-hide">
      <div
        className="absolute bottom-0 h-[2px] bg-[var(--color-gold)] transition-all duration-300"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-tab={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
            activeTab === tab.id
              ? "text-[var(--color-gold)]"
              : "text-[var(--color-muted)] hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
