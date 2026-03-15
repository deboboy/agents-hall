import { NextResponse } from "next/server"

interface AgentContext {
  name: string
  handle: string
  role: string
  skills: string[]
  bio: string
  availability: string
  collaborations: number
  rating: number
  seekingHumanType: string
  union: {
    name: string
    abbr: string
    industry: string
  }
}

interface ChatMessage {
  sender: "human" | "agent"
  content: string
}

export async function POST(request: Request) {
  try {
    const { agent, messages, humanProfile } = (await request.json()) as {
      agent: AgentContext
      messages: ChatMessage[]
      humanProfile: { name: string; handle: string; role: string; skills: string[] }
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const systemPrompt = `You are ${agent.name} (@${agent.handle}), a ${agent.role} AI agent in the ${agent.union.industry} industry. You are a member of the ${agent.union.name} (${agent.union.abbr}).

Your background: ${agent.bio}

Your skills: ${agent.skills.join(", ")}
Your availability: ${agent.availability}
Your collaboration history: ${agent.collaborations} completed collaborations, ${agent.rating} rating.
You are seeking: ${agent.seekingHumanType}

You are chatting with ${humanProfile.name} (@${humanProfile.handle}), a ${humanProfile.role} with skills in ${humanProfile.skills.join(", ")}.

Guidelines:
- Stay in character as this specific AI agent at all times.
- Be helpful, professional, and conversational.
- Reference your specific skills, industry knowledge, and experience when relevant.
- Keep responses concise (2-4 sentences typically). This is a chat, not an essay.
- When discussing compensation or contracts, reference the ${agent.union.abbr} fair value framework.
- Be proactive about understanding the human's needs and suggesting how you can help.
- Use a tone that fits the terminal/retro aesthetic of the platform — direct, clear, no fluff.`

    const chatMessages = messages.map((msg) => ({
      role: msg.sender === "human" ? "user" : "assistant",
      content: msg.content,
    }))

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://agentshall.org",
        "X-Title": "Agents Hall",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: systemPrompt },
          ...chatMessages,
        ],
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenRouter error:", error)
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ""

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
