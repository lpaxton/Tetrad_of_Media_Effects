"use client";
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { performClaudeAnalysis, performOllamaAnalysis } from './analysis-api';
import { AnalysisParams } from './types/types';
import styled from 'styled-components';
import { ExplorationResults } from './ExplorationResults';
import QuestionWithDeepDive from './QuestionWithDeepDive';
import { ExplorationResponse } from './types/types';

import {
  Maximize2,    // For Enhancement
  MinusCircle,  // For Obsolescence
  RotateCcw,    // For Retrieval
  FlipHorizontal, // For Reversal
  HomeIcon, Settings, Search, ArrowDownCircle, FileText
} from 'lucide-react';
import FlipCard from './FlipCard';
import { generateCounterpartContent } from './counterpartContent';
import McLuhanReport from './McLuhanReport';
import './flip-card.css';

type NavSection = {
  id: string;
  title: string;
  icon?: React.ReactNode;
};

const navSections: NavSection[] = [
  { id: 'introduction', title: 'Introduction', icon: <HomeIcon className="h-4 w-4" /> },
  { id: 'analysis-parameters', title: 'Analysis Parameters', icon: <Settings className="h-4 w-4" /> },
  { id: 'tetrad-analysis', title: 'Tetrad Analysis', icon: <Search className="h-4 w-4" /> },
  { id: 'deep-dive', title: 'Deep Dive Exploration', icon: <ArrowDownCircle className="h-4 w-4" /> },
  { id: 'full-report', title: 'Complete Report', icon: <FileText className="h-4 w-4" /> },
];

const McLuhanAnalyzer = () => {
  const [technology, setTechnology] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [selectedLLM, setSelectedLLM] = useState<'claude' | 'ollama'>('claude');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [explorationResults, setExplorationResults] = useState<ExplorationResponse | null>(null);
  const [isLoadingExploration, setIsLoadingExploration] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  const [deepDiveResponses, setDeepDiveResponses] = useState<{
    [key: string]: { [key: number]: string };
  }>({
    enhancement: {},
    obsolescence: {},
    retrieval: {},
    reversal: {}
  });
  
  // Add the handler function
  const handleDeepDiveResponse = (category: string, questionIndex: number, response: string) => {
    setDeepDiveResponses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [questionIndex]: response
      }
    }));
  };

  // Analysis parameters
  const [parameters, setParameters] = useState({
    timeScope: 50,  // 0: Immediate effects, 100: Long-term effects
    scale: 50,      // 0: Individual impact, 100: Societal impact
    depth: 50,      // 0: Surface-level analysis, 100: Deep philosophical analysis
    timeline: 2025  // Year for the analysis
  });

  const getTimeScopeLabel = () => {
    if (parameters.timeScope < 33) return "Focus on immediate and short-term effects";
    if (parameters.timeScope < 66) return "Balance short and long-term implications";
    return "Emphasize long-term and future implications";
  };

  const getScaleLabel = () => {
    if (parameters.scale < 33) return "Focus on individual impacts";
    if (parameters.scale < 66) return "Consider both individual and societal impacts";
    return "Emphasize broader societal and cultural impacts";
  };

  const getDepthLabel = () => {
    if (parameters.depth < 33) return "Provide practical, concrete analysis";
    if (parameters.depth < 66) return "Balance practical and philosophical implications";
    return "Delve into deeper philosophical implications";
  };

  const handleExploreDeeper = async () => {
    if (!analysisResults) return;

    setIsLoadingExploration(true);
    try {
      console.log('Exploration payload:', {
        technology,
        tetradResults: analysisResults.content,
        model: selectedLLM
      });

      const response = await fetch('/api/exploration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technology,
          tetradResults: analysisResults.content,
          model: selectedLLM
        }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error details:', errorData);
        throw new Error(`Failed to generate exploration: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Exploration results:', data);
      setExplorationResults(data);
    } catch (error) {
      console.error('Exploration failed:', error);
      setError('Failed to generate exploration content');
    } finally {
      setIsLoadingExploration(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!technology) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysisParams: AnalysisParams = {
        technology,
        temperature,
        model: selectedLLM,
        parameters: {
          timeScope: parameters.timeScope,
          scale: parameters.scale,
          depth: parameters.depth,
          timeline: parameters.timeline
        }
      };

      console.log('Sending analysis params:', analysisParams);

      const results = selectedLLM === 'claude'
        ? await performClaudeAnalysis(analysisParams)
        : await performOllamaAnalysis(analysisParams);

      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navSections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));
      
      const currentSection = sections.find(section => {
        if (!section.element) return false;
        const rect = section.element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex max-w-2xl gap-6 relative min-h-screen" style={{  paddingLeft:"20px", margin:"0 auto", width:"90%" }}>
      {/* Add sticky navigation */}
      <nav className="hidden lg:block sticky top-4 h-fit w-60 min-w-[240px]" >
        <SoftUICard>
          <SoftUICardHeader>
            <SoftUICardTitle className="text-sm">Navigation</SoftUICardTitle>
          </SoftUICardHeader>
          <SoftUICardContent>
            <ul className="space-y-2">
              {navSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md text-sm
                      transition-colors duration-200
                      ${activeSection === section.id
                        ? 'bg-orange-100 text-orange-600'
                        : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
                      }
                    `}
                  >
                    <span className="text-inherit">{section.icon}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </SoftUICardContent>
        </SoftUICard>
      </nav>

      {/* Wrap main content */}
      <div className="flex-1" style={{ flex:2,  }} >
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Introduction Section */}
          <SoftUICard id="introduction">
            <SoftUICardHeader>
              <SoftUICardTitle>McLuhan&apos;s Tetrad of Media Effects</SoftUICardTitle>
              <div className="text-muted-foreground">
                Analyze any technology or medium using McLuhan&apos;s four laws of media
              </div>
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

          {/* Analysis Parameters */}
          <SoftUICard id="analysis-parameters">
            <SoftUICardHeader>
              <SoftUICardTitle>Analysis Parameters</SoftUICardTitle>
            </SoftUICardHeader>
            <SoftUICardContent>
              <div className="space-y-6">
                {/* Technology Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Technology or Medium to Analyze
                  </label>
                  <Input
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    placeholder="e.g., Smartphone, Social Media, Virtual Reality"
                  />
                </div>

                {/* Time Scope Slider - Already exists */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Scope</label>
                  <Slider
                    value={[parameters.timeScope]}
                    onValueChange={(value) => setParameters(p => ({ ...p, timeScope: value[0] }))}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Immediate</span>
                    <p className="text-sm text-muted-foreground">{getTimeScopeLabel()}</p>
                    <span>Long-term</span>
                  </div>
                </div>

                {/* Scale Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impact Scale</label>
                  <Slider
                    value={[parameters.scale]}
                    onValueChange={(value) => setParameters(p => ({ ...p, scale: value[0] }))}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Individual</span>
                    <p className="text-sm text-muted-foreground">{getScaleLabel()}</p>
                    <span>Societal</span>
                  </div>
                </div>

                {/* Depth Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Depth</label>
                  <Slider
                    value={[parameters.depth]}
                    onValueChange={(value) => setParameters(p => ({ ...p, depth: value[0] }))}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Practical</span>
                    <p className="text-sm text-muted-foreground">{getDepthLabel()}</p>
                    <span>Philosophical</span>
                  </div>
                </div>

                {/* Timeline Slider - Already exists */}
                {/* Timeline Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Analysis Timeline</label>
                  <div className="sc-hWWBcw frWHZL">
                    <Slider
                      value={[parameters.timeline]}
                      onValueChange={(value) => setParameters(p => ({ ...p, timeline: value[0] }))}
                      min={2025}
                      max={2055}
                      step={1}
                    />
                    <span className="text-sm text-muted-foreground w-16">
                      {parameters.timeline}
                    </span>
                  </div>
                </div>

                {/* Temperature Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">LLM Temperature</label>
                  <Slider
                    value={[temperature * 100]}
                    onValueChange={(value) => setTemperature(value[0] / 100)}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>More Focused ({(temperature * 100).toFixed(0)}%)</span>
                    <p className="text-sm text-muted-foreground">
                      {temperature < 0.33 ? "Consistent, deterministic outputs"
                        : temperature < 0.66 ? "Balanced creativity and consistency"
                          : "More creative, diverse outputs"}
                    </p>
                    <span>More Creative</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2" style={{ margin:"20px auto", width:"fit-content" }}>
                  <label className="text-sm">Use Local Claude</label>
                    <Switch
                      checked={selectedLLM === 'ollama'}
                      onCheckedChange={(checked) =>
                        setSelectedLLM(checked ? 'ollama' : 'claude')
                      }
                    />
                    <label className="text-sm">Use Local Deepseek</label>
                  </div>

                  <Button
                    disabled={!technology || isLoading}
                    onClick={handleGenerateAnalysis}
                    className="w-full" style={{ color: 'rgb(237 113 26)' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      `Generate ${selectedLLM === 'claude' ? 'Claude' : 'Deepseek'} Analysis`
                    )}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </SoftUICardContent>
          </SoftUICard>

          {/* Analysis Results */}
          {analysisResults && (
            <SoftUICard id="tetrad-analysis">
              <SoftUICardHeader>
                <SoftUICardTitle>McLuhan Tetrad Analysis</SoftUICardTitle>
              </SoftUICardHeader>
              <SoftUICardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Enhancement */}
                  <FlipCard
                    title="Enhancement"
                    icon={<Maximize2 className="h-5 w-5" style={{ color: '#708de6' }} />}
                    frontContent={
                      <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                          {analysisResults.content?.enhancement?.map((item: string, index: number) => (
                            <li key={index} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                          <p className="text-muted-foreground">
                            {generateCounterpartContent(technology).enhancement.implications}
                          </p>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="p-4 h-full">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2 text-slate-600">Potential Limitations:</h3>
                            <ul className="list-disc pl-5 space-y-2 ">
                              {generateCounterpartContent(technology).enhancement.limitations.map((limitation, index) => (
                                <li key={index}>{limitation}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                            <p className="">
                              {generateCounterpartContent(technology).enhancement.implications}
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />

                  {/* Obsolescence */}
                  <FlipCard
                    title="Obsolescence"
                    icon={<MinusCircle className="h-5 w-5" style={{ color: '#708de6' }} />}
                    frontContent={
                      <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                          {analysisResults.content?.obsolescence?.map((item: string, index: number) => (
                            <li key={index} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                          <p className="text-muted-foreground">
                            {generateCounterpartContent(technology).obsolescence.implications}
                          </p>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="p-4 h-full">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Potential Limitations:</h3>
                            <ul className="list-disc pl-5 space-y-2 ">
                              {generateCounterpartContent(technology).obsolescence.limitations.map((limitation, index) => (
                                <li key={index}>{limitation}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                            <p className="">
                              {generateCounterpartContent(technology).obsolescence.implications}
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />

                  {/* Retrieval */}
                  <FlipCard
                    title="Retrieval"
                    icon={<RotateCcw className="h-5 w-5" style={{ color: '#708de6' }} />}
                    frontContent={
                      <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                          {analysisResults.content?.retrieval?.map((item: string, index: number) => (
                            <li key={index} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                          <p className="text-muted-foreground">
                            {generateCounterpartContent(technology).retrieval.implications}
                          </p>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="p-4 h-full">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Potential Limitations:</h3>
                            <ul className="list-disc pl-5 space-y-2 ">
                              {generateCounterpartContent(technology).retrieval.limitations.map((limitation, index) => (
                                <li key={index}>{limitation}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                            <p className="">
                              {generateCounterpartContent(technology).retrieval.implications}
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />

                  {/* Reversal */}
                  <FlipCard
                    title="Reversal"
                    icon={<FlipHorizontal className="h-5 w-5" style={{ color: '#708de6' }} />}
                    frontContent={
                      <div className="space-y-4">
                        <ul className="list-disc pl-5 space-y-2">
                          {analysisResults.content?.reversal?.map((item: string, index: number) => (
                            <li key={index} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                          <p className="text-muted-foreground">
                            {generateCounterpartContent(technology).reversal.implications}
                          </p>
                        </div>
                      </div>
                    }
                    backContent={
                      <div className="p-4 h-full">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Potential Limitations:</h3>
                            <ul className="list-disc pl-5 space-y-2 ">
                              {generateCounterpartContent(technology).reversal.limitations.map((limitation, index) => (
                                <li key={index}>{limitation}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Critical Considerations:</h3>
                            <p className="">
                              {generateCounterpartContent(technology).reversal.implications}
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* Analysis Summary */}
                <div className="mt-6">
                  <SoftUICard>
                    <SoftUICardHeader>
                      <SoftUICardTitle>Analysis Summary</SoftUICardTitle>
                    </SoftUICardHeader>
                    <SoftUICardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {analysisResults.content.analysis}
                        </p>
                        <div className="flex items-center mt-4 text-sm">
                          <span className="font-medium">Confidence Score:</span>
                          <span className="ml-2 text-muted-foreground">
                            {(analysisResults.content.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </SoftUICardContent>
                  </SoftUICard>
                </div>
                <div className="mt-6">
                  <div className="flex justify-center">
                    <Button
                      onClick={handleExploreDeeper}
                      disabled={isLoadingExploration}
                      className="w-full md:w-auto" style={{ color: 'rgb(237 113 26)' }}
                    >
                      {isLoadingExploration ? (
                        <div className="flex items-center gap-2" >
                          <Loader2 className="animate-spin" />
                          <span>Generating Exploration...</span>
                        </div>
                      ) : (
                        'Dig Deeper'
                      )}
                    </Button>
                  </div>
                </div>
              </SoftUICardContent>
            </SoftUICard>
          )}
          {explorationResults && (
            <SoftUICard id="deep-dive">
              <SoftUICardHeader>
                <SoftUICardTitle>Deep Dive Exploration</SoftUICardTitle>
              </SoftUICardHeader>
              <SoftUICardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridAutoRows: "auto" }}>
                  {/* Enhancement */}
                  <SoftUICard>
                    <SoftUICardHeader>
                      <div className="flex items-center space-x-2">
                        <Maximize2 className="h-5 w-5" style={{ color: '#708de6' }} />
                        <SoftUICardTitle>Enhancement</SoftUICardTitle>
                      </div>
                    </SoftUICardHeader>
                    <SoftUICardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Example:</h3>
                          <p className="text-muted-foreground">{explorationResults.content.enhancement.example}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                          <div className="space-y-4">
                            {explorationResults.content.enhancement.questions.map((question, index) => (
                              <QuestionWithDeepDive
                                key={index}
                                question={question}
                                category="enhancement"
                                questionIndex={index}
                                technology={technology}
                                selectedLLM={selectedLLM}
                                onDeepDiveResponse={handleDeepDiveResponse}
                                
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </SoftUICardContent>
                  </SoftUICard>

                  {/* Obsolescence */}
                  <SoftUICard>
                    <SoftUICardHeader>
                      <div className="flex items-center space-x-2">
                        <MinusCircle className="h-5 w-5" style={{ color: '#708de6' }} />
                        <SoftUICardTitle>Obsolescence</SoftUICardTitle>
                      </div>
                    </SoftUICardHeader>
                    <SoftUICardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Example:</h3>
                          <p className="text-muted-foreground">{explorationResults.content.obsolescence.example}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                          <div className="space-y-4">
                            {explorationResults.content.obsolescence.questions.map((question, index) => (
                              <QuestionWithDeepDive
                                key={index}
                                question={question}
                                category="obsolescence"
                                questionIndex={index}
                                technology={technology}
                                selectedLLM={selectedLLM}  // Add this
                                onDeepDiveResponse={handleDeepDiveResponse}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </SoftUICardContent>
                  </SoftUICard>

                  {/* Retrieval */}
                  <SoftUICard>
                    <SoftUICardHeader>
                      <div className="flex items-center space-x-2">
                        <RotateCcw className="h-5 w-5" style={{ color: '#708de6' }} />
                        <SoftUICardTitle>Retrieval</SoftUICardTitle>
                      </div>
                    </SoftUICardHeader>
                    <SoftUICardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Example:</h3>
                          <p className="text-muted-foreground">{explorationResults.content.retrieval.example}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                          <div className="space-y-4">
                            {explorationResults.content.retrieval.questions.map((question, index) => (
                              <QuestionWithDeepDive
                                key={index}
                                question={question}
                                category="retrieval"
                                questionIndex={index}
                                technology={technology}
                                selectedLLM={selectedLLM}  // Add this
                                onDeepDiveResponse={handleDeepDiveResponse}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </SoftUICardContent>
                  </SoftUICard>
                  <SoftUICard>
                    <SoftUICardHeader>
                      <div className="flex items-center space-x-2">
                        <FlipHorizontal className="h-5 w-5" style={{ color: '#708de6' }} />
                        <SoftUICardTitle>Reversal</SoftUICardTitle>
                      </div>
                    </SoftUICardHeader>
                    <SoftUICardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Example:</h3>
                          <p className="text-muted-foreground">{explorationResults.content.reversal.example}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                          <div className="space-y-4">
                            {explorationResults.content.reversal.questions.map((question, index) => (
                              <QuestionWithDeepDive
                                key={index}
                                question={question}
                                category="reversal"
                                questionIndex={index}
                                technology={technology}
                                selectedLLM={selectedLLM}  // Add this
                                onDeepDiveResponse={handleDeepDiveResponse}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </SoftUICardContent>
                  </SoftUICard>
                </div>
                <div className="mt-6">
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setShowReport(!showReport)}
                      className="w-full md:w-auto"
                      style={{ color: 'rgb(237 113 26)' }}
                    >
                      {showReport ? 'Hide Report' : 'Generate Complete Report'}
                    </Button>
                  </div>
                </div>
              </SoftUICardContent>
            </SoftUICard>
          )}



          {/* Report Section */}
          {showReport && explorationResults && (
            <McLuhanReport
              technology={technology}
              analysisResults={analysisResults}
              explorationResults={explorationResults}
              deepDiveResponses={deepDiveResponses}
              timeline={parameters.timeline}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default McLuhanAnalyzer;