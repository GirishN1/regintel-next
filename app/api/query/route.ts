import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-sonnet:beta",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that summarizes recent U.S. federal regulatory rules with citations and recommendations for compliance teams."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const raw = await response.text();
    const clean = raw.replace(/^```json|```$/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ result: parsed.choices?.[0]?.message?.content || null });
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
