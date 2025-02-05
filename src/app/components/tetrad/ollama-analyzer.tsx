'use client';

import React, { useState } from 'react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import SoftUIButton from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';
import { AnalysisParams } from './types/types';

// Separate async function for making the API call
export const performOllamaAnalysis = async (params: AnalysisParams) => {
  try {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
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

// React component interface
interface OllamaAnalyzerProps {
  technology: string;
  temperature: number;
  timeScope: number;
  scale: number;
  depth: number;
  timeline: number;
}

// React component
const OllamaAnalyzer: React.FC<OllamaAnalyzerProps> = ({ 
  technology, 
  temperature,
  timeScope,
  scale,
  depth,
  timeline
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await performOllamaAnalysis({
        technology,
        temperature,
        timeScope,
        scale,
        depth,
        timeline
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setResult(response.content);
    } catch (err) {
      setError('Failed to generate Deepseek analysis');
      console.error('Ollama analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SoftUICard>
      <SoftUICardHeader>
        <SoftUICardTitle>McLuhan's Tetrad Analysis - Ollama Deepseek</SoftUICardTitle>
      </SoftUICardHeader>
      <SoftUICardContent>
        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          result && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Add Ollama-specific result rendering */}
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )
        )}
        <SoftUIButton 
          onClick={handleAnalysis}
          disabled={loading || !technology}
          className="mt-4 w-full"
        >
          Generate Deepseek Analysis
        </SoftUIButton>
      </SoftUICardContent>
    </SoftUICard>
  );
};

export default OllamaAnalyzer;