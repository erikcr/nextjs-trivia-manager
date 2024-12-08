'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Message } from 'ai';

import ResponseGrid from '@/components/event/response-grid';
import RoundNavigation from '@/components/event/round-navigation';
import QuestionSlideout from '@/components/slideouts/question';
import RoundSlideout from '@/components/slideouts/round';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/lib/store/event-store';
import { Question, useRoundStore } from '@/lib/store/round-store';
import { useUserStore } from '@/lib/store/user-store';
import { cx } from '@/lib/utils';

export default function EventPageOngoing() {
  const router = useRouter();

  // Store
  const { currentEvent, loading: eventLoading } = useEventStore();
  const {
    rounds,
    activeRound,
    setActiveRound,
    fetchRounds,
    fetchQuestions,
    questions,
    loading: questionsLoading,
    createQuestion,
    fetchResponses,
    subscribeToResponses,
    unsubscribeFromResponses,
  } = useRoundStore();
  const { user } = useUserStore();

  // Local state
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Slideout states
  const [roundSlideoutOpen, setRoundSlideoutOpen] = useState(false);
  const [questionSlideoutOpen, setQuestionSlideoutOpen] = useState(false);
  const [roundToEdit, setRoundToEdit] = useState<any>(null);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

  // AI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setQuestionSuggestions] = useState<
    Array<{
      question: string;
      answer: string;
      points?: number;
      selected?: boolean;
    }>
  >([]);

  const handleQuestionClick = (question: any) => {
    setQuestionToEdit(question);
    setQuestionSlideoutOpen(true);
  };

  useEffect(() => {
    if (activeRound) {
      fetchQuestions(activeRound.id);
    }
  }, [activeRound, fetchQuestions]);

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
              <RoundNavigation setRoundSlideoutOpen={setRoundSlideoutOpen} />

              <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col ">
                <div className="flex-1 min-h-0 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-zinc-800 sticky top-0">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                        >
                          Question
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {questions?.map((question) => (
                        <tr
                          key={question.id}
                          onClick={() => {
                            setActiveQuestion(question);
                            fetchResponses(question.id);
                            unsubscribeFromResponses(); // Cleanup previous subscription
                            subscribeToResponses(question.id);
                          }}
                          className={cx(
                            'cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700',
                            question.id === activeQuestion?.id
                              ? 'bg-gray-100 dark:bg-zinc-700'
                              : '',
                          )}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 dark:text-gray-200">
                            {question.question_text}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={cx(
                                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                {
                                  'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20':
                                    question.status === 'pending',
                                  'bg-green-50 text-green-800 ring-green-600/20 dark:bg-green-400/10 dark:text-green-500 dark:ring-green-400/20':
                                    question.status === 'ongoing',
                                  'bg-gray-50 text-gray-800 ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-500 dark:ring-gray-400/20':
                                    question.status === 'completed',
                                },
                              )}
                            >
                              {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                            </span>
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
                <ResponseGrid
                  questions={questions}
                  loading={questionsLoading}
                  onQuestionClick={handleQuestionClick}
                  setQuestionSlideoutOpen={() => setQuestionSlideoutOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Slideouts */}
      <RoundSlideout
        roundToEdit={roundToEdit}
        setRoundToEdit={setRoundToEdit}
        roundSlideoutOpen={roundSlideoutOpen}
        setRoundSlideoutOpen={setRoundSlideoutOpen}
      />

      {questionToEdit && (
        <QuestionSlideout
          questionToEdit={questionToEdit}
          setQuestionToEdit={setQuestionToEdit}
          questionSlideoutOpen={questionSlideoutOpen}
          setQuestionSlideoutOpen={setQuestionSlideoutOpen}
          onSave={() => activeRound && fetchQuestions(activeRound.id)}
        />
      )}
    </>
  );
}
