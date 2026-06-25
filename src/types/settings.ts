export interface SocialLink {
  id: string
  platform: string
  handle: string
  url: string
  active: boolean
  order: number
}

export interface SettingsContextType {
  settings: Record<string, string>
  socialLinks: SocialLink[]
  loading: boolean
  getSetting: (key: string, fallback?: string) => string
  getActiveSocials: () => SocialLink[]
  refresh: () => Promise<void>
}

export type SettingFieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "phone"
  | "toggle"
  | "image"
  | "select"

export interface SettingField {
  key: string
  label: string
  type: SettingFieldType
  placeholder?: string
  options?: string[]
  fallback?: string
}
