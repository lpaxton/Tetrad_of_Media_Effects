export interface AnalysisParams {
  technology: string;
  temperature: number;
  model: 'claude' | 'ollama';
  parameters?: {
    timeScope: number;    // 0-100: Immediate to Long-term effects
    scale: number;        // 0-100: Individual to Societal impact
    depth: number;        // 0-100: Surface-level to Deep philosophical
    timeline: number;     // Year for analysis (2024-2100)
  };
  isDeepAnalysis?: boolean;
}

export interface AnalysisResponse {
  content: string;
  error?: string;
}

export interface TetradSection {
  section: string;
  content: string;
  example?: string;
  questions?: string[];
}

export interface Exploration {
  section: string;
  example: string;
  questions: string;
}

export interface ExplorationSection {
  example: string;
  questions: string[];
}

export interface ExplorationContent {
  enhancement: ExplorationSection;
  obsolescence: ExplorationSection;
  retrieval: ExplorationSection;
  reversal: ExplorationSection;
}

export interface ExplorationResponse {
  content: ExplorationContent;
  error?: string;
}

interface CounterpartContent {
  limitations: string[];
  implications: string;
}

interface TetradCounterparts {
  enhancement: CounterpartContent;
  obsolescence: CounterpartContent;
  retrieval: CounterpartContent;
  reversal: CounterpartContent;
}