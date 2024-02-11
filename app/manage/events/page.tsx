"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseISO, format } from "date-fns";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Supabase
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

// Components
import Notification from "@/components/Notification";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventsPage() {
  const router = useRouter();

  const supabase = createClient();

  // User
  const [user, setUser] = useState<User | null>(null);

  // Notifications
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifType, setNotifType] = useState("");

  // Events
  const [eLoading, setELoading] = useState(true);
  const [eventSlideout, setEventSlideout] = useState(false);
  const [addEventLoading, setAddEventLoading] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Tables<"v002_events_stag">>();
  const [eventToDelete, setEventToDelete] =
    useState<Tables<"v002_events_stag">>();

  // Modal
  const [deleteEventConfirmShow, setDeleteEventConfirmShow] = useState(false);
  const cancelButtonRef = useRef(null);

  const [allEvents, setAllEvents] = useState<
    Tables<"v002_events_stag">[] | null
  >([]);

  const getAllEvents = async (userId?: string) => {
    const { data, error } = await supabase
      .from("v002_events_stag")
      .select()
      .eq("owner", userId ? userId : user?.id)
      .order("date_of_event");

    if (data) {
      setAllEvents(data);
      setELoading(false);
    }
  };

  const deleteEvent = async () => {
    const { data, error } = await supabase
      .from("v002_events_stag")
      .delete()
      .eq("id", eventToDelete?.id);

    if (!error) {
      getAllEvents();
      setDeleteEventConfirmShow(false);
    } else if (error) {
      console.log(error);
    }
  };

  const addEvent = async (formData: FormData) => {
    const { data, error } = await supabase
      .from("v002_events_stag")
      .insert([
        {
          name: formData.get("event-name"),
          date_of_event: formData.get("event-date"),
          description: formData.get("event-description"),
          location: formData.get("event-location"),
          venue: formData.get("event-venue"),
          owner: user?.id,
        },
      ])
      .select();

    if (!error) {
      setNotifTitle("Event created");
      setNotifType("success");
      setNotifShow(true);
      setEventSlideout(false);
      setAddEventLoading(false);

      router.push(`/dashboard/${data[0].id}/editor`);
    } else {
      console.log(error);
    }
  };

  const updateEvent = async (formData: FormData) => {
    const { data, error } = await supabase
      .from("v002_events_stag")
      .update([
        {
          name: formData.get("event-name"),
          date_of_event: formData.get("event-date"),
          description: formData.get("event-description"),
          location: formData.get("event-location"),
          venue: formData.get("event-venue"),
        },
      ])
      .eq("id", eventToEdit?.id)
      .select();

    if (!error) {
      setNotifTitle("Event updated");
      setNotifType("success");
      setNotifShow(true);
      setEventSlideout(false);
      setAddEventLoading(false);

      getAllEvents();
      setEventToEdit(undefined);
    } else {
      console.log(error);
    }
  };

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) {
      getAllEvents(data.user?.id);
      setUser(data.user);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getEventDate = (dateOfEvent: string) => {
    const date = dateOfEvent.split("T")[0];
    // const month = Date.parse(date).

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date;
  };

  const getMinEventDate = () => {
    const dtToday = new Date();

    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let yearStr = dtToday.getFullYear().toString();

    let monthStr,
      dayStr = "";

    if (month < 10) monthStr = "0" + month.toString();
    if (day < 10) dayStr = "0" + day.toString();

    return yearStr + "-" + monthStr + "-" + dayStr;
  };

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
      >
        <li>
          <button
            type="button"
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 dark:border-zinc-700 dark:hover:border-zinc-500 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => {
              setEventSlideout(true);
            }}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-500"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              />
            </svg>
            <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-zinc-400">
              Create a new event
            </span>
          </button>
        </li>

        {eLoading && (
          <li className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 p-6">
              <div className="text-sm font-medium leading-6 text-gray-400 dark:text-gray-200">
                Loading...
              </div>
              <EllipsisHorizontalIcon
                className="h-5 w-5 relative ml-auto text-gray-300 dark:text-gray-200"
                aria-hidden="true"
              />
            </div>
            <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-300 dark:text-gray-300">Date</dt>
                <dd className="text-gray-300 dark:text-gray-400">Loading...</dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-300 dark:text-gray-300">Venue</dt>
                <dd className="text-gray-300 dark:text-gray-400">Loading...</dd>
              </div>
            </dl>
          </li>
        )}

        {!eLoading &&
          allEvents
            ?.filter((item) => item.status !== "COMPLETE")
            .map((item) => (
              <div key={item.id}>
                <li
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 p-6">
                    <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                      {item.name}
                    </div>
                    <span
                      className={classNames(
                        item?.status === "PENDING"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-green-100 dark:bg-green-900",
                        "inline-flex items-center rounded-full px-2 mr-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset"
                      )}
                    >
                      {item.status}
                    </span>
                    <Menu as="div" className="relative ml-auto">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <p
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                                onClick={() => {
                                  setEventToEdit(item);
                                  setEventSlideout(true);
                                }}
                              >
                                Edit
                              </p>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <p
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                                onClick={() => {
                                  setDeleteEventConfirmShow(true);
                                  setEventToDelete(item);
                                }}
                              >
                                Delete
                              </p>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <a
                    href={
                      item.status === "PENDING"
                        ? `/dashboard/${item.id}/editor`
                        : `/dashboard/${item.id}/ongoing`
                    }
                  >
                    <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6">
                      <div className="flex justify-between gap-x-4 py-3">
                        <dt className="text-gray-500 dark:text-gray-300">
                          Date
                        </dt>
                        <dd className="text-gray-700 dark:text-gray-400">
                          <time dateTime={item.date_of_event}>
                            {getEventDate(item.date_of_event)}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-x-4 py-3">
                        <dt className="text-gray-500 dark:text-gray-300">
                          Venue
                        </dt>
                        <dd className="text-gray-700 dark:text-gray-400">
                          {item.venue}
                        </dd>
                      </div>
                    </dl>
                  </a>
                </li>
              </div>
            ))}
      </ul>

      {allEvents &&
        allEvents?.filter((item) => item.status === "COMPLETE").length > 0 && (
          <div className="border-t border-gray-200 pb-5 mt-10 dark:border-zinc-700">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-zinc-200 pt-3">
              Completed events
            </h3>
          </div>
        )}

      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
      >
        {!eLoading &&
          allEvents
            ?.filter((item) => item.status === "COMPLETE")
            .map((item) => (
              <Link key={item.id} href={`/dashboard/${item.id}/final`}>
                <li
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 p-6">
                    <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                      {item.name}
                    </div>
                    <span className="inline-flex items-center rounded-full px-2 mr-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 ring-1 ring-inset dark:ring-zinc-700">
                      {item.status}
                    </span>
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500 dark:text-gray-300">Date</dt>
                      <dd className="text-gray-700 dark:text-gray-400">
                        <time dateTime={item.date_of_event}>
                          {format(parseISO(item.date_of_event), "LLLL d, yyyy")}
                        </time>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500 dark:text-gray-300">
                        Venue
                      </dt>
                      <dd className="text-gray-700 dark:text-gray-400">
                        {item.venue}
                      </dd>
                    </div>
                  </dl>
                </li>
              </Link>
            ))}
      </ul>

      {/**
       * Event panel slideout
       */}
      <Transition.Root show={eventSlideout} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setEventSlideout(false);
            setEventToEdit(undefined);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <form
                      className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                      action={(e) => {
                        setAddEventLoading(true);
                        eventToEdit ? updateEvent(e) : addEvent(e);
                      }}
                    >
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                {eventToEdit ? "Update" : "New"} event
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                {eventToEdit
                                  ? "Make changes to the event details."
                                  : "Get started by filling in the information below to create your next event."}
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                  setEventSlideout(false);
                                  setEventToEdit(undefined);
                                }}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Divider container */}
                        <div className="space-y-6 py-6 sm:space-y-0 sm:border-b sm:border-1 sm:py-0">
                          {/* Event name */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="event-name"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Name <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addEventLoading}
                                type="text"
                                name="event-name"
                                id="event-name"
                                placeholder="The Next Great Trivia"
                                defaultValue={eventToEdit?.name}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          {/* Date of event */}
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="event-date"
                                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                              >
                                Date of event{" "}
                                <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addEventLoading}
                                type="date"
                                name="event-date"
                                id="event-date"
                                min={getMinEventDate()}
                                defaultValue={
                                  eventToEdit?.date_of_event.split("T")[0]
                                }
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Event description */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-description"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Description
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              disabled={addEventLoading}
                              id="event-description"
                              name="event-description"
                              rows={3}
                              placeholder="An optional description of The Next Great Trivia event with relevant details for the players."
                              defaultValue={eventToEdit?.description || ""}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        {/* Event location */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-location"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Location
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              disabled={addEventLoading}
                              type="text"
                              name="event-location"
                              id="event-location"
                              autoComplete="home city"
                              placeholder="Chattanooga, TN"
                              defaultValue={eventToEdit?.location || ""}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        {/* Event venue */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="event-venue"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Venue
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              disabled={addEventLoading}
                              type="text"
                              name="event-venue"
                              id="event-venue"
                              placeholder="South Side Social"
                              defaultValue={eventToEdit?.venue || ""}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            disabled={addEventLoading}
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              setEventSlideout(false);
                              setEventToEdit(undefined);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={addEventLoading}
                            type="submit"
                            className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {addEventLoading ? (
                              <>
                                <div role="status" className="pr-2">
                                  <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-500 animate-spin dark:text-gray-600 fill-white"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                                </div>
                                Loading...
                              </>
                            ) : (
                              <>{!eventToEdit ? <>Create</> : <>Save</>}</>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/**
       * Start event confirm modal
       */}
      <Transition.Root show={deleteEventConfirmShow} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={cancelButtonRef}
          onClose={setDeleteEventConfirmShow}
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
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <XCircleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Confirm event delete
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You are about to delete <b>{eventToDelete?.name}</b>.
                          Are you sure?
                        </p>
                        <p className="text-sm text-gray-500">
                          This will delete all rounds and questions you created
                          for this event.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
                      onClick={() => deleteEvent()}
                    >
                      Yes, I&apos;m sure
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setDeleteEventConfirmShow(false)}
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

      {/**
       * Action notification
       */}
      <Notification
        title={notifTitle}
        type={notifType}
        show={notifShow}
        setShow={setNotifShow}
      />
    </>
  );
}
