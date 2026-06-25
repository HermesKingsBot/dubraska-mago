"use client"

import { useState } from "react"
import type { SettingField } from "@/types/settings"

interface SettingsFormProps {
  fields: SettingField[]
  values: Record<string, string>
  onSave: (values: Record<string, string>) => void
}

export default function SettingsForm({ fields, values, onSave }: SettingsFormProps) {
  const [local, setLocal] = useState<Record<string, string>>({ ...values })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<"success" | "error" | null>(null)

  const handleChange = (key: string, val: string) => {
    setLocal((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setToast(null)
    try {
      onSave(local)
      setToast("success")
      setTimeout(() => setToast(null), 2000)
    } catch {
      setToast("error")
      setTimeout(() => setToast(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              value={local[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-[var(--color-dark-card)] px-3 py-2 text-white text-sm outline-none focus:border-[var(--color-gold)]/50 transition-colors resize-none"
            />
          ) : field.type === "toggle" ? (
            <button
              type="button"
              onClick={() =>
                handleChange(
                  field.key,
                  local[field.key] === "true" ? "false" : "true"
                )
              }
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                local[field.key] === "true"
                  ? "bg-[var(--color-gold)]"
                  : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  local[field.key] === "true"
                    ? "translate-x-6"
                    : "translate-x-0"
                }`}
              />
            </button>
          ) : field.type === "select" ? (
            <select
              value={local[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[var(--color-dark-card)] px-3 py-2 text-white text-sm outline-none focus:border-[var(--color-gold)]/50"
            >
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="bg-[var(--color-dark-card)]">
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === "phone" ? "tel" : field.type}
              value={local[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-white/10 bg-[var(--color-dark-card)] px-3 py-2 text-white text-sm outline-none focus:border-[var(--color-gold)]/50 transition-colors"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        {toast === "success" && (
          <span className="text-sm text-green-400">Guardado correctamente</span>
        )}
        {toast === "error" && (
          <span className="text-sm text-red-400">Error al guardar</span>
        )}
      </div>
    </div>
  )
}
