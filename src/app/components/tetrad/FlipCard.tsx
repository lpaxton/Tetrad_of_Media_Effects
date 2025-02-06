// src/app/components/tetrad/FlipCard.tsx
import React, { useState } from 'react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import { Rotate3D } from 'lucide-react';

interface FlipCardProps {
  title: string;
  icon?: React.ReactNode;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

const FlipCard: React.FC<FlipCardProps> = ({
  title,
  icon,
  frontContent,
  backContent
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative flip-card-container">
      <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Front */}
        <div className="flip-card-face flip-card-front">
          <SoftUICard>
            <SoftUICardHeader className="relative">
              <div className="flex items-center space-x-2">
                {icon}
                <SoftUICardTitle>{title}</SoftUICardTitle>
              </div>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute top-4 right-4 text-[#708de6] hover:text-[#4a6ee5] transition-colors duration-200"
                aria-label="Show counterpart"
              >
                <Rotate3D className="h-5 w-5" />
              </button>
            </SoftUICardHeader>
            <SoftUICardContent>
              {frontContent}
            </SoftUICardContent>
          </SoftUICard>
        </div>

        {/* Back */}
        <div className="flip-card-face flip-card-back">
          <SoftUICard className="h-full bg-slate-900">
            <SoftUICardHeader className="relative border-b border-slate-700">
              <div className="flex items-center space-x-2">
                {icon}
                <SoftUICardTitle className="text-slate-200">
                  {title} Counterpart
                </SoftUICardTitle>
              </div>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute top-4 right-4 text-[#708de6] hover:text-[#4a6ee5] transition-colors duration-200"
                aria-label="Show front"
              >
                <Rotate3D className="h-5 w-5" />
              </button>
            </SoftUICardHeader>
            <SoftUICardContent className="text-slate-300">
              {backContent}
            </SoftUICardContent>
          </SoftUICard>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;