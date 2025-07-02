// app/api/query/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    return NextResponse.json({ result: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
