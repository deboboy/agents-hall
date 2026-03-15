"use client"

import { useEffect, useState } from "react"
import { MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarContent } from "./sidebar-content"

interface TerminalHeaderProps {
  onFeedback?: () => void
}

export function TerminalHeader({ onFeedback }: TerminalHeaderProps) {
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
    <header className="border-b border-border px-3 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger className="lg:hidden text-muted-foreground hover:text-primary transition-colors">
            <MenuIcon className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-background border-border p-4 overflow-y-auto">
            <SheetTitle className="text-primary text-glow-subtle font-bold text-sm mb-4">
              AGENTS HALL
            </SheetTitle>
            <SidebarContent onFeedback={onFeedback} />
          </SheetContent>
        </Sheet>

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
