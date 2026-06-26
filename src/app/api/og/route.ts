import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") || "Dubraska Mago"
  const price = searchParams.get("price") || ""
  const brand = searchParams.get("brand") || "Dubraska Mago®"
  const image = searchParams.get("image") || ""

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F5E6A3"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="4" fill="url(#gold)"/>
  <rect x="0" y="626" width="1200" height="4" fill="url(#gold)"/>
  ${image ? `<image href="${image}" x="60" y="80" width="400" height="400" preserveAspectRatio="xMidYMid slice" clip-path="url(#imgClip)"/>
  <clipPath id="imgClip"><rect x="60" y="80" width="400" height="400" rx="16"/></clipPath>` : `
  <rect x="60" y="80" width="400" height="400" rx="16" fill="#111" stroke="#D4AF37" stroke-width="1" opacity="0.3"/>
  <text x="260" y="290" text-anchor="middle" fill="#D4AF37" font-size="48" font-family="serif">DM</text>`}
  <text x="${image ? '520' : '520'}" y="180" fill="#D4AF37" font-size="48" font-family="serif" font-weight="400">${escapeXml(title.length > 30 ? title.slice(0, 30) + '...' : title)}</text>
  ${price ? `<text x="520" y="250" fill="#FFFFFF" font-size="64" font-family="sans-serif" font-weight="300">$${escapeXml(price)}</text>` : ''}
  <text x="520" y="${price ? '320' : '260'}" fill="rgba(255,255,255,0.5)" font-size="20" font-family="sans-serif" letter-spacing="4">${escapeXml(brand)}</text>
  <line x1="520" y1="${price ? '360' : '300'}" x2="720" y2="${price ? '360' : '300'}" stroke="#D4AF37" stroke-width="1"/>
  <text x="520" y="${price ? '400' : '340'}" fill="rgba(255,255,255,0.3)" font-size="16" font-family="sans-serif">Acero inoxidable · Oro 18K</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
