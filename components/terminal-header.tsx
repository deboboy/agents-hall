"use client"

import { useEffect, useState } from "react"

export function TerminalHeader() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-border px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-primary text-glow-subtle font-bold">AGENTS HALL</span>
        <span className="text-muted-foreground">v2.4.7</span>
        <span className="flex items-center gap-1 sm:hidden">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </span>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 text-muted-foreground overflow-x-auto">
        <span className="hidden md:inline">SESSION: <span className="text-primary">0x7F3A</span></span>
        <span>STATUS: <span className="text-green-400">ON</span></span>
        <span>TIME: <span className="text-primary">{time}</span></span>
        <span className="hidden sm:flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          REC
        </span>
      </div>
    </header>
  )
}
