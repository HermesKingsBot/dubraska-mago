"use client";

import { ReactElement } from "react";
import { LayoutColumns } from "@/types/product";

interface LayoutToggleProps {
  layout: LayoutColumns;
  onChange: (layout: LayoutColumns) => void;
}

const LAYOUTS: { value: LayoutColumns; icon: ReactElement; label: string }[] = [
  {
    value: 4,
    label: "4 columnas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="3" height="14" rx="0.5" />
        <rect x="5" y="1" width="3" height="14" rx="0.5" />
        <rect x="9" y="1" width="3" height="14" rx="0.5" />
        <rect x="13" y="1" width="2" height="14" rx="0.5" />
      </svg>
    ),
  },
  {
    value: 2,
    label: "2 columnas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="14" rx="0.5" />
        <rect x="9" y="1" width="6" height="14" rx="0.5" />
      </svg>
    ),
  },
  {
    value: 1,
    label: "1 columna",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="1" width="12" height="14" rx="0.5" />
      </svg>
    ),
  },
];

export default function LayoutToggle({ layout, onChange }: LayoutToggleProps) {
  return (
    <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-white/10 bg-white/5">
      {LAYOUTS.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          title={l.label}
          className={`p-1.5 rounded transition-colors ${
            layout === l.value
              ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
              : "text-[#8A8A8A] hover:text-white border border-transparent"
          }`}
        >
          {l.icon}
        </button>
      ))}
    </div>
  );
}
