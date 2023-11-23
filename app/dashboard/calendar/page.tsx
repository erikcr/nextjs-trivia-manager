"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { parseISO, format } from "date-fns";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

import GeneralLayout from "@/layouts/GeneralLayout";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Notification from "@/components/Notification";
import Calendar from "@/components/Calendar";
// import Logo from "@/public/bb-logo.svg"
import Logo from "@/components/Logo";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CalendarPage() {
  const supabase = createClient();

  // User
  const [user, setUser] = useState<User | null>(null);

  // Notifications
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifType, setNotifType] = useState("");

  // Events
  const [eLoading, setELoading] = useState(true);
  const [eventSlideout, setEventSlideout] = useState(false);
  const [addEventLoading, setAddEventLoading] = useState(false);

  const [allEvents, setAllEvents] = useState<
    Tables<"v001_events_stag">[] | null
  >([]);

  const getAllEvents = async (userId?: string) => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("owner", userId ? userId : user?.id);

    if (data) {
      setAllEvents(data);
      setELoading(false);
    }
  };

  const addEvent = async (formData: FormData) => {
    setAddEventLoading(true);
    const { data, error } = await supabase
      .from("v001_events_stag")
      .insert([
        {
          name: formData.get("event-name"),
          date_of_event: formData.get("event-date"),
          description: formData.get("event-description"),
          location: formData.get("event-location"),
          venue: formData.get("event-venue"),
          owner: user?.id,
        },
      ])
      .select();

    if (!error) {
      getAllEvents();
      setNotifTitle("Event created");
      setNotifType("success");
      setNotifShow(true);
      setEventSlideout(false);
      setAddEventLoading(false);
    } else {
      console.log(error);
    }
  };

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) {
      getAllEvents(data.user?.id);
      setUser(data.user);
    }
  };

  useEffect(() => {
    getUser();
  });

  return (
    <>
      <GeneralLayout>
        <Calendar />
      </GeneralLayout>

      {/**
       * New event panel
       */}
      <Transition.Root show={eventSlideout} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setEventSlideout}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

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
                      action={addEvent}
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
                                onClick={() => setEventSlideout(false)}
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
                        <div className="space-y-6 py-6 sm:space-y-0 sm:border-b sm:border-1 sm:py-0">
                          {/* Event name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="event-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Name <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addEventLoading}
                                type="text"
                                name="event-name"
                                id="event-name"
                                placeholder="The Next Great Trivia"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Date of event */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="event-date"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Date of event{" "}
                                <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addEventLoading}
                                type="date"
                                name="event-date"
                                id="event-date"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
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
                              disabled={addEventLoading}
                              id="event-description"
                              name="event-description"
                              rows={3}
                              placeholder="An optional description of The Next Great Trivia event with relevant details for the players."
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
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
                              disabled={addEventLoading}
                              type="text"
                              name="event-location"
                              id="event-location"
                              autoComplete="home city"
                              placeholder="Chattanooga, TN"
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
                              disabled={addEventLoading}
                              type="text"
                              name="event-venue"
                              id="event-venue"
                              placeholder="South Side Social"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            disabled={addEventLoading}
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setEventSlideout(false)}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={addEventLoading}
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {addEventLoading ? (
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
                              <>Create</>
                            )}
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

      {/**
       * Action notification
       */}
      <Notification
        title={notifTitle}
        type={notifType}
        show={notifShow}
        setShow={setNotifShow}
      />
    </>
  );
}
