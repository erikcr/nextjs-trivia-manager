"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  RocketLaunchIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import logoBrainyBrawls from "@/public/logos/brainybrawls.svg";

// Supabase
import { PostgrestError, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

// Components
import Notification from "@/components/Notification";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const leftSidebarTabs = [{ name: "Rounds", href: "#", current: true }];
const rightSidebarTabs = [
  { name: "Manual", href: "#", current: true },
  { name: "TriviaAI", href: "#", current: false },
];

export default function EventResponsesPage() {
  const { eventId } = useParams();
  const router = useRouter();

  const supabase = createClient();

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

  // Modal
  const [endConfirmShow, setEndConfirmShow] = useState(false);
  const cancelButtonRef = useRef(null);

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

  const getQuestions = async () => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .select()
      .order("id")
      .eq("round_id", activeRound?.id)
      .eq("owner", user?.id);

    if (data) {
      setQuestions(data);
      setActiveQuestion(data[data.length - 1]);

      const firstPending = data.find((item) => item.status === "PENDING");
      if (firstPending) {
        setActiveQuestion(firstPending);
      }
      if (!firstPending) {
        const firstOngoing = data.find((item) => item.status === "ONGOING");
        setActiveQuestion(firstOngoing);
      }
      setQLoading(false);
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

  const endEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .update({ status: "COMPLETE" })
      .eq("id", event?.id)
      .eq("owner", user?.id)
      .select();

    if (data) {
      setEvent(data[0]);
      router.push(`/dashboard/${event?.id}/complete`);
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
      if (data[0].status === "PENDING") {
        router.push(`/dashboard/${data[0].id}/editor`);
      } else if (data[0].status === "COMPLETE") {
        router.push(`/dashboard/${data[0].id}/complete`);
      } else {
        setEvent(data[0]);
        setELoading(false);
      }
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
       * Top header
       */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200">
        <TopHeader event={event} setEndConfirmShow={setEndConfirmShow} />
      </div>

      {/**
       * Left-side column
       */}
      <aside className="fixed left-0 top-16 h-16 right-0 xl:w-16 xl:h-full xl:w-80 overflow-y-auto border-r border-gray-200 xl:block">
        <LeftSidebar
          rounds={rounds}
          activeRound={activeRound}
          setActiveRound={setActiveRound}
          getRounds={getRounds}
        />
      </aside>

      {/**
       * Main content
       */}
      <main className="fixed pt-32 sm:w-2/3 xl:pt-16 xl:left-80 xl:right-96 xl:w-auto">
        <MainContent
          questions={questions}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
        />
      </main>

      {/**
       * Right-side column
       */}
      <aside className="fixed bottom-0 right-0 top-16 w-1/3 xl:w-96 overflow-y-auto border-l border-gray-200 xl:block">
        <RightSidebar
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          getQuestions={getQuestions}
          responses={responses}
          getResponses={getResponses}
        />
      </aside>

      {/**
       * End event confirm modal
       */}
      <Transition.Root show={endConfirmShow} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setEndConfirmShow}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Confirm event end
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Once you confirm the event is over, the teams will
                          still be able to see their answers and score but will
                          no longer be able to add or edit.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => endEvent()}
                    >
                      Complete event
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setEndConfirmShow(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

function TopHeader({
  event,
  setEndConfirmShow,
}: {
  event: Tables<"v001_events_stag"> | undefined;
  setEndConfirmShow: Function;
}) {
  const pathname = usePathname();

  // Navigation
  const navigation = [
    { name: "Responses", href: `/dashboard/${event?.id}/responses` },
    // { name: "Teams", href: `/dashboard/${event?.id}/teams` },
    // {
    //   name: "Settings",
    //   href: `/dashboard/${event?.id}/settings`,
    // },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto px-4">
        <nav
          className="mx-auto flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="/manage/events" className="-m-1.5 p-1.5">
              <span className="sr-only">Next.js Trivia Manager</span>
              <Image
                src={logoBrainyBrawls}
                alt="Next.js Trivia Manager"
                className="h-8 w-8"
                unoptimized
              />
            </a>

            {/* <p>{event?.name}</p> */}
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname === item.href ? "text-primary" : "",
                  "text-sm font-semibold leading-6 text-gray-900"
                )}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {event !== undefined && (
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
            )}

            <button
              type="button"
              disabled={event === undefined}
              className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-900 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setEndConfirmShow(true)}
            >
              END EVENT
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

function LeftSidebar({
  rounds,
  activeRound,
  setActiveRound,
  getRounds,
}: {
  rounds: Tables<"v001_rounds_stag">[] | undefined;
  activeRound: Tables<"v001_rounds_stag"> | undefined;
  setActiveRound: Function;
  getRounds: Function;
}) {
  const supabase = createClient();

  const updateRoundOngoing = async () => {
    console.log(activeRound?.id)
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .update({ status: "ONGOING" })
      .eq("id", activeRound?.id)
      .select();

    if (data) {
      getRounds();
    } else if (error) {
      console.log(error);
    }
  };

  const activateNextRound = async () => {
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .update({ status: "COMPLETE" })
      .eq("id", activeRound?.id)
      .select();

    if (data) {
      getRounds();
    } else if (error) {
      console.log(error);
    }
  };

  return (
    <div className="hidden sm:block">
      <div className="border-b border-gray-300">
        <nav className="-mb-px flex justify-end space-x-4 px-4 sm:px-6">
          {activeRound?.status === "COMPLETE" ? (
            <p className="hover:text-primary py-4 px-1 text-sm font-medium">
              Round closed
            </p>
          ) : activeRound?.status === "ONGOING" ? (
            <button
              className="py-4 px-1 text-sm font-medium"
              onClick={activateNextRound}
            >
              Close round
            </button>
          ) : (
            <button
              className="py-4 px-1 text-sm font-medium"
              onClick={updateRoundOngoing}
            >
              Start round
            </button>
          )}
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
                      : "text-gray-700 hover:text-primary hover:bg-gray-100",
                    "group justify-between flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
                  )}
                >
                  {item.name}

                  <span
                    className={classNames(
                      item.status === "ONGOING"
                        ? "bg-green-100"
                        : item.status === "PENDING"
                        ? "bg-blue-100"
                        : "bg-gray-100",
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset"
                    )}
                  >
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function MainContent({
  questions,
  activeQuestion,
  setActiveQuestion,
}: {
  questions: Tables<"v001_questions_stag">[] | undefined;
  activeQuestion: Tables<"v001_questions_stag"> | undefined;
  setActiveQuestion: Function;
}) {
  return (
    <div className="hidden sm:block">
      <ul role="list" className="border-b divide-y divide-gray-200">
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
                    item.status === "ONGOING"
                      ? "bg-green-100"
                      : item.status === "PENDING"
                      ? "bg-blue-100"
                      : "bg-gray-100",
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset"
                  )}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RightSidebar({
  activeQuestion,
  getQuestions,
  responses,
  getResponses,
}: {
  activeQuestion: Tables<"v001_questions_stag"> | undefined;
  setActiveQuestion: Function;
  getQuestions: Function;
  responses: Tables<"v001_responses_stag">[] | undefined;
  getResponses: Function;
}) {
  const supabase = createClient();

  const updateQuestionOngoing = async () => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .update({ status: "ONGOING" })
      .eq("id", activeQuestion?.id)
      .select();

    if (data) {
      getQuestions();
    } else if (error) {
      console.log(error);
    }
  };

  const activateNextQuestion = async () => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .update({ status: "COMPLETE" })
      .eq("id", activeQuestion?.id)
      .select();

    if (data) {
      getQuestions();
    } else if (error) {
      console.log(error);
    }
  };

  if (!activeQuestion) {
    return (
      <div>
        <nav className="-mb-px flex justify-center pt-8 space-x-4 px-4 sm:px-6">
          <p>Select a question.</p>
        </nav>
      </div>
    );
  }

  return (
    <div className="hidden sm:block">
      <div className="border-b border-gray-300">
        <nav className="-mb-px flex justify-end space-x-4 px-4 sm:px-6">
          {activeQuestion?.status === "COMPLETE" ? (
            <p className="hover:text-primary py-4 px-1 text-sm font-medium">
              Submissions closed
            </p>
          ) : activeQuestion?.status === "ONGOING" ? (
            <button
              className="py-4 px-1 text-sm font-medium"
              onClick={activateNextQuestion}
            >
              Close question
            </button>
          ) : (
            <button
              className="py-4 px-1 text-sm font-medium"
              onClick={updateQuestionOngoing}
            >
              Activate question
            </button>
          )}
        </nav>
      </div>

      <div className="h-full overflow-y-auto" aria-label="Responses">
        <div className="relative">
          <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-100 px-6 py-1.5 text-sm font-semibold leading-6 text-gray-900">
            <h3>Pending</h3>
          </div>

          <ul role="list" className="divide-y divide-gray-100 px-6">
            {responses
              ?.filter((item) => item.is_correct === null)
              .map((item) => (
                <ResponseItem
                  key={item.id}
                  item={item}
                  getResponses={getResponses}
                />
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
                <ResponseItem
                  key={item.id}
                  item={item}
                  getResponses={getResponses}
                />
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
                <ResponseItem
                  key={item.id}
                  item={item}
                  getResponses={getResponses}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ResponseItem({
  item,
  getResponses,
}: {
  item: Tables<"v001_responses_stag">;
  getResponses: Function;
}) {
  const supabase = createClient();

  const approveResponse = async (responseId: number, isCorrect: boolean) => {
    const { data, error } = await supabase
      .from("v001_responses_stag")
      .update({ is_correct: isCorrect })
      .eq("id", responseId);

    if (!error) {
      getResponses();
    }
  };

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2 sm:flex-nowrap">
      <div>
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {item.submitted_answer}
        </p>
        {/* <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p>{item.v001_teams_stag.name}</p>
        </div> */}
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
}
