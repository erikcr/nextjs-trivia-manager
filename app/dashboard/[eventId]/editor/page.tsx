"use client";

import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  RocketLaunchIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useChat } from "ai/react";

import logoBrainyBrawls from "@/public/logos/brainybrawls.svg";

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

type TriviaItem = {
  question: string;
  answer: string;
};

export default function EditorByIdPage() {
  const { eventId } = useParams();
  const searchParams = useSearchParams();
  const roundFromUrl = searchParams.get("round");

  const router = useRouter();

  const supabase = createClient();

  // Mobile responsiveness
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(undefined);

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
  const [questionToEdit, setQuestionToEdit] =
    useState<Tables<"v001_questions_stag">>();
  const [qError, setQError] = useState<PostgrestError>();
  const questionToEditFormRef = useRef<HTMLFormElement | undefined>();

  // Notification
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifType, setNotifType] = useState("");

  // Modal
  const [startConfirmShow, setStartConfirmShow] = useState(false);
  const cancelButtonRef = useRef(null);

  const getQuestions = async () => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .select()
      .order("id")
      .eq("round_id", activeRound?.id)
      .eq("owner", user?.id);

    if (data) {
      setQuestions(data);
      setQLoading(false);
    }
  };

  const getRounds = async () => {
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .select()
      .order("order_num")
      .eq("event_id", eventId)
      .eq("owner", user?.id);

    if (data) {
      setRounds(data);

      const round = data.find((i) => i.id === Number(roundFromUrl));
      if (round) {
        setActiveRound(round);
      } else {
        setActiveRound(data[0]);
      }
      setRLoading(false);

      if (!data.length) {
        setQLoading(false);
      }
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
      router.push(`/dashboard/${event?.id}/responses`);
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
      if (data[0].status === "ONGOING") {
        router.push(`/dashboard/${data[0].id}/responses`);
      } else if (data[0].status === "COMPLETE") {
        router.push(`/dashboard/${data[0].id}/complete`);
      } else {
        setEvent(data[0]);
        setELoading(false);
      }
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
      {notifShow && (
        <Notification
          title={notifTitle}
          type={notifType}
          show={notifShow}
          setShow={setNotifShow}
        />
      )}

      {/**
       * Top header
       */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-400">
        <TopHeader />
      </div>

      {/**
       * Secondary header
       */}
      <div className="fixed top-16 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-400">
        <SecondaryHeader />
      </div>

      {/**
       * Main content
       */}
      <main className="fixed top-32 bottom-0 left-0 w-2/3 border-r border-gray-400">
        <MainContent />
      </main>

      {/**
       * Right-side column
       */}
      <aside className="fixed top-32 bottom-0 right-0 w-1/3">
        <RightSidebar />
      </aside>

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
       * Start event confirm modal
       */}
      <Transition.Root show={startConfirmShow} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={cancelButtonRef}
          onClose={setStartConfirmShow}
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
                        Confirm event start
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Make sure all of your event settings and details are
                          correct. You will not be able to make any edits once
                          you start the event.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
                      onClick={() => startEvent()}
                    >
                      Let&apos;s go
                      <RocketLaunchIcon className="h-5 w-5 pl-1 mr-2" />
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setStartConfirmShow(false)}
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

  function TopHeader() {
    return (
      <div className="w-full">
        <nav
          className="mx-auto flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="/manage/events" className="-m-1.5 p-1.5">
              <span className="sr-only">Trivia Management Dashboard</span>
              <Image
                src={logoBrainyBrawls}
                alt="Trivia Management Dashboard"
                className="h-8 w-8"
                unoptimized
              />
            </a>
          </div>

          <div className="flex lg:gap-x-12">
            <p>{event?.name}</p>
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
              onClick={() => {
                setStartConfirmShow(true);
              }}
            >
              START EVENT
              <RocketLaunchIcon
                className="-mr-0.5 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      </div>
    );
  }

  function SecondaryHeader() {
    return (
      <div className="pl-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            type="button"
            className="rounded-md px-8 py-2 mr-2 text-sm font-medium border-2 border-dashed border-gray-300 text-center hover:border-gray-400"
            onClick={() => {
              setRoundSlideoutOpen(true);
            }}
          >
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-400">
              Add round
            </span>
          </button>

          {rounds?.map((item) => (
            <button
              key={item.name}
              className={classNames(
                item.id === activeRound?.id
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={item.id === activeRound?.id ? "page" : undefined}
              onClick={() => {
                setActiveRound(item);
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  function LeftSidebar({
    rounds,
    activeRound,
    setActiveRound,
    setRoundSlideoutOpen,
  }: {
    rounds: Tables<"v001_rounds_stag">[] | undefined;
    activeRound: Tables<"v001_rounds_stag"> | undefined;
    setActiveRound: Function;
    setRoundSlideoutOpen: Function;
  }) {
    const leftSidebarTabs = [{ name: "Rounds", href: "#", current: true }];

    return (
      <>
        <div className="hidden xl:block">
          <div className="hidden border-b border-gray-300 xl:block">
            <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
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

          <div className="mx-6 my-3 xl:block">
            <div
              className="-mx-2 space-y-1 mb-2"
              onClick={() => {
                setRoundSlideoutOpen(true);
              }}
            >
              <div className="text-gray-900 border-2 border-dashed border-gray-300 hover:border-gray-400 group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <div>Add round</div>
              </div>
            </div>

            <nav
              className="flex flex-1 flex-row md:flex-col"
              aria-label="Sidebar"
            >
              <ul role="list" className="-mx-2 space-y-1">
                {rounds?.map((item) => (
                  <li key={item.id} onClick={() => setActiveRound(item)}>
                    <div
                      // href={item.href}
                      className={classNames(
                        item.id === activeRound?.id
                          ? "bg-gray-200 text-primary"
                          : "text-gray-700 hover:text-primary hover:bg-gray-100",
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

        <div className="flex flex-col h-full bg-green-100 m-auto p-auto xl:hidden">
          <div className="flex overflow-x-scroll hide-scroll-bar">
            <div className="flex flex-nowrap items-center">
              {rounds?.map((item) => (
                <div key={item.id} className="inline-block px-3">
                  <div className="bg-red-100 h-12 max-w-xs overflow-hidden rounded-lg">
                    {item.name}
                  </div>
                </div>
              ))}
              {/* <div className="inline-block px-3">
              <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
            </div>
            <div className="inline-block px-3">
              <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
            </div>
            <div className="inline-block px-3">
              <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
            </div>
            <div className="inline-block px-3">
              <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
            </div>
            <div className="inline-block px-3">
              <div className="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
            </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }

  function MainContent() {
    return (
      <div className="h-full overflow-y px-4 sm:px-6 lg:px-8">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="overflow-auto inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-b divide-y divide-gray-300">
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
                      className="w-2/12 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Answer
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 text-right sm:pr-6 lg:pr-8 text-gray-50"
                    >
                      a
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {qLoading && (
                    <tr className="animate-pulse">
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        <div className="bg-gray-200 group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold" />
                      </td>
                      <td className=" px-3 py-4 text-sm text-gray-500">
                        <div className="bg-gray-200 group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold" />
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8"></td>
                    </tr>
                  )}

                  {!qLoading && !questions?.length && (
                    <tr>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        No questions yet.
                      </td>
                      <td className=" px-3 py-4 text-sm text-gray-500"></td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8"></td>
                    </tr>
                  )}

                  {questions?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        {item.question}
                      </td>
                      <td className=" px-3 py-4 text-sm text-gray-500">
                        {item.answer}
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <button
                          type="button"
                          className="text-primary hover:text-primary-hover"
                          onClick={() => {
                            if (questionToEdit)
                              questionToEditFormRef?.current?.reset();
                            setQuestionToEdit(item);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function RightSidebar() {
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState("Add");
    const [addQuestionLoading, setAddQuestionLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<TriviaItem[]>([]);
    const [aiResponseLoading, setAiResponseLoading] = useState(false);
    const [questionToAdd, setQuestionToAdd] = useState<TriviaItem>();

    const addFormRef = useRef<HTMLFormElement>(null);

    const { messages, input, handleInputChange, handleSubmit } = useChat({
      api: "/api/chat/langchain",
    });

    const rightSidebarTabs = [
      { name: "Edit", isVisible: questionToEdit },
      { name: "Add", isVisible: true },
    ];

    const removeQuestionFromAI = async () => {
      const newAiResponse = aiResponse.slice(1);
      setAiResponse(newAiResponse);
    };

    const addQuestion = async (formData: FormData) => {
      console.log("submit action triggered");
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
        getQuestions();
        setAddQuestionLoading(false);
        addFormRef.current?.reset();
      }
    };

    const updateQuestion = async (formData: FormData) => {
      const { data, error } = await supabase
        .from("v001_questions_stag")
        .update([
          {
            question: formData.get("question"),
            answer: formData.get("answer"),
            points: formData.get("points"),
          },
        ])
        .eq("id", questionToEdit?.id)
        .eq("owner", user?.id)
        .select();

      if (!error) {
        getQuestions();
        setQuestionToEdit(undefined);
      } else {
        console.log(error);
      }
    };

    useEffect(() => {
      if (questionToEdit) {
        setActiveTab("Edit");
      } else {
        setActiveTab("Add");
      }
    }, [questionToEdit]);

    useEffect(() => {
      messages.map((item) => {
        if (item.role === "assistant") {
          let content = JSON.parse(item.content);
          setAiResponse(content.message);
          setAiResponseLoading(false);
        }
      });
    }, [messages]);

    if (!activeRound) {
      return (
        <div>
          <nav className="-mb-px flex justify-center pt-8 space-x-4 px-4 sm:px-6">
            <p>Select a round.</p>
          </nav>
        </div>
      );
    }

    return (
      <div className="hidden sm:block">
        <div className="border-b border-gray-300">
          <nav
            className="-mb-px flex space-x-4 px-4 sm:px-6 justify-end"
            aria-label="Tabs"
          >
            {rightSidebarTabs.map((tab) => (
              <p
                key={tab.name}
                className={classNames(
                  tab.name === activeTab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  tab.isVisible ? "" : "hidden",
                  "whitespace-nowrap border-b py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.name === activeTab ? "page" : undefined}
                onClick={() => {
                  setActiveTab(tab.name);
                }}
              >
                {tab.name}
              </p>
            ))}
          </nav>
        </div>

        {activeTab === "Edit" && (
          <form action={updateQuestion}>
            <div className="space-y-12 px-4 sm:px-6">
              <div className="pb-12">
                {/* Question */}
                <div className="space-y-2 sm:gap-4 sm:space-y-0 sm:py-3">
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 sm:mb-2"
                  >
                    Question <span className="text-red-600">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <textarea
                      required
                      disabled={addQuestionLoading}
                      name="question"
                      id="question"
                      rows={5}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      defaultValue={questionToEdit?.question}
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
                      id="answer"
                      name="answer"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      defaultValue={questionToEdit?.answer}
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
                      type="number"
                      name="points"
                      id="points"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      defaultValue={questionToEdit?.points}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex-shrink-0 py-5">
                  <div className="flex justify-end space-x-3">
                    <button
                      disabled={addQuestionLoading}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setQuestionToEdit(undefined);
                        setActiveTab("Add");
                      }}
                    >
                      <>Cancel</>
                    </button>

                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <>Save</>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {activeTab === "Add" && (
          <div className="space-y-1 px-4 sm:px-6">
            <form action={addQuestion} ref={addFormRef}>
              <div className="pb-">
                {/* Question */}
                <div className="space-y-2 sm:gap-4 sm:space-y-0 sm:py-3">
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5 sm:mb-2"
                  >
                    Question <span className="text-red-600">*</span>
                  </label>
                  <div className="sm:col-span-2">
                    <textarea
                      required
                      disabled={addQuestionLoading}
                      name="question"
                      id="question"
                      rows={5}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      defaultValue={questionToAdd ? questionToAdd.question : ""}
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
                      defaultValue={questionToAdd ? questionToAdd.answer : ""}
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
                      disabled={addQuestionLoading}
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <>Add</>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* <>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Generate ideas with TriviaAI
            </label>
            {aiResponse.length <= 0 ? (
              <form
                onSubmit={(e) => {
                  setAiResponseLoading(true);
                  handleSubmit(e);
                }}
              >
                <div className="mt-2 flex rounded-md shadow-sm">
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                      type="text"
                      name="topic"
                      id="topic"
                      className="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      placeholder="A trivia topic"
                      value={input}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Go
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-2 sm:gap- sm:space-y-0 sm:py-3">
                  <div className="sm:col-span-2">
                    <p className="flex w-full text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6">
                      {aiResponse[0].question}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 sm:gap-4 sm:space-y-0 sm:py-3">
                  <div className="sm:col-span-2">
                    <p className="flex justify-end w-full text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6">
                      {aiResponse[0].answer}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 py-5">
                  <div className="flex justify-end space-x-3">
                    <button
                      disabled={addQuestionLoading}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => removeQuestionFromAI()}
                    >
                      <>Next</>
                    </button>
                    <button
                      className="inline-flex justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => {
                        setQuestionToAdd(aiResponse[0]);
                        removeQuestionFromAI();
                      }}
                    >
                      <>Edit</>
                    </button>
                  </div>
                </div>
              </>
            )}
          </> */}
          </div>
        )}
      </div>
    );
  }
}
