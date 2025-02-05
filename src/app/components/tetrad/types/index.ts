export interface TetradeAnalysis {
  enhancement: string;
  obsolescence: string;
  retrieval: string;
  reversal: string;
}

export interface Exploration {
  section: string;
  example: string;
  questions: string;
}

export interface AnalysisParams {
  technology: string;
  temperature: number;
  model: 'claude' | 'ollama';
  parameters?: {
    timeScope: number;
    scale: number;
    depth: number;
    timeline: number;
  };
  isDeepAnalysis?: boolean;
}