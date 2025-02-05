import { AnalysisParams } from '../components/tetrad/mcluhan-analyzer';

export async function generateAnalysis(params: AnalysisParams): Promise<{ content: string; error?: string }> {
  try {
    console.log('Generating analysis with params:', params);
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate analysis');
    }

    return data;
  } catch (error) {
    console.error('Analysis generation error:', error);
    throw error;
  }
}