import { Question } from '@/lib/store/round-store';

export default function ResponseGrid({
  questions,
  loading,
  onQuestionClick,
  setQuestionSlideoutOpen,
}: {
  questions: Question[];
  loading: boolean;
  onQuestionClick: (question: Question) => void;
  setQuestionSlideoutOpen: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-lg font-semibold">Responses</h1>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 min-h-0">
        <div className="h-full overflow-y-auto shadow border border-black border-opacity-5 dark:border-white dark:border-opacity-10 sm:rounded-lg">
          <div className="h-full">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-zinc-800 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                  >
                    Response
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >{' '}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-zinc-900 overflow-y-scroll">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6"
                    >
                      No questions yet. Add some using the buttons above!
                    </td>
                  </tr>
                ) : (
                  responses.map((question) => (
                    <tr
                      key={question.id}
                      onClick={() => onQuestionClick(question)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                        {question.question_text}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {question.correct_answer}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {question.points}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
