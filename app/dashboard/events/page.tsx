"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";

export default function DashboardPage() {
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const [allEvents, setAllEvents] = useState<
    Tables<"v001_events_stag">[] | null
  >([]);

  const addEvent = async () => {
    setShow(true);
  };

  const getAllEvents = async (userId: string | undefined) => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("owner", userId);

    if (data) {
      setAllEvents(data);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data) {
        getAllEvents(data.user?.id);
      }
    };

    getUser();
  });

  return (
    <div>
      <Sidebar />

      <main className="lg:pl-72">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
          {/* Main area */}
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
          >
            <li>
              <button
                type="button"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                  />
                </svg>
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Create a new event
                </span>
              </button>
            </li>

            {allEvents?.map((item) => (
              <Link key={item.id} href={`/dashboard/event/${item.id}`}>
                <li
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      {item.name}
                    </div>
                    <ChevronRightIcon
                      className="h-5 w-5 relative ml-auto text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Date</dt>
                      <dd className="text-gray-700">{item.date_of_event}</dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Venue</dt>
                      <dd className="text-gray-700">{item.venue}</dd>
                    </div>
                  </dl>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </main>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <form
                      className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                      onSubmit={addEvent}
                    >
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                New event
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                Get started by filling in the information below
                                to create your next event.
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Divider container */}
                        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Event name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="event-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Name
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                type="text"
                                name="event-name"
                                id="event-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Event description */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="event-description"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Description
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <textarea
                                id="event-description"
                                name="event-description"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Event location */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-location"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Location
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              name="event-location"
                              id="event-location"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        {/* Event venue */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-venue"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Venue
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              name="event-venue"
                              id="event-venue"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Notification
        title="Event created"
        type="success"
        show={show}
        setShow={setShow}
      />
    </div>
  );
}
