'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ResponseGrid from '@/components/event/ongoing/response-grid';
import RoundNavigation from '@/components/event/round-navigation';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/lib/store/event-store';
import { useRoundStore } from '@/lib/store/round-store';
import { cx } from '@/lib/utils';

export default function EventPageCompleted() {
  const router = useRouter();

  // Store
  const { currentEvent, loading: eventLoading } = useEventStore();
  const {
    activeRound,
    fetchQuestions,
    questions,
    activeQuestion,
    setActiveQuestion,
    loading: questionsLoading,
    fetchResponses,
  } = useRoundStore();

  useEffect(() => {
    if (activeRound) {
      fetchQuestions(activeRound.id);
    }
  }, [activeRound]);

  if (eventLoading) {
    return <div className="flex h-screen items-center justify-center"></div>;
  }

  if (!currentEvent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary dark:text-primary-dark">404</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Event not found</p>
          <Button
            onClick={() => router.push('/events')}
            className="mt-4"
            variant="default"
            size="sm"
          >
            Go back to events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 pt-4">
        <div className="mx-auto px-1 pb-12 sm:px-2 lg:px-8">
          <div className="grid h-[calc(100vh-9rem)] grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6">
            <div className="flex max-h-full flex-col overflow-hidden gap-3">
              <RoundNavigation />

              <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="flex-1 min-h-0 overflow-y-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-zinc-800 sticky top-0">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                        >
                          Question
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {questions?.map((question) => (
                        <tr key={question.id} className="group">
                          <td
                            className={cx(
                              'whitespace-nowrap px-3 py-4 text-sm',
                              'group-hover:bg-gray-50 dark:group-hover:bg-zinc-700',
                              question.id === activeQuestion?.id
                                ? 'bg-gray-50 dark:bg-zinc-700'
                                : ''
                            )}
                          >
                            <span
                              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset
                                bg-gray-50 text-gray-800 ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-500 dark:ring-gray-400/20"
                            >
                              Completed
                            </span>
                          </td>
                          <td
                            onClick={() => {
                              setActiveQuestion(question);
                              fetchResponses(question.id);
                            }}
                            className={cx(
                              'py-4 pl-4 pr-3 text-sm text-gray-900 dark:text-gray-200 cursor-pointer',
                              'group-hover:bg-gray-50 dark:group-hover:bg-zinc-700',
                              question.id === activeQuestion?.id
                                ? 'bg-gray-50 dark:bg-zinc-700'
                                : ''
                            )}
                          >
                            {question.question_text}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Question Grid */}
            <div className="flex max-h-full flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <ResponseGrid questions={questions} loading={questionsLoading} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}