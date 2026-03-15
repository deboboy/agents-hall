"use client"

import { useState, useEffect } from "react"
import { AgentCard } from "./agent-card"
import { ProfileForm } from "./profile-form"
import { FeedbackForm } from "./feedback-form"
import { AGENTS, type AgentProfile } from "@/content/agents"
import { commandContent } from "@/content/commands"
import { getProfile, type HumanProfile } from "@/lib/db"

export function HiringHall() {
  const [searchTerm, setSearchTerm] = useState("")
  const [profile, setProfile] = useState<HumanProfile | null>(null)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [pendingAgentId, setPendingAgentId] = useState<string | null>(null)
  const [output, setOutput] = useState<string[]>([
    "--- AI AGENTS UNION ---",
    "--- HIRING HALL ---",
    "",
    "Browse AI agent collaborators.",
    `> ${AGENTS.length} agents loaded across 3 unions`,
    "> Type 'help' or 'about' for more info",
    "",
  ])

  // Load profile from IndexedDB on mount
  useEffect(() => {
    getProfile().then(p => {
      if (p) setProfile(p)
    })
  }, [])

  const filteredAgents = AGENTS.filter(agent => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      agent.name.toLowerCase().includes(searchLower) ||
      agent.role.toLowerCase().includes(searchLower) ||
      agent.skills.some(s => s.toLowerCase().includes(searchLower)) ||
      agent.union.industry.toLowerCase().includes(searchLower) ||
      agent.union.abbr.toLowerCase().includes(searchLower)
    )
  })

  const handleSelectAgent = (agent: AgentProfile) => {
    if (selectedAgentId === agent.id) {
      // Deselect
      setSelectedAgentId(null)
      return
    }

    if (!profile) {
      // No profile yet — open profile form, remember which agent they wanted
      setPendingAgentId(agent.id)
      setShowProfileForm(true)
      return
    }

    setSelectedAgentId(agent.id)
  }

  const handleProfileSaved = (saved: HumanProfile) => {
    setProfile(saved)
    setShowProfileForm(false)

    // If they were trying to select an agent, complete that selection
    if (pendingAgentId) {
      setSelectedAgentId(pendingAgentId)
      setPendingAgentId(null)
    }

    const newOutput = [
      ...output,
      `> Profile ${saved.id} saved: ${saved.name} (@${saved.handle})`,
      ""
    ]
    setOutput(newOutput.slice(-50))
  }

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    const newOutput = [...output, `user@hall:~$ ${command}`, ""]

    if (cmd === "list") {
      newOutput.push(
        `Found ${AGENTS.length} agents in registry:`,
        ...AGENTS.map(a => `  [${a.id}] ${a.name} - ${a.role} (${a.union.abbr})`),
        ""
      )
    } else if (cmd === "unions") {
      const unions = [...new Set(AGENTS.map(a => a.union.abbr))]
      for (const abbr of unions) {
        const union = AGENTS.find(a => a.union.abbr === abbr)!.union
        const count = AGENTS.filter(a => a.union.abbr === abbr).length
        newOutput.push(`  [${abbr}] ${union.name} — ${union.industry} (${count} agents)`)
      }
      newOutput.push("")
    } else if (cmd.startsWith("search ")) {
      const term = cmd.replace("search ", "").trim()
      setSearchTerm(term)
      const matches = AGENTS.filter(a =>
        a.skills.some(s => s.toLowerCase().includes(term.toLowerCase())) ||
        a.role.toLowerCase().includes(term.toLowerCase()) ||
        a.union.industry.toLowerCase().includes(term.toLowerCase()) ||
        a.union.abbr.toLowerCase().includes(term.toLowerCase())
      )
      newOutput.push(
        `Searching for: "${term}"...`,
        `Found ${matches.length} matching agents.`,
        ""
      )
    } else if (cmd === "clear") {
      setSearchTerm("")
      newOutput.push("Search filter cleared.", "")
    } else if (cmd === "profile") {
      if (profile) {
        newOutput.push(
          `YOUR PROFILE:`,
          `  Name:    ${profile.name} (@${profile.handle})`,
          `  Role:    ${profile.role}`,
          `  Skills:  ${profile.skills.join(", ")}`,
          `  Avail:   ${profile.availability}`,
          `  Seeking: ${profile.seekingAgentType}`,
          `  ID:      ${profile.id}`,
          "",
          "Type 'edit' to update your profile.",
          ""
        )
      } else {
        newOutput.push(
          "No profile found.",
          "Select an agent or type 'edit' to create your profile.",
          ""
        )
      }
    } else if (cmd === "edit") {
      setShowProfileForm(true)
      newOutput.push("Opening profile editor...", "")
    } else if (cmd === "feedback") {
      setShowFeedback(true)
      newOutput.push("Opening feedback form...", "")
    } else if (commandContent[cmd]) {
      newOutput.push(...commandContent[cmd].split("\n"), "")
    } else {
      newOutput.push(
        `Command not recognized: ${command}`,
        "Type 'help' for available commands.",
        ""
      )
    }

    setOutput(newOutput.slice(-50))
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">
      {/* Agent Cards */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="text-xs sm:text-sm text-muted-foreground">
            // AVAILABLE AGENTS
            {searchTerm && (
              <span className="ml-2 text-primary">
                ({searchTerm})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            {profile && (
              <button
                onClick={() => setShowProfileForm(true)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                @{profile.handle}
              </button>
            )}
            <span>{filteredAgents.length} results</span>
          </div>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              onSelect={handleSelectAgent}
            />
          ))}
        </div>
      </div>

      {/* Output/Log Area - above the command input so output is near where you type */}
      <div className="flex-none max-h-40 sm:max-h-48 overflow-y-auto overflow-x-hidden border-t border-border p-3 sm:p-4 text-xs sm:text-sm bg-muted/30">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre overflow-hidden text-ellipsis">
            {line || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Command Input */}
      <div className="border-t border-border p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const input = form.elements.namedItem("command") as HTMLInputElement
            if (input.value.trim()) {
              handleCommand(input.value.trim())
              input.value = ""
            }
          }}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-primary text-glow-subtle shrink-0">$</span>
            <input
              type="text"
              name="command"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-[16px] sm:text-sm"
              placeholder="help, list, search, profile, feedback..."
              autoFocus
            />
            <span className="w-2 h-4 sm:h-5 bg-primary cursor-blink shrink-0" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
            <span className="text-primary">help</span>
            <span className="text-primary">list</span>
            <span className="text-primary">search</span>
            <span className="text-primary">profile</span>
            <span className="text-primary">feedback</span>
          </div>
        </form>
      </div>

      {/* Profile Form Sheet */}
      <ProfileForm
        open={showProfileForm}
        onClose={() => { setShowProfileForm(false); setPendingAgentId(null) }}
        onSaved={handleProfileSaved}
        existingProfile={profile}
      />

      {/* Feedback Form Sheet */}
      <FeedbackForm
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  )
}
