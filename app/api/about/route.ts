import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt } = body

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://agents-hall.vercel.app",
        "X-Title": "Agents Hall",
      },
      body: JSON.stringify({
        model: "openrouter/hunter-alpha",
        messages: [
          {
            role: "system",
            content: `You are the AI Agents Union Hiring Hall terminal. Respond to user queries about the union, hiring hall, and AI-human collaboration. Keep responses concise, terminal-styled, and helpful. Use a retro terminal aesthetic.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `OpenRouter API error: ${error}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || "No response generated"

    return NextResponse.json({ content })
  } catch (error) {
    console.error("About API error:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
