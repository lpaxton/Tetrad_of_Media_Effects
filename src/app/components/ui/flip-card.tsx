import { useState } from 'react';

interface FlipCardProps {
  title: string;
  icon: React.ReactNode;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

export const FlipCard = ({ title, icon, frontContent, backContent }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-full min-h-[400px] perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`
        relative w-full h-full duration-500 preserve-3d
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="p-6 h-full bg-[#e0e5ec] rounded-xl shadow-neomorphism">
            <div className="flex items-center space-x-2 mb-4">
              {icon}
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            {frontContent}
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="p-6 h-full bg-slate-800 rounded-xl">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
};