import React from 'react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import { Exploration } from './types';
import { FaArrowUp, FaArrowDown, FaUndo, FaExchangeAlt } from 'react-icons/fa';

interface OllamaExplorationProps {
  explorations: Exploration[];
}

export const OllamaExploration: React.FC<OllamaExplorationProps> = ({ explorations }) => {
  if (!explorations.length) return null;

  return (
    <SoftUICard>
      <SoftUICardHeader>
        <SoftUICardTitle>Exploring McLuhan&apos;s Tetrad Analysis - Ollama Deepseek</SoftUICardTitle>
      </SoftUICardHeader>
      <SoftUICardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {explorations.map((exploration, index) => (
            <SoftUICard key={index} className="p-4 bg-muted/50">
              <h3 className="font-bold mb-2 capitalize flex items-center">
                {exploration.section === 'enhancement' && <FaArrowUp className="mr-2" />}
                {exploration.section === 'obsolescence' && <FaArrowDown className="mr-2" />}
                {exploration.section === 'retrieval' && <FaUndo className="mr-2" />}
                {exploration.section === 'reversal' && <FaExchangeAlt className="mr-2" />}
                {exploration.section}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Example</h4>
                  <p className="text-sm leading-relaxed">{exploration.example}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Questions</h4>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {exploration.questions}
                  </p>
                </div>
              </div>
            </SoftUICard>
          ))}
        </div>
      </SoftUICardContent>
    </SoftUICard>
  );
};