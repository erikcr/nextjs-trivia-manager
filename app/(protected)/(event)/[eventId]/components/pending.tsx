'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import AIGenerator from '@/components/event/pending/ai-generator';
import QuestionGrid from '@/components/event/pending/question-grid';
import RoundNavigation from '@/components/event/round-navigation';
import QuestionSlideout from '@/components/slideouts/question';
import RoundSlideout from '@/components/slideouts/round';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/lib/store/event-store';
import { Question, useRoundStore } from '@/lib/store/round-store';

export default function EventPagePending() {
  const router = useRouter();

  // Store
  const { currentEvent, loading: eventLoading } = useEventStore();
  const { activeRound, fetchQuestions, questions, loading: questionsLoading } = useRoundStore();

  // Slideout states
  const [roundSlideoutOpen, setRoundSlideoutOpen] = useState(false);
  const [questionSlideoutOpen, setQuestionSlideoutOpen] = useState(false);
  const [roundToEdit, setRoundToEdit] = useState<any>(null);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

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
        <div className="mx-auto px-1 pb-12 sm:px-2 lg:px-4">
          {activeRound ? (
            <div className="grid h-[calc(100vh-9rem)] grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6">
              <div className="flex max-h-full flex-col overflow-hidden gap-3">
                <RoundNavigation setRoundSlideoutOpen={setRoundSlideoutOpen} />

                <AIGenerator />
              </div>

              {/* Right Column - Question Grid */}
              <div className="flex max-h-full flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <QuestionGrid
                    questions={questions}
                    loading={questionsLoading}
                    onQuestionClick={handleQuestionClick}
                    setQuestionSlideoutOpen={() => setQuestionSlideoutOpen(true)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  No round selected
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by creating a new round or selecting an existing one.
                </p>

                <RoundNavigation setRoundSlideoutOpen={setRoundSlideoutOpen} />
              </div>
            </div>
          )}
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
