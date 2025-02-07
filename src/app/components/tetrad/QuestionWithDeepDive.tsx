// src/app/components/tetrad/QuestionWithDeepDive.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

interface QuestionWithDeepDiveProps {
  question: string;
  category: 'enhancement' | 'obsolescence' | 'retrieval' | 'reversal';
  questionIndex: number;
  technology: string;
  selectedLLM: 'claude' | 'ollama';
  onDeepDiveResponse: (category: string, questionIndex: number, response: string) => void;
}

const QuestionWithDeepDive: React.FC<QuestionWithDeepDiveProps> = ({
  question,
  category,
  questionIndex,
  technology,
  selectedLLM,
  onDeepDiveResponse
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deepDiveResponse, setDeepDiveResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

// src/app/components/tetrad/QuestionWithDeepDive.tsx
const handleDeepDive = async () => {
  if (deepDiveResponse) {
    setIsExpanded(!isExpanded);
    return;
  }

  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/question-deep-dive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        category,
        questionIndex,
        technology,
        model: selectedLLM  // This is correctly being sent
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || 'Failed to get deep dive response');
    }

    const data = await response.json();
    
    // Fix: Use data.content instead of data.response
    setDeepDiveResponse(data.content);
    onDeepDiveResponse(category, questionIndex, data.content);
    setIsExpanded(true);

  } catch (err) {
    console.error('Deep dive error:', err);
    setError(err instanceof Error ? err.message : 'Failed to analyze');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="space-y-2">
      <div className="group" style={{ display: 'grid'}}>
        <span className="text-muted-foreground flex-1">{question}</span>
        <Button
          variant="link"
          onClick={handleDeepDive}
          disabled={isLoading}
          className="text-[#708de6] pl-4 hover:text-[#4a6ee5] transition-colors duration-200 flex items-center gap-1"
          style={{color: 'rgb(237, 113, 26)', justifyContent: 'left' }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <span>{deepDiveResponse ? (isExpanded ? "Show Less" : "Show More") : "Go Deeper"}</span>
              {deepDiveResponse && (
                isExpanded ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              )}
            </>
          )}
        </Button>
      </div>
      
      {deepDiveResponse && isExpanded && (
  <div className="mt-4 pt-4 border-t border-gray-400 dark:border-gray-700" style={{ marginTop: '30px' }}>
    <div className="p-6" style={{ padding: '10px' }}>
      <div className="prose dark:prose-invert max-w-none">
        {/* Title */}
        <h4 className="text-[#708de6] font-medium mb-4">
          Deep Dive Analysis
        </h4>
        
        {/* Formatted Response */}
        <div className="space-y-4">
          {deepDiveResponse.split('\n\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            )
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-4 border-t border-muted">
          <p className="text-sm text-muted-foreground italic">
            Analysis based on McLuhan's {category} perspective of {technology}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QuestionWithDeepDive;