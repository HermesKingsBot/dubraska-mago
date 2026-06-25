"use client"

import { useState } from "react"
import Tabs from "@/components/office/Tabs"
import SettingsForm from "@/components/office/SettingsForm"
import ImageUpload from "@/components/office/ImageUpload"
import SocialLinksManager from "@/components/office/SocialLinksManager"
import { useSettingsContext } from "@/context/SettingsContext"
import type { SettingField } from "@/types/settings"
import type { SocialLink } from "@/lib/defaults"

const TABS = [
  { id: "general", label: "General" },
  { id: "contacto", label: "Contacto" },
  { id: "redes", label: "Redes Sociales" },
  { id: "pagos", label: "Pagos" },
  { id: "envios", label: "Envíos y Features" },
]

const GENERAL_FIELDS: SettingField[] = [
  { key: "company_name", label: "Nombre de la empresa", type: "text", placeholder: "Dubraska Mago" },
  { key: "company_slogan", label: "Slogan", type: "text", placeholder: "Joyería de Lujo" },
  { key: "company_description", label: "Descripción", type: "textarea", placeholder: "Descripción de la empresa..." },
]

const CONTACT_FIELDS: SettingField[] = [
  { key: "email", label: "Email", type: "email", placeholder: "hola@ejemplo.com" },
  { key: "phone", label: "Teléfono", type: "phone", placeholder: "+58 412 000 0000" },
  { key: "whatsapp", label: "WhatsApp (solo números)", type: "phone", placeholder: "584120000000" },
  { key: "address", label: "Dirección", type: "text", placeholder: "Calle, local, etc." },
  { key: "city", label: "Ciudad", type: "text" },
  { key: "state", label: "Estado", type: "text" },
  { key: "country", label: "País", type: "text" },
  { key: "schedule", label: "Horario", type: "textarea", placeholder: "Lunes a Sábado: 10am - 7pm" },
  { key: "map_lat", label: "Latitud del mapa", type: "text", placeholder: "10.4806" },
  { key: "map_lng", label: "Longitud del mapa", type: "text", placeholder: "-66.9036" },
]

const PAYMENT_FIELDS: SettingField[] = [
  { key: "bank_name", label: "Banco", type: "text" },
  { key: "bank_account", label: "Nº de cuenta", type: "text" },
  { key: "bank_holder", label: "Titular", type: "text" },
  { key: "bank_rif", label: "RIF / CI", type: "text" },
  { key: "pagomovil_phone", label: "Pago Móvil — Teléfono", type: "phone" },
  { key: "pagomovil_bank", label: "Pago Móvil — Banco", type: "text" },
  { key: "pagomovil_ci", label: "Pago Móvil — CI", type: "text" },
  { key: "zelle_email", label: "Zelle — Email", type: "email" },
  { key: "paypal_email", label: "PayPal — Email", type: "email" },
]

const SHIPPING_FIELDS: SettingField[] = [
  { key: "shipping_enabled", label: "Mostrar info de envíos", type: "toggle" },
  { key: "shipping_info", label: "Texto de envíos", type: "textarea", placeholder: "Info de envíos..." },
  { key: "cashea_enabled", label: "Mostrar Cashea", type: "toggle" },
  { key: "cashea_info", label: "Info de Cashea", type: "textarea", placeholder: "Info de Cashea..." },
  { key: "free_shipping_threshold", label: "Envío gratis desde ($)", type: "text", placeholder: "100" },
  { key: "return_days", label: "Días para devolución", type: "text", placeholder: "15" },
]

export default function ConfiguracionPage() {
  const { settings, socialLinks, refresh } = useSettingsContext()
  const [activeTab, setActiveTab] = useState("general")
  const [localSettings, setLocalSettings] = useState(settings)
  const [localSocials, setLocalSocials] = useState<SocialLink[]>(socialLinks)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<"success" | "error" | null>(null)

  const showToast = (type: "success" | "error") => {
    setToast(type)
    setTimeout(() => setToast(null), type === "success" ? 2000 : 3000)
  }

  const handleSaveSettings = async (values: Record<string, string>) => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed")
      setLocalSettings((prev) => ({ ...prev, ...values }))
      await refresh()
      showToast("success")
    } catch {
      showToast("error")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSocials = async (links: SocialLink[]) => {
    setSaving(true)
    try {
      const res = await fetch("/api/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links),
      })
      if (!res.ok) throw new Error("Failed")
      setLocalSocials(links)
      await refresh()
      showToast("success")
    } catch {
      showToast("error")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoChange = (url: string) => {
    const updated = { ...localSettings, logo_url: url }
    setLocalSettings(updated)
    handleSaveSettings({ logo_url: url })
  }

  const handleFaviconChange = (url: string) => {
    const updated = { ...localSettings, favicon_url: url }
    setLocalSettings(updated)
    handleSaveSettings({ favicon_url: url })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl text-white"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Configuración
        </h1>
        {toast && (
          <span
            className={`text-sm ${
              toast === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {toast === "success" ? "Guardado" : "Error al guardar"}
          </span>
        )}
      </div>

      <div className="border-b border-white/10 mb-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
            <ImageUpload
              value={localSettings.logo_url || ""}
              onChange={handleLogoChange}
              label="Logo URL"
            />
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
            <ImageUpload
              value={localSettings.favicon_url || ""}
              onChange={handleFaviconChange}
              label="Favicon URL"
            />
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
            <SettingsForm
              fields={GENERAL_FIELDS}
              values={localSettings}
              onSave={handleSaveSettings}
            />
          </div>
        </div>
      )}

      {activeTab === "contacto" && (
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
          <SettingsForm
            fields={CONTACT_FIELDS}
            values={localSettings}
            onSave={handleSaveSettings}
          />
        </div>
      )}

      {activeTab === "redes" && (
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
          <SocialLinksManager
            links={localSocials}
            onChange={setLocalSocials}
            onSave={handleSaveSocials}
          />
        </div>
      )}

      {activeTab === "pagos" && (
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
          <SettingsForm
            fields={PAYMENT_FIELDS}
            values={localSettings}
            onSave={handleSaveSettings}
          />
        </div>
      )}

      {activeTab === "envios" && (
        <div className="p-4 rounded-xl border border-white/10 bg-[var(--color-dark-card)]">
          <SettingsForm
            fields={SHIPPING_FIELDS}
            values={localSettings}
            onSave={handleSaveSettings}
          />
        </div>
      )}
    </div>
  )
}
