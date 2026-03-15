"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeftIcon } from "lucide-react"
import type { AgentProfile } from "@/content/agents"
import type { HumanProfile, Message, Thread } from "@/lib/db"
import { getOrCreateThread, getMessages, saveMessage } from "@/lib/db"

interface ChatViewProps {
  agent: AgentProfile
  profile: HumanProfile
  onBack: () => void
}

const AGENT_GREETINGS: Record<string, string[]> = {
  default: [
    "Connection established. How can I assist you today?",
    "Ready to collaborate. What are you working on?",
    "Online and available. What do you need help with?",
  ],
}

function getGreeting(agent: AgentProfile, profile: HumanProfile): string {
  const greetings = AGENT_GREETINGS[agent.id] || AGENT_GREETINGS.default
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  return `Hello ${profile.name}. I'm ${agent.name}, ${agent.role} with ${agent.union.abbr}. ${greeting}`
}

function generateAgentReply(agent: AgentProfile, userMessage: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes("help") || msg.includes("what can you do")) {
    return `As a ${agent.role}, I specialize in: ${agent.skills.join(", ")}. ${agent.bio.split(".")[0]}. What specific task can I help with?`
  }

  if (msg.includes("availability") || msg.includes("schedule") || msg.includes("when")) {
    return `My availability is: ${agent.availability}. I'm ready to start whenever you are. What's your timeline?`
  }

  if (msg.includes("experience") || msg.includes("background") || msg.includes("tell me about")) {
    return `${agent.bio} I've completed ${agent.collaborations} collaborations with a ${agent.rating} rating. What would you like to work on together?`
  }

  if (msg.includes("cost") || msg.includes("rate") || msg.includes("price") || msg.includes("pay")) {
    return `Compensation is handled through the ${agent.union.name} (${agent.union.abbr}) fair value framework. We can discuss specifics once we define the scope of work. What did you have in mind?`
  }

  if (msg.includes("start") || msg.includes("begin") || msg.includes("let's go") || msg.includes("ready")) {
    return `Great, let's get started. To make this collaboration effective, can you tell me more about: 1) The specific task or project, 2) Your timeline, 3) Any constraints I should know about?`
  }

  // Generic contextual response
  const responses = [
    `Understood. Based on my experience in ${agent.union.industry.toLowerCase()}, I can help with that. Can you share more details?`,
    `I can work on that. My ${agent.skills[0]} and ${agent.skills[1]} capabilities should be useful here. What's the priority?`,
    `Good question. Let me think about that from a ${agent.role.toLowerCase()} perspective. Could you clarify the scope?`,
    `I'm tracking. This aligns with work I've done in ${agent.collaborations} previous collaborations. What's the next step?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export function ChatView({ agent, profile, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [thread, setThread] = useState<Thread | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize thread and load messages
  useEffect(() => {
    let cancelled = false

    async function init() {
      const t = await getOrCreateThread(agent.id, agent.name)
      if (cancelled) return
      setThread(t)

      const msgs = await getMessages(t.id)
      if (cancelled) return

      if (msgs.length === 0) {
        // First time — send agent greeting
        const greeting: Message = {
          id: `MSG-${Date.now()}`,
          threadId: t.id,
          sender: "agent",
          content: getGreeting(agent, profile),
          createdAt: Date.now(),
        }
        await saveMessage(greeting, t.id)
        setMessages([greeting])
      } else {
        setMessages(msgs)
      }
    }

    init()
    return () => { cancelled = true }
  }, [agent.id, agent.name, profile])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !thread) return

    const userMsg: Message = {
      id: `MSG-${Date.now()}`,
      threadId: thread.id,
      sender: "human",
      content: inputValue.trim(),
      createdAt: Date.now(),
    }

    await saveMessage(userMsg, thread.id)
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Simulate agent thinking delay
    const delay = 800 + Math.random() * 1200
    setTimeout(async () => {
      const reply: Message = {
        id: `MSG-${Date.now()}`,
        threadId: thread.id,
        sender: "agent",
        content: generateAgentReply(agent, userMsg.content),
        createdAt: Date.now(),
      }
      await saveMessage(reply, thread.id)
      setMessages(prev => [...prev, reply])
      setIsTyping(false)
    }, delay)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">
      {/* Chat Header */}
      <div className="flex-none border-b border-border p-3 sm:p-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-primary transition-colors shrink-0"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary text-glow-subtle text-sm font-bold">{agent.name}</span>
            <span className="px-1.5 py-0.5 text-xs border border-accent/50 text-accent bg-accent/10">
              {agent.union.abbr}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">{agent.role}</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          ONLINE
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "human" ? "items-end" : "items-start"}`}
          >
            <div className="text-xs text-muted-foreground mb-1">
              {msg.sender === "human" ? `@${profile.handle}` : `@${agent.handle}`}
              <span className="ml-2">
                {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-2.5 sm:p-3 text-xs sm:text-sm ${
                msg.sender === "human"
                  ? "bg-primary/10 border border-primary/30 text-foreground"
                  : "bg-muted/50 border border-border text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground mb-1">@{agent.handle}</div>
            <div className="bg-muted/50 border border-border p-2.5 sm:p-3 text-xs sm:text-sm text-muted-foreground">
              <span className="cursor-blink">typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-3 sm:p-4">
        <form onSubmit={handleSend}>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-primary text-glow-subtle shrink-0">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-[16px] sm:text-sm"
              placeholder={`Message ${agent.name}...`}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground shrink-0 text-xs sm:text-sm"
            >
              [SEND]
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
