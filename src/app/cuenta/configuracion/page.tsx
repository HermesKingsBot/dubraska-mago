"use client"

import { useEffect, useState } from "react"

interface CustomerData { id: string; name: string; email: string; phone: string | null }

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    fetch("/api/customer/auth/me", { credentials: "include" })
      .then(r => r.json()).then(j => {
        if (j.success && j.data) { const d = j.data as CustomerData; setName(d.name); setEmail(d.email); setPhone(d.phone || "") }
      }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingProfile(true); setProfileMsg(""); setProfileError("")
    try {
      const res = await fetch("/api/customer/auth/me", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || null }),
      })
      const json = await res.json()
      if (!json.success) { setProfileError(json.error || "Error al actualizar"); return }
      setProfileMsg("Perfil actualizado correctamente")
    } catch { setProfileError("Error de red") } finally { setSavingProfile(false) }
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingPassword(true); setPasswordMsg(""); setPasswordError("")
    if (newPassword !== confirmPassword) { setPasswordError("Las contraseñas no coinciden"); setSavingPassword(false); return }
    if (newPassword.length < 6) { setPasswordError("Mínimo 6 caracteres"); setSavingPassword(false); return }
    try {
      const res = await fetch("/api/customer/auth/me", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const json = await res.json()
      if (!json.success) { setPasswordError(json.error || "Error al cambiar contraseña"); return }
      setPasswordMsg("Contraseña cambiada correctamente")
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    } catch { setPasswordError("Error de red") } finally { setSavingPassword(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" /></div>

  const inputCls = "w-full bg-[var(--color-bg)] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-gold)]"
  const btnCls = "bg-[var(--color-gold)] text-black px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"

  return (
    <div className="space-y-8 max-w-lg">
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Configuración</h2>

      <form onSubmit={handleProfile} className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Editar Perfil</h3>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Nombre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Teléfono</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
        </div>
        {profileMsg && <p className="text-green-400 text-sm">{profileMsg}</p>}
        {profileError && <p className="text-red-400 text-sm">{profileError}</p>}
        <button type="submit" disabled={savingProfile} className={btnCls}>{savingProfile ? "Guardando..." : "Guardar Cambios"}</button>
      </form>

      <form onSubmit={handlePassword} className="bg-[var(--color-dark-card)] border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>Cambiar Contraseña</h3>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Contraseña Actual</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Nueva Contraseña</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-muted)] mb-1">Confirmar Contraseña</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} className={inputCls} />
        </div>
        {passwordMsg && <p className="text-green-400 text-sm">{passwordMsg}</p>}
        {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
        <button type="submit" disabled={savingPassword} className={btnCls}>{savingPassword ? "Cambiando..." : "Cambiar Contraseña"}</button>
      </form>
    </div>
  )
}
