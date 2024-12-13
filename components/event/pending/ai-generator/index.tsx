import { useState } from 'react';

import QuestionSuggestions from '@/components/event/pending/ai-generator/suggestions';
import TopicInput from '@/components/event/pending/ai-generator/topic-input';
import { useRoundStore } from '@/lib/store/round-store';
import { useUserStore } from '@/lib/store/user-store';

export default function AIGenerator() {
  const { user } = useUserStore();
  const { activeRound, fetchQuestions, createQuestion } = useRoundStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setQuestionSuggestions] = useState<
    Array<{
      question_text: string;
      correct_answer: string;
      points: number;
      selected?: boolean;
    }>
  >([]);

  const handleAddQuestion = async (
    question: { question_text: string; correct_answer: string; points: number },
  ) => {
    if (!activeRound || !user) return;

    try {
      await createQuestion({
        question_text: question.question_text,
        correct_answer: question.correct_answer,
        points: question.points,
        round_id: activeRound.id,
        created_by: user.id,
        updated_by: user.id,
      });

      await fetchQuestions(activeRound.id);

      // Remove the question from the local generatedQuestions array
      setQuestionSuggestions((prev) =>
        prev.filter((q) => q.question_text !== question.question_text),
      );
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleUpdateGeneratedQuestion = (
    index: number,
    updates: Partial<{ question: string; answer: string; points?: number; selected?: boolean }>,
  ) => {
    setQuestionSuggestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

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
        })),
      );
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
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
            onUpdateQuestion={handleUpdateGeneratedQuestion}
            onAddQuestion={handleAddQuestion}
          />
        </div>
      </div>
    </div>
  );
}
