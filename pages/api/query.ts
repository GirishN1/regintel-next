// pages/api/query.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // from .env
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku', // or gpt-4-openrouter
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const raw = data.choices[0]?.message?.content?.trim();
    const clean = raw?.replace(/^```json|```$/g, '')?.trim();

    const parsed = JSON.parse(clean);

    res.status(200).json({
      summary: parsed.summary,
      citations: parsed.citations || [],
      recommendations: parsed.recommendations || [],
    });
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    res.status(500).json({ error: 'Failed to get response from model.' });
  }
}
