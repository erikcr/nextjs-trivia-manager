import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

import headerLogo from "@/public/logos/trivialynx-logo.svg";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function LoginScreen() {
  // const sendMagicLink = async (formData: FormData) => {
  //   "use server";

  //   const email = formData.get("email") as string;

  //   if (!email) {
  //     return redirect("?error=Email is empty");
  //   }

  //   const origin = headers().get("origin");
  //   const supabase = createClient();

  //   const { data, error } = await supabase.auth.signInWithOtp({
  //     email,
  //     options: {
  //       emailRedirectTo: `${origin}`,
  //     },
  //   });

  //   if (error) {
  //     return redirect(`?error=${error?.message}`);
  //   } else {
  //     return redirect(`${origin}/home`);
  //   }
  // };

  const signInAsUser = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;

    if (!email) {
      return redirect("?error=Email is empty");
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: "password",
    });

    if (data.user) {
      return redirect("/home?sv-status=testing");
    } else {
      return redirect(`?error=${error?.message}`);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src={headerLogo}
            alt="Next.js Trivia Manager"
            className="mx-auto h-16 w-auto"
            unoptimized
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action={signInAsUser} method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-primary-hover"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/auth/signup"
              className="font-semibold leading-6 text-primary hover:text-primary-hover"
            >
              Sign up
            </a>
          </p>

          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-2 text-sm text-gray-500">Or</span>
            </div>
          </div>

          <p className="mt-t text-center text-sm text-gray-500">
            Login with magic link?{" "}
            <a
              href="/auth/magic"
              className="font-semibold leading-6 text-primary hover:text-primary-hover"
            >
              Send link
            </a>
          </p>
        </div>
      </div>

      {/* {searchParams?.message && (
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            Notification panel, dynamically insert this into the live region when it needs to be displayed
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      Login failed
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchParams.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
