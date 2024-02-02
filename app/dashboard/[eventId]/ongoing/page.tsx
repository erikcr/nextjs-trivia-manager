"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import logoBrainyBrawls from "@/public/logos/brainybrawls.svg";

// Supabase
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

// Components
import Notification from "@/components/Notification";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventOngoingPage() {
  const { eventId } = useParams();

  const router = useRouter();

  const supabase = createClient();

  /**
   * State params
   */

  // User
  const [user, setUser] = useState<User | null>(null);

  // Event
  const [event, setEvent] = useState<Tables<"v001_events_stag">>();

  // Rounds
  const [rounds, setRounds] = useState<Tables<"v001_rounds_stag">[]>();
  const [activeRound, setActiveRound] = useState<Tables<"v001_rounds_stag">>();

  // Questions
  const [questions, setQuestions] = useState<Tables<"v001_questions_stag">[]>();
  const [activeQuestion, setActiveQuestion] =
    useState<Tables<"v001_questions_stag">>();
  const [nextQuestion, setNextQuestion] =
    useState<Tables<"v001_questions_stag">>();

  // Responses
  const [responses, setResponses] = useState<Tables<"v001_responses_stag">[]>();

  // Header button status
  const [topHeaderButton, setTopHeaderButton] = useState("");

  /**
   * Action functions
   */

  // Responses functions
  const getResponses = async () => {
    const { data, error } = await supabase
      .from("v001_responses_stag")
      .select("*, v001_teams_stag( name )")
      .eq("question_id", activeQuestion?.id);

    if (data) {
      setResponses(data);
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

  useEffect(() => {
    if (activeQuestion) {
      getResponses();
    }
  }, [activeQuestion]);

  // Questions functions
  const updateQuestionOngoing = async () => {
    if (activeRound?.status === "PENDING") {
      startRound();
    }

    const { data, error } = await supabase
      .from("v001_questions_stag")
      .update({ status: "ONGOING" })
      .eq("id", nextQuestion?.id);

    if (error) {
      console.log(error);
    }
  };

  /**
   * TODO
   * There is a bug that doesn't allow the event to end if a round doesn't have any questions
   * Best option is probably to not allow an event to start if a round has 0 questions
   */
  const getQuestions = async () => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .select()
      .order("id")
      .eq("round_id", activeRound?.id)
      .eq("owner", user?.id);

    if (data) {
      setQuestions(data);

      const activeQuestion = data.findLast((item) => item.status === "ONGOING");
      if (activeQuestion) {
        setActiveQuestion(activeQuestion);
      }

      const nextQuestion = data.find((item) => item.status === "PENDING");
      const ongoingQuestions = data.find((item) => item.status === "ONGOING");
      if (nextQuestion) {
        setNextQuestion(nextQuestion);
        setTopHeaderButton("ACTIVATE_NEXT_QUESTION");
      } else if (ongoingQuestions) {
        setTopHeaderButton("CLOSE_ROUND");
      } else {
        const roundsComplete = rounds?.every(
          (item) => item.status === "COMPLETE"
        );

        if (roundsComplete && event?.status !== "COMPLETE") {
          setTopHeaderButton("END_EVENT");
        } else {
          setTopHeaderButton("");
        }
      }
    }
  };

  useEffect(() => {
    if (rounds) {
      getQuestions();
    }

    supabase
      .channel("active-round-question-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "v001_questions_stag",
          filter: `round_id=eq.${activeRound?.id}`,
        },
        () => {
          getQuestions();
        }
      )
      .subscribe();
  }, [activeRound]);

  // Rounds functions
  const startRound = async () => {
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .update({ status: "ONGOING" })
      .eq("id", activeRound?.id);
  };

  const closeRound = async () => {
    questions?.map(async (item) => {
      const { data, error } = await supabase
        .from("v001_questions_stag")
        .update({ status: "COMPLETE" })
        .eq("id", item.id);
    });

    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .update({ status: "COMPLETE" })
      .eq("id", activeRound?.id);

    const nextRound = rounds?.find(i => i.status === "PENDING")
    setActiveRound(nextRound);
  };

  const getRounds = async () => {
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .select()
      .eq("event_id", event?.id)
      .eq("owner", user?.id)
      .order("id");

    if (data) {
      setActiveRound(data[0]);
      setRounds(data);
    }
  };

  useEffect(() => {
    if (event) {
      getRounds();

      supabase
        .channel("active-round-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "v001_rounds_stag",
            filter: `id=eq.${activeRound?.id}`,
          },
          () => {
            getRounds();
          }
        )
        .subscribe();
    }
  }, [event]);

  // Event functions
  const endEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .update({ status: "COMPLETE" })
      .eq("id", eventId);

    setTopHeaderButton("");
    
    router.push(`/dashbaord/${event?.id}/final`)
  };

  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("id", eventId)
      .eq("owner", user?.id);

    if (data) {
      setEvent(data[0]);
    }
  };

  useEffect(() => {
    if (user) {
      getEvent();
    }
  }, [user]);

  // User functions
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) {
      setUser(data.user);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
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
    </>
  );

  function TopHeader() {
    return (
      <div className="w-full">
        <div className="mx-auto px-4">
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

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <button
                type="button"
                disabled={event === undefined}
                className="inline-flex items-center gap-x-1.5 px-2.5 py-1.5 text-sm text-gray-900 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={
                  topHeaderButton === "ACTIVATE_NEXT_QUESTION"
                    ? updateQuestionOngoing
                    : topHeaderButton === "CLOSE_ROUND"
                    ? closeRound
                    : endEvent
                }
              >
                {topHeaderButton.replaceAll("_", " ")}
              </button>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  function SecondaryHeader() {
    return (
      <div className="pl-4">
        <nav className="flex space-x-4" aria-label="Tabs">
          {!rounds && (
            <div className="animate-pulse flex space-x-3">
              <div className="rounded-md bg-slate-200 h-10 w-32"></div>
              <div className="rounded-md bg-slate-200 h-10 w-24"></div>
              <div className="rounded-md bg-slate-200 h-10 w-40"></div>
            </div>
          )}
          {rounds?.map((item) => (
            <button
              key={item.name}
              className={classNames(
                item.id === Number(activeRound?.id)
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={item.id === Number(activeRound?.id) ? "page" : undefined}
              onClick={() => setActiveRound(item)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  function MainContent() {
    return (
      <div className="hidden sm:block">
        <ul role="list" className="border-b divide-y divide-gray-200">
          {/** TODO:
           * Add skeleton placeholders for questions list
           */}
          {questions?.map((item) => (
            <li
              key={item.id}
              className={classNames(
                activeQuestion?.id === item.id ? "bg-gray-100" : "",
                item.status !== "PENDING" ? "hover:bg-gray-100" : "",
                "relative flex justify-between gap-x-6 px-4 py-2 sm:px-6"
              )}
              onClick={
                item.status !== "PENDING"
                  ? () => setActiveQuestion(item)
                  : () => {}
              }
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    Answer: {item.answer}
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    Question: {item.question}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
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
                <ChevronRightIcon
                  className={classNames(
                    activeQuestion?.id === item.id
                      ? "text-gray-600"
                      : "text-gray-100",
                    "h-4 w-4"
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function RightSidebar() {
    if (!activeQuestion) {
      return (
        <div>
          <nav className="-mb-px flex justify-center pt-8 space-x-4 px-4 sm:px-6">
            <p>Select a question.</p>
          </nav>
        </div>
      );
    }

    if (!responses?.length) {
      return (
        <div>
          <nav className="-mb-px flex justify-center pt-8 space-x-4 px-4 sm:px-6">
            <p>Waiting for responses.</p>
          </nav>
        </div>
      );
    }

    return (
      <ul role="list" className="divide-y divide-gray-100 px-6">
        {responses?.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2 sm:flex-nowrap"
          >
            <div>
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {item.submitted_answer}
              </p>
            </div>
            <dl className="flex w-full flex-none items-center justify-between px-4 py-4 sm:w-auto">
              <div
                className={classNames(
                  activeRound?.status !== "COMPLETE"
                    ? "flex w-16 gap-x-2.5"
                    : "hidden bg-red-300"
                )}
              >
                <dt>
                  <CheckCircleIcon
                    className={classNames(
                      item.is_correct === true ? "text-green-600" : "",
                      "h-6 w-6 text-gray-600 hover:text-green-600"
                    )}
                    aria-hidden="true"
                    onClick={() => approveResponse(item.id, true)}
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">
                  <XCircleIcon
                    className={classNames(
                      item.is_correct === false ? "text-red-600" : "",
                      "h-6 w-6 text-gray-600 hover:text-red-600"
                    )}
                    aria-hidden="true"
                    onClick={() => approveResponse(item.id, false)}
                  />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    );
  }
}
