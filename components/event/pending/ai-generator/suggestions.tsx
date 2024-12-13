import { PlusIcon } from '@heroicons/react/24/outline';

import { cx } from '@/lib/utils';

interface GeneratedQuestion {
  question_text: string;
  correct_answer: string;
  points: number;
}

interface QuestionSuggestionsProps {
  questions: GeneratedQuestion[];
  onUpdateQuestion?: (index: number, updates: Partial<GeneratedQuestion>) => void;
  onAddQuestion: (question: GeneratedQuestion) => void;
  loading?: boolean;
}

export default function QuestionSuggestions({
  questions,
  onUpdateQuestion,
  onAddQuestion,
  loading = false,
}: QuestionSuggestionsProps) {
  const handlePointsChange = (index: number, change: number) => {
    if (onUpdateQuestion) {
      const question = questions[index];
      const newPoints = Math.max(5, Math.min(50, (question.points || 10) + change));
      onUpdateQuestion(index, { points: newPoints });
    }
  };

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
          <p className="text-sm text-gray-500 dark:text-gray-400 lg:px-20">
            No questions generated yet. Try submitting a topic or theme above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={index}
            className={cx(
              'rounded-lg border transition-colors border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary-dark',
            )}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-sm text-gray-900 dark:text-gray-100">
                    {question.question_text}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {question.correct_answer}
                  </p>
                </div>

                <button
                  onClick={() => onAddQuestion(question)}
                  className={cx(
                    'group flex-shrink-0 p-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-primary dark:hover:bg-gray-800',
                  )}
                >
                  <PlusIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-zinc-300" />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePointsChange(index, -5);
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                  {question.points || 10} pts
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePointsChange(index, 5);
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Add edit functionality
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                title="Edit question"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
