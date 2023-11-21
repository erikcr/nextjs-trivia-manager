"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars2Icon,
  Bars3Icon,
  HomeIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

const navigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: true },
  { name: "Settings", href: "#", icon: Cog6ToothIcon, current: false },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventPage() {
  const { eventId } = useParams();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [qLoading, setQLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rounds, setRounds] = useState<Tables<"v001_rounds_stag">[]>();
  const [activeRound, setActiveRound] = useState<Tables<"v001_rounds_stag">>();
  const [questions, setQuestions] = useState<Tables<"v001_questions_stag">[]>();

  useEffect(() => {
    const getQuestions = async () => {
      const { data, error } = await supabase
        .from("v001_questions_stag")
        .select()
        .eq("round_id", activeRound?.id)
        .eq("owner", user?.id);

      if (data) {
        setQuestions(data);
        setQLoading(false);
      }
    };

    if (activeRound) {
      getQuestions();
    }
  }, [activeRound]);

  useEffect(() => {
    const getRounds = async () => {
      const { data, error } = await supabase
        .from("v001_rounds_stag")
        .select()
        .order("order_num")
        .eq("event_id", eventId)
        .eq("owner", user?.id);

      if (data) {
        setRounds(data);
        setActiveRound(data[0]);
        setLoading(false);
      }
    };

    if (user) {
      getRounds();
    }
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="-mx-2 flex-1 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
          <div className="flex h-16 shrink-0 items-center justify-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          <nav className="mt-8">
            <ul role="list" className="flex flex-col items-center space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-800"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </a>
        </div>

        <main className="lg:pl-20">
          <div className="xl:pl-96">
            <div className="px-4 py-10 sm:px-6 lg:px-16 lg:py-6">
              {/* Main area */}
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Questions
              </h3>

              <dl className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-gray-100">
                {qLoading && (
                  <div role="status" className="max-w-sm animate-pulse py-3">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}

                {questions?.map((item) => (
                  <div className="px-4 py-3 sm:col-span-2 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {item.question}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* <div
                key={item.id}
                className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
              >
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`question-${item.id}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Question
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name={`question-${item.id}`}
                      id={`question-${item.id}`}
                      autoComplete="question"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor={`answer-${item.id}`}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Answer
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name={`answer-${item.id}`}
                      id={`answer-${item.id}`}
                      autoComplete="answer"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </main>

        <aside className="fixed inset-y-0 left-20 hidden w-96 overflow-y-auto border-r border-gray-200 mx-4 py-6 sm:mx-6 lg:mx-8 xl:block">
          {/* Secondary column (hidden on smaller screens) */}
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Rounds
            </h3>

            <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6">
              {loading && (
                <li
                  role="status"
                  className="col-span-1 animate-pulse flex rounded-md hover:shadow-sm"
                >
                  <div className="bg-gray-200 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"></div>
                  <div className="flex flex-1 items-center justify-between truncate border-b border-r border-t border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-200 w-48 mb-4"></div>
                      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-100 max-w-[360px] mb-2.5"></div>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="sr-only"></span>
                        <EllipsisVerticalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    {/* <span className="sr-only">Loading...</span> */}
                  </div>
                </li>
              )}

              {rounds?.map((item, index) => (
                <li
                  key={item.id}
                  className={classNames(
                    item.id === activeRound?.id
                      ? "border-r-2 border-red-600"
                      : "",
                    "col-span-1 flex rounded-md hover:shadow-sm"
                  )}
                >
                  <div className="bg-gray-400 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white">
                    {item.order_num}
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate border-b border-r border-t border-gray-200 bg-white">
                    <div
                      className="flex-1 truncate px-4 py-2 text-sm"
                      onClick={() => setActiveRound(item)}
                    >
                      <p className="font-medium text-gray-900 hover:text-gray-600">
                        {item.name}
                      </p>
                      <p className="text-gray-500"># Questions</p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
