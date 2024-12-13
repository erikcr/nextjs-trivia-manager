'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Message } from 'ai';

import QuestionGrid from '@/components/event/question-grid';
import QuestionSuggestions from '@/components/event/question-suggestions';
import RoundNavigation from '@/components/event/round-navigation';
import TopicInput from '@/components/event/topic-input';
import QuestionSlideout from '@/components/slideouts/question';
import RoundSlideout from '@/components/slideouts/round';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/lib/store/event-store';
import { Question, useRoundStore } from '@/lib/store/round-store';
import { useUserStore } from '@/lib/store/user-store';

export default function EventPagePending() {
  const router = useRouter();

  // Store
  const { currentEvent, loading: eventLoading } = useEventStore();
  const {
    activeRound,
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
      question_text: string;
      correct_answer: string;
      points: number;
      selected?: boolean;
    }>
  >([]);

  const [messages, setMessages] = useState<Message[]>([]);

  // Refs
  const addFormRef = useRef<HTMLFormElement>(null);

  const handleAddQuestions = async (
    newQuestions: Array<{ question_text: string; correct_answer: string; points: number }>,
  ) => {
    if (!activeRound || !user) return;

    try {
      await Promise.all(
        newQuestions.map((q) =>
          createQuestion({
            question_text: q.question_text,
            correct_answer: q.correct_answer,
            points: q.points,
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

  // Add new function to call completion API
  const generateQuestionsFromAPI = async (topic: string) => {
    const response = await fetch('/api/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: `Generate trivia questions about: ${topic}` }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    return data.trivia;
  };

  const handleGenerateQuestions = async (topic: string) => {
    setIsGenerating(true);
    try {
      const questions = await generateQuestionsFromAPI(topic);
      setQuestionSuggestions(
        questions.map((q: any) => ({
          ...q,
          selected: false,
        }))
      );
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
        <div className="mx-auto px-1 pb-12 sm:px-2 lg:px-4">
          {activeRound ? (
            <div className="grid h-[calc(100vh-9rem)] grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6">
              <div className="flex max-h-full flex-col overflow-hidden gap-3">
                <RoundNavigation setRoundSlideoutOpen={setRoundSlideoutOpen} />

                <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col ">
                  <h2 className="text-lg font-semibold py-2 px-4">AI Question Generator</h2>

                  <div className="flex-shrink-0 px-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <TopicInput onSubmit={handleGenerateQuestions} loading={isGenerating} />
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      <QuestionSuggestions
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
