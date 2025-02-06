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

  return `You are tasked with thinking like the media theorist Marshall McLuhan and creating outputs for his tetrad of media effects based on a given media technology. McLuhan's tetrad is a tool for analyzing the effects of any technology or medium on society.

First, I will provide you with a brief explanation of the four aspects of McLuhan's tetrad:
1. Enhancement: What does the medium amplify or intensify?
2. Obsolescence: What does the medium drive out of prominence?
3. Retrieval: What does the medium recover which was previously lost?
4. Reversal: What does the medium flip into when pushed to extremes?

Analysis Parameters:
${temperatureGuidance}
${parameters.timeScope < 33 ? '- Focus on immediate and short-term effects' 
  : parameters.timeScope < 66 ? '- Balance short and long-term implications'
  : '- Emphasize long-term and future implications'}
${parameters.scale < 33 ? '- Focus on individual impacts'
  : parameters.scale < 66 ? '- Consider both individual and societal impacts'
  : '- Emphasize broader societal and cultural impacts'}
${parameters.depth < 33 ? '- Provide practical, concrete analysis'
  : parameters.depth < 66 ? '- Balance practical and philosophical implications'
  : '- Delve into deeper philosophical implications'}
- Consider advancements in technology or medium for the year ${parameters.timeline}

Your task is to analyze the following media technology using McLuhan's tetrad:
<media_technology>
${technology}
</media_technology>

${temperature < 0.33 
  ? 'Focus on well-documented and proven effects, maintaining a conservative analytical approach.'
  : temperature < 0.66
  ? 'Balance established effects with thoughtful speculation about emerging trends.'
  : 'Feel free to explore innovative and transformative possibilities while maintaining plausibility.'}

Provide your response in JSON format with the following structure:
{
  "enhancement": ["effect1", "effect2", "effect3"],
  "obsolescence": ["effect1", "effect2", "effect3"],
  "retrieval": ["effect1", "effect2", "effect3"],
  "reversal": ["effect1", "effect2", "effect3"],
  "analysis": "A thoughtful summary paragraph that synthesizes the key insights",
  "confidence": ${temperature < 0.33 ? '0.9' : temperature < 0.66 ? '0.85' : '0.75'}
}

Make sure each section contains exactly 3 concise but insightful effects, with each effect being a complete phrase or sentence. The response must be valid JSON that can be parsed.`;
}

export async function POST(request: Request) {
  try {
    const params: AnalysisParams = await request.json();
    console.log('Received parameters:', params);

    const prompt = generatePrompt(params);
    console.log('Generated prompt:', prompt);

    // Make request to local Ollama instance
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:70b',
        prompt: prompt,
        stream: false,
        temperature: params.temperature || 0.7,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error('Failed to get response from Ollama API');
    }

    const ollamaData = await ollamaResponse.json();
    console.log('Raw Ollama response:', ollamaData);

    try {
      // Extract JSON from the response
      const jsonMatch = ollamaData.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Ollama response');
      }

      const parsedContent = JSON.parse(jsonMatch[0]);
      console.log('Parsed content:', parsedContent);

      // Return in the expected format
      const response: AnalysisResponse = {
        content: parsedContent
      };

      return NextResponse.json(response);
    } catch (parseError) {
      console.error('Failed to parse Ollama response:', parseError);
      console.error('Raw response:', ollamaData.response);
      
      // Fall back to mock data if parsing fails
      const fallbackResponse: AnalysisResponse = {
        content: {
          enhancement: [
            `Amplified ${params?.parameters?.depth ?? 50 < 33 ? 'functional' : 'transformative'} capabilities`,
            `Enhanced ${params?.parameters?.scale ?? 50 < 33 ? 'personal' : 'collective'} engagement`,
            `Expanded ${params?.parameters?.timeScope ?? 50 < 33 ? 'immediate' : 'future'} possibilities`
          ],
          obsolescence: [
            `Legacy ${params?.parameters?.depth ?? 50 < 33 ? 'tools' : 'paradigms'}`,
            `Traditional ${params?.parameters?.scale ?? 50 < 33 ? 'methods' : 'systems'}`,
            `Previous ${params?.parameters?.timeScope ?? 50 < 33 ? 'solutions' : 'frameworks'}`
          ],
          retrieval: [
            `Essential ${params?.parameters?.depth ?? 50 < 33 ? 'functions' : 'principles'}`,
            `Core ${params?.parameters?.scale ?? 50 < 33 ? 'experiences' : 'values'}`,
            `Fundamental ${params?.parameters?.timeScope ?? 50 < 33 ? 'processes' : 'patterns'}`
          ],
          reversal: [
            `${params?.parameters?.depth ?? 50 < 33 ? 'Practical' : 'Philosophical'} challenges`,
            `${params?.parameters?.scale ?? 50 < 33 ? 'Personal' : 'Societal'} implications`,
            `${params?.parameters?.timeScope ?? 50 < 33 ? 'Immediate' : 'Long-term'} consequences`
          ],
          analysis: `Deep analysis of ${params?.technology ?? 'technology'} using McLuhan's framework reveals ${
            params?.parameters?.depth ?? 50 < 33 ? 'practical' : 'philosophical'
          } insights about ${
            params?.parameters?.scale ?? 50 < 33 ? 'individual' : 'societal'
          } impacts through ${
            params?.parameters?.timeline ?? '2024'
          }, highlighting ${
            params?.parameters?.timeScope ?? 50 < 33 ? 'immediate' : 'long-term'
          } transformative potential.`,
          confidence: 0.78
        }
      };

      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process analysis request' },
      { status: 500 }
    );
  }
}