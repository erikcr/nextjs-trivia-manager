'use client';

import { Fragment, useState } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel, Menu, Transition, TransitionChild } from '@headlessui/react';

import { Event } from '@/lib/store/event-store';
import { DialogTitle } from '@/components/ui/dialog';

interface AddEventSlideoutProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  eventToEdit?: Event;
}

export default function AddEventSlideout({
  open,
  onClose,
  onSubmit,
  loading,
  eventToEdit,
}: AddEventSlideoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMinEventDate = () => {
    const dtToday = new Date();
    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let yearStr = dtToday.getFullYear().toString();
    let monthStr = month.toString();
    let dayStr = day.toString();
    if (month < 10) monthStr = '0' + monthStr;
    if (day < 10) dayStr = '0' + dayStr;
    return yearStr + '-' + monthStr + '-' + dayStr;
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-zinc-800 dark:bg-opacity-75 transition-opacity" />
        </TransitionChild>

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
                <DialogPanel className="pointer-events-auto w-screen max-w-2xl">
                  <form
                    className="flex h-full flex-col overflow-y-scroll bg-gray-50 dark:bg-zinc-900 shadow-xl"
                    action={async (formData) => {
                      setIsSubmitting(true);
                      try {
                        await onSubmit(formData);
                        onClose();
                      } catch (error) {
                        console.error('Error submitting event:', error);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <DialogTitle className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">
                              {eventToEdit ? 'Update' : 'New'} event
                            </DialogTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {eventToEdit
                                ? 'Make changes to the event details.'
                                : 'Get started by filling in the information below to create your next event.'}
                            </p>
                          </div>
                          <div className="flex h-7 items-center">
                            <button
                              type="button"
                              className="relative text-gray-400 hover:text-gray-500 dark:text-gray-200"
                              onClick={onClose}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Divider container */}
                      <div className="space-y-6 py-6 sm:space-y-0 sm:border-b sm:border-1 sm:py-0 dark:border-zinc-700">
                        {/* Event name */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-name"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                            >
                              Name <span className="text-red-600">*</span>
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              required
                              disabled={loading || isSubmitting}
                              type="text"
                              name="event-name"
                              id="event-name"
                              placeholder="The Next Great Trivia"
                              defaultValue={eventToEdit?.name}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        {/* Date of event */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-date"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                            >
                              Date of event <span className="text-red-600">*</span>
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              required
                              disabled={loading || isSubmitting}
                              type="date"
                              name="event-date"
                              id="event-date"
                              min={getMinEventDate()}
                              defaultValue={eventToEdit?.scheduled_at.split('T')[0]}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event description */}
                      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="event-description"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                          >
                            Description
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <textarea
                            disabled={loading || isSubmitting}
                            id="event-description"
                            name="event-description"
                            rows={3}
                            placeholder="An optional description of The Next Great Trivia event with relevant details for the players."
                            defaultValue={eventToEdit?.description || ''}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      {/* Event location */}
                      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="event-location"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                          >
                            Location
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            disabled={loading || isSubmitting}
                            type="text"
                            name="event-location"
                            id="event-location"
                            autoComplete="home city"
                            placeholder="Chattanooga, TN"
                            defaultValue={eventToEdit?.location || ''}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      {/* Event venue */}
                      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="event-venue"
                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                          >
                            Venue
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            disabled={loading || isSubmitting}
                            type="text"
                            name="event-venue"
                            id="event-venue"
                            placeholder="South Side Social"
                            defaultValue={eventToEdit?.venue || ''}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex-shrink-0 border-t border-gray-200 dark:border-zinc-700 px-4 py-5 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          disabled={loading || isSubmitting}
                          type="button"
                          className="rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-700"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={loading || isSubmitting}
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {loading || isSubmitting ? (
                            <>
                              <div role="status" className="pr-2">
                                <svg
                                  aria-hidden="true"
                                  className="w-5 h-5 text-gray-500 animate-spin dark:text-gray-600 fill-white"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                  />
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>
                              Loading...
                            </>
                          ) : (
                            <>{!eventToEdit ? <>Create</> : <>Save</>}</>
                          )}
                        </button>
                      </div>
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
