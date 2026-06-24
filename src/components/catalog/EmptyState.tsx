"use client";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8A8A8A"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
      </div>
      <h3
        className="text-white text-lg mb-2"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        No encontramos resultados
      </h3>
      <p
        className="text-[#8A8A8A] text-sm max-w-md mb-6"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Intenta ajustar los filtros o el término de búsqueda para encontrar lo que buscas.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2.5 rounded-lg bg-[#D4AF37] text-[#050505] text-sm font-medium hover:bg-[#E8C96A] transition-colors"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Limpiar filtros
      </button>
    </div>
  );
}
