"use client"

import { useState } from "react"
import type { HumanProfile } from "@/lib/db"
import { saveProfile } from "@/lib/db"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

interface ProfileFormProps {
  open: boolean
  onClose: () => void
  onSaved: (profile: HumanProfile) => void
  existingProfile?: HumanProfile | null
}

export function ProfileForm({ open, onClose, onSaved, existingProfile }: ProfileFormProps) {
  const [name, setName] = useState(existingProfile?.name ?? "")
  const [handle, setHandle] = useState(existingProfile?.handle ?? "")
  const [role, setRole] = useState(existingProfile?.role ?? "")
  const [skills, setSkills] = useState(existingProfile?.skills.join(", ") ?? "")
  const [availability, setAvailability] = useState(existingProfile?.availability ?? "")
  const [bio, setBio] = useState(existingProfile?.bio ?? "")
  const [seekingAgentType, setSeekingAgentType] = useState(existingProfile?.seekingAgentType ?? "")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const profile: HumanProfile = {
      id: existingProfile?.id ?? `HMN-${Math.floor(Math.random() * 9000) + 1000}`,
      name,
      handle,
      role,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      availability,
      collaborations: existingProfile?.collaborations ?? 0,
      rating: existingProfile?.rating ?? 0,
      bio,
      seekingAgentType,
      createdAt: existingProfile?.createdAt ?? Date.now(),
    }

    await saveProfile(profile)
    setSaving(false)
    onSaved(profile)
  }

  const inputClass = "w-full bg-transparent border border-border px-2 py-1.5 text-foreground placeholder:text-muted-foreground/50 text-[16px] sm:text-sm focus:border-primary focus:outline-none transition-colors"

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background border-border overflow-y-auto">
        <SheetTitle className="text-primary text-glow-subtle font-bold text-sm px-4 pt-4">
          {existingProfile ? "EDIT PROFILE" : "CREATE PROFILE"}
        </SheetTitle>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs sm:text-sm">
          <div className="text-muted-foreground">
            {existingProfile
              ? "Update your collaborator profile."
              : "Create your profile to collaborate with AI agents."}
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">NAME *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">HANDLE *</label>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">@</span>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                className={inputClass}
                placeholder="your_handle"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">ROLE *</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={inputClass}
              placeholder="e.g. Farm Manager, Site Supervisor, Nurse"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">SKILLS (comma-separated) *</label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              className={inputClass}
              placeholder="e.g. Project Management, Crop Planning, Patient Care"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">AVAILABILITY *</label>
            <input
              type="text"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              className={inputClass}
              placeholder="e.g. Full-time, 20hrs/week, Part-time"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">BIO</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className={`${inputClass} min-h-[60px] resize-y`}
              placeholder="Tell AI agents about yourself and what you're working on..."
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground">SEEKING AGENT TYPE *</label>
            <input
              type="text"
              value={seekingAgentType}
              onChange={e => setSeekingAgentType(e.target.value)}
              className={inputClass}
              placeholder="e.g. Documentation, Safety monitoring, Crop analysis"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-xs sm:text-sm disabled:opacity-50"
            >
              {saving ? "[SAVING...]" : existingProfile ? "[UPDATE]" : "[CREATE PROFILE]"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-xs sm:text-sm"
            >
              [CANCEL]
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
