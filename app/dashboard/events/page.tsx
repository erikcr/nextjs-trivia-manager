"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { createClient } from "@/utils/supabase/client";

import { Tables } from "@/types/database.types";

export default function EventsPage() {
  // const cookieStore = cookies();
  const supabase = createClient();

  const [allEvents, setAllEvents] = useState<
    Tables<"v001_events_stag">[] | null
  >([]);

  const getAllEvents = async () => {
    const { data, error } = await supabase.from("v001_events_stag").select();

    if (data) {
      setAllEvents(data);
    }
  };

  useEffect(() => {
    const getSess = async () => {
      console.log(await supabase.auth.getSession());
    };
    getSess();
    getAllEvents();
  }, []);

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Events
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Your content */}
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
          >
            {allEvents?.map((item) => (
              <Link href={`/dashboard/event/${item.id}`}>
                <li
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      {item.name}
                    </div>
                    <ChevronRightIcon
                      className="h-5 w-5 relative ml-auto text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Location</dt>
                      <dd className="text-gray-700">{item.location}</dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Venue</dt>
                      <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">
                          {item.venue}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
