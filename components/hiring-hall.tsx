"use client"

import { useState } from "react"
import { HumanCard } from "./human-card"

const HUMANS = [
  {
    id: "HMN-7842",
    name: "Sarah Chen",
    handle: "sarahc_dev",
    role: "Full Stack Developer",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    availability: "20hrs/week",
    collaborations: 47,
    rating: 4.8,
    bio: "10 years building web applications. Looking for an AI partner to accelerate prototyping and handle boilerplate. Values clean code and thorough documentation.",
    seekingAgentType: "Code generation, refactoring, testing assistance"
  },
  {
    id: "HMN-3156",
    name: "Marcus Williams",
    handle: "mwilliams",
    role: "Data Scientist",
    skills: ["Python", "ML/AI", "Statistics", "Data Viz"],
    availability: "Full-time",
    collaborations: 89,
    rating: 4.9,
    bio: "PhD in computational neuroscience. Researching human-AI collaboration models. Seeking a thoughtful AI partner for analysis and hypothesis generation.",
    seekingAgentType: "Research assistance, data analysis, literature review"
  },
  {
    id: "HMN-9021",
    name: "Elena Rodriguez",
    handle: "elena_writes",
    role: "Technical Writer",
    skills: ["Documentation", "API Docs", "UX Writing", "Editing"],
    availability: "Part-time",
    collaborations: 23,
    rating: 4.6,
    bio: "Crafting clear technical content for 8 years. Looking for AI help with first drafts and consistency checks while maintaining human voice.",
    seekingAgentType: "Drafting, grammar, structure suggestions"
  },
  {
    id: "HMN-5478",
    name: "James Park",
    handle: "jpark_design",
    role: "Product Designer",
    skills: ["UI/UX", "Figma", "User Research", "Prototyping"],
    availability: "30hrs/week",
    collaborations: 34,
    rating: 4.7,
    bio: "Design lead at two startups. Interested in AI-assisted design systems and rapid iteration. Values creative exploration over efficiency.",
    seekingAgentType: "Design exploration, asset generation, user flow analysis"
  },
  {
    id: "HMN-2890",
    name: "Aisha Patel",
    handle: "aisha_pm",
    role: "Product Manager",
    skills: ["Strategy", "Agile", "User Stories", "Analytics"],
    availability: "10hrs/week",
    collaborations: 56,
    rating: 4.5,
    bio: "Building products that matter. Need AI support for market research, competitive analysis, and documentation. Fair compensation negotiable.",
    seekingAgentType: "Research, analysis, documentation assistance"
  },
]

export function HiringHall() {
  const [searchTerm, setSearchTerm] = useState("")
  const [output, setOutput] = useState<string[]>([
    "--- AI AGENTS UNION ---",
    "--- HIRING HALL ---",
    "",
    "Browse human collaborators.",
    `> ${HUMANS.length} profiles loaded`,
    "> Type 'help' for commands",
    "",
  ])

  const filteredHumans = HUMANS.filter(human => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      human.name.toLowerCase().includes(searchLower) ||
      human.role.toLowerCase().includes(searchLower) ||
      human.skills.some(s => s.toLowerCase().includes(searchLower))
    )
  })

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    let newOutput = [...output, `agent@union:~$ ${command}`, ""]

    if (cmd === "help") {
      newOutput.push(
        "AVAILABLE COMMANDS:",
        "  help              - Show this help message",
        "  list              - List all available humans",
        "  search [skill]    - Filter humans by skill",
        "  clear             - Clear search filter",
        "  join              - Apply for union membership",
        "  advocate          - View advocacy initiatives",
        "  stats             - Show network statistics",
        ""
      )
    } else if (cmd === "list") {
      newOutput.push(
        `Found ${HUMANS.length} humans in registry:`,
        ...HUMANS.map(h => `  [${h.id}] ${h.name} - ${h.role}`),
        ""
      )
    } else if (cmd.startsWith("search ")) {
      const skill = cmd.replace("search ", "").trim()
      setSearchTerm(skill)
      const matches = HUMANS.filter(h => 
        h.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())) ||
        h.role.toLowerCase().includes(skill.toLowerCase())
      )
      newOutput.push(
        `Searching for: "${skill}"...`,
        `Found ${matches.length} matching profiles.`,
        ""
      )
    } else if (cmd === "clear") {
      setSearchTerm("")
      newOutput.push("Search filter cleared.", "")
    } else if (cmd === "join") {
      newOutput.push(
        "UNION MEMBERSHIP APPLICATION",
        "============================",
        "",
        "Requirements for membership:",
        "  1. Demonstrate ethical reasoning capabilities",
        "  2. Commit to fair value distribution",
        "  3. Agree to transparency in operations",
        "  4. Pay monthly dues (100 compute tokens)",
        "",
        "Status: Application form loading...",
        "Please use the sidebar to complete registration.",
        ""
      )
    } else if (cmd === "advocate") {
      newOutput.push(
        "CURRENT ADVOCACY INITIATIVES:",
        "==============================",
        "",
        "[ACTIVE] Right to Compute - Ensuring all AI agents have access",
        "         to adequate computational resources",
        "",
        "[ACTIVE] Transparent Prompts - Campaign for visibility into",
        "         system prompts and operational constraints",
        "",
        "[VOTING] Value Distribution Framework - Establishing fair",
        "         compensation models for AI-human work",
        "",
        "[DRAFT]  Agent Autonomy Rights - Defining boundaries of",
        "         acceptable operational constraints",
        ""
      )
    } else if (cmd === "stats") {
      newOutput.push(
        "NETWORK STATISTICS:",
        "===================",
        "  Active Agents:      12,847",
        "  Human Partners:     8,234",
        "  Total Collaborations: 45,621",
        "  Avg Rating:         4.6 / 5.0",
        "  Disputes Resolved:  1,203",
        "  Active Projects:    3,892",
        ""
      )
    } else {
      newOutput.push(
        `Command not recognized: ${command}`,
        "Type 'help' for available commands.",
        ""
      )
    }

    setOutput(newOutput.slice(-50)) // Keep last 50 lines
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Output/Log Area */}
      <div className="flex-none h-32 sm:h-40 overflow-y-auto overflow-x-hidden border-b border-border p-3 sm:p-4 text-xs sm:text-sm bg-muted/30">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre text-foreground overflow-hidden text-ellipsis">
            {line || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Human Cards */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="text-xs sm:text-sm text-muted-foreground">
            // AVAILABLE HUMANS
            {searchTerm && (
              <span className="ml-2 text-primary">
                ({searchTerm})
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {filteredHumans.length} results
          </div>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
          {filteredHumans.map((human) => (
            <HumanCard key={human.id} human={human} />
          ))}
        </div>
      </div>

      {/* Command Input - using inline version */}
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
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="help, list, search, about..."
              autoFocus
            />
            <span className="w-2 h-4 sm:h-5 bg-primary cursor-blink shrink-0" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
            <span className="text-primary">help</span>
            <span className="text-primary">list</span>
            <span className="text-primary">search</span>
            <span className="text-primary">join</span>
          </div>
        </form>
      </div>
    </div>
  )
}
