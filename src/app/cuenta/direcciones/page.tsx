"use client"

import { useEffect, useState } from "react"

interface Address {
  id: string
  label: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string | null
  carrier: string | null
  officeCode: string | null
  reference: string | null
  isDefault: boolean
}

const EMPTY_FORM = {
  label: "Casa", fullName: "", phone: "", street: "", city: "", state: "",
  zipCode: "", carrier: "", officeCode: "", reference: "", isDefault: false,
}

function Input({ label, name, value, onChange, required, ...rest }: {
  label: string; name: string; value: string; onChange: React.ChangeEventHandler; required?: boolean
} & Record<string, unknown>) {
  return (
    <div>
      <label className="block text-xs text-[var(--color-muted)] mb-1">{label}</label>
      <input name={name} value={value} onChange={onChange} required={required}
        className="w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-gold)]"
        {...rest} />
    </div>
  )
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { fetchAddresses() }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/customer/addresses", { credentials: "include" })
      const json = await res.json()
      if (json.success) setAddresses(json.data as Address[])
    } catch {} finally { setLoading(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(p => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError("")
    try {
      const body = { ...form, zipCode: form.zipCode || undefined, carrier: form.carrier || undefined,
        officeCode: form.officeCode || undefined, reference: form.reference || undefined }
      const url = editingId ? `/api/customer/addresses/${editingId}` : "/api/customer/addresses"
      const res = await fetch(url, { method: editingId ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!json.success) { setError(json.error || "Error al guardar"); return }
      await fetchAddresses(); setShowForm(false); setEditingId(null); setForm(EMPTY_FORM)
    } catch { setError("Error de red") } finally { setSaving(false) }
  }

  const handleEdit = (a: Address) => {
    setForm({ label: a.label, fullName: a.fullName, phone: a.phone, street: a.street, city: a.city,
      state: a.state, zipCode: a.zipCode || "", carrier: a.carrier || "", officeCode: a.officeCode || "",
      reference: a.reference || "", isDefault: a.isDefault })
    setEditingId(a.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/customer/addresses/${id}`, { method: "DELETE", credentials: "include" })
    await fetchAddresses()
  }

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/customer/addresses/${id}`, { method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isDefault: true }) })
    await fetchAddresses()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const inputCls = "w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-gold)]"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Direcciones</h2>
        {!showForm && (
          <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}
            className="bg-[var(--color-gold)] text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            + Nueva Dirección
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6 space-y-4">
          <h3 className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
            {editingId ? "Editar Dirección" : "Nueva Dirección"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Etiqueta</label>
              <select name="label" value={form.label} onChange={handleChange} className={inputCls}>
                <option value="Casa">Casa</option><option value="Oficina">Oficina</option><option value="Otro">Otro</option>
              </select>
            </div>
            <Input label="Nombre Completo" name="fullName" value={form.fullName} onChange={handleChange} required />
            <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} required />
            <Input label="Estado" name="state" value={form.state} onChange={handleChange} required />
            <Input label="Ciudad" name="city" value={form.city} onChange={handleChange} required />
            <Input label="Código Postal" name="zipCode" value={form.zipCode} onChange={handleChange} />
          </div>
          <Input label="Dirección Completa" name="street" value={form.street} onChange={handleChange} required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[var(--color-muted)] mb-1">Transportadora</label>
              <select name="carrier" value={form.carrier} onChange={handleChange} className={inputCls}>
                <option value="">Seleccionar</option><option value="Zoom">Zoom</option>
                <option value="MRW">MRW</option><option value="DHL">DHL</option>
              </select>
            </div>
            <Input label="Código de Oficina" name="officeCode" value={form.officeCode} onChange={handleChange} />
            <Input label="Referencia" name="reference" value={form.reference} onChange={handleChange} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="accent-[var(--color-gold)]" />
            Establecer como dirección predeterminada
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-[var(--color-gold)] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }}
              className="px-6 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-white transition-colors">Cancelar</button>
          </div>
        </form>
      )}

      {!showForm && addresses.length === 0 && (
        <div className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-12 text-center">
          <p className="text-[var(--color-muted)] mb-4">No tienes direcciones guardadas</p>
          <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}
            className="bg-[var(--color-gold)] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Agregar Dirección
          </button>
        </div>
      )}

      {!showForm && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map(a => (
            <div key={a.id} className={`bg-[var(--color-dark-card)] border rounded-xl p-4 ${a.isDefault ? "border-[var(--color-gold)]/30" : "border-white/5"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.label}</span>
                    {a.isDefault && <span className="text-xs bg-[var(--color-gold)]/10 text-[var(--color-gold)] px-2 py-0.5 rounded-full">Predeterminada</span>}
                  </div>
                  <p className="text-sm text-[var(--color-muted)] mt-1">{a.fullName} · {a.phone}</p>
                  <p className="text-sm text-[var(--color-muted)]">{a.street}</p>
                  <p className="text-sm text-[var(--color-muted)]">{a.city}, {a.state}{a.zipCode ? ` ${a.zipCode}` : ""}</p>
                  {a.carrier && <p className="text-xs text-[var(--color-muted)] mt-1">Transportadora: {a.carrier}{a.officeCode ? ` - ${a.officeCode}` : ""}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  {!a.isDefault && <button onClick={() => handleSetDefault(a.id)} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors">Predeterminar</button>}
                  <button onClick={() => handleEdit(a)} className="text-xs text-[var(--color-muted)] hover:text-white transition-colors">Editar</button>
                  <button onClick={() => handleDelete(a.id)} className="text-xs text-[var(--color-muted)] hover:text-red-400 transition-colors">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
