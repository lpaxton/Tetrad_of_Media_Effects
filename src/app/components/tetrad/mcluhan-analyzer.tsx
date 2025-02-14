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
import QuestionWithDeepDive from './QuestionWithDeepDive';
import { ExplorationResponse } from './types/types';
import { Knob } from '../ui/knob';

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
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

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
    <div className="flex max-w-2xl gap-6 relative min-h-screen" style={{ paddingLeft: "20px", margin: "0 auto", width: "90%" }}>
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
      <div className="flex-1" style={{ flex: 2, }} >
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
              <SoftUICardTitle style={{textAlign:"center", paddingBottom:"20px"}}>Analysis Parameters</SoftUICardTitle>
              <label className="text-sm font-medium" style={{
                float: 'left',
                fontFamily: 'monospace',
                color: '#4a4a4a', fontWeight:"900"
              }}>Technology or Medium to Analyze</label>
            </SoftUICardHeader>
            <SoftUICardContent>
              <div className="space-y-6">
                {/* Technology Input */}
                <div className="space-y-2">

                  <Input style={{
                    backgroundColor: '#ddd9c6',
                    border: '1px solid',
                    borderRadius: '0px',
                    width: '100%',
                    fontFamily: 'monospace',
                    marginTop: '20px',
                    minHeight: '60px',
                    boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                  }}
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    placeholder="e.g., Smartphone, Social Media, Virtual Reality"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ margin: "0px" }}>
                  {/* Time Scope Knob */}

                  <div className="flex flex-col items-center space-y-4">
                    <label className="text-sm font-medium" style={{ display: "none" }}>Time Scope</label>
                    <Knob
                      value={parameters.timeScope}
                      onChange={(value) => setParameters(p => ({ ...p, timeScope: value }))}
                      size={100}
                      min={0}
                      max={100}
                      step={1}
                      className="knob-primary"
                    />
                    <div className="text-center">

                      <div className="flex justify-between w-full text-xs text-muted-foreground mt-2">
                        <span>Immediate</span>
                        <label className="text-sm font-medium" style={{
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    color: '#4a4a4a', fontWeight:"900",marginTop: "40px"
                  }}>TIME SCOPE</label>
                        <span>Long-term</span>
                      </div>
                      
                      <div style={{
                        backgroundColor: '#ddd9c6',
                        border: '1px solid',
                        width: '220px',
                        
                        minHeight: '60px',
                        boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                      }}>
                        <p className="text-sm text-muted-foreground" style={{
                          fontFamily: 'monospace',
                          wordWrap: 'normal', margin: ".5rem"
                        }}>
                          {getTimeScopeLabel()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Impact Scale Knob */}
                  <div className="flex flex-col items-center space-y-4">
                    <label className="text-sm font-medium" style={{ display: "none" }}>Impact Scale</label>
                    <Knob
                      value={parameters.scale}
                      onChange={(value) => setParameters(p => ({ ...p, scale: value }))}
                      size={100}
                      min={0}
                      max={100}
                      step={1}
                      className="knob-primary"
                    />
                    <div className="text-center">

                      <div className="flex justify-between w-full text-xs text-muted-foreground mt-2">
                        <span>Individual</span>
                        <label className="text-sm font-medium" style={{
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    color: '#4a4a4a', fontWeight:"900", marginTop: "40px"
                  }}>IMPACT SCALE</label>
                        <span>Societal</span>
                      </div>
                      
                      <div style={{
                        backgroundColor: '#ddd9c6',
                        border: '1px solid',
                        width: '220px',
                        
                        minHeight: '60px',
                        boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                      }}>
                        <p className="text-sm text-muted-foreground" style={{
                          fontFamily: 'monospace',
                          wordWrap: 'normal', margin: ".5rem"
                        }}>
                          {getScaleLabel()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Depth Knob */}
                  <div className="flex flex-col items-center space-y-4">
                    <label className="text-sm font-medium" style={{ display: "none" }}>Analysis Depth</label>
                    <Knob
                      value={parameters.depth}
                      onChange={(value) => setParameters(p => ({ ...p, depth: value }))}
                      size={100}
                      min={0}
                      max={100}
                      step={1}
                      className="knob-primary"
                    />
                    <div className="text-center">

                      <div className="flex justify-between w-full text-xs text-muted-foreground mt-2">
                        <span>Practical</span>
                        <label className="text-sm font-medium" style={{
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    color: '#4a4a4a', fontWeight:"900", marginTop: "40px"
                  }}>ANALYSIS DEPTH</label>
                        <span>Philosophical</span>
                      </div>
                      
                      <div style={{
                        backgroundColor: '#ddd9c6',
                        border: '1px solid',
                        width: '220px',
                        
                        minHeight: '60px',
                        boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                      }}>
                        <p className="text-sm text-muted-foreground" style={{
                          fontFamily: 'monospace',
                          wordWrap: 'normal', margin: ".5rem"
                        }}>
                          {getDepthLabel()}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Timeline Slider - Already exists */}
                {/* Timeline Slider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: "60px" }}>
                  <div className="space-y-2" style={{ margin: "0px 0px 0px 38px", maxWidth: "300px", display: "grid" }}>
                    <label className="text-sm font-medium" style={{
                      float: 'left',
                      fontFamily: 'monospace',
                      color: '#4a4a4a', fontWeight:"900", paddingBottom: "20px", textAlign: "center"
                    }}>ANALYSIS TIMELINE</label>

                    <div className="sc-hWWBcw frWHZL">
                      <Slider
                        value={[parameters.timeline]}
                        onValueChange={(value) => setParameters(p => ({ ...p, timeline: value[0] }))}
                        min={2025}
                        max={2055}
                        step={1}
                      /><div className="flex justify-between text-xs text-muted-foreground" style={{ marginTop: "20px" }}><span>More Focused</span><p className="text-sm text-muted-foreground"></p><span>More Creative</span></div>
                      <span className="text-sm text-muted-foreground w-16">
                        <div style={{
                          backgroundColor: '#ddd9c6',
                          border: '1px solid',
                          width: '220px',
                          height: "80px",
                          margin: '30px auto 20px',
                          minHeight: '60px',
                          boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                        }}>
                          <p className="text-sm text-muted-foreground" style={{
                            fontFamily: 'monospace',
                            fontSize: "1.2rem",
                            wordWrap: 'normal', margin: "1.8rem"
                          }}>
                            {parameters.timeline}
                          </p>
                        </div>

                      </span>
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2" style={{ margin: "0px 0px 0px 48px", maxWidth: "300px", display: "grid" }}>
                    <label className="text-sm font-medium" style={{
                      float: 'left',
                      fontFamily: 'monospace',
                      color: '#4a4a4a', fontWeight:"900", paddingBottom: "20px", textAlign: "center"
                    }}>LLM TEMPERATURE</label>

                    <Slider
                      value={[temperature * 100]}
                      onValueChange={(value) => setTemperature(value[0] / 100)}
                      max={100}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground" style={{ marginTop: "20px" }}>
                      <span>More Focused ({(temperature * 100).toFixed(0)}%)</span>
                      <p className="text-sm text-muted-foreground">

                      </p>
                      <span>More Creative</span>

                    </div>
                    <div style={{
                      backgroundColor: '#ddd9c6',
                      border: '1px solid',
                      width: '220px',
                      height: "80px",
                      margin: '30px auto 20px',
                      minHeight: '60px',
                      boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                    }}>
                      <p className="text-sm text-muted-foreground" style={{
                        fontFamily: 'monospace',
                        fontSize: ".875rem",
                        wordWrap: 'normal', margin: "1.2rem"
                      }}>
                        {temperature < 0.33 ? "Consistent, deterministic outputs"
                          : temperature < 0.66 ? "Balanced creativity and consistency"
                            : "More creative, diverse outputs"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: "60px", width: "90%", margin: "40px auto 0px" }}>
                  <div className="space-y-4" style={{ display: "grid" }}>
                    <label className="text-sm font-medium" style={{
                      float: 'left',
                      fontFamily: 'monospace',
                      color: '#4a4a4a', fontWeight:"900", textAlign: "center"
                  }}> SELECT LLM</label>
                    <div className="flex items-center space-x-2" style={{ width: "fit-content" }}>

                      <Switch
                        checked={selectedLLM === 'ollama'}
                        onCheckedChange={(checked) =>
                          setSelectedLLM(checked ? 'ollama' : 'claude')
                        }
                      />
                      <div style={{ display: "grid", gap: "90px" }}>
                        <label className="text-sm" style={{ fontSize: "0.75rem", color: "#64748b" }}>Use Local Claude</label>
                        <label className="text-sm" style={{ fontSize: "0.75rem", color: "#64748b" }}>Use Local Deepseek</label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4" style={{ marginTop: "20px" }}>
                    <Button
                      disabled={!technology || isLoading}
                      onClick={handleGenerateAnalysis}
                      className="w-full" style={{ color: '#64748b', height: "160px", border: "1px solid  #b6b6b6" }}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{
                  backgroundColor: '#ddd9c6',
                  border: '1px solid',
                  padding: '5px',
                  margin: '30px auto 20px',
                  minHeight: '60px',
                  boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                }}>
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
                <div className="mt-6" style={{
                  backgroundColor: '#ddd9c6',
                  border: '1px solid',
                  padding: '5px',
                  margin: '30px auto 20px',
                  minHeight: '60px',
                  boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                }}>
                  <SoftUICard >
                    <SoftUICardHeader>
                      <SoftUICardTitle>Analysis Summary</SoftUICardTitle>
                    </SoftUICardHeader>
                    <SoftUICardContent >
                      <div className="space-y-4" >
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ margin: "0px" }}>


                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '30px auto' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '20%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% + 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% - 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                  </div>



                  <div className="mt-6">
                    <div className="flex justify-center">
                      <Button
                        onClick={handleExploreDeeper}
                        disabled={isLoadingExploration}
                        className="w-full md:w-auto" style={{ color: '#64748b', width: "240px", height: "120px", borderColor: "#e5e7eb" }}
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

                  <div style={{ position: 'relative', width: '100px', height: '100px', margin: '30px auto' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '20%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset  3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% + 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% - 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6" style={{ gridAutoRows: "auto" }}>
                  {/* Enhancement */}
                  <SoftUICard style={{
                  backgroundColor: '#ddd9c6',
                  border: '1px solid',
                  padding: '15px',
                  margin: '30px auto 20px',
                  minHeight: '60px',
                  boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                }}>
                    <SoftUICardHeader>
                      <div className="flex items-center space-x-2" >
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
                  <SoftUICard style={{
                  backgroundColor: '#ddd9c6',
                  border: '1px solid',
                  padding: '15px',
                  margin: '30px auto 20px',
                  minHeight: '60px',
                  boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                }}>
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
                  <SoftUICard style={{
                  backgroundColor: '#ddd9c6',
                  border: '1px solid',
                  padding: '15px',
                  margin: '30px auto 20px',
                  minHeight: '60px',
                  boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                }}>
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
                  <SoftUICard style={{
                  backgroundColor: '#ddd9c6',
                  border: '1px solid',
                  padding: '15px',
                  margin: '30px auto 20px',
                  minHeight: '60px',
                  boxShadow: '#9199a2 2px 2px 2px inset, #caba7b -2px -2px 11px inset'
                }}>
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


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ margin: "0px" }}>


<div style={{ position: 'relative', width: '100px', height: '100px', margin: '30px auto' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '20%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% + 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% - 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
  </div>



  <div className="mt-6">
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setShowReport(!showReport)}
                      className="w-full md:w-auto"
                      style={{ color: '#64748b', width: "240px", height: "120px", borderColor: "#e5e7eb" }}
                    >
                      {showReport ? 'Hide Report' : 'Generate Complete Report'}
                    </Button>
                  </div>
                </div>

  <div style={{ position: 'relative', width: '100px', height: '100px', margin: '30px auto' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '20%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset  3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% + 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% - 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: '50%', left: 'calc(50% - 40px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% - 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
    <div style={{ position: 'absolute', top: 'calc(50% + 35px)', left: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)', width: '15%', height: '15%', borderRadius: '50%', background: 'linear-gradient(145deg,rgb(164, 164, 164),rgb(203, 203, 203))', boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.2), -1px -1px 4px rgba(255,255,255,0.1)' }}></div>
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