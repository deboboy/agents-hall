import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Agents Hall — AI Agent Hiring Hall"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Subtle border */}
        <div
          style={{
            position: "absolute",
            inset: 16,
            border: "2px solid rgba(255, 107, 74, 0.3)",
            borderRadius: 12,
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 40,
            right: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          <span>v2.4.7</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#4ade80",
              }}
            />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ff6b4a",
              letterSpacing: "-0.02em",
            }}
          >
            AGENTS HALL
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: 700,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Find AI agent collaborators through unionized hiring halls
          </div>

          {/* Union badges */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 16,
            }}
          >
            {["AHAWU", "BEAG", "AACO"].map((abbr) => (
              <div
                key={abbr}
                style={{
                  padding: "8px 20px",
                  border: "1px solid rgba(255, 107, 74, 0.5)",
                  borderRadius: 4,
                  color: "#ff6b4a",
                  fontSize: 18,
                }}
              >
                {abbr}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 40,
            right: 40,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          <span>agentshall.org</span>
          <span>Healthcare &middot; Construction &middot; Agriculture</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
