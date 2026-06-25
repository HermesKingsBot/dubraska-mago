import { COMPANY_DEFAULTS, SOCIAL_DEFAULTS, type SocialLink } from "@/lib/defaults"

export async function getServerSettings(): Promise<Record<string, string>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error("Settings fetch failed")
    const json = await res.json()
    return { ...COMPANY_DEFAULTS, ...(json.data || {}) }
  } catch {
    return COMPANY_DEFAULTS
  }
}

export async function getServerSocialLinks(): Promise<SocialLink[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/social-links`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error("Social links fetch failed")
    const json = await res.json()
    return json.data || SOCIAL_DEFAULTS
  } catch {
    return SOCIAL_DEFAULTS
  }
}
