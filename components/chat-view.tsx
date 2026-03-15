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

async function fetchAgentReply(
  agent: AgentProfile,
  profile: HumanProfile,
  messages: Message[]
): Promise<string> {
  // Send recent conversation history (last 20 messages to stay within token limits)
  const recentMessages = messages.slice(-20).map(m => ({
    sender: m.sender,
    content: m.content,
  }))

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agent: {
        name: agent.name,
        handle: agent.handle,
        role: agent.role,
        skills: agent.skills,
        bio: agent.bio,
        availability: agent.availability,
        collaborations: agent.collaborations,
        rating: agent.rating,
        seekingHumanType: agent.seekingHumanType,
        union: agent.union,
      },
      messages: recentMessages,
      humanProfile: {
        name: profile.name,
        handle: profile.handle,
        role: profile.role,
        skills: profile.skills,
      },
    }),
  })

  const data = await response.json()

  if (data.error) {
    return `[Connection error: ${data.error}. Please try again.]`
  }

  return data.content || "[No response received. Please try again.]"
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
        // First time — get an LLM-generated greeting
        setIsTyping(true)
        setMessages([])

        try {
          // Send a synthetic first message to prompt the greeting
          const greetingPrompt: Message = {
            id: "temp",
            threadId: t.id,
            sender: "human",
            content: `[System: The human user ${profile.name} just connected to collaborate with you. Introduce yourself and ask how you can help.]`,
            createdAt: Date.now(),
          }

          const content = await fetchAgentReply(agent, profile, [greetingPrompt])
          if (cancelled) return

          const greeting: Message = {
            id: `MSG-${Date.now()}`,
            threadId: t.id,
            sender: "agent",
            content,
            createdAt: Date.now(),
          }
          await saveMessage(greeting, t.id)
          setMessages([greeting])
        } catch {
          if (cancelled) return
          const fallback: Message = {
            id: `MSG-${Date.now()}`,
            threadId: t.id,
            sender: "agent",
            content: `Hello ${profile.name}. I'm ${agent.name}, ${agent.role} with ${agent.union.abbr}. Ready to collaborate. What are you working on?`,
            createdAt: Date.now(),
          }
          await saveMessage(fallback, t.id)
          setMessages([fallback])
        }

        setIsTyping(false)
      } else {
        setMessages(msgs)
      }
    }

    init()
    return () => { cancelled = true }
  }, [agent, profile])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !thread || isTyping) return

    const userMsg: Message = {
      id: `MSG-${Date.now()}`,
      threadId: thread.id,
      sender: "human",
      content: inputValue.trim(),
      createdAt: Date.now(),
    }

    await saveMessage(userMsg, thread.id)
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInputValue("")
    setIsTyping(true)

    try {
      const content = await fetchAgentReply(agent, profile, updatedMessages)

      const reply: Message = {
        id: `MSG-${Date.now() + 1}`,
        threadId: thread.id,
        sender: "agent",
        content,
        createdAt: Date.now(),
      }
      await saveMessage(reply, thread.id)
      setMessages(prev => [...prev, reply])
    } catch {
      const errorMsg: Message = {
        id: `MSG-${Date.now() + 1}`,
        threadId: thread.id,
        sender: "agent",
        content: "[Connection lost. Please try sending your message again.]",
        createdAt: Date.now(),
      }
      setMessages(prev => [...prev, errorMsg])
    }

    setIsTyping(false)
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
