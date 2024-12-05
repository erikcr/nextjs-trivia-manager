'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AIAssistantProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onQuestionsGenerated: (questions: Array<{
    question: string;
    answer: string;
    points?: number;
  }>) => void;
}

export default function AIAssistant({
  isOpen,
  setIsOpen,
  onQuestionsGenerated,
}: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to AI service
      const mockQuestions = [
        {
          question: "What is Harry Potter's middle name?",
          answer: 'James',
          points: 10,
        },
        {
          question: 'Who wrote the Half-Blood Prince\'s potions book?',
          answer: 'Severus Snape',
          points: 10,
        },
      ];

      onQuestionsGenerated(mockQuestions);
      setIsOpen(false);
      setPrompt('');
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center gap-2"
                >
                  <SparklesIcon className="h-5 w-5 text-primary dark:text-primary-dark" />
                  AI Question Generator
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Describe the topic or type of questions you want to generate. Be specific for better results.
                  </p>
                </div>

                <div className="mt-4">
                  <textarea
                    rows={4}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-zinc-800 shadow-sm focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
                    placeholder="E.g., Generate 5 questions about Harry Potter's first year at Hogwarts, focusing on key events and characters."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary dark:bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover dark:hover:bg-primary-dark-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                    onClick={generateQuestions}
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? 'Generating...' : 'Generate Questions'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
