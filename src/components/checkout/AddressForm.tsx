"use client"

import { useState } from "react"

interface AddressData {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  carrier: string
  officeCode: string
  reference: string
}

interface AddressFormProps {
  onSubmit: (address: AddressData) => void
  initialData?: Partial<AddressData>
}

const carriers = ["Zoom", "MRW", "DHL", "FedEx", "Otro"]

export default function AddressForm({ onSubmit, initialData }: AddressFormProps) {
  const [form, setForm] = useState<AddressData>({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    street: initialData?.street || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    carrier: initialData?.carrier || "",
    officeCode: initialData?.officeCode || "",
    reference: initialData?.reference || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: keyof AddressData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = "Nombre requerido"
    if (!form.phone.trim()) e.phone = "Teléfono requerido"
    if (!form.street.trim()) e.street = "Dirección requerida"
    if (!form.city.trim()) e.city = "Ciudad requerida"
    if (!form.state.trim()) e.state = "Estado requerido"
    if (!form.zipCode.trim()) e.zipCode = "Código postal requerido"
    if (!form.carrier) e.carrier = "Selecciona una transportadora"
    if ((form.carrier === "Zoom" || form.carrier === "MRW") && !form.officeCode.trim()) {
      e.officeCode = "Código de oficina requerido"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-lg bg-[var(--color-dark-accent)] border border-white/10 text-[var(--color-white)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors text-sm"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Nombre completo</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={inputClasses}
          />
          {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Teléfono</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClasses}
          />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Dirección</label>
        <input
          type="text"
          value={form.street}
          onChange={(e) => update("street", e.target.value)}
          className={inputClasses}
        />
        {errors.street && <p className="text-xs text-red-400 mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Ciudad</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className={inputClasses}
          />
          {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Estado</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            className={inputClasses}
          />
          {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Código postal</label>
          <input
            type="text"
            value={form.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            className={inputClasses}
          />
          {errors.zipCode && <p className="text-xs text-red-400 mt-1">{errors.zipCode}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Transportadora</label>
          <select
            value={form.carrier}
            onChange={(e) => update("carrier", e.target.value)}
            className={inputClasses}
          >
            <option value="">Seleccionar...</option>
            {carriers.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.carrier && <p className="text-xs text-red-400 mt-1">{errors.carrier}</p>}
        </div>
        {(form.carrier === "Zoom" || form.carrier === "MRW") && (
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">Código de oficina</label>
            <input
              type="text"
              value={form.officeCode}
              onChange={(e) => update("officeCode", e.target.value)}
              className={inputClasses}
            />
            {errors.officeCode && <p className="text-xs text-red-400 mt-1">{errors.officeCode}</p>}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs text-[var(--color-muted)] mb-1">Punto de referencia</label>
        <input
          type="text"
          value={form.reference}
          onChange={(e) => update("reference", e.target.value)}
          placeholder="Ej: frente al parque, casa amarilla"
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Continuar
      </button>
    </form>
  )
}
