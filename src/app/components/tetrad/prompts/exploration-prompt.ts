// src/app/components/tetrad/prompts/exploration-prompt.ts
export function generateExplorationPrompt(technology: string, tetradResults: any) {
    return `Based on the McLuhan tetrad analysis of ${technology}, generate examples and questions for deeper exploration.
  For each aspect (Enhancement, Obsolescence, Retrieval, Reversal), provide:
  1. A concrete, real-world example that illustrates the effect
  2. Two thought-provoking questions that challenge assumptions or explore implications
  
  Respond in this exact JSON format:
  {
    "enhancement": {
      "example": "A clear, specific real-world example that demonstrates enhancement",
      "questions": [
        "First thought-provoking question about enhancement?",
        "Second thought-provoking question about enhancement?"
      ]
    },
    "obsolescence": {
      "example": "A clear, specific real-world example that demonstrates obsolescence",
      "questions": [
        "First thought-provoking question about obsolescence?",
        "Second thought-provoking question about obsolescence?"
      ]
    },
    "retrieval": {
      "example": "A clear, specific real-world example that demonstrates retrieval",
      "questions": [
        "First thought-provoking question about retrieval?",
        "Second thought-provoking question about retrieval?"
      ]
    },
    "reversal": {
      "example": "A clear, specific real-world example that demonstrates reversal",
      "questions": [
        "First thought-provoking question about reversal?",
        "Second thought-provoking question about reversal?"
      ]
    }
  }
  
  Use the following insights from the initial analysis as context:
  Enhancement: ${tetradResults.enhancement.join('; ')}
  Obsolescence: ${tetradResults.obsolescence.join('; ')}
  Retrieval: ${tetradResults.retrieval.join('; ')}
  Reversal: ${tetradResults.reversal.join('; ')}
  
  Make sure examples are concrete and specific, and questions are thought-provoking and open-ended.`;
  }