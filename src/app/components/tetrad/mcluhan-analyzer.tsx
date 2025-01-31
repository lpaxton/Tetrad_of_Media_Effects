'use client';

import React, { useState } from 'react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import SoftUIButton from '../ui/button';
import SoftUISlider from '../ui/slider';
import SoftUIInput from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2 } from 'lucide-react';
import { generateAnalysis } from '../../lib/claude';
import { FaArrowUp, FaArrowDown, FaUndo, FaExchangeAlt } from 'react-icons/fa';

const McLuhanAnalyzer = () => {
  const [technology, setTechnology] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analysis parameters
  const [parameters, setParameters] = useState({
    timeScope: 50,  // 0: Immediate effects, 100: Long-term effects
    scale: 50,      // 0: Individual impact, 100: Societal impact
    depth: 50,      // 0: Surface-level analysis, 100: Deep philosophical analysis
    timeline: 2024  // Year for the analysis
  });

  const handleAnalysis = async () => {
    if (!technology.trim()) {
      setError('Please enter a technology to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `You are tasked with thinking like the media theorist Marshall McLuhan and creating outputs for his tetrad of media effects based on a given media technology. McLuhan's tetrad is a tool for analyzing the effects of any technology or medium on society.

First, I will provide you with a brief explanation of the four aspects of McLuhan's tetrad:

1. Enhancement: What does the medium amplify or intensify?
2. Obsolescence: What does the medium drive out of prominence?
3. Retrieval: What does the medium recover which was previously lost?
4. Reversal: What does the medium flip into when pushed to extremes?

Analysis Parameters:
${parameters.timeScope < 33 ? '- Focus on immediate and short-term effects' 
  : parameters.timeScope < 66 ? '- Balance short and long-term implications'
  : '- Emphasize long-term and future implications'}
${parameters.scale < 33 ? '- Focus on individual impacts'
  : parameters.scale < 66 ? '- Consider both individual and societal impacts'
  : '- Emphasize broader societal and cultural impacts'}
${parameters.depth < 33 ? '- Provide practical, concrete analysis'
  : parameters.depth < 66 ? '- Balance practical and philosophical implications'
  : '- Delve into deeper philosophical implications'}
- Consider advancements in technology or medium for the year ${parameters.timeline}

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
</tetrad_analysis>
`;

      const response = await generateAnalysis(prompt);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setResult(response.content);
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTetradAnalysis = (result: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(result, 'text/xml');
    return {
      enhancement: doc.querySelector('enhancement')?.textContent || '',
      obsolescence: doc.querySelector('obsolescence')?.textContent || '',
      retrieval: doc.querySelector('retrieval')?.textContent || '',
      reversal: doc.querySelector('reversal')?.textContent || ''
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Introduction Section */}
      <SoftUICard>
        <SoftUICardHeader>
          <SoftUICardTitle>McLuhan&apos;s Tetrad of Media Effects</SoftUICardTitle>
          <SoftUICardContent>
            Analyze any technology or medium using McLuhan&apos;s four laws of media
          </SoftUICardContent>
        </SoftUICardHeader>
        <SoftUICardContent>
          <div className="prose dark:prose-invert">
            <p>
              Marshall McLuhan&apos;s tetrad examines the effects of technologies 
              and media through four aspects:
            </p>
            <ol className="space-y-2">
              <li><strong>Enhancement:</strong> What does the medium amplify or intensify?</li>
              <li><strong>Obsolescence:</strong> What does the medium drive out of prominence?</li>
              <li><strong>Retrieval:</strong> What does the medium recover which was previously lost?</li>
              <li><strong>Reversal:</strong> What does the medium flip into when pushed to extremes?</li>
            </ol>
          </div>
        </SoftUICardContent>
      </SoftUICard>

      {/* Analysis Tool */}
      <SoftUICard>
        <SoftUICardHeader>
          <SoftUICardTitle>Analysis Parameters</SoftUICardTitle>
          <SoftUICardContent>
            Configure how the analysis should be performed
          </SoftUICardContent>
        </SoftUICardHeader>
        <SoftUICardContent>
          <div>
            <label className="block text-sm font-medium mb-2">
              Technology or Medium to Analyze
            </label>
            <SoftUIInput
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              placeholder="e.g., Smartphone, Social Media, Virtual Reality"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Scope: Immediate to Long-term Effects
              </label>
              <SoftUISlider
                value={parameters.timeScope}
                onChange={(e) => setParameters(p => ({...p, timeScope: Number(e.target.value)}))}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Immediate</span>
                <span>Long-term</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Scale: Individual to Societal Impact
              </label>
              <SoftUISlider
                value={parameters.scale}
                onChange={(e) => setParameters(p => ({...p, scale: Number(e.target.value)}))}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Individual</span>
                <span>Societal</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Analysis Depth: Practical to Philosophical
              </label>
              <SoftUISlider
                value={parameters.depth}
                onChange={(e) => setParameters(p => ({...p, depth: Number(e.target.value)}))}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Practical</span>
                <span>Philosophical</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Timeline: Year of Analysis for <span style={{ color: '#007bff' }}>{parameters.timeline}</span>
              </label>
              <SoftUISlider
                value={parameters.timeline}
                onChange={(e) => setParameters(p => ({...p, timeline: Number(e.target.value)}))}
                min={2024}
                max={2100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2024</span>
                <span>2100</span>
              </div>
            </div>
          </div>

          <SoftUIButton 
            onClick={handleAnalysis} 
            disabled={loading || !technology.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Analysis...
              </>
            ) : (
              'Generate Tetrad Analysis'
            )}
          </SoftUIButton>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </SoftUICardContent>
      </SoftUICard>

      {/* Results Section */}
      {result && (
        <SoftUICard>
          <SoftUICardHeader>
            <SoftUICardTitle>McLuhan&apos;s Tetrad Analysis</SoftUICardTitle>
            <SoftUICardContent>
              Analysis of {technology}&apos;s effects on society and culture for the year <span style={{ color: '#007bff' }}>{parameters.timeline}</span>
            </SoftUICardContent>
          </SoftUICardHeader>
          <SoftUICardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(formatTetradAnalysis(result)).map(([key, value]) => (
                <SoftUICard key={key} className="p-4 bg-muted/50">
                  <h3 className="font-bold mb-2 capitalize flex items-center">
                    {key === 'enhancement' && <FaArrowUp className="mr-2" />}
                    {key === 'obsolescence' && <FaArrowDown className="mr-2" />}
                    {key === 'retrieval' && <FaUndo className="mr-2" />}
                    {key === 'reversal' && <FaExchangeAlt className="mr-2" />}
                    {key}
                  </h3>
                  <p className="text-sm leading-relaxed">{value}</p>
                </SoftUICard>
              ))}
            </div>
          </SoftUICardContent>
        </SoftUICard>
      )}
    </div>
  );
};

export default McLuhanAnalyzer;