export interface AnalysisParams {
  technology: string;
  temperature?: number;
  model: 'claude' | 'ollama';
  parameters?: {
    timeScope: number;
    scale: number;
    depth: number;
    timeline: number;
  };
}

export interface ClaudeResponse {
  content: string;
  error?: string;
}

export async function generateAnalysis({ 
  technology, 
  temperature = 0.7,
  model = 'claude',
  parameters
}: AnalysisParams): Promise<ClaudeResponse> {
  try {
    console.log(`Using ${model} model with temperature ${temperature}`);
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ technology, temperature, model })
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Invalid JSON response from server');
    }

    return { content: data.content };
  } catch (error) {
    return { 
      content: '',
      error: error instanceof Error ? error.message : 'Failed to generate analysis'
    };
  }
}