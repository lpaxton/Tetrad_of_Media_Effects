import { NextResponse } from 'next/server';
import { AnalysisParams, AnalysisResponse } from '@/app/components/tetrad/types/types';

function generatePrompt(params: AnalysisParams) {
  const { technology, parameters, temperature } = params;
  
  // Add temperature-based guidance
  const temperatureGuidance = temperature < 0.33 
    ? '- Provide focused, conservative analysis with established impacts'
    : temperature < 0.66
    ? '- Balance established impacts with potential emerging effects'
    : '- Explore creative and speculative future implications';

  // Build analysis parameters
  const timeScope = (parameters?.timeScope ?? 0) < 33 
    ? '- Focus on immediate and short-term effects'
    : (parameters?.timeScope ?? 0) < 66 
    ? '- Balance short and long-term implications'
    : '- Emphasize long-term and future implications';

  const scale = (parameters?.scale ?? 0) < 33
    ? '- Focus on individual impacts'
    : (parameters?.scale ?? 0) < 66
    ? '- Consider both individual and societal impacts'
    : '- Emphasize broader societal and cultural impacts';

  const depth = (parameters?.depth ?? 0) < 33
    ? '- Provide practical, concrete analysis'
    : (parameters?.depth ?? 0) < 66
    ? '- Balance practical and philosophical implications'
    : '- Delve into deeper philosophical implications';

  const temperatureInstruction = temperature < 0.33 
    ? 'Focus on well-documented and proven effects, maintaining a conservative analytical approach.'
    : temperature < 0.66
    ? 'Balance established effects with thoughtful speculation about emerging trends.'
    : 'Feel free to explore innovative and transformative possibilities while maintaining plausibility.';

  return `You are tasked with analyzing ${technology} using Marshall McLuhan's tetrad of media effects. Please provide your analysis in a strict JSON format matching this exact structure:

{
  "enhancement": [
    "first effect",
    "second effect",
    "third effect"
  ],
  "obsolescence": [
    "first effect",
    "second effect",
    "third effect"
  ],
  "retrieval": [
    "first effect",
    "second effect",
    "third effect"
  ],
  "reversal": [
    "first effect",
    "second effect",
    "third effect"
  ],
  "considerations": {
    "enhancement": "A thoughtful consideration about balancing enhancement capabilities",
    "obsolescence": "A thoughtful consideration about what is being lost",
    "retrieval": "A thoughtful consideration about what is being brought back",
    "reversal": "A thoughtful consideration about potential negative transformations"
  },
  "analysis": "summary paragraph here",
  "confidence": 0.85
}

Analysis Parameters to consider:
${temperatureGuidance}
${timeScope}
${scale}
${depth}
- Consider advancements in technology or medium for the year ${parameters?.timeline || 2024}

Remember:
1. Enhancement: What does ${technology} amplify or intensify?
2. Obsolescence: What does ${technology} drive out of prominence?
3. Retrieval: What does ${technology} recover which was previously lost?
4. Reversal: What does ${technology} flip into when pushed to extremes?

${temperatureInstruction}

Important: Your response must be valid JSON that exactly matches the structure shown above. Each effect should be a complete, insightful phrase.`;
}

export async function POST(request: Request) {
  try {
    const params: AnalysisParams = await request.json();
    console.log('Received parameters:', params);

    const prompt = generatePrompt(params);
    console.log('Generated prompt:', prompt);

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
        temperature: params.temperature || 0.7,
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
      // Extract the text content from Claude's response
      const text = claudeResponse.content[0].text;
      console.log('Claude text response:', text);

      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Claude response');
      }

      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);

      const parsedContent = JSON.parse(jsonStr);
      console.log('Parsed content:', parsedContent);

      return NextResponse.json({ content: parsedContent });
    } catch (error: unknown) {
      console.error('Parse error:', error);
      console.error('Failed to parse text:', claudeResponse.content[0].text);
      
      // Return a more specific error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
      return NextResponse.json(
        { error: `Failed to parse Claude response: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process analysis request' },
      { status: 500 }
    );
  }
}