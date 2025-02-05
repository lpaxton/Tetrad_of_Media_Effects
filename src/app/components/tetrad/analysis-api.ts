import { AnalysisParams, AnalysisResponse } from './types/types';

export const performClaudeAnalysis = async (params: AnalysisParams): Promise<AnalysisResponse> => {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        model: 'claude'
      })
    });
    
    if (!response.ok) {
      throw new Error('Analysis request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Claude analysis error:', error);
    throw error;
  }
};

export const performOllamaAnalysis = async (params: AnalysisParams): Promise<AnalysisResponse> => {
  try {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        model: 'ollama'
      })
    });
    
    if (!response.ok) {
      throw new Error('Analysis request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ollama analysis error:', error);
    throw error;
  }
};