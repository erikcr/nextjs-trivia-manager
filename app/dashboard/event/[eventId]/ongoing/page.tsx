"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  HomeIcon,
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
import RoundSlideout from "@/components/RoundSlideout";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const leftSidebarTabs = [
  { name: "Rounds", href: "#", current: true },
  { name: "Teams", href: "#", current: false },
];
const rightSidebarTabs = [{ name: "Responses", href: "#", current: true }];

export default function EventEditorPage() {
  const { eventId } = useParams();
  const supabase = createClient();

  // User
  const [user, setUser] = useState<User | null>(null);

  // Event
  const [event, setEvent] = useState<Tables<"v001_events_stag">>();
  const [eLoading, setELoading] = useState(true);
  const [eError, setEError] = useState<PostgrestError>();

  // Teams
  const [teams, setTeams] = useState<Tables<"v001_teams_stag">[]>();
  const [tLoading, setTLoading] = useState(true);

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

  const getResponses = async (defaultQuestionId?: string) => {
    const questionId = activeQuestion ? activeQuestion.id : defaultQuestionId;
    console.log(questionId);
    const { data, error } = await supabase
      .from("v001_responses_stag")
      .select()
      .order("inserted_at")
      .eq("question_id", questionId);

    if (data) {
      setResponses(data);
      setRpLoading(false);
    }
  };

  const approveRespose = async (responseId: number, isCorrect: boolean) => {
    const { error } = await supabase
      .from("v001_responses_stag")
      .update({ is_correct: isCorrect })
      .eq("id", 1);

    console.log(error);
    // console.log(responseId);
    // const { data, error } = await supabase
    //   .from("v001_responses_stag")
    //   .update({ is_correct: isCorrect })
    //   .eq("id", responseId)
    //   .select();

    // console.log(data);
    // console.log(error);

    // getResponses();
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
      console.log(data[0].id);
      getResponses(data[0].id);
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

  const getTeams = async () => {
    const { data, error } = await supabase
      .from("v001_teams_stag")
      .select()
      .eq("event_id", eventId);

    if (data) {
      setTeams(data);
      setTLoading(false);
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
      console.log(error);
    }
  };

  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("owner", user?.id);

    if (data) {
      setEvent(data[0]);
      setELoading(false);
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
      getTeams();
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

  const TopHeader = () => {
    return (
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <div>
                  <a
                    href="/dashboard/events"
                    className="text-gray-900 hover:text-gray-500"
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
                    className="h-5 w-5 flex-shrink-0 text-gray-900"
                    aria-hidden="true"
                  />
                  <a
                    href={`/dashboard/event/${eventId}`}
                    className="ml-4 text-sm font-medium text-gray-900 hover:text-gray-700"
                    aria-current="page"
                  >
                    {event ? event.name : "Event"}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center">
          <span
            className={classNames(
              event?.status === "PENDING"
                ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                : event?.status === "ONGOING"
                ? "bg-green-50 text-green-700 ring-green-700/10"
                : event?.status === "COMPLETE"
                ? "bg-gray-50 text-gray-700 ring-gray-700/10"
                : "",
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
            )}
          >
            {event?.status}
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-900 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            START EVENT
            <RocketLaunchIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
          </button>
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
                <li key={item.name} onClick={() => setActiveRound(item)}>
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
                    <span
                      className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                      aria-hidden="true"
                    >
                      0
                    </span>
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
                          onClick={() => setQuestionSlideout(true)}
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
  };

  const RightSidebar = () => {
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

        <ul role="list" className="divide-y divide-gray-100 px-6">
          {responses?.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-x-6 py-2"
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {item.submitted_answer}
                  </p>
                  <p
                    className={classNames(
                      item.is_correct === null
                        ? "bg-blue-50 text-blue-700 ring-blue-green/10"
                        : item.is_correct === true
                        ? "bg-green-50 text-green-700 ring-blue-green/10"
                        : "bg-red-50 text-red-700 ring-blue-red/10",
                      "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {item.is_correct === null
                      ? "Pending"
                      : item.is_correct === true
                      ? "Correct"
                      : "Incorrect"}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p className="whitespace-nowrap">
                    {teams?.find((team) => team.id === item.team_id)?.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-700"
                  onClick={() => {
                    approveRespose(item?.id, true);
                  }}
                />
                <XCircleIcon
                  className="h-5 w-5 text-red-700"
                  onClick={() => {
                    approveRespose(item?.id, false);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
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
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        <TopHeader />
      </div>

      {/**
       * Left-side column
       */}
      {showLeftSidebar ? (
        <aside className="fixed bottom-0 left-16 top-16 hidden w-80 overflow-y-auto border-r border-gray-200 xl:block">
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
          "fixed pt-16 right-1/3",
          showLeftSidebar ? "left-96" : "left-32",
          showRightSidebar ? "right-1/2" : "right-0"
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
