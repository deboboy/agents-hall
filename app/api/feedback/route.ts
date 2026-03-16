import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, rating } = (await request.json()) as {
      message: string
      rating: number
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Feedback webhook not configured" },
        { status: 500 }
      )
    }

    const stars = rating > 0 ? "⭐".repeat(rating) + ` (${rating}/5)` : "No rating"

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: "New Feedback Submission",
            color: 0x00ff88,
            fields: [
              { name: "Rating", value: stars, inline: true },
              { name: "Feedback", value: message },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Agents Hall Feedback" },
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Discord webhook error:", error)
      return NextResponse.json(
        { error: "Failed to send feedback" },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    )
  }
}
