interface QuestionWithDeepDiveProps {
  question: string;
  category: string;
  questionIndex: number;
  technology: string;
  onDeepDiveResponse: (category: string, index: number, response: string) => void;
}

const QuestionWithDeepDive: React.FC<QuestionWithDeepDiveProps> = ({
  question,
  category,
  questionIndex,
  technology,
  onDeepDiveResponse
}) => {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div className="text-sm text-slate-700">{question}</div>
        {/* Deep dive button/content here */}
      </div>
      <div className="pl-4 space-y-2">
        {/* Deep dive responses here */}
      </div>
    </div>
  );
};

export default QuestionWithDeepDive;