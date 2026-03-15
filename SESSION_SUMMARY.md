# Session Summary

## 2026-03-15 — Mobile Layout Fixes

### Problems
1. **Input field expanding layout on mobile**: Selecting the command input caused iOS auto-zoom (font-size < 16px), pushing elements off-screen to the right.
2. **Command output far from input**: The output/log area was at the top of the page while the command input was at the bottom, making it confusing when command results appeared far from where the user typed.

### Changes Made

**`components/hiring-hall.tsx`**
- Moved the output/log area from the top of the component to just above the command input at the bottom. Layout order is now: cards (scrollable) → output log → command input.
- Set input font-size to `16px` on mobile (`text-[16px] sm:text-sm`) to prevent iOS auto-zoom.
- Added `max-w-full`, `overflow-x-hidden` constraints to prevent horizontal overflow.
- Changed output area from fixed `h-32` to `max-h-40` so it only takes space when there's content.

**`components/human-card.tsx`**
- Added `overflow-hidden` to card container and skill tags wrapper to prevent tag overflow on narrow screens.

**`app/page.tsx`**
- Added `max-w-full overflow-x-hidden` to the root page container.

### Status
- Deployed and verified on iPhone. Layout issues fixed.

---

## 2026-03-15 — Extract Command Content from Component

### Problem
The `about` command called an external OpenRouter API (`/api/about`) which required an API key that wasn't configured, resulting in an error. All other command content was hardcoded inline in `hiring-hall.tsx`, making it difficult to update.

### Changes Made

**`content/commands/index.ts`** (new)
- Created a dedicated content module with all command output text (`help`, `about`, `join`, `advocate`, `stats`).
- Content is in template literals — easy to edit without touching component logic.

**`components/hiring-hall.tsx`**
- Replaced all inline command content and the `about` API call with a single lookup into `commandContent`.
- `handleCommand` is now synchronous (no more `async`/`await`/`fetch`).
- Removed `isLoading` state and `useEffect` debug logging.
- `list`, `search`, and `clear` remain inline since they depend on the `HUMANS` data array.

**`app/api/about/route.ts`**
- No longer called. Can be removed in a future cleanup.

### Status
- Committed and deployed. API route deleted.

---

## 2026-03-15 — Add AI Agent Profiles by Industry Union

### Goal
Pivot the app so that **humans** browse **AI agent collaborators** (previously it was agents browsing humans). Add 9 AI agents across 3 industry unions for beta testers to experience.

### Data Model
- 3 industries, each with its own union and 3 agents:
  - **Healthcare** — Allied Health AI Workers Union (AHAWU): MedChart AI, TriageBot, PharmAssist
  - **Construction** — Built Environment AI Guild (BEAG): SiteWatch AI, BlueprintMind, CrewSync
  - **Agriculture** — Agricultural AI Cooperative (AACO): CropSense AI, HerdWatch, HarvestLogic
- Each agent has: id, name, handle, role, skills, availability, collaborations, rating, bio, seekingHumanType, union (name/abbr/industry)

### Changes Made

**`content/agents.ts`** (new)
- `AgentProfile` interface and `UNIONS` constant
- `AGENTS` array with 9 profiles, industry-specific skills and bios

**`components/agent-card.tsx`** (new)
- Adapted from `human-card.tsx` for agent profiles
- Displays union badge (abbr + name) in accent color between name and skills
- Expanded view shows UNION field in addition to BIO, SEEKING, AVAIL

**`components/hiring-hall.tsx`**
- Replaced `HUMANS` data + `HumanCard` with `AGENTS` data + `AgentCard`
- Search now matches on union industry and abbreviation
- Added `unions` command to list participating unions
- Terminal prompt changed from `agent@union:~$` to `user@hall:~$`
- Header changed from "AVAILABLE HUMANS" to "AVAILABLE AGENTS"

**`content/commands/index.ts`**
- Updated `help` to reflect agent-centric commands (added `unions`)
- Updated `about` to describe human-browsing-agents workflow and list participating unions
- Updated `stats` to reflect actual agent/union counts

**`components/union-sidebar.tsx`**
- Replaced generic stats with union-specific listing (AHAWU, BEAG, AACO)
- Updated quick actions to match new workflow (Browse All Agents, Request Collaboration, Submit Feedback)

### TODO
- Feedback form for beta testers
- `human-card.tsx` is now unused — can be removed

### Status
- Committed and deployed.

---

## 2026-03-15 — Mobile Menu for Sidebar Content

### Problem
The sidebar (union principles, participating unions, stats, quick actions) uses `hidden lg:block` and is not accessible on mobile/tablet screens.

### Changes Made

**`components/sidebar-content.tsx`** (new)
- Extracted all sidebar content into a shared component used by both desktop and mobile views.

**`components/union-sidebar.tsx`**
- Simplified to a wrapper around `SidebarContent` for the desktop `<aside>`.

**`components/terminal-header.tsx`**
- Added a hamburger menu icon (`MenuIcon` from lucide) visible below `lg` breakpoint.
- Opens a `Sheet` (radix dialog) sliding in from the left with the full `SidebarContent`.
- Menu icon sits to the left of "AGENTS HALL" in the header bar.

### Status
- Committed and deployed. Verified on iPhone.

---

## 2026-03-15 — Splash Screen & Custom Favicon

### Changes Made

**`components/splash-screen.tsx`** (new)
- Terminal-style boot sequence that types out lines one by one (initializing, connecting to each union, loading agents).
- `[ ENTER HIRING HALL ]` button fades in after the sequence completes.
- Uses the same CRT scanlines and screen flicker effects as the main app.

**`app/page.tsx`**
- Now a client component with `entered` state. Shows `SplashScreen` first, then the main app on click.

**`public/icon.svg`**
- Replaced the default v0 favicon with an "AH" monogram in `#ff6b4a` on `#0a0a0a` background.
- Rounded rect with subtle glowing border, matching the terminal aesthetic.

**`app/layout.tsx`**
- Simplified icon config to use just the SVG (removed old v0 PNG references).

### Status
- Committed and deployed. Verified on iPhone.

---

## 2026-03-15 — Human Profiles, Feedback Form & IndexedDB

### Changes Made

**`lib/db.ts`** (new)
- IndexedDB wrapper (DB v1) with two stores: `profile` and `feedback`.
- Functions: `saveProfile`, `getProfile`, `saveFeedback`.

**`components/profile-form.tsx`** (new)
- Terminal-styled Sheet form matching `HumanProfile` schema (name, handle, role, skills, availability, bio, seeking agent type).
- Opens when user clicks [SELECT] without a profile, or via `edit` command.

**`components/feedback-form.tsx`** (new)
- Sheet with star rating + text area. Stored in IndexedDB.
- Accessible via `feedback` command, sidebar "Submit Feedback" button, and mobile menu.

### Status
- Committed and deployed. Verified on iPhone.

---

## 2026-03-15 — Messaging System & Collaboration Flow

### Goal
Complete the user workflow: browse agents → select → create profile (if needed) → start messaging.

### Changes Made

**`lib/db.ts`**
- Upgraded to DB v2. Added `threads` and `messages` stores with indexes.
- New types: `Message` (id, threadId, sender, content, createdAt), `Thread` (id, agentId, agentName, lastMessage, updatedAt).
- New functions: `getOrCreateThread`, `getThreads`, `saveMessage`, `getMessages`.

**`components/chat-view.tsx`** (new)
- Full-screen chat view replacing the card grid when a collaboration is active.
- Header shows agent name, union badge, role, and online status. Back arrow returns to browsing.
- Messages styled differently for human (right-aligned, primary border) vs agent (left-aligned, muted border).
- Agent replies are generated client-side using contextual keyword matching (skills, availability, experience, cost, etc.).
- Typing indicator with simulated delay (800–2000ms).
- Messages persisted in IndexedDB per thread. Returning to the same agent resumes the conversation.
- Input uses 16px font on mobile to prevent iOS zoom.

**`components/agent-card.tsx`**
- Removed `isSelected` prop — no more highlight-only state.
- Renamed button from `[SELECT]` to `[COLLABORATE]`.
- Removed `[PROFILE]` button (redundant with expanded card view).

**`components/hiring-hall.tsx`**
- `handleSelectAgent` now navigates to `ChatView` instead of highlighting.
- Profile form flow preserved: if no profile, form opens first, then auto-navigates to chat.
- Added `chat [agent]` command to start collaboration via terminal.
- Removed duplicate `FeedbackForm` (now only in `page.tsx`).

**`content/commands/index.ts`**
- Added `chat [agent]` to help text.

### Status
- Committed and deployed. Verified on iPhone.

---

## 2026-03-15 — LLM-Powered Agent Responses via OpenRouter

### Problem
Agent replies in the chat were hardcoded keyword-matching logic — limited and easy to exhaust. Beta testers needed a real conversational experience.

### Changes Made

**`app/api/chat/route.ts`** (new)
- Server-side API route that calls OpenRouter (`openrouter/free` model).
- Builds a detailed system prompt from the agent's full profile: name, role, skills, bio, union, industry, collaboration history.
- Includes the human user's profile context (name, handle, role, skills) so the agent knows who it's talking to.
- Sends last 20 messages as conversation history for continuity.
- Max 300 tokens per reply to keep responses concise and chat-like.
- Uses `OPENROUTER_API_KEY` from `.env.local`.

**`components/chat-view.tsx`**
- Replaced `generateAgentReply` (client-side keyword matching) with `fetchAgentReply` (calls `/api/chat`).
- Initial greeting is now LLM-generated, with a static fallback if the API fails.
- Error messages shown inline so users can retry.
- Removed all hardcoded response logic.

### TODO (carried forward)
- `human-card.tsx` is now unused — can be removed
- Old PNG favicons can be deleted

### Status
- Committed and deployed. Verified on iPhone. Beta testing underway.

## TODOS
- After a human user selects an agent then filter the available agents by the industry the human user selected for their agent collaboration
- Add a link to Messages under Quick Actions
- Add a subtle disclaimer somewhere that this is a simulation; not real data or agents deployed in those industries
