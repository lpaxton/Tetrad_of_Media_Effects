import React from 'react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import { ExplorationContent } from './types/types';

interface ExplorationResultsProps {
  content: ExplorationContent;
}

export const ExplorationResults: React.FC<ExplorationResultsProps> = ({ content }) => {
  return (
    <div className="sc-KXCwU hLvonL">
      <div className="sc-gyycJP bxooLV">
        <h2 className="sc-eaUbBy fWhFkO">Deep Dive Exploration</h2>
      </div>
      <div className="sc-gaZyOd dcMrUA">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enhancement */}
            <div className="sc-KXCwU hLvonL">
              <div className="sc-gyycJP bxooLV">
                <h2 className="sc-eaUbBy fWhFkO">Enhancement - Deep Dive</h2>
              </div>
              <div className="sc-gaZyOd dcMrUA">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Example:</h3>
                    <p className="text-muted-foreground">{content.enhancement.example}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {content.enhancement.questions.map((question, index) => (
                        <li key={index} className="text-muted-foreground">{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Obsolescence */}
            <div className="sc-KXCwU hLvonL">
              <div className="sc-gyycJP bxooLV">
                <h2 className="sc-eaUbBy fWhFkO">Obsolescence - Deep Dive</h2>
              </div>
              <div className="sc-gaZyOd dcMrUA">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Example:</h3>
                    <p className="text-muted-foreground">{content.obsolescence.example}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {content.obsolescence.questions.map((question, index) => (
                        <li key={index} className="text-muted-foreground">{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Retrieval */}
            <div className="sc-KXCwU hLvonL">
              <div className="sc-gyycJP bxooLV">
                <h2 className="sc-eaUbBy fWhFkO">Retrieval - Deep Dive</h2>
              </div>
              <div className="sc-gaZyOd dcMrUA">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Example:</h3>
                    <p className="text-muted-foreground">{content.retrieval.example}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {content.retrieval.questions.map((question, index) => (
                        <li key={index} className="text-muted-foreground">{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Reversal */}
            <div className="sc-KXCwU hLvonL">
              <div className="sc-gyycJP bxooLV">
                <h2 className="sc-eaUbBy fWhFkO">Reversal - Deep Dive</h2>
              </div>
              <div className="sc-gaZyOd dcMrUA">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Example:</h3>
                    <p className="text-muted-foreground">{content.reversal.example}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Questions to Consider:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {content.reversal.questions.map((question, index) => (
                        <li key={index} className="text-muted-foreground">{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationResults;