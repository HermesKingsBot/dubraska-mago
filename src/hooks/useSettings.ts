"use client"

import { useState, useEffect, useCallback } from "react"
import { COMPANY_DEFAULTS, SOCIAL_DEFAULTS, type SocialLink } from "@/lib/defaults"

interface UseSettingsReturn {
  settings: Record<string, string>
  socialLinks: SocialLink[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

let cachedSettings: Record<string, string> | null = null
let cachedSocials: SocialLink[] | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Record<string, string>>(
    cachedSettings || COMPANY_DEFAULTS
  )
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    cachedSocials || SOCIAL_DEFAULTS
  )
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const now = Date.now()
      if (cachedSettings && cachedSocials && now - cacheTime < CACHE_TTL) {
        setSettings(cachedSettings)
        setSocialLinks(cachedSocials)
        setLoading(false)
        return
      }

      const [settingsRes, socialsRes] = await Promise.allSettled([
        fetch("/api/settings"),
        fetch("/api/social-links"),
      ])

      let newSettings = COMPANY_DEFAULTS
      let newSocials = SOCIAL_DEFAULTS

      if (settingsRes.status === "fulfilled" && settingsRes.value.ok) {
        const json = await settingsRes.value.json()
        if (json.success && json.data) {
          newSettings = { ...COMPANY_DEFAULTS, ...json.data }
        }
      }

      if (socialsRes.status === "fulfilled" && socialsRes.value.ok) {
        const json = await socialsRes.value.json()
        if (json.success && json.data) {
          newSocials = json.data
        }
      }

      cachedSettings = newSettings
      cachedSocials = newSocials
      cacheTime = Date.now()
      setSettings(newSettings)
      setSocialLinks(newSocials)
    } catch {
      setError("Error cargando configuración")
      setSettings(COMPANY_DEFAULTS)
      setSocialLinks(SOCIAL_DEFAULTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { settings, socialLinks, loading, error, refetch: fetchData }
}
