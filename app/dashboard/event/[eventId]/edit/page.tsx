"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import { Tables } from "@/types/database.types";

export default function EditEventPage() {
  const router = useRouter();
  const { eventId } = useParams();
  const supabase = createClient();

  const [event, setEvent] = useState<Tables<"v001_events_stag"> | undefined>(
    undefined
  );

  const onSubmit = async (action?: string) => {
    if (action === "SAVE") {
      console.log("Save event");
    }

    router.push(`/dashboard/event/${eventId}`);
  };

  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .eq("id", eventId);

    if (data) {
      setEvent(data[0]);
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
            Edit
          </h1>

          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 mr-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
              onClick={() => onSubmit()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-green-200 focus:z-10"
              onClick={() => onSubmit("SAVE")}
            >
              Save
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Your content */}
          <div>
            <div className="border-t border-gray-100">
              <dl className="divide-y divide-gray-200">
                {/** Name */}
                <div className="px-4 pb-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {event?.name || "Loading..."}
                  </dd>
                </div>
                {/** Description */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {event?.description}
                  </dd>
                </div>
                {/** Date of event */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Date
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {event?.date_of_event}
                  </dd>
                </div>
                {/** Location */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {event?.location}
                  </dd>
                </div>
                {/** Venue */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Venue
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {event?.venue}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
