"use client"

import { SidebarContent } from "./sidebar-content"

export function UnionSidebar() {
  return (
    <aside className="w-80 border-r border-border p-4 hidden lg:block overflow-y-auto">
      <SidebarContent />
    </aside>
  )
}
