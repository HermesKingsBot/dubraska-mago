import db from '@/lib/db'
import { COMPANY_DEFAULTS, SOCIAL_DEFAULTS } from '@/lib/defaults'

let cachedSettings: { data: Record<string, string>, expiry: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

export async function getSetting(key: string, fallback = ''): Promise<string> {
  try {
    const setting = await db.setting.findUnique({ where: { key } })
    return setting?.value ?? COMPANY_DEFAULTS[key] ?? fallback
  } catch {
    return COMPANY_DEFAULTS[key] ?? fallback
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const settings = await db.setting.findMany()
    const result: Record<string, string> = { ...COMPANY_DEFAULTS }
    for (const s of settings) {
      result[s.key] = s.value
    }
    return result
  } catch {
    return { ...COMPANY_DEFAULTS }
  }
}

export async function getSettingsByGroup(group: string): Promise<Array<{ key: string, value: string, label: string | null }>> {
  try {
    const settings = await db.setting.findMany({
      where: { group },
      orderBy: { order: 'asc' },
    })
    return settings.map(s => ({ key: s.key, value: s.value, label: s.label }))
  } catch {
    return []
  }
}

export async function getActiveSocialLinks(): Promise<Array<{
  id: string
  platform: string
  url: string
  handle: string | null
  order: number
}>> {
  try {
    const links = await db.socialLink.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return links
  } catch {
    return SOCIAL_DEFAULTS.map((s, i) => ({
      id: `fallback-${i}`,
      platform: s.platform,
      url: s.url,
      handle: s.handle,
      order: i,
    }))
  }
}

export async function getAllSocialLinks(): Promise<Array<{
  id: string
  platform: string
  url: string
  handle: string | null
  active: boolean
  order: number
}>> {
  try {
    const links = await db.socialLink.findMany({
      orderBy: { order: 'asc' },
    })
    return links
  } catch {
    return []
  }
}

export async function getCachedSettings(): Promise<Record<string, string>> {
  const now = Date.now()
  if (cachedSettings && now < cachedSettings.expiry) {
    return cachedSettings.data
  }
  const data = await getAllSettings()
  cachedSettings = { data, expiry: now + CACHE_TTL }
  return data
}

export function clearSettingsCache(): void {
  cachedSettings = null
}
