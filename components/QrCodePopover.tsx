"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  RocketLaunchIcon,
  CheckIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

import { useQRCode } from "next-qrcode";

export default function QrCodePopover() {
  const { eventId } = useParams();

  const { Canvas } = useQRCode();

  const joinLink = `https://expo-trivia-app.vercel.app?joinCode=${eventId}`;

  // Modal
  const [qrCodeShow, setQrCodeShow] = useState(false);
  const cancelButtonRef = useRef(null);

  return (
    <>
      <QrCodeIcon className="w-5 h-5" onClick={() => setQrCodeShow(true)} />

      <Transition.Root show={qrCodeShow} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={cancelButtonRef}
          onClose={setQrCodeShow}
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
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Event join code
                      </Dialog.Title>
                      <div className="mt-2 items-center">
                        <p className="text-sm text-gray-500">
                          Share this QR code or the join code to allow teams to
                          join your event.
                        </p>

                        <Canvas
                          text={joinLink}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 3,
                            scale: 4,
                            width: 400,
                            color: {
                              dark: "#000",
                              light: "#fff",
                            },
                          }}
                        />

                        <p className="text-sm text-gray-500">{joinLink}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary sm:col-start-2"
                      onClick={() => setQrCodeShow(false)}
                    >
                      I'm finished
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
