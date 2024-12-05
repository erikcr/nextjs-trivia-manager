"use client";

import { Fragment, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Supabase
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/types/database.types";
import { RoundsWithQuestions } from "@/lib/types/app.types";

// Components
import Notification from "@/components/Notification";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { DialogTitle } from "../ui/dialog";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function RoundSlideout({
  user,
  rounds,
  setRounds,
  roundToEdit,
  setRoundToEdit,
  roundSlideoutOpen,
  setRoundSlideoutOpen,
  setActiveRound,
}: {
  user: User | null;
  rounds: RoundsWithQuestions | undefined;
  setRounds: Function;
  roundToEdit: Tables<"round"> | undefined;
  setRoundToEdit: Function;
  roundSlideoutOpen: boolean;
  setRoundSlideoutOpen: Function;
  setActiveRound: Function;
}) {
  const { eventId } = useParams();
  const router = useRouter();

  const supabase = createClient();

  // Rounds
  const [addRoundLoading, setAddRoundLoading] = useState(false);

  // Notification
  const [notifShow, setNotifShow] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifType, setNotifType] = useState("");

  const addRound = async (formData: FormData) => {
    const { data, error } = await supabase
      .from("round")
      .insert([
        {
          name: formData.get("round-name"),
          description: formData.get("round-description"),
          order_num: rounds?.length,
          event_id: eventId,
          owner: user?.id,
        },
      ])
      .select("*, question ( id )");

    if (!error) {
      setNotifTitle("Round added");
      setNotifType("success");
      setNotifShow(true);
      setRoundSlideoutOpen(false);
      setAddRoundLoading(false);

      const nextRounds = rounds?.concat(data);
      setRounds(nextRounds);

      setActiveRound(data[0]);
      setRoundToEdit(undefined);
    } else {
      console.log(error);
    }
  };

  const updateRound = async (formData: FormData) => {
    const { data, error } = await supabase
      .from("round")
      .update([
        {
          name: formData.get("round-name"),
          description: formData.get("round-description"),
        },
      ])
      .eq("id", roundToEdit?.id)
      .select("*, question ( id )");

    if (!error) {
      setNotifTitle("Round updated");
      setNotifType("success");
      setNotifShow(true);
      setRoundSlideoutOpen(false);
      setAddRoundLoading(false);

      const nextRounds = rounds?.map((round) => {
        if (round.id === roundToEdit?.id) {
          return data;
        } else {
          return round;
        }
      });

      setRounds(nextRounds);
      setRoundToEdit(undefined);
    } else {
      console.log(error);
    }
  };

  const deleteRound = async () => {
    const { data, error } = await supabase
      .from("round")
      .delete()
      .eq("id", roundToEdit?.id);

    if (!error) {
      setRounds(undefined);
      setNotifTitle("Round deleted");
      setNotifType("success");
      setNotifShow(true);
      setRoundSlideoutOpen(false);
      setAddRoundLoading(false);

      const nextRounds = rounds?.filter(
        (round) => round.id !== roundToEdit?.id
      );

      setRounds(nextRounds);
      if (nextRounds) {
        setActiveRound(nextRounds[0]);
      } else {
        setActiveRound(undefined);
      }
      setRoundToEdit(undefined);
    }
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
       * Round panel slideout
       */}
      <Transition show={roundSlideoutOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            setRoundSlideoutOpen(false);
            setRoundToEdit(undefined);
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-zinc-800 dark:bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="bg-gray-50 dark:bg-zinc-900 pointer-events-auto w-screen max-w-2xl">
                    <form
                      className="flex h-full flex-col overflow-y-scroll shadow-xl"
                      action={(e) => {
                        setAddRoundLoading(true);
                        roundToEdit ? updateRound(e) : addRound(e);
                      }}
                    >
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <DialogTitle className="text-base font-semibold leading-6">
                                {roundToEdit ? "Update" : "New"} round
                              </DialogTitle>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {roundToEdit
                                  ? "Make changes to the round details."
                                  : "Add a new round to the event."}
                              </p>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500 dark:text-gray-200"
                                onClick={() => {
                                  setRoundSlideoutOpen(false);
                                  setRoundToEdit(undefined);
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

                        <div className="space-y-6 py-6 sm:space-y-0 sm:border-b sm:border-1 sm:py-0 dark:border-zinc-700">
                          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                            <div>
                              <label
                                htmlFor="round-name"
                                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                              >
                                Name <span className="text-red-600">*</span>
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <input
                                required
                                disabled={addRoundLoading}
                                type="text"
                                name="round-name"
                                id="round-name"
                                placeholder="Beyond Harry Potter"
                                defaultValue={roundToEdit?.name}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="round-description"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:mt-1.5"
                            >
                              Description
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              disabled={addRoundLoading}
                              id="round-description"
                              name="round-description"
                              rows={3}
                              placeholder="An optional description of Beyond Harry Potter round."
                              defaultValue={roundToEdit?.description || ""}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:bg-zinc-800 dark:text-gray-200 shadow-sm dark:shadow-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus-primary-dark sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 border-t border-gray-200 dark:border-zinc-700 px-4 py-5 sm:px-6">
                        <div className="flex justify-between">
                          <div>
                            {" "}
                            <button
                              disabled={addRoundLoading}
                              className={classNames(
                                roundToEdit ? "" : "hidden",
                                "rounded-md bg-red-200 dark:bg-red-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm hover:bg-red-500 dark:hover:bg-red-600"
                              )}
                              onClick={() => {
                                deleteRound();
                              }}
                            >
                              <>Delete</>
                            </button>
                          </div>
                          <div className="space-x-3">
                            <button
                              disabled={addRoundLoading}
                              type="button"
                              className="rounded-md px-3 py-2 text-sm font-semibold dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:ring-slate-700"
                              onClick={() => {
                                setRoundSlideoutOpen(false);
                                setRoundToEdit(undefined);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              disabled={addRoundLoading}
                              type="submit"
                              className="inline-flex justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              <>{roundToEdit ? <>Save</> : <>Create</>}</>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
