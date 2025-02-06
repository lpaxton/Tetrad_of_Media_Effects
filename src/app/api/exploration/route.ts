import { NextResponse } from 'next/server';
import { AnalysisParams, AnalysisResponse } from '@/app/components/tetrad/types/types';

function generateExplorationPrompt(technology: string, tetradResults: any) {
  return `You are tasked with providing deeper insights into the McLuhan tetrad analysis of ${technology}. Provide your response in a strict JSON format matching this exact structure:

{
  "enhancement": {
    "example": "A clear, specific real-world example demonstrating enhancement",
    "questions": [
      "First thought-provoking question about enhancement?",
      "Second thought-provoking question about enhancement?"
    ]
  },
  "obsolescence": {
    "example": "A clear, specific real-world example demonstrating obsolescence",
    "questions": [
      "First thought-provoking question about obsolescence?",
      "Second thought-provoking question about obsolescence?"
    ]
  },
  "retrieval": {
    "example": "A clear, specific real-world example demonstrating retrieval",
    "questions": [
      "First thought-provoking question about retrieval?",
      "Second thought-provoking question about retrieval?"
    ]
  },
  "reversal": {
    "example": "A clear, specific real-world example demonstrating reversal",
    "questions": [
      "First thought-provoking question about reversal?",
      "Second thought-provoking question about reversal?"
    ]
  }
}

Base your exploration on these initial analysis insights:
Enhancement: ${tetradResults.enhancement.join('; ')}
Obsolescence: ${tetradResults.obsolescence.join('; ')}
Retrieval: ${tetradResults.retrieval.join('; ')}
Reversal: ${tetradResults.reversal.join('; ')}

Important: Your response must be valid JSON that exactly matches the structure shown above. Make sure examples are concrete and specific, and questions are thought-provoking and open-ended.`;
}

export async function POST(request: Request) {
  try {
    const { technology, tetradResults, model } = await request.json();
    console.log('Received exploration request:', { technology, model });

    const prompt = generateExplorationPrompt(technology, tetradResults);
    console.log('Generated exploration prompt:', prompt);

    if (model === 'claude') {
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
          max_tokens: 2000,
          temperature: 0.7,
          messages: [{
            role: 'user',
            content: prompt
          }],
          system: "You are an expert in media theory and McLuhan's tetrad analysis. Always respond with valid JSON matching the exact structure requested."
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Claude API error:', errorData);
        throw new Error(`Claude API error: ${JSON.stringify(errorData)}`);
      }

      const claudeResponse = await response.json();
      console.log('Raw Claude response:', claudeResponse);

      try {
        const text = claudeResponse.content[0].text;
        console.log('Claude text response:', text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in Claude response');
        }

        const jsonStr = jsonMatch[0];
        console.log('Extracted JSON string:', jsonStr);

        const parsedContent = JSON.parse(jsonStr);
        console.log('Parsed content:', parsedContent);

        return NextResponse.json({ content: parsedContent });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Failed to parse text:', claudeResponse.content[0].text);
        
        return NextResponse.json(
          { error: `Failed to parse Claude response: ${(parseError as Error).message}` },
          { status: 500 }
        );
      }
    } else {
      // Ollama
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
        throw new Error('Failed to get response from Ollama API');
      }

      const ollamaData = await response.json();
      console.log('Raw Ollama response:', ollamaData);

      try {
        const jsonMatch = ollamaData.response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in Ollama response');
        }

        const parsedContent = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ content: parsedContent });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        return NextResponse.json(
          { error: `Failed to parse Ollama response: ${(parseError as Error).message}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process exploration request' },
      { status: 500 }
    );
  }
}