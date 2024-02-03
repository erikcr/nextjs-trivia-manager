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
import {
  Tables,
  TeamsWithResponses,
  TeamWithResponses,
  ResponeWithQuestions,
} from "@/types/database.types";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventFinalPage() {
  const { eventId } = useParams();
  const supabase = createClient();

  /**
   * State params
   */

  // User
  const [user, setUser] = useState<User | null>(null);

  // Event
  const [event, setEvent] = useState<Tables<"v002_events_stag">>();

  // Teams
  const [teams, setTeams] = useState<TeamsWithResponses>();
  const [activeTeam, setActiveTeam] = useState<TeamWithResponses>();

  // Responses functions
  const getTeamScore = (teamResponses: ResponeWithQuestions) => {
    let score = 0;
    teamResponses.map((i) => {
      if (i.is_correct) {
        /** TODO
         * Fix the database.types.ts definition for questions table
         */
        // @ts-ignore
        score += i.v002_questions_stag.points;
      }
    });
    return score;
  };

  // Teams functions
  const getTeams = async () => {
    const { data, error } = await supabase
      .from("v002_teams_stag")
      .select("*, v002_responses_stag ( *, v002_questions_stag ( points ) )")
      .eq("event_id", eventId);

    if (data) {
      setTeams(data);
    }
  };

  useEffect(() => {
    if (event) {
      getTeams();
    }
  }, [event]);

  // Event functions
  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v002_events_stag")
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
      {/* <div className="fixed top-16 left-0 right-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-400">
        <SecondaryHeader />
      </div> */}

      {/**
       * Main content
       */}
      <main className="fixed top-16 bottom-0 left-0 w-2/3 border-r border-gray-400">
        <MainContent />
      </main>

      {/**
       * Right-side column
       */}
      <aside className="fixed top-16 bottom-0 right-0 w-1/3">
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

            <div className="hidden lg:flex lg:flex-1 lg:justify-end"></div>
          </nav>
        </div>
      </div>
    );
  }

  function MainContent() {
    return (
      <div className="hidden sm:block">
        <ul role="list" className="border-b divide-y divide-gray-200">
          {teams?.map((item) => (
            <li
              key={item.id}
              className={classNames(
                activeTeam?.id === item.id ? "bg-gray-100" : "",
                "relative flex justify-between gap-x-6 px-4 py-2 sm:px-6 hover:bg-gray-100"
              )}
              onClick={() => setActiveTeam(item)}
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                  <span>Score: {getTeamScore(item.v002_responses_stag)}</span>
                </div>
                <ChevronRightIcon
                  className={classNames(
                    activeTeam?.id === item.id
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
    if (!activeTeam) {
      return (
        <div>
          <nav className="-mb-px flex justify-center pt-8 space-x-4 px-4 sm:px-6">
            <p>Select a team.</p>
          </nav>
        </div>
      );
    }

    return (
      <ul role="list" className="divide-y divide-gray-100 px-6">
        {activeTeam?.v002_responses_stag?.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2 sm:flex-nowrap"
          >
            <div>
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {item.submitted_answer}
              </p>
            </div>
            <dl className="flex w-full flex-none items-center justify-between px-4 sm:w-auto">
              <div className="flex w-16 gap-x-1">
                <dt>
                  {item.is_correct == true ? (
                    <CheckCircleIcon
                      className={classNames(
                        item.is_correct === true ? "" : "",
                        "h-6 w-6 text-green-600"
                      )}
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircleIcon
                      className={classNames(
                        item.is_correct === false ? "text-red-600" : "",
                        "h-6 w-6 text-gray-600"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </dt>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    );
  }
}
