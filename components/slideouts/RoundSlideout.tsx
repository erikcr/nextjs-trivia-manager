'use client';

import { Fragment, useState } from 'react';

import { useParams } from 'next/navigation';

import { DialogTitle } from '../ui/dialog';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
// Supabase
import { User } from '@supabase/supabase-js';

// Components
import Notification from '@/components/Notification';
// Store
import { useRoundStore } from '@/lib/store/round-store';
import { RoundsWithQuestions } from '@/lib/types/app.types';
import { Tables } from '@/lib/types/database.types';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function RoundSlideout({
  roundToEdit,
  setRoundToEdit,
  roundSlideoutOpen,
  setRoundSlideoutOpen,
}: {
  roundToEdit: Tables<'round'> | null;
  setRoundToEdit: Function;
  roundSlideoutOpen: boolean;
  setRoundSlideoutOpen: Function;
}) {
  const { eventId } = useParams();

  // Round Store
  const { createRound, updateRound, setActiveRound } = useRoundStore();

  // Notification
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifType, setNotifType] = useState('');

  const handleClose = () => {
    setRoundSlideoutOpen(false);
    setRoundToEdit(null);
  };

  const handleAddRound = async (formData: FormData) => {
    const newRound = await createRound({
      name: formData.get('round-name') as string,
      description: formData.get('round-description') as string,
      event_id: eventId as string,
    });

    if (newRound) {
      setNotifTitle('Round added');
      setNotifType('success');
      setNotifShow(true);
      setRoundSlideoutOpen(false);
      setActiveRound(newRound);
      setRoundToEdit(null);
    }
  };

  const handleUpdateRound = async (formData: FormData) => {
    if (!roundToEdit?.id) return;

    const updatedRound = await updateRound(roundToEdit.id, {
      name: formData.get('round-name') as string,
      description: formData.get('round-description') as string,
    });

    if (updatedRound) {
      setNotifTitle('Round updated');
      setNotifType('success');
      setNotifShow(true);
      setRoundSlideoutOpen(false);
      setRoundToEdit(null);
    }
  };

  return (
    <>
      {notifShow && (
        <Notification title={notifTitle} type={notifType} show={notifShow} setShow={setNotifShow} />
      )}

      <Transition show={roundSlideoutOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
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
                      className="flex h-full flex-col divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900 shadow-xl"
                      action={roundToEdit ? handleUpdateRound : handleAddRound}
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-primary dark:bg-primary-dark px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <DialogTitle className="text-base font-semibold leading-6 text-white">
                              {roundToEdit ? 'Edit Round' : 'New Round'}
                            </DialogTitle>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md bg-primary dark:bg-primary-dark text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setRoundSlideoutOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-primary-200">
                              {roundToEdit
                                ? 'Update round information below'
                                : 'Get started by filling in the information below to create your new round.'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 dark:divide-zinc-700 px-4 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <div>
                                <label
                                  htmlFor="round-name"
                                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                                >
                                  Round name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="round-name"
                                    id="round-name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-dark sm:text-sm sm:leading-6"
                                    defaultValue={roundToEdit?.name}
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="round-description"
                                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                                >
                                  Description
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id="round-description"
                                    name="round-description"
                                    rows={4}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-zinc-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-dark sm:text-sm sm:leading-6"
                                    defaultValue={roundToEdit?.description || ''}
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
                          className="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
                          onClick={() => setRoundSlideoutOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-primary dark:bg-primary-dark px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {roundToEdit ? 'Save' : 'Create'}
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
    </>
  );
}
