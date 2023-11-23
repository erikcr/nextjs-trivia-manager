"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useChat } from "ai/react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  Cog6ToothIcon,
  Bars2Icon,
  ChevronRightIcon,
  CubeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

import Notification from "@/components/Notification";
import Logo from "@/components/Logo";

type TriviaItem = {
  question: string;
  answer: string;
};

const tabs = [
  { name: "Manual", href: "#", current: true },
  { name: "TriviaAI", href: "#", current: false },
];

const navigation = [
  {
    name: "Home",
    href: "/dashboard/events",
    icon: HomeIcon,
    current: false,
    divider: true,
  },
  {
    name: "Rounds",
    href: "#",
    icon: CubeIcon,
    current: true,
    divider: false,
  },
  {
    name: "Settings",
    href: "#",
    icon: Cog6ToothIcon,
    current: false,
    divider: false,
  },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventByIdPage() {
  const { eventId } = useParams();
  const supabase = createClient();
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [user, setUser] = useState<User | null>(null);
  const [roundSlideout, setRoundSlideout] = useState(false);
  const [addRoundLoading, setAddRoundLoading] = useState(false);
  const [questionSlideout, setQuestionSlideout] = useState(false);
  const [addQuestionLoading, setAddQuestionLoading] = useState(false);
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifType, setNotifType] = useState("");
  const [rLoading, setRLoading] = useState(true);
  const [qLoading, setQLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rounds, setRounds] = useState<Tables<"v001_rounds_stag">[]>();
  const [activeRound, setActiveRound] = useState<Tables<"v001_rounds_stag">>();
  const [questions, setQuestions] = useState<Tables<"v001_questions_stag">[]>();
  const [response, setResponse] = useState<TriviaItem[]>([]);
  const [qError, setQError] = useState("");
  const [rError, setRError] = useState("");

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
      setRLoading(false);
    }
  };

  const addRound = async (formData: FormData) => {
    setAddRoundLoading(true);
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .insert([
        {
          name: formData.get("round-name"),
          description: formData.get("round-description"),
          order_num: rounds?.length,
          event_id: eventId,
          owner: user?.id,
        },
      ])
      .select();

    if (!error) {
      getRounds();
      setNotifTitle("Round added");
      setNotifType("success");
      setNotifShow(true);
      setRoundSlideout(false);
      setAddRoundLoading(false);
    } else {
      setRError(error);
      console.log(error);
    }
  };

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

  const addQuestion = async (formData: FormData) => {
    setAddQuestionLoading(true);
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .insert([
        {
          question: formData.get("question"),
          answer: formData.get("answer"),
          points: formData.get("points"),
          round_id: activeRound?.id,
          owner: user?.id,
        },
      ])
      .select();

    if (!error) {
      setNotifTitle("Question added");
      setNotifType("success");
      setNotifShow(true);
      setQuestionSlideout(false);
      getQuestions();
    }
  };

  useEffect(() => {
    if (activeRound) {
      getQuestions();
    }
  }, [activeRound]);

  useEffect(() => {
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

  useEffect(() => {
    messages.map((item) => {
      if (item.role === "assistant") {
        let content = JSON.parse(item.content);
        setResponse(content);
      }
    });
  }, [messages]);

  return (
    <div className="">
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
                                ? "bg-gray-300 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-300",
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
      <div className="hidden border-r border-gray-200 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-16 lg:overflow-y-auto lg:pb-4 dark:bg-slate-800">
        <div className="flex h-16 shrink-0 items-center justify-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />

          {/* <Logo className="h-8 w-auto" /> */}
        </div>
        <nav className="mt-8">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
                    "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span className="sr-only">{item.name}</span>
                </a>

                {item.divider && (
                  <div className="relative pt-10">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="lg:pl-20">
        <div className="fixed top-0 left-16 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="h-6 w-px bg-gray-900/10 lg:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1">
              <nav className="flex" aria-label="Breadcrumb">
                <ol role="list" className="flex items-center space-x-4">
                  <li>
                    <div>
                      <a
                        href="/dashboard/events"
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <HomeIcon
                          className="h-5 w-5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Home</span>
                      </a>
                    </div>
                  </li>

                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <a
                        href={`/dashboard/event/${eventId}`}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        aria-current="page"
                      >
                        Event
                      </a>
                    </div>
                  </li>

                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <a
                        href={`/dashboard/e/${eventId}`}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        aria-current="page"
                      >
                        {activeRound?.name}
                      </a>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
              </button>

              {/* Separator */}
              <div
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                aria-hidden="true"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      aria-hidden="true"
                    >
                      Start event
                    </span>
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="fixed lg:left-96 pt-16">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="w-8/12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                        >
                          Question
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Answer
                        </th>
                        <th className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => setQuestionSlideout(true)}
                          >
                            Add
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {questions?.map((item) => (
                        <tr key={item.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                            {item.question}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.answer}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                              <span className="sr-only">, {item.question}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/**
       * Left-side column
       */}
      <aside className="fixed bottom-0 left-16 top-16 hidden w-80 overflow-y-auto border-r border-gray-200 px-4 py-4 sm:px-6 lg:px-8 xl:block">
        <nav className="flex flex-1 flex-col" aria-label="Sidebar">
          <ul role="list" className="-mx-2 space-y-1">
            <li
              onClick={() => {
                setRoundSlideout(true);
              }}
            >
              <div className=" text-gray-900 border-2 border-dashed border-gray-300 hover:border-gray-400 group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                {/* <Bars2Icon
                      className={classNames(
                        "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    /> */}
                <div>Add round</div>
              </div>
            </li>

            {rLoading && (
              <li className="animate-pulse">
                <div className="bg-gray-100 text-gray-500 group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                  <div>Loading...</div>

                  <ChevronRightIcon
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </li>
            )}

            {!rLoading &&
              rounds?.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setQLoading(true);
                    setActiveRound(item);
                  }}
                >
                  <div
                    className={classNames(
                      item.id === activeRound?.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                      "group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    {/* <Bars2Icon
                      className={classNames(
                        "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    /> */}
                    <div>{item.name}</div>

                    <ChevronRightIcon
                      className={classNames(
                        item.id === activeRound?.id
                          ? "text-gray-900"
                          : "hidden text-gray-500 hover:visible",
                        "h-5 w-5 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              ))}
          </ul>
        </nav>
      </aside>

      {/**
       * Right-side column
       */}
      <aside className="fixed bottom-0 right-0 top-16 hidden w-96 overflow-y-auto border-l border-gray-200 xl:hidden">
        <div className="hidden sm:block">
          <div className="border-b border-gray-300">
            <nav
              className="-mb-px flex space-x-4 px-4 sm:px-6"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <p
                  key={tab.name}
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "whitespace-nowrap border-b py-4 px-1 text-sm font-medium"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </p>
              ))}
            </nav>
          </div>
        </div>

        {/**
         * TriviaAI Tab
         */}
        <div className="hidden">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            TriviaAI
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <input
                type="text"
                name="chat-input"
                id="chat-input"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="A trivia topic"
                value={input}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <ul role="list" className="mt-4">
            {response.map((item, index) => (
              <li key={index}>
                <div className="pb-4">
                  <div className="relative flex">
                    <div>
                      <span className="h-8 w-8 rounded-full flex items-center justify-center">
                        <input
                          id="comments"
                          aria-describedby="comments-description"
                          name="comments"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-700">{item.question}</p>
                        <p className="text-sm text-gray-950">{item.answer} </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/**
         * Add new question tab
         */}
        <form>
          <div className="space-y-12 px-4 sm:px-6">
            <div className="pb-12">
              {/* Question */}
              <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:py-5">
                <div>
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                  >
                    Question <span className="text-red-600">*</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    required
                    disabled={addQuestionLoading}
                    name="question"
                    id="question"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>

              {/* Answer */}
              <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:py-5">
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                  >
                    Answer <span className="text-red-600">*</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <input
                    required
                    disabled={addQuestionLoading}
                    id="answer"
                    name="answer"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Points */}
              <div className="space-y-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:py-5">
                <div>
                  <label
                    htmlFor="points"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                  >
                    Points <span className="text-red-600">*</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <input
                    required
                    disabled={addQuestionLoading}
                    type="number"
                    name="points"
                    id="points"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={1}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 py-5">
                <div className="flex justify-end space-x-3">
                  <button
                    disabled={addRoundLoading}
                    type="button"
                    className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setRoundSlideout(false)}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={addRoundLoading}
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {addRoundLoading ? (
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
                      <>Add</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </aside>

      {/**
       * New question panel
       */}
      <Transition.Root show={questionSlideout} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setQuestionSlideout}
        >
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
                      className="flex h-full flex-col overflow-y-scroll shadow-xl"
                      action={addQuestion}
                    >
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                New question
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                Add a new question to the {activeRound?.name}{" "}
                                round.
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => setQuestionSlideout(false)}
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
                          {/* Question */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="question"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Question <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <textarea
                                required
                                disabled={addQuestionLoading}
                                name="question"
                                id="question"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={""}
                              />
                            </div>
                          </div>

                          {/* Answer */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="answer"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Answer <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addQuestionLoading}
                                id="answer"
                                name="answer"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Points */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="points"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Points <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addQuestionLoading}
                                type="number"
                                name="points"
                                id="points"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={1}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            disabled={addQuestionLoading}
                            type="button"
                            className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setQuestionSlideout(false)}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={addQuestionLoading}
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {addQuestionLoading ? (
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
                              <>Add</>
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
       * New round panel
       */}
      <Transition.Root show={roundSlideout} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setRoundSlideout}>
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
                      className="flex h-full flex-col overflow-y-scroll shadow-xl"
                      action={addRound}
                    >
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                New round
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                Add a new round to the event.
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => setRoundSlideout(false)}
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
                          {/* Round name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="round-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Name <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addRoundLoading}
                                type="text"
                                name="round-name"
                                id="round-name"
                                placeholder="Beyond Harry Potter "
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Round description */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="round-description"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Description
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              disabled={addRoundLoading}
                              id="round-description"
                              name="round-description"
                              rows={3}
                              placeholder="An optional description of Beyond Harry Potter round."
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            disabled={addRoundLoading}
                            type="button"
                            className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setRoundSlideout(false)}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={addRoundLoading}
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {addRoundLoading ? (
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
                              <>Add</>
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
    </div>
  );
}
