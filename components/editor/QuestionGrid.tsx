import { useState } from 'react';

import AIAssistant from './AIAssistant';
import { SparklesIcon } from '@heroicons/react/24/outline';

import { Question } from '@/lib/store/round-store';

export default function QuestionGrid({
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
    <div className="pt-1 sm:pt-2 lg:pt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold">Questions</h1>

          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all questions in this round.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
          <button
            type="button"
            onClick={setQuestionSlideoutOpen}
            className="block rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Add Question
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-zinc-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                    >
                      Question
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Answer
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-zinc-900">
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
                    questions.map((question) => (
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
    </div>
  );
}
