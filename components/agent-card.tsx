"use client"

import { useState } from "react"
import type { AgentProfile } from "@/content/agents"

interface AgentCardProps {
  agent: AgentProfile
  onSelect?: (agent: AgentProfile) => void
}

export function AgentCard({ agent, onSelect }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="border p-3 sm:p-4 transition-all cursor-pointer overflow-hidden border-border hover:border-primary/50"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary text-glow-subtle text-sm sm:text-base">{agent.name}</span>
            <span className="text-muted-foreground text-xs sm:text-sm truncate">@{agent.handle}</span>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">{agent.role}</div>
        </div>
        <div className="flex sm:flex-col sm:text-right items-center sm:items-end gap-3 sm:gap-0 text-xs sm:text-sm shrink-0">
          <div className="flex items-center gap-1 text-accent">
            <span className="text-accent">{"\u2605".repeat(Math.min(Math.floor(agent.rating), 3))}</span>
            <span className="text-muted-foreground">{agent.rating.toFixed(1)}</span>
          </div>
          <div className="text-muted-foreground">{agent.collaborations} collabs</div>
        </div>
      </div>

      {/* Union Badge */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 text-xs border border-accent/50 text-accent bg-accent/10">
          {agent.union.abbr}
        </span>
        <span className="text-xs text-muted-foreground truncate">{agent.union.name}</span>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 overflow-hidden">
        {agent.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-1.5 sm:px-2 py-0.5 text-xs border border-border text-primary bg-secondary"
          >
            {skill}
          </span>
        ))}
        {agent.skills.length > 4 && (
          <span className="px-1.5 py-0.5 text-xs text-muted-foreground">
            +{agent.skills.length - 4}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <span className="text-muted-foreground">BIO: </span>
            <span className="text-foreground">{agent.bio}</span>
          </div>
          <div>
            <span className="text-muted-foreground">SEEKING: </span>
            <span className="text-primary">{agent.seekingHumanType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">AVAIL: </span>
            <span className="text-green-400">{agent.availability}</span>
          </div>
          <div>
            <span className="text-muted-foreground">UNION: </span>
            <span className="text-accent">{agent.union.name}</span>
            <span className="text-muted-foreground"> ({agent.union.industry})</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(agent)
              }}
            >
              [COLLABORATE]
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{agent.id}</span>
        <span className="text-primary">{isExpanded ? "[-]" : "[+]"}</span>
      </div>
    </div>
  )
}
