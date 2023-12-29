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

export default function EventOngoingPage() {
  const { eventId, roundId } = useParams();
  const router = useRouter();

  const supabase = createClient();

  // User
  const [user, setUser] = useState<User | null>(null);

  // Event
  const [event, setEvent] = useState<Tables<"v001_events_stag">>();

  // Questions
  const [questions, setQuestions] = useState<Tables<"v001_questions_stag">[]>();

  // Modal
  const [endConfirmShow, setEndConfirmShow] = useState(false);
  const cancelButtonRef = useRef(null);

  const getQuestions = async () => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .select()
      .order("id")
      .eq("round_id", roundId)
      .eq("owner", user?.id);

    if (data) {
      setQuestions(data);
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

      getQuestions();
    }
  };

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) {
      setUser(data.user);
    }
  };

  useEffect(() => {
    if (user) {
      getEvent();
    }
  }, [user]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {/**
       * Top header
       */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-400">
        <TopHeader event={event} setEndConfirmShow={setEndConfirmShow} />
      </div>

      {/**
       * Main content
       */}
      <main className="fixed top-16 bottom-0 left-0 w-2/3 border-r border-gray-400">
        <MainContent
          questions={questions}
          // activeQuestion={activeQuestion}
          // setActiveQuestion={setActiveQuestion}
        />
      </main>
    </>
  );

  function TopHeader({
    event,
    setEndConfirmShow,
  }: {
    event: Tables<"v001_events_stag"> | undefined;
    setEndConfirmShow: Function;
  }) {
    const pathname = usePathname();

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

  function MainContent({
    questions,
  }: // activeQuestion,
  // setActiveQuestion,
  {
    questions: Tables<"v001_questions_stag">[] | undefined;
    // activeQuestion: Tables<"v001_questions_stag"> | undefined;
    // setActiveQuestion: Function;
  }) {
    return (
      <div className="hidden sm:block">
        <ul role="list" className="border-b divide-y divide-gray-200">
          {questions?.map((item) => (
            <li
              key={item.id}
              className={classNames(
              //   activeQuestion?.id === item.id ? "bg-gray-100" : "",
                "relative flex justify-between gap-x-6 px-4 py-2 hover:bg-gray-100 sm:px-6"
              )}
              // onClick={() => setActiveQuestion(item)}
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
}
