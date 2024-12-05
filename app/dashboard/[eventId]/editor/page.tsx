'use client';

import { useEffect, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { Message } from 'ai';

import ChatInput from '@/components/ai/ChatInput';
import ChatMessage from '@/components/ai/ChatMessage';
import GeneratedQuestions from '@/components/ai/GeneratedQuestions';
import TopicInput from '@/components/ai/TopicInput';
import EditorHeader from '@/components/editor/EditorHeader';
import QuestionGrid from '@/components/editor/QuestionGrid';
import RoundNavigation from '@/components/editor/RoundNavigation';
import QuestionSlideout from '@/components/slideouts/QuestionSlideout';
import RoundSlideout from '@/components/slideouts/RoundSlideout';
// Store
import { useEventStore } from '@/lib/store/event-store';
import { Question, useRoundStore } from '@/lib/store/round-store';
import { useUserStore } from '@/lib/store/user-store';
import { cx } from '@/lib/utils';

export default function EditorByIdPage() {
  const { eventId } = useParams();

  // Store
  const { currentEvent, fetchEvent, loading: eventLoading, error: eventError } = useEventStore();
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
  const [generatedQuestions, setGeneratedQuestions] = useState<
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
      setGeneratedQuestions([
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
    setGeneratedQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selected: !q.selected } : q)),
    );
  };

  const handleAddSelectedQuestions = async () => {
    const selectedQuestions = generatedQuestions.filter((q) => q.selected);
    if (selectedQuestions.length === 0) return;

    await handleAddQuestions(selectedQuestions);
    setGeneratedQuestions((prev) => prev.map((q) => ({ ...q, selected: false })));
  };

  const handleUpdateGeneratedQuestion = (
    index: number,
    updates: Partial<{ question: string; answer: string; points?: number; selected?: boolean }>,
  ) => {
    setGeneratedQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const handleQuestionClick = (question: any) => {
    setQuestionToEdit(question);
    setQuestionSlideoutOpen(true);
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId as string);
      fetchRounds(eventId as string);
    }
  }, [eventId, fetchEvent, fetchRounds]);

  useEffect(() => {
    if (activeRound) {
      fetchQuestions(activeRound.id);
    }
  }, [activeRound, fetchQuestions]);

  if (eventLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary dark:text-primary-dark">Error</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{eventError.message}</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary dark:text-primary-dark">404</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <EditorHeader event={currentEvent} />

      <div className="flex flex-1 items-stretch overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <RoundNavigation
            rounds={rounds}
            activeRound={activeRound}
            setActiveRound={setActiveRound}
            setRoundToEdit={setRoundToEdit}
            setRoundSlideoutOpen={setRoundSlideoutOpen}
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {activeRound ? (
              <div className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6">
                <div>
                  <QuestionGrid
                    questions={questions}
                    loading={questionsLoading}
                    onQuestionClick={handleQuestionClick}
                    setQuestionSlideoutOpen={() => setQuestionSlideoutOpen(true)}
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">AI Question Generator</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <TopicInput onSubmit={handleGenerateQuestions} loading={isGenerating} />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <GeneratedQuestions
                        questions={generatedQuestions}
                        loading={isGenerating}
                        onSelect={handleSelectQuestion}
                        onAddSelected={handleAddSelectedQuestions}
                        onUpdateQuestion={handleUpdateGeneratedQuestion}
                      />
                    </div>
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
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setRoundSlideoutOpen(true)}
                      className="inline-flex items-center rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:hover:bg-primary-dark-hover"
                    >
                      Create new round
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Slideouts */}
      <RoundSlideout
        roundToEdit={roundToEdit}
        setRoundToEdit={setRoundToEdit}
        roundSlideoutOpen={roundSlideoutOpen}
        setRoundSlideoutOpen={setRoundSlideoutOpen}
      />

      <QuestionSlideout
        questionToEdit={questionToEdit}
        setQuestionToEdit={setQuestionToEdit}
        questionSlideoutOpen={questionSlideoutOpen}
        setQuestionSlideoutOpen={setQuestionSlideoutOpen}
        onSave={() => activeRound && fetchQuestions(activeRound.id)}
      />
    </div>
  );
}
