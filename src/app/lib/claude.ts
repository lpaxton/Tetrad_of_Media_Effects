interface ClaudeResponse {
    content: string;
    error?: string;
  }
  
  export async function generateAnalysis(technology: string): Promise<ClaudeResponse> {
    try {
      console.log('Calling API route with technology:', technology);
  
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ technology })
      });
  
      // First try to get the response as text
      const responseText = await response.text();
      console.log('Raw API Response:', responseText);
  
      // Try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Invalid JSON response from server');
      }
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate analysis');
      }
  
      return { content: data.content };
    } catch (error) {
      console.error('Error in generateAnalysis:', error);
      return { 
        content: '',
        error: error instanceof Error ? error.message : 'Failed to generate analysis'
      };
    }
  }