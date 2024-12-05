'use client';

import { Fragment } from 'react';

import { DialogTitle } from '../ui/dialog';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { useRoundStore } from '@/lib/store/round-store';

interface QuestionSlideoutProps {
  questionToEdit: any;
  setQuestionToEdit: (question: any) => void;
  questionSlideoutOpen: boolean;
  setQuestionSlideoutOpen: (open: boolean) => void;
  onSave: () => void;
}

export default function QuestionSlideout({
  questionToEdit,
  setQuestionToEdit,
  questionSlideoutOpen,
  setQuestionSlideoutOpen,
  onSave,
}: QuestionSlideoutProps) {
  const { updateQuestion } = useRoundStore();

  const handleClose = () => {
    setQuestionSlideoutOpen(false);
    setQuestionToEdit(null);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const success = await updateQuestion(questionToEdit.id, {
        question_text: formData.get('question') as string,
        correct_answer: formData.get('answer') as string,
        points: parseInt(formData.get('points') as string) || 10,
      });

      if (success) {
        onSave();
        handleClose();
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <Transition show={questionSlideoutOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-zinc-900 shadow-xl"
                    action={handleSubmit}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-primary dark:bg-primary-dark px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <DialogTitle className="text-base font-semibold leading-6 text-white">
                            Edit Question
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-primary dark:bg-primary-dark text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={handleClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-primary-200">
                            Update the question details below.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="question"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                              >
                                Question
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="question"
                                  name="question"
                                  rows={3}
                                  required
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-dark sm:text-sm sm:leading-6"
                                  defaultValue={questionToEdit?.question_text}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="answer"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                              >
                                Answer
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="answer"
                                  name="answer"
                                  required
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-dark sm:text-sm sm:leading-6"
                                  defaultValue={questionToEdit?.answer_text}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="points"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                              >
                                Points
                              </label>
                              <div className="mt-2">
                                <input
                                  type="number"
                                  id="points"
                                  name="points"
                                  min="1"
                                  required
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-dark sm:text-sm sm:leading-6"
                                  defaultValue={questionToEdit?.points || 10}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
