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

async function getClaudeResponse(prompt: string) {
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
    const errorText = await response.text();
    throw new Error(`Claude API error: ${errorText}`);
  }

  const claudeResponse = await response.json();
  return claudeResponse.content[0].text;
}

async function getOllamaResponse(prompt: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-r1:70b',
      prompt: prompt,
      stream: false,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${errorText}`);
  }

  const ollamaData = await response.json();

  // Get the raw response
  let cleanedResponse = ollamaData.response.trim();

  // Remove any thinking/planning content before the actual response
  cleanedResponse = cleanedResponse
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    
    // Clean up any remaining artifacts
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleanedResponse;
}

export async function POST(request: Request) {
  try {
    const { question, category, technology, model = 'claude' } = await request.json();
    console.log('Received question deep dive request:', { question, category, technology, model });

    if (!question || !category || !technology) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const prompt = generatePrompt(technology, question, category);
    let content: string;

    if (model === 'ollama') {
      content = await getOllamaResponse(prompt);
    } else {
      content = await getClaudeResponse(prompt);
    }

    return NextResponse.json({
      content,
      service: model
    });
  } catch (error) {
    console.error('Question deep dive error:', error);

    let errorMessage = 'Failed to process question deep dive request';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        errorMessage = 'Claude API key not configured';
        statusCode = 503;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Could not connect to AI service. Please check your configuration.';
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}