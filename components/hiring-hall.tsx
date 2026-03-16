"use client"

import { useState, useEffect } from "react"
import { AgentCard } from "./agent-card"
import { ChatView } from "./chat-view"
import { ProfileForm } from "./profile-form"
import { AGENTS, type AgentProfile } from "@/content/agents"
import { commandContent } from "@/content/commands"
import { getProfile, getThreads, type HumanProfile, type Thread } from "@/lib/db"

interface HiringHallProps {
  showMessages?: boolean
  onMessagesHandled?: () => void
  browseAll?: boolean
  onBrowseAllHandled?: () => void
}

export function HiringHall({ showMessages, onMessagesHandled, browseAll, onBrowseAllHandled }: HiringHallProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState<string | null>(null)
  const [profile, setProfile] = useState<HumanProfile | null>(null)
  const [activeAgent, setActiveAgent] = useState<AgentProfile | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [pendingAgentId, setPendingAgentId] = useState<string | null>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [showThreads, setShowThreads] = useState(false)
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

  // Handle Messages request from sidebar
  useEffect(() => {
    if (showMessages) {
      getThreads().then(t => {
        setThreads(t)
        setShowThreads(true)
      })
      onMessagesHandled?.()
    }
  }, [showMessages, onMessagesHandled])

  // Handle Browse All request from sidebar
  useEffect(() => {
    if (browseAll) {
      setActiveAgent(null)
      setShowThreads(false)
      setSearchTerm("")
      setIndustryFilter(null)
      onBrowseAllHandled?.()
    }
  }, [browseAll, onBrowseAllHandled])

  const filteredAgents = AGENTS.filter(agent => {
    if (industryFilter && agent.union.industry !== industryFilter) return false
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
    if (!profile) {
      // No profile yet — open profile form, remember which agent they wanted
      setPendingAgentId(agent.id)
      setShowProfileForm(true)
      return
    }

    // Go to chat with this agent, filter by their industry
    setIndustryFilter(agent.union.industry)
    setActiveAgent(agent)
  }

  const handleProfileSaved = (saved: HumanProfile) => {
    setProfile(saved)
    setShowProfileForm(false)

    // If they were trying to select an agent, go to chat
    if (pendingAgentId) {
      const agent = AGENTS.find(a => a.id === pendingAgentId)
      if (agent) {
        setIndustryFilter(agent.union.industry)
        setActiveAgent(agent)
      }
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
    } else if (cmd === "clear") {
      setSearchTerm("")
      setIndustryFilter(null)
      newOutput.push("Filters cleared.", "")
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
          "Select your profile in the top right to update it.",
          ""
        )
      } else {
        newOutput.push(
          "No profile found.",
          "Select an agent to create your profile and start collaborating.",
          ""
        )
      }
    } else if (cmd === "messages") {
      getThreads().then(t => {
        setThreads(t)
        setShowThreads(true)
      })
      newOutput.push("Loading messages...", "")
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

  // If chatting with an agent, show the chat view
  if (activeAgent && profile) {
    return (
      <ChatView
        agent={activeAgent}
        profile={profile}
        onBack={() => {
          setActiveAgent(null)
          setShowThreads(false)
        }}
      />
    )
  }

  // Show threads/messages list
  if (showThreads) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">
        <div className="flex-none border-b border-border p-3 sm:p-4 flex items-center gap-3">
          <button
            onClick={() => setShowThreads(false)}
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            &larr; Back
          </button>
          <span className="text-xs sm:text-sm text-muted-foreground">// MESSAGES</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {threads.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">
              No conversations yet. Select an agent to start collaborating.
            </div>
          ) : (
            <div className="space-y-2">
              {threads.map(thread => {
                const agent = AGENTS.find(a => a.id === thread.agentId)
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      if (agent && profile) {
                        setIndustryFilter(agent.union.industry)
                        setActiveAgent(agent)
                      }
                    }}
                    className="w-full text-left border border-border p-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-primary">{thread.agentName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(thread.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {agent && (
                      <div className="text-xs text-accent mb-1">{agent.union.abbr} &middot; {agent.role}</div>
                    )}
                    {thread.lastMessage && (
                      <div className="text-xs text-muted-foreground truncate">{thread.lastMessage}</div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">
      {/* Agent Cards */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="text-xs sm:text-sm text-muted-foreground">
            // AVAILABLE AGENTS
            {industryFilter && (
              <span className="ml-2 text-accent">
                [{industryFilter}]
                <button
                  onClick={() => setIndustryFilter(null)}
                  className="ml-1 text-muted-foreground hover:text-primary transition-colors"
                  title="Clear filter"
                >
                  x
                </button>
              </span>
            )}
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
              onSelect={handleSelectAgent}
            />
          ))}
        </div>
      </div>

      {/* Output/Log Area */}
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
              placeholder="help, list, profile, feedback..."
              autoFocus
            />
            <span className="w-2 h-4 sm:h-5 bg-primary cursor-blink shrink-0" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
            <span className="text-primary">help</span>
            <span className="text-primary">list</span>
            <span className="text-primary">messages</span>
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
    </div>
  )
}
