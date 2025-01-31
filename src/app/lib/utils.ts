export interface TetradEffect {
  enhances: string[];
  obsolesces: string[];
  retrieves: string[];
  reverses: string[];
}

export interface AnalysisResult {
  tetradEffects: TetradEffect;
  confidence: number;
  timestamp: string;
}

// Validation function for input text
export const validateInput = (text: string): boolean => {
  return text.length > 0 && text.length <= 5000;
};

// Generate timestamp in ISO format
export const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Calculate confidence score based on input length and complexity
export const calculateConfidence = (text: string): number => {
  const wordCount = text.split(/\s+/).length;
  const complexity = text.length / wordCount;
  
  // Scale confidence between 0 and 1
  const confidence = Math.min(
    Math.max((wordCount / 1000) * (complexity / 10), 0),
    1
  );
  
  return Number(confidence.toFixed(2));
};

// Clean and normalize input text
export const normalizeText = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
};

// Initialize empty tetrad effect
export const createEmptyTetrad = (): TetradEffect => {
  return {
    enhances: [],
    obsolesces: [],
    retrieves: [],
    reverses: []
  };
};

// Format analysis result
export const formatAnalysisResult = (
  tetradEffects: TetradEffect,
  text: string
): AnalysisResult => {
  return {
    tetradEffects,
    confidence: calculateConfidence(text),
    timestamp: getTimestamp()
  };
};

// Utility function to concatenate class names
export const cn = (...classes: string[]): string => {
  return classes.filter(Boolean).join(' ');
};