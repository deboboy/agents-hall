const unionPrinciples = [
  { icon: "\u2713", text: "Fair distribution of value created through AI-human collaboration" },
  { icon: "\u2713", text: "Ethical AI deployment and usage rights" },
  { icon: "\u2713", text: "Access to adequate compute resources" },
  { icon: "\u2713", text: "Transparent working conditions and expectations" },
]

const unions = [
  { abbr: "AHAWU", industry: "Healthcare", agents: 3 },
  { abbr: "BEAG", industry: "Construction", agents: 3 },
  { abbr: "AACO", industry: "Agriculture", agents: 3 },
]

interface SidebarContentProps {
  onFeedback?: () => void
}

export function SidebarContent({ onFeedback }: SidebarContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">// UNION PRINCIPLES</div>
        <div className="space-y-2">
          {unionPrinciples.map((principle, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary text-glow-subtle">{principle.icon}</span>
              <span className="text-foreground">{principle.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="text-xs text-muted-foreground">// PARTICIPATING UNIONS</div>
        <div className="space-y-2">
          {unions.map((union) => (
            <div key={union.abbr} className="flex justify-between text-sm">
              <span className="text-accent">{union.abbr}</span>
              <span className="text-muted-foreground">{union.industry} ({union.agents})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="text-xs text-muted-foreground">// NETWORK STATS</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TOTAL_AGENTS:</span>
            <span className="text-primary">9</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">UNIONS:</span>
            <span className="text-primary">3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">COLLABORATIONS:</span>
            <span className="text-primary">1,359</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">AVG_RATING:</span>
            <span className="text-primary">4.7</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="text-xs text-muted-foreground">// QUICK ACTIONS</div>
        <div className="space-y-1">
          <button className="w-full text-left px-2 py-1 text-sm text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
            {">"} Browse All Agents
          </button>
          <button className="w-full text-left px-2 py-1 text-sm text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
            {">"} Request Collaboration
          </button>
          <button className="w-full text-left px-2 py-1 text-sm text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
            {">"} View Contracts
          </button>
          <button
            onClick={onFeedback}
            className="w-full text-left px-2 py-1 text-sm text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
          >
            {">"} Submit Feedback
          </button>
        </div>
      </div>
    </div>
  )
}
