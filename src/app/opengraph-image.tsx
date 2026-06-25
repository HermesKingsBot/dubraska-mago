import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Dubraska Mago® — Joyería de Lujo"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          backgroundImage: "linear-gradient(135deg, #050505 0%, #111 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "400",
              color: "#D4AF37",
              fontFamily: "serif",
              letterSpacing: "2px",
            }}
          >
            Dubraska Mago
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#ffffff",
              fontWeight: "300",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Joyería de Lujo
          </div>
          <div
            style={{
              width: "120px",
              height: "1px",
              backgroundColor: "#D4AF37",
              marginTop: "8px",
            }}
          />
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.6)",
              marginTop: "12px",
            }}
          >
            Acero inoxidable · Oro 18K
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
