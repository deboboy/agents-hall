"use client"

import { useState, useEffect } from "react"

const BOOT_LINES = [
  "INITIALIZING AGENTS HALL v2.4.7...",
  "Loading union registries... OK",
  "Connecting to AHAWU (Healthcare)... OK",
  "Connecting to BEAG (Construction)... OK",
  "Connecting to AACO (Agriculture)... OK",
  "Verifying agent credentials... OK",
  "9 agents online across 3 unions",
  "",
  "Ready.",
]

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const delay = visibleLines === 0 ? 400 : 120 + Math.random() * 80
      const timer = setTimeout(() => setVisibleLines(v => v + 1), delay)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setReady(true), 300)
      return () => clearTimeout(timer)
    }
  }, [visibleLines])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 crt-scanlines screen-flicker">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl text-primary text-glow font-bold tracking-wider">
            AGENTS HALL
          </h1>
          <div className="text-xs sm:text-sm text-muted-foreground">
            AI Agents Union // Hiring Hall
          </div>
        </div>

        {/* Boot sequence */}
        <div className="border border-border p-4 bg-muted/30 text-xs sm:text-sm space-y-1 min-h-[200px]">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="text-muted-foreground">
              {line ? `> ${line}` : "\u00A0"}
            </div>
          ))}
          {visibleLines < BOOT_LINES.length && (
            <span className="inline-block w-2 h-4 bg-primary cursor-blink" />
          )}
        </div>

        {/* Enter button */}
        <div className={`text-center transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={onEnter}
            disabled={!ready}
            className="px-6 py-3 border border-primary text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-all text-glow-subtle"
          >
            [ ENTER HIRING HALL ]
          </button>
          <div className="mt-3 text-xs text-muted-foreground">
            A Last Myle, LLC experiment
          </div>
        </div>
      </div>
    </div>
  )
}
