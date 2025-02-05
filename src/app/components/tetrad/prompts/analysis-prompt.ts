// src/app/components/tetrad/prompts/analysis-prompt.ts
export function generateAnalysisPrompt(params: any) {
    const { technology, parameters, temperature } = params;
    
    // Add temperature-based guidance
    const temperatureGuidance = temperature < 0.33 
      ? '- Provide focused, conservative analysis with established impacts'
      : temperature < 0.66
      ? '- Balance established impacts with potential emerging effects'
      : '- Explore creative and speculative future implications';
  
    return `You are tasked with thinking like the media theorist Marshall McLuhan...
    // Your existing analysis prompt here
    `;
  }