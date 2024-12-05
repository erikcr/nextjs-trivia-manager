import { cx } from '@/lib/utils';

interface GeneratedQuestion {
  question: string;
  answer: string;
  points?: number;
  selected?: boolean;
}

interface GeneratedQuestionsProps {
  questions: GeneratedQuestion[];
  onSelect: (index: number) => void;
  onAddSelected: () => void;
  loading?: boolean;
}

export default function GeneratedQuestions({ 
  questions, 
  onSelect, 
  onAddSelected,
  loading = false 
}: GeneratedQuestionsProps) {
  const selectedCount = questions.filter(q => q.selected).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Generating questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No questions generated yet. Try submitting a topic or theme above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedCount} question{selectedCount !== 1 ? 's' : ''} selected
        </p>
        <button
          onClick={onAddSelected}
          disabled={selectedCount === 0}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Selected
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={index}
            className={cx(
              "p-4 rounded-lg border cursor-pointer transition-colors",
              question.selected
                ? "border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary-dark/5"
                : "border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary-dark"
            )}
            onClick={() => onSelect(index)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm text-gray-900 dark:text-gray-100">
                  {question.question}
                </h3>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {question.points || 10} pts
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {question.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
