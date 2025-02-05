// At the top of your ollama handler file
import { Exploration, AnalysisParams, AnalysisResponse, TetradSection } from '../types/types';;

function parseOllamaResponse(response: string): string {
  // Remove thinking section and non-XML content
  let cleaned = response
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/### /g, '')
    .replace(/\*\*/g, '')
    .replace(/---/g, '')
    .replace(/####/g, '')
    .replace(/Analysis:/g, '')
    .replace(/Example:/g, '')
    .replace(/Questions:/g, '')
    .trim();

  // Fix incorrect closing tag
  cleaned = cleaned.replace('</tetradata>', '</tetrad_analysis>');

  // Ensure proper XML structure
  if (!cleaned.startsWith('<tetrad_analysis>')) {
    cleaned = `<tetrad_analysis>\n${cleaned}\n</tetrad_analysis>`;
  }

  return cleaned;
}




function parseOllamaDeepAnalysis(content: string): Exploration[] {
  const sections = ['enhancement', 'obsolescence', 'retrieval', 'reversal'];
  return sections.map(section => {
    const sectionRegex = new RegExp(
      `<${section}>\\s*([\\s\\S]*?)` + 
      `<example>([\\s\\S]*?)</example>\\s*` + 
      `<questions>\\s*([\\s\\S]*?)\\s*</questions>\\s*` + 
      `</${section}>`, 
      's'
    );
    
    const matches = content.match(sectionRegex);
    
    return {
      section,
      example: matches?.[2]?.trim() || '',
      questions: matches?.[3]?.trim() || ''
    };
  });
}


export async function handleOllamaAnalysis(params: AnalysisParams) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:70b',
        prompt: constructPrompt(params.technology, params.parameters, params.isDeepAnalysis),
        temperature: params.temperature,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Ollama API error');
    }

    const data = await response.json();
    const cleanedResponse = parseOllamaResponse(data.response);
    return { content: cleanedResponse };
  } catch (error) {
    console.error('Ollama error:', error);
    return { content: '', error: 'Failed to generate Deepseek analysis' };
  }
}



function constructPrompt(technology: string, parameters?: AnalysisParams['parameters'], isDeepAnalysis?: boolean) {
  if (isDeepAnalysis) {
    return `You are tasked with analyzing McLuhan's tetrad sections and providing examples and questions.
For each section below, provide:
1. A specific real-world example demonstrating the effect
2. Two thought-provoking questions about the implications

<tetrad_analysis>
<enhancement>
[Your analysis of enhancement]
<example>[Your specific example for enhancement]</example>
<questions>
1. First question about enhancement implications
2. Second question about enhancement impacts
</questions>
</enhancement>

<obsolescence>
[Your analysis of obsolescence]
<example>[Your specific example for obsolescence]</example>
<questions>
1. First question about obsolescence implications
2. Second question about obsolescence impacts
</questions>
</obsolescence>

<retrieval>
[Your analysis of retrieval]
<example>[Your specific example for retrieval]</example>
<questions>
1. First question about retrieval implications
2. Second question about retrieval impacts
</questions>
</retrieval>

<reversal>
[Your analysis of reversal]
<example>[Your specific example for reversal]</example>
<questions>
1. First question about reversal implications
2. Second question about reversal impacts
</questions>
</reversal>
</tetrad_analysis>

Technology to analyze: ${technology}`;
  }
  return `You are Marshall McLuhan analyzing "${technology}". Provide your response in EXACTLY this format:

<tetrad_analysis>
<enhancement>
[Analysis of enhancement]

</enhancement>

<obsolescence>
[Analysis of obsolescence]

</obsolescence>

<retrieval>
[Analysis of retrieval]

</retrieval>

<reversal>
[Analysis of reversal]

</reversal>
</tetrad_analysis>`;
}

export function constructOllamaPrompt(sections: Record<string, string>, isDeepAnalysis: boolean) {
  if (isDeepAnalysis) {
    return `Analyze these tetrad sections and provide specific examples. Format EXACTLY like this:

<tetrad_analysis>
<enhancement>
${sections.enhancement}
<example>A specific real-world example of enhancement</example>
</enhancement>

<obsolescence>
${sections.obsolescence}
<example>A specific real-world example of obsolescence</example>
</obsolescence>

<retrieval>
${sections.retrieval}
<example>A specific real-world example of retrieval</example>
</retrieval>

<reversal>
${sections.reversal}
<example>A specific real-world example of reversal</example>
</reversal>
</tetrad_analysis>`;
  }
  // ...regular prompt construction
}