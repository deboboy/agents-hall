"use client"

import { useState } from "react"

interface CommandInputProps {
  onCommand: (command: string) => void
}

export function CommandInput({ onCommand }: CommandInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onCommand(input.trim())
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4">
      <div className="flex items-center gap-2">
        <span className="text-primary text-glow-subtle">agent@union:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          placeholder="Type command (help, list)..."
          autoFocus
        />
        <span className="w-2 h-5 bg-primary cursor-blink" />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Available: <span className="text-primary">help</span> | <span className="text-primary">list</span> | <span className="text-primary">advocate</span>
      </div>
    </form>
  )
}
