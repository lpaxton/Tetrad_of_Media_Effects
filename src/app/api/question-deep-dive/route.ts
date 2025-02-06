// src/app/api/question-deep-dive/route.ts
import { NextResponse } from 'next/server';

function generatePrompt(technology: string, question: string, category: string) {
  return `Analyze the following question about ${technology} in the context of McLuhan's tetrad of media effects, specifically focusing on the ${category} aspect:

Question: "${question}"

Provide a thoughtful, detailed response that:
1. Addresses the question directly
2. Draws on specific examples and real-world implications
3. Considers both immediate and long-term effects
4. References McLuhan's media theory where relevant
5. Offers balanced perspectives on potential benefits and challenges

Keep the response focused, insightful, and approximately 2-3 paragraphs long.`;
}

export async function POST(request: Request) {
  try {
    const { question, category, technology } = await request.json();
    console.log('Received question deep dive request:', { question, category, technology });

    const prompt = generatePrompt(technology, question, category);
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }],
        system: "You are an expert in media theory and McLuhan's tetrad analysis."
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Claude API');
    }

    const claudeResponse = await response.json();
    return NextResponse.json({ 
      content: claudeResponse.content[0].text 
    });
  } catch (error) {
    console.error('Question deep dive error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process question deep dive request' },
      { status: 500 }
    );
  }
}