import Image from "next/image";

import logoBrainyBrawls from "@/public/logos/brainybrawls.svg";

export default function MagicLinkPage({}: {}) {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src={logoBrainyBrawls}
            alt="Next.js Trivia Manager"
            className="mx-auto h-16 w-auto"
            unoptimized
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-4 text-center leading-9 tracking-tight text-gray-900">
            Look for the magic link to login.
          </p>
        </div>
      </div>
    </>
  );
}
