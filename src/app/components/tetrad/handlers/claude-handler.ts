import { AnalysisParams, AnalysisResponse, Exploration } from '../types/types';

const ANTHROPIC_API_URL = process.env.NEXT_PUBLIC_ANTHROPIC_API_URL;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function constructPrompt(technology: string, parameters?: AnalysisParams['parameters'], isDeepAnalysis?: boolean) {
  if (isDeepAnalysis) {
    return `Analyze the following technology using McLuhan's tetrad. Format your response EXACTLY like this:

<tetrad_analysis>
<enhancement>
<example>A specific example demonstrating enhancement effects</example>
<questions>
1. First question about enhancement implications
2. Second question about enhancement impacts
</questions>
</enhancement>

<obsolescence>
<example>A specific example demonstrating obsolescence</example>
<questions>
1. First question about obsolescence implications
2. Second question about obsolescence impacts
</questions>
</obsolescence>

<retrieval>
<example>A specific example demonstrating retrieval</example>
<questions>
1. First question about retrieval implications
2. Second question about retrieval impacts
</questions>
</retrieval>

<reversal>
<example>A specific example demonstrating reversal</example>
<questions>
1. First question about reversal implications
2. Second question about reversal impacts
</questions>
</reversal>
</tetrad_analysis>

Technology to analyze: ${technology}`;
  }

  return `You are tasked with thinking like the media theorist Marshall McLuhan and creating outputs for his tetrad of media effects based on a given media technology. McLuhan's tetrad is a tool for analyzing the effects of any technology or medium on society.

First, I will provide you with a brief explanation of the four aspects of McLuhan's tetrad:

1. Enhancement: What does the medium amplify or intensify?
2. Obsolescence: What does the medium drive out of prominence?
3. Retrieval: What does the medium recover which was previously lost?
4. Reversal: What does the medium flip into when pushed to extremes?

${parameters ? `Analysis Parameters:
${parameters.timeScope < 33 ? '- Focus on immediate and short-term effects' 
  : parameters.timeScope < 66 ? '- Balance short and long-term implications'
  : '- Emphasize long-term and future implications'}
${parameters.scale < 33 ? '- Focus on individual impacts'
  : parameters.scale < 66 ? '- Consider both individual and societal impacts'
  : '- Emphasize broader societal and cultural impacts'}
${parameters.depth < 33 ? '- Provide practical, concrete analysis'
  : parameters.depth < 66 ? '- Balance practical and philosophical implications'
  : '- Delve into deeper philosophical implications'}
- Consider advancements in technology or medium for the year ${parameters.timeline}` : ''}

Your task is to analyze the following media technology using McLuhan's tetrad:

<media_technology>
${technology}
</media_technology>

To complete this task, follow these steps:

1. Carefully consider the given media technology and its potential impacts on society, culture, and human behavior.
2. For each aspect of the tetrad, provide a thoughtful analysis in McLuhan's style. Be creative, critical, and consider both obvious and non-obvious effects.
3. Structure your response using the following format:

<tetrad_analysis>
<enhancement>
[Your analysis of what the medium enhances or intensifies]
</enhancement>

<obsolescence>
[Your analysis of what the medium makes obsolete or pushes out of prominence]
</obsolescence>

<retrieval>
[Your analysis of what the medium brings back or retrieves from the past]
</retrieval>

<reversal>
[Your analysis of how the medium flips into when pushed to its limits]
</reversal>
</tetrad_analysis>`;
}

const parseDeepAnalysis = (content: string): Exploration[] => {
  const sections = ['enhancement', 'obsolescence', 'retrieval', 'reversal'];
  return sections.map(section => {
    const sectionRegex = new RegExp(`<${section}>\\s*<example>([\\s\\S]*?)</example>\\s*<questions>([\\s\\S]*?)</questions>\\s*</${section}>`, 's');
    const matches = content.match(sectionRegex);
    
    return {
      section,
      example: matches?.[1]?.trim() || '',
      questions: matches?.[2]?.trim() || ''
    };
  });
};

export function constructClaudePrompt(sections: Record<string, string>, isDeepAnalysis: boolean) {
  if (isDeepAnalysis) {
    return `You are tasked with analyzing McLuhan's tetrad sections and providing examples and questions.
For each section below, provide:
1. A specific real-world example demonstrating the effect
2. Two thought-provoking questions about the implications

<tetrad_analysis>
<enhancement>
${sections.enhancement}
<example>[Your specific example for enhancement]</example>
<questions>
1. First question about enhancement implications
2. Second question about enhancement impacts
</questions>
</enhancement>

<obsolescence>
${sections.obsolescence}
<example>[Your specific example for obsolescence]</example>
<questions>
1. First question about obsolescence implications
2. Second question about obsolescence impacts
</questions>
</obsolescence>

<retrieval>
${sections.retrieval}
<example>[Your specific example for retrieval]</example>
<questions>
1. First question about retrieval implications
2. Second question about retrieval impacts
</questions>
</retrieval>

<reversal>
${sections.reversal}
<example>[Your specific example for reversal]</example>
<questions>
1. First question about reversal implications
2. Second question about reversal impacts
</questions>
</reversal>
</tetrad_analysis>`;
  }
  // ...regular prompt construction
}

export async function handleClaudeAnalysis(params: AnalysisParams): Promise<AnalysisResponse> {
  if (!ANTHROPIC_API_URL || !ANTHROPIC_API_KEY) {
    console.error('Missing Claude API configuration');
    return { 
      content: '', 
      error: 'Claude API not configured. Check environment variables.' 
    };
  }

  const { technology, temperature, isDeepAnalysis, parameters } = params;

  try {
    const prompt = constructPrompt(technology, parameters, isDeepAnalysis || false);
    
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: prompt
        }],
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Claude raw response:', data);

    const text = data.content[0].text;

    if (!text.includes('<tetrad_analysis>')) {
      const formattedResponse = `<tetrad_analysis>
<enhancement>${text}</enhancement>
<obsolescence>Effects on traditional technologies</obsolescence>
<retrieval>Historical patterns and retrievals</retrieval>
<reversal>Potential negative effects</reversal>
</tetrad_analysis>`;
      return { content: formattedResponse };
    }

    return { content: text };
  } catch (error) {
    console.error('Claude API error:', error);
    return { 
      content: '', 
      error: error instanceof Error ? error.message : 'Failed to generate analysis with Claude' 
    };
  }
}