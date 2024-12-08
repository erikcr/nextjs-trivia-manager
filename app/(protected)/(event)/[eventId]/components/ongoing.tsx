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
  } = useRoundStore();
  const { user } = useUserStore();

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

  const [messages, setMessages] = useState<Message[]>([]);

  // Refs
  const addFormRef = useRef<HTMLFormElement>(null);

  const handleAddQuestions = async (
    newQuestions: Array<{ question: string; answer: string; points?: number }>,
  ) => {
    if (!activeRound || !user) return;

    try {
      await Promise.all(
        newQuestions.map((q) =>
          createQuestion({
            question_text: q.question,
            correct_answer: q.answer,
            points: q.points || 10,
            round_id: activeRound.id,
            created_by: user.id,
            updated_by: user.id,
          }),
        ),
      );

      await fetchQuestions(activeRound.id);
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  const handleGenerateQuestions = async (topic: string) => {
    setIsGenerating(true);
    try {
      // TODO: Replace with actual AI call
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setQuestionSuggestions([
        {
          question:
            'What was the first spacecraft to land on Mars but I need to test a much shorter?',
          answer: 'Viking 1',
          points: 10,
          selected: false,
        },
        {
          question: 'Who was the first American woman in space?',
          answer: 'Sally Ride',
          points: 10,
          selected: false,
        },
        {
          question: 'What is the largest planet in our solar system?',
          answer: 'Jupiter',
          points: 10,
          selected: false,
        },
      ]);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setQuestionSuggestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected: !q.selected } : q)),
    );
  };

  const handleAddSelectedQuestions = async () => {
    const selectedQuestions = generatedQuestions.filter((q) => q.selected);
    if (selectedQuestions.length === 0) return;

    await handleAddQuestions(selectedQuestions);
    setQuestionSuggestions((prev) => prev.map((q) => ({ ...q, selected: false })));
  };

  const handleUpdateGeneratedQuestion = (
    index: number,
    updates: Partial<{ question: string; answer: string; points?: number; selected?: boolean }>,
  ) => {
    setQuestionSuggestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

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
        <div className="mx-auto max-w-7xl px-1 pb-12 sm:px-2 lg:px-4">
          <div className="grid h-[calc(100vh-9rem)] grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6">
            <div className="flex max-h-full flex-col overflow-hidden gap-3">
              <RoundNavigation
                rounds={rounds}
                activeRound={activeRound}
                setActiveRound={setActiveRound}
                setRoundToEdit={setRoundToEdit}
                setRoundSlideoutOpen={setRoundSlideoutOpen}
              />

              <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col ">
                <h2 className="text-lg font-semibold py-2 px-4">Questions</h2>
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
