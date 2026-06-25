"use client"

import { useState } from "react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [inputVal, setInputVal] = useState(value)
  const [imgError, setImgError] = useState(false)

  const handleApply = () => {
    setImgError(false)
    onChange(inputVal)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="url"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded-lg border border-white/10 bg-[var(--color-dark-card)] px-3 py-2 text-white text-sm outline-none focus:border-[var(--color-gold)]/50 transition-colors"
        />
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all"
        >
          Aplicar
        </button>
        {inputVal && (
          <button
            type="button"
            onClick={() => {
              setInputVal("")
              onChange("")
              setImgError(false)
            }}
            className="px-3 py-2 rounded-lg border border-white/10 text-[var(--color-muted)] text-sm hover:text-red-400 hover:border-red-400/50 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
      {value && (
        <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
          {!imgError ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-contain bg-[var(--color-dark-card)]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-dark-card)] text-[var(--color-muted)] text-xs">
              Error al cargar
            </div>
          )}
        </div>
      )}
    </div>
  )
}
