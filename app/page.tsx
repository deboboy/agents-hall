"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { TerminalHeader } from "@/components/terminal-header"
import { UnionSidebar } from "@/components/union-sidebar"
import { HiringHall } from "@/components/hiring-hall"
import { FeedbackForm } from "@/components/feedback-form"

export default function HomePage() {
  const [entered, setEntered] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  if (!entered) {
    return <SplashScreen onEnter={() => setEntered(true)} />
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden flex flex-col crt-scanlines screen-flicker">
      <TerminalHeader onFeedback={() => setShowFeedback(true)} />
      <div className="flex-1 flex overflow-hidden">
        <UnionSidebar onFeedback={() => setShowFeedback(true)} />
        <HiringHall />
      </div>
      <FeedbackForm
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  )
}
