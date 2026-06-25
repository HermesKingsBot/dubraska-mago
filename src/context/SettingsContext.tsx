"use client"

import { createContext, useContext, useCallback, type ReactNode } from "react"
import { useSettings } from "@/hooks/useSettings"
import { COMPANY_DEFAULTS, SOCIAL_DEFAULTS, type SocialLink } from "@/lib/defaults"
import type { SettingsContextType } from "@/types/settings"

const SettingsContext = createContext<SettingsContextType>({
  settings: COMPANY_DEFAULTS,
  socialLinks: SOCIAL_DEFAULTS,
  loading: true,
  getSetting: (key, fallback) => fallback || "",
  getActiveSocials: () => [],
  refresh: async () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { settings, socialLinks, loading, refetch } = useSettings()

  const getSetting = useCallback(
    (key: string, fallback?: string) => {
      return settings[key] || fallback || COMPANY_DEFAULTS[key] || ""
    },
    [settings]
  )

  const getActiveSocials = useCallback(() => {
    return socialLinks
      .filter((s) => s.active)
      .sort((a, b) => a.order - b.order)
  }, [socialLinks])

  return (
    <SettingsContext.Provider
      value={{ settings, socialLinks, loading, getSetting, getActiveSocials, refresh: refetch }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  return useContext(SettingsContext)
}

export type { SocialLink }
