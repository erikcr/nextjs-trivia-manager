import { useEffect } from 'react';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Question, ResponseCorrect, useRoundStore } from '@/lib/store/round-store';
import { cx } from '@/lib/utils';

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
    markResponseCorrectness,
  } = useRoundStore();
  const { activeQuestion } = useRoundStore();
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

  const handleMarkResponse = async (id: string, isCorrect: ResponseCorrect) => {
    await markResponseCorrectness(id, isCorrect);
  };

  return (
    <div
      className={cx(
        'flex h-full flex-col bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-white dark:border-opacity-10',
        {
          'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20':
            activeQuestion?.status === 'pending',
          'bg-blue-50 text-blue-800 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-500 dark:ring-blue-400/20':
            activeQuestion?.status === 'ongoing',
          'bg-gray-50 text-gray-800 ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-500 dark:ring-gray-400/20':
            activeQuestion?.status === 'completed',
        },
      )}
    >
      <div className="flex-shrink-0 pb-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto px-4">
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Answer: {activeQuestion?.correct_answer}
            </p>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              Points: {activeQuestion?.points}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto bg-white dark:bg-zinc-900 sm:rounded-lg">
          <div className="h-full">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-zinc-800 sticky top-0 z-10 bg-green-200">
                <tr>
                  <th
                    scope="col"
                    className="w-1/5 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                  >
                    Team
                  </th>
                  <th
                    scope="col"
                    className="w-3/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Response
                  </th>
                  <th
                    scope="col"
                    className="flex justify-center px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-zinc-900 overflow-y-scroll">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4} // Update colspan to 4
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : responses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4} // Update colspan to 4
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
                      <td className="flex justify-center px-3 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkResponse(response.id, 'true')}
                            className={cx(
                              'rounded px-2 bg-green-500 py-1 text-xs font-semibold text-black shadow-sm hover:bg-green-500',
                              response.is_correct === 'false' && 'bg-green-200',
                            )}
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarkResponse(response.id, 'false')}
                            className={cx(
                              'rounded px-2 bg-red-500 py-1 text-xs font-semibold text-black shadow-sm hover:bg-red-500',
                              response.is_correct === 'true' && 'bg-red-200',
                            )}
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
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
