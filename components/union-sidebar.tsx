"use client"

import { SidebarContent } from "./sidebar-content"

interface UnionSidebarProps {
  onFeedback?: () => void
  onMessages?: () => void
  onBrowseAll?: () => void
}

export function UnionSidebar({ onFeedback, onMessages, onBrowseAll }: UnionSidebarProps) {
  return (
    <aside className="w-80 border-r border-border p-4 hidden lg:block overflow-y-auto">
      <SidebarContent onFeedback={onFeedback} onMessages={onMessages} onBrowseAll={onBrowseAll} />
    </aside>
  )
}
