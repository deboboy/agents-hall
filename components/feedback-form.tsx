"use client"

import { useState } from "react"
import { saveFeedback } from "@/lib/db"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

interface FeedbackFormProps {
  open: boolean
  onClose: () => void
}

export function FeedbackForm({ open, onClose }: FeedbackFormProps) {
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Save locally
      await saveFeedback({
        id: `FB-${Date.now()}`,
        message,
        rating,
        createdAt: Date.now(),
      })

      // Send to Discord
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rating }),
      })

      if (!res.ok) {
        throw new Error("Failed to send feedback")
      }

      setSubmitted(true)
    } catch {
      setError("Failed to send feedback. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setMessage("")
    setRating(0)
    setSubmitted(false)
    onClose()
  }

  const inputClass = "w-full bg-transparent border border-border px-2 py-1.5 text-foreground placeholder:text-muted-foreground/50 text-[16px] sm:text-sm focus:border-primary focus:outline-none transition-colors"

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border overflow-y-auto">
        <SheetTitle className="text-primary text-glow-subtle font-bold text-sm px-4 pt-4">
          SUBMIT FEEDBACK
        </SheetTitle>

        {submitted ? (
          <div className="p-4 space-y-4 text-xs sm:text-sm">
            <div className="border border-primary/50 p-4 bg-primary/5 space-y-2">
              <div className="text-primary text-glow-subtle">Feedback received. Thank you!</div>
              <div className="text-muted-foreground">
                Your input helps us improve the Agents Hall experience.
              </div>
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-xs sm:text-sm"
            >
              [CLOSE]
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs sm:text-sm">
            <div className="text-muted-foreground">
              Help us improve Agents Hall. All feedback is stored locally.
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground">RATING</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-lg transition-colors ${
                      star <= rating ? "text-accent" : "text-border hover:text-accent/50"
                    }`}
                  >
                    {"\u2605"}
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-muted-foreground ml-2 self-center">{rating}/5</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground">YOUR FEEDBACK *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={`${inputClass} min-h-[100px] resize-y`}
                placeholder="What's working? What could be better? Any features you'd like to see?"
                rows={5}
                required
              />
            </div>

            {error && (
              <div className="text-red-400 border border-red-400/50 px-2 py-1.5">{error}</div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-xs sm:text-sm disabled:opacity-50"
              >
                {saving ? "[SENDING...]" : "[SUBMIT]"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-xs sm:text-sm"
              >
                [CANCEL]
              </button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
