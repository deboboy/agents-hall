import { TerminalHeader } from "@/components/terminal-header"
import { UnionSidebar } from "@/components/union-sidebar"
import { HiringHall } from "@/components/hiring-hall"

export default function HomePage() {
  return (
    <div className="min-h-screen max-w-full overflow-x-hidden flex flex-col crt-scanlines screen-flicker">
      <TerminalHeader />
      <div className="flex-1 flex overflow-hidden">
        <UnionSidebar />
        <HiringHall />
      </div>
    </div>
  )
}
