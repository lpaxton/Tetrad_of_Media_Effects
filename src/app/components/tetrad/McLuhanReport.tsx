// src/app/components/tetrad/McLuhanReport.tsx
import React from 'react';
import { SoftUICard, SoftUICardHeader, SoftUICardTitle, SoftUICardContent } from '../ui/card';
import { Button } from '../ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Maximize2, MinusCircle, RotateCcw, FlipHorizontal, Download } from 'lucide-react';
import './mcluhan-report-print.css';

interface McLuhanReportProps {
  technology: string;
  analysisResults: any;
  explorationResults: any;
  timeline: boolean;
  parameters: any;
  deepDiveResponses: {
    [category: string]: {
      [questionIndex: number]: string;
    };
  };
}

const McLuhanReport: React.FC<McLuhanReportProps> = ({
  technology,
  analysisResults,
  explorationResults,
  timeline,
  parameters,
  deepDiveResponses
}) => {
  type TetradAspect = 'enhancement' | 'obsolescence' | 'retrieval' | 'reversal';
  
  const tetradAspects = [
      { name: 'enhancement' as TetradAspect, icon: <Maximize2 className="h-5 w-5" style={{ color: '#708de6' }} /> },
      { name: 'obsolescence' as TetradAspect, icon: <MinusCircle className="h-5 w-5" style={{ color: '#708de6' }} /> },
      { name: 'retrieval' as TetradAspect, icon: <RotateCcw className="h-5 w-5" style={{ color: '#708de6' }} /> },
      { name: 'reversal' as TetradAspect, icon: <FlipHorizontal className="h-5 w-5" style={{ color: '#708de6' }} /> }
    ];

  const generateCounterpartContent = (technology: string) => {
    // Default counterpart analysis structure
    return {
      enhancement: {
        limitations: [
          `Resource requirements for implementing ${technology}`,
          "Potential accessibility barriers",
          "Learning curve considerations"
        ],
        implications: `While ${technology} enhances certain capabilities, it's important to consider the resources and infrastructure needed to fully realize these benefits.`
      },
      obsolescence: {
        limitations: [
          "Potential loss of traditional skills",
          "Impact on existing workflows",
          "Transition challenges"
        ],
        implications: `The displacement effects of ${technology} should be carefully managed to preserve valuable legacy knowledge and processes where appropriate.`
      },
      retrieval: {
        limitations: [
          "Accuracy of historical parallels",
          "Context adaptation challenges",
          "Integration complexities"
        ],
        implications: `While ${technology} brings back certain patterns, we must ensure these retrieved elements are meaningfully adapted to contemporary contexts.`
      },
      reversal: {
        limitations: [
          "Unintended consequences",
          "System dependencies",
          "Scalability concerns"
        ],
        implications: `When pushed to extremes, ${technology}'s benefits might transform into limitations, requiring careful monitoring and management of its implementation.`
      }
    };
  };

  const renderDeepDiveContent = (category: string, questionIndex: number) => {
    const response = deepDiveResponses[category]?.[questionIndex];
    if (!response) return null;

    return (
      <div className="mt-4 ml-6 border-l-2 border-[#708de6] pl-4">
        <h5 className="text-sm font-medium mb-2">Deep Dive Analysis:</h5>
        <div className="space-y-4">
          {response.split('\n\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            )
          ))}
        </div>
      </div>
    );
  };
  const handleSavePDF = async () => {
    const report = document.querySelector('.mcluhan-report');
    if (!report) return;

    try {
      const canvas = await html2canvas(report as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        windowWidth: report.scrollWidth,
        windowHeight: report.scrollHeight
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      pdf.save(`McLuhan_Analysis_${technology.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  return (
    <>
      

      <SoftUICard id='full-report' className="mcluhan-report">
        <SoftUICardHeader>
          <div style={{ display: 'flex'}}><SoftUICardTitle className="text-2xl">
            McLuhan Tetrad Analysis Report - {technology}
            
          </SoftUICardTitle><div className="print-button mb-4 flex justify-end" style={{ color: 'rgb(237 113 26)', margin: '0 0 0 auto' }}>
        <Button 
          onClick={() => window.print()}
          className="flex items-center gap-2"
          style={{ color: 'rgb(237 113 26)' }}
        >
          <Download className="h-4 w-4" />
          Save as PDF
        </Button>
      </div></div>
          <p className="text-muted-foreground">Analysis Timeline: {timeline}</p>
          
        </SoftUICardHeader>
        <SoftUICardContent>
          <div className="space-y-8">
            {/* Executive Summary */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                Executive Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {analysisResults.content.analysis}
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Confidence Score: {(analysisResults.content.confidence * 100).toFixed(1)}%
              </div>
            </section>

            {/* Initial Analysis */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Initial Tetrad Analysis</h2>
              {tetradAspects.map((aspect) => (
                <div key={aspect.name} className="border-b pb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {aspect.icon}
                    <h3 className="text-lg font-medium capitalize">{aspect.name}</h3>
                  </div>
                  
                  {/* Primary Analysis */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">Primary Effects:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {analysisResults.content[aspect.name].map((item: string, index: number) => (
                        <li key={index} className="text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Counterpart Analysis */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium mb-2">Counterpart Analysis:</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-slate-600 mb-2">Potential Limitations:</h5>
                        <ul className="list-disc pl-5 space-y-2">
                          {generateCounterpartContent(technology)[aspect.name].limitations.map((limitation: string, index: number) => (
                            <li key={index} className="text-muted-foreground">{limitation}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-slate-600 mb-2">Critical Considerations:</h5>
                        <p className="text-muted-foreground">
                          {generateCounterpartContent(technology)[aspect.name].implications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Deep Dive Analysis */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Deep Dive Exploration</h2>
              {tetradAspects.map((aspect) => (
                <div key={`${aspect.name}-deepdive`} className="border-b pb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {aspect.icon}
                    <h3 className="text-lg font-medium capitalize">{aspect.name} Deep Dive</h3>
                  </div>
                  
                  {/* Example */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Illustrative Example:</h4>
                    <p className="text-muted-foreground pl-4 border-l-2 border-[#708de6]">
                      {explorationResults.content[aspect.name].example}
                    </p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Key Questions for Consideration:</h4>
                    <ul className="list-disc pl-5 space-y-4">
                      {explorationResults.content[aspect.name].questions.map((question: string, index: number) => (
                        <li key={index} className="text-muted-foreground">
                          <div className="space-y-2">
                            <p>{question}</p>
                            {renderDeepDiveContent(aspect.name, index)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Critical Considerations */}
                  {analysisResults.content.considerations?.[aspect.name] && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Critical Considerations:</h4>
                      <p className="text-muted-foreground">
                        {analysisResults.content.considerations[aspect.name]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Conclusion */}
            <section className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
              <p className="text-muted-foreground leading-relaxed">
                This analysis of {technology} through McLuhan's tetrad framework reveals a complex interplay 
                of effects across enhancement, obsolescence, retrieval, and reversal. The technology's impact 
                spans from {parameters?.timeScope < 33 ? 'immediate' : parameters?.timeScope < 66 ? 'balanced' : 'long-term'} effects, 
                with {parameters?.scale < 33 ? 'individual' : parameters?.scale < 66 ? 'mixed' : 'societal'} implications, 
                examined through a {parameters?.depth < 33 ? 'practical' : parameters?.depth < 66 ? 'balanced' : 'philosophical'} lens.
              </p>
            </section>

            {/* Footer */}
            <footer className="text-sm text-muted-foreground border-t pt-4">
              <p>Analysis generated using McLuhan's Tetrad Framework</p>
              <p>Report Date: {new Date().toLocaleDateString()}</p>
            </footer>
          </div>
        </SoftUICardContent>
      </SoftUICard>
    </>
  );
};

export default McLuhanReport;