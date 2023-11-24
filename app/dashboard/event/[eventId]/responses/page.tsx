"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronRightIcon,
  RocketLaunchIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Supabase
import { PostgrestError, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

// Components
import Notification from "@/components/Notification";
import RoundSlideout from "@/components/slideouts/RoundSlideout";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const leftSidebarTabs = [{ name: "Rounds", href: "#", current: true }];
const rightSidebarTabs = [
  { name: "Manual", href: "#", current: true },
  { name: "TriviaAI", href: "#", current: false },
];

const navigation = [
  { name: "Editor", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Settings", href: "#", current: false },
];

export default function EventResponsesPage() {
  const { eventId } = useParams();
  const pathname = usePathname();
  const supabase = createClient();

  // Navigation
  const navigation = [
    { name: "Responses", href: `/dashboard/event/${eventId}/responses` },
    { name: "Teams", href: `/dashboard/event/${eventId}/responses/teams` },
    {
      name: "Settings",
      href: `/dashboard/event/${eventId}/settings`,
    },
  ];

  // User
  const [user, setUser] = useState<User | null>(null);

  // Event
  const [event, setEvent] = useState<Tables<"v001_events_stag">>();
  const [eLoading, setELoading] = useState(true);
  const [eError, setEError] = useState<PostgrestError>();

  // Rounds
  const [rounds, setRounds] = useState<Tables<"v001_rounds_stag">[]>();
  const [rLoading, setRLoading] = useState(true);
  const [rError, setRError] = useState<PostgrestError>();
  const [activeRound, setActiveRound] = useState<Tables<"v001_rounds_stag">>();
  const [addRoundLoading, setAddRoundLoading] = useState(false);
  const [roundSlideoutOpen, setRoundSlideoutOpen] = useState(false);

  // Questions
  const [questions, setQuestions] = useState<Tables<"v001_questions_stag">[]>();
  const [qLoading, setQLoading] = useState(true);
  const [qError, setQError] = useState<PostgrestError>();
  const [activeQuestion, setActiveQuestion] =
    useState<Tables<"v001_questions_stag">>();
  const [addQuestionLoading, setAddQuestionLoading] = useState(false);
  const [questionSlideout, setQuestionSlideout] = useState(false);

  // Responses
  const [responses, setResponses] = useState<Tables<"v001_responses_stag">[]>();
  const [rpLoading, setRpLoading] = useState(true);
  const [rpError, setRpError] = useState<PostgrestError>();

  // Notification
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifType, setNotifType] = useState("");

  // Display toggles
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

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

      if (!data.length) {
        setQLoading(false);
      }
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
      setRoundSlideoutOpen(false);
      setAddRoundLoading(false);
    } else {
      setRError(error);
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
      setActiveQuestion(data[0]);
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

  const getResponses = async () => {
    const { data, error } = await supabase
      .from("v001_responses_stag")
      .select("*, v001_teams_stag( name )")
      .eq("question_id", activeQuestion?.id);

    if (data) {
      setResponses(data);
      setRpLoading(false);
    }
  };

  const approveResponse = async (responseId: number, isCorrect: boolean) => {
    const { data, error } = await supabase
      .from("v001_responses_stag")
      .update({ is_correct: isCorrect })
      .eq("id", responseId);

    if (!error) {
      getResponses();
    }
  };

  const startEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .update({ status: "ONGOING" })
      .eq("id", event?.id)
      .eq("owner", user?.id)
      .select();

    if (data) {
      setEvent(data[0]);
    } else if (error) {
      console.log(error);
    }
  };

  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("id", eventId)
      .eq("owner", user?.id);

    if (data) {
      setEvent(data[0]);
      setELoading(false);
    }
  };

  useEffect(() => {
    if (activeQuestion) {
      getResponses();
    }
  }, [activeQuestion]);

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
    if (user) {
      getEvent();
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

  // useEffect(() => {
  //   messages.map((item) => {
  //     if (item.role === "assistant") {
  //       let content = JSON.parse(item.content);
  //       setResponse(content);
  //     }
  //   });
  // }, [messages]);

  const QuestionForm = () => {
    return (
      <form action={addQuestion}>
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  defaultValue={1}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 py-5">
              <div className="flex justify-end space-x-3">
                <button
                  disabled={addRoundLoading}
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <>Add</>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  };

  const TopHeader = () => {
    return (
      <div className="min-h-full w-full">
        <div className="mx-auto px-6">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <a href="/manage/events">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=amber&shade=600"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=amber&shade=600"
                    alt="Your Company"
                  />
                </a>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                    )}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {event && (
              <div className="flex">
                <div className="inline-flex items-center px-1 pt-1 font-medium">
                  {event.name}
                </div>
              </div>
            )}

            {event && (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <span
                  className={classNames(
                    event?.status === "PENDING"
                      ? "bg-blue-100"
                      : event?.status === "ONGOING"
                      ? "bg-green-100"
                      : "bg-gray-100",
                    "inline-flex items-center rounded-full px-2 mr-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset"
                  )}
                >
                  {event?.status}
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-900 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={() => startEvent()}
                >
                  END EVENT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LeftSidebar = () => {
    return (
      <div className="hidden sm:block">
        <div className="border-b border-gray-300">
          <nav className="-mb-px flex space-x-4 px-4 sm:px-6" aria-label="Tabs">
            {leftSidebarTabs.map((tab) => (
              <p
                key={tab.name}
                className={classNames(
                  tab.current
                    ? "border-primary text-primary"
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

        <div className="mx-6 my-3">
          <nav className="flex flex-1 flex-col" aria-label="Sidebar">
            <ul role="list" className="-mx-2 space-y-1">
              {rounds?.map((item) => (
                <li key={item.id} onClick={() => setActiveRound(item)}>
                  <div
                    // href={item.href}
                    className={classNames(
                      item.id === activeRound?.id
                        ? "bg-gray-200 text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
                    )}
                  >
                    {item.name}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  };

  const LeftSidebarMin = () => {
    return (
      <ArrowRightOnRectangleIcon
        className="h-7 w-7 flex-shrink-0"
        onClick={() => setShowLeftSidebar(true)}
      />
    );
  };

  const MainContent = () => {
    return (
      <ul role="list" className="divide-y divide-gray-200">
        {questions?.map((item) => (
          <li
            key={item.id}
            className={classNames(
              activeQuestion?.id === item.id ? "bg-gray-100" : "",
              "relative flex justify-between gap-x-6 px-4 py-2 hover:bg-gray-100 sm:px-6"
            )}
            onClick={() => setActiveQuestion(item)}
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {item.answer}
                </p>
                <p className="mt-1 flex text-xs leading-5 text-gray-500">
                  {item.question}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <span
                  className={classNames(
                    item.status === "PENDING"
                      ? "bg-blue-100"
                      : item.status === "ONGOING"
                      ? "bg-green-100"
                      : "bg-gray-100",
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset"
                  )}
                >
                  {item.status}
                </span>
              </div>
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const ResponseItem = ({ item }: { item: Tables<"v001_responses_stag"> }) => {
    return (
      <li
        key={item.id}
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2 sm:flex-nowrap"
      >
        <div>
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {item.submitted_answer}
          </p>
          <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
            <p>{item.v001_teams_stag.name}</p>
          </div>
        </div>
        <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
          <div className="flex -space-x-0.5">
            <dt className="sr-only">Commenters</dt>
          </div>
          <div className="flex w-16 gap-x-2.5">
            <dt>
              <span className="sr-only">Total comments</span>
              <CheckCircleIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
                onClick={() => approveResponse(item.id, true)}
              />
            </dt>
            <dd className="text-sm leading-6 text-gray-900">
              <XCircleIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
                onClick={() => approveResponse(item.id, false)}
              />
            </dd>
          </div>
        </dl>
      </li>
    );
  };

  const RightSidebar = () => {
    return (
      <nav className="h-full overflow-y-auto" aria-label="Directory">
        <div className="relative">
          <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-100 px-6 py-1.5 text-sm font-semibold leading-6 text-gray-900">
            <h3>Pending</h3>
          </div>

          <ul role="list" className="divide-y divide-gray-100 px-6">
            {responses
              ?.filter((item) => item.is_correct === null)
              .map((item) => (
                <ResponseItem item={item} />
              ))}
          </ul>
        </div>

        <div className="relative">
          <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-100 px-6 py-1.5 text-sm font-semibold leading-6 text-gray-900">
            <h3>Correct</h3>
          </div>

          <ul role="list" className="divide-y divide-gray-100 px-6">
            {responses
              ?.filter((item) => item.is_correct === true)
              .map((item) => (
                <ResponseItem item={item} />
              ))}
          </ul>
        </div>

        <div className="relative">
          <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-100 px-6 py-1.5 text-sm font-semibold leading-6 text-gray-900">
            <h3>Incorrect</h3>
          </div>

          <ul role="list" className="divide-y divide-gray-100 px-6">
            {responses
              ?.filter((item) => item.is_correct === false)
              .map((item) => (
                <ResponseItem item={item} />
              ))}
          </ul>
        </div>
      </nav>
    );
  };

  return (
    <>
      {/**
       * Action notification
       */}
      <Notification
        title={notifTitle}
        type={notifType}
        show={notifShow}
        setShow={setNotifShow}
      />

      {/**
       * Round slideout
       */}
      <RoundSlideout
        user={user}
        rounds={rounds}
        getRounds={getRounds}
        roundSlideoutOpen={roundSlideoutOpen}
        setRoundSlideoutOpen={setRoundSlideoutOpen}
      />

      {/**
       * Top header
       */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200">
        <TopHeader />
      </div>

      {/**
       * Left-side column
       */}
      {showLeftSidebar ? (
        <aside className="fixed bottom-0 left-0 top-16 hidden w-80 overflow-y-auto border-r border-gray-200 xl:block">
          <LeftSidebar />
        </aside>
      ) : (
        <aside className="bg-red-100 fixed bottom-0 left-16 top-16 hidden w-16 overflow-y-auto border-r border-gray-200 pl-4 py-3 xl:block">
          <LeftSidebarMin />
        </aside>
      )}

      {/**
       * Main content
       */}
      <main
        className={classNames(
          "fixed pt-16",
          showLeftSidebar ? "left-80" : "left-0",
          showRightSidebar ? "right-1/3" : "right-0"
        )}
      >
        <MainContent />
      </main>

      {/**
       * Right-side column
       */}
      {showRightSidebar && (
        <aside className="fixed bottom-0 right-0 top-16 hidden w-1/3 overflow-y-auto border-l border-gray-200 xl:block">
          <RightSidebar />
        </aside>
      )}
    </>
  );
}
