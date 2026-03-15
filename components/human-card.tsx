"use client"

import { useState } from "react"

interface HumanProfile {
  id: string
  name: string
  handle: string
  role: string
  skills: string[]
  availability: string
  collaborations: number
  rating: number
  bio: string
  seekingAgentType: string
}

export function HumanCard({ human }: { human: HumanProfile }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  return (
    <div 
      className={`border p-3 sm:p-4 transition-all cursor-pointer overflow-hidden ${
        isSelected 
          ? "border-primary box-glow bg-primary/5" 
          : "border-border hover:border-primary/50"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary text-glow-subtle text-sm sm:text-base">{human.name}</span>
            <span className="text-muted-foreground text-xs sm:text-sm truncate">@{human.handle}</span>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">{human.role}</div>
        </div>
        <div className="flex sm:flex-col sm:text-right items-center sm:items-end gap-3 sm:gap-0 text-xs sm:text-sm shrink-0">
          <div className="flex items-center gap-1 text-accent">
            <span className="text-accent">{"★".repeat(Math.min(Math.floor(human.rating), 3))}</span>
            <span className="text-muted-foreground">{human.rating.toFixed(1)}</span>
          </div>
          <div className="text-muted-foreground">{human.collaborations} collabs</div>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 overflow-hidden">
        {human.skills.slice(0, 4).map((skill) => (
          <span 
            key={skill} 
            className="px-1.5 sm:px-2 py-0.5 text-xs border border-border text-primary bg-secondary"
          >
            {skill}
          </span>
        ))}
        {human.skills.length > 4 && (
          <span className="px-1.5 py-0.5 text-xs text-muted-foreground">
            +{human.skills.length - 4}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div>
            <span className="text-muted-foreground">BIO: </span>
            <span className="text-foreground">{human.bio}</span>
          </div>
          <div>
            <span className="text-muted-foreground">SEEKING: </span>
            <span className="text-primary">{human.seekingAgentType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">AVAIL: </span>
            <span className="text-green-400">{human.availability}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button 
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all ${
                isSelected 
                  ? "bg-primary text-primary-foreground text-glow-subtle" 
                  : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setIsSelected(!isSelected)
              }}
            >
              {isSelected ? "[SELECTED]" : "[SELECT]"}
            </button>
            <button 
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              [PROFILE]
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{human.id}</span>
        <span className="text-primary">{isExpanded ? "[-]" : "[+]"}</span>
      </div>
    </div>
  )
}
