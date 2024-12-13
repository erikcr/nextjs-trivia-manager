import { useEffect } from 'react';

import { Question, useRoundStore } from '@/lib/store/round-store';

export default function ResponseGrid({
  questions,
  loading: externalLoading,
}: {
  questions: Question[];
  loading: boolean;
}) {
  const {
    responses,
    loading: responseLoading,
    fetchResponses,
    subscribeToResponses,
    unsubscribeFromResponses,
  } = useRoundStore();
  const activeQuestion = questions.find((q) => q.status === 'ongoing');
  const loading = externalLoading || responseLoading;

  useEffect(() => {
    if (activeQuestion) {
      fetchResponses(activeQuestion.id);
      subscribeToResponses(activeQuestion.id);
    }
    return () => {
      unsubscribeFromResponses();
    };
  }, [activeQuestion?.id]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-lg font-semibold">Responses for </h1>
            {activeQuestion && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Showing responses for: {activeQuestion.question_text}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 min-h-0">
        <div className="h-full overflow-y-auto shadow border border-black border-opacity-5 dark:border-white dark:border-opacity-10 sm:cx-lg">
          <div className="h-full">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-zinc-800 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                  >
                    Team
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Response
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-zinc-900 overflow-y-scroll">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : responses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:pl-6"
                    >
                      No responses yet
                    </td>
                  </tr>
                ) : (
                  responses.map((response) => (
                    <tr key={response.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                        {response.team_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-200">
                        {response.text_response}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-gray-200">
                        {response.response_time_seconds}s
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {response.is_correct === null ? (
                          <span className="text-gray-500 dark:text-gray-400">Pending</span>
                        ) : response.is_correct ? (
                          <span className="text-green-600 dark:text-green-400">Correct</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">Incorrect</span>
                        )}
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
