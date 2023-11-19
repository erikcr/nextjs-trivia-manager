"use client";

import { useChat } from "ai/react";
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDaysIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  UserCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import {
  BellIcon,
  XMarkIcon as XMarkIconOutline,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function TriviaAI() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            TriviaAI
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Chat panel */}
          <div className="lg:col-start-3 lg:row-end-1 h-72">
            <h2 className="sr-only">Chat panel</h2>
            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 min-h-full">
              <dl className="flex flex-wrap">
                {messages.length > 0
                  ? messages.map((m) => (
                      <div>
                        <div
                          key={m.id}
                          className="flex w-full flex-none gap-x-4 px-6 pt-2"
                        >
                          <dt className="flex-none">
                            <span className="sr-only">User input</span>
                            <UserCircleIcon
                              className="h-6 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </dt>
                          <dd className="text-sm font-medium leading-6 text-gray-900">
                            {m.role === "user" ? "User: " : "AI: "} 
                            {m.content}
                          </dd>
                        </div>
                      </div>
                    ))
                  : null}
              </dl>
              <div className="pt-4">
                <form onSubmit={handleSubmit}>
                  <input
                    className="w-full max-w-md bottom-0 border border-gray-300 rounded p-2"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                  />
                </form>
              </div>
            </div>
          </div>

          {/* Invoice */}
          <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Questions
            </h2>
            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
              <div className="sm:pr-4">
                <dt className="inline text-gray-500">Issued on</dt>{" "}
                <dd className="inline text-gray-700">
                  <time dateTime="2023-23-01">January 23, 2023</time>
                </dd>
              </div>
              <div className="mt-2 sm:mt-0 sm:pl-4">
                <dt className="inline text-gray-500">Due on</dt>{" "}
                <dd className="inline text-gray-700">
                  <time dateTime="2023-31-01">January 31, 2023</time>
                </dd>
              </div>
              <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                <dt className="font-semibold text-gray-900">From</dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">Acme, Inc.</span>
                  <br />
                  7363 Cynthia Pass
                  <br />
                  Toronto, ON N3Y 4H8
                </dd>
              </div>
              <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                <dt className="font-semibold text-gray-900">To</dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">Tuple, Inc</span>
                  <br />
                  886 Walter Street
                  <br />
                  New York, NY 12345
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
