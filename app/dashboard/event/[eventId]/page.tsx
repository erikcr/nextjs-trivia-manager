"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/20/solid";

import { createClient } from "@/utils/supabase/client";

import { Tables } from "@/types/database.types";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventPage() {
  const { eventId } = useParams();
  const supabase = createClient();

  const [event, setEvent] = useState<Tables<"v001_events_stag"> | undefined>(
    undefined
  );
  const [rounds, setRounds] = useState<
    Tables<"v001_rounds_stag">[] | undefined
  >([]);
  const [questions, setQuestions] = useState<
    Tables<"v001_questions_stag">[] | undefined
  >([]);

  const getQuestions = async (roundId: number) => {
    const { data, error } = await supabase
      .from("v001_questions_stag")
      .select()
      .eq("round_id", roundId);

    if (data) {
      setQuestions(data);
    }
  };

  const getRounds = async () => {
    const { data, error } = await supabase
      .from("v001_rounds_stag")
      .select()
      .order("order_num")
      .eq("event_id", Number(eventId));

    if (data) {
      setRounds(data);
    }
  };

  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("id", eventId);

    if (data) {
      setEvent(data[0]);
      getRounds();
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <>
      <header className="bg-white shadow">
        <div className="flex justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {event?.name}
          </h1>

          <div className="inline-flex rounded-md shadow-sm">
            <Link href={`/dashboard/event/${eventId}/edit`}>
              <button
                type="button"
                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              >
                Edit
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Your content */}
          {/* 3 column wrapper */}
          <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
            {/* Left sidebar & main wrapper */}
            <div className="flex-1 xl:flex">
              <div className="border-b bg-red-200 border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
                {/* Left column area */}
                Rounds
                {rounds?.map((item) => (
                  <p
                    onClick={() => {
                      getQuestions(item.id);
                    }}
                  >
                    {item.name}
                  </p>
                ))}
              </div>

              <div className="px-4 bg-green-200 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                {/* Main area */}
                Questions
                {questions?.map((item) => (
                  <div>
                    <p>{item.question}</p>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
