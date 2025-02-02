'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { UserCircleIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const secondaryNavigation = [
  {
    name: 'General',
    href: '/settings',
    icon: UserCircleIcon,
  },
  // {
  //   name: "Security",
  //   href: "/settings/security",
  //   icon: FingerPrintIcon,
  // },
];

export default function SettingsPage() {
  const supabase = createClient();

  const pathname = usePathname();
  const router = useRouter();

  const passwordForm = useRef<HTMLFormElement>(null);

  // User
  const [user, setUser] = useState<User | null>(null);

  const updateEmail = async (formData: FormData) => {
    const email = formData.get('email') as string;

    const { data, error } = await supabase.auth.updateUser({
      email,
    });

    if (error) {
      console.error(error);
    } else if (data) {
      console.log(data);
      toast.success('Email updated', {
        description: 'Click the link sent to your new email to confirm change.',
      });
    }
  };

  const updatePassword = async (formData: FormData) => {
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    console.log(error);

    if (data) {
      toast.success('Password updated');
      passwordForm.current?.reset();
    }
  };

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) {
      setUser(data.user);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    getUser();
  });

  return (
    <div className="mx-auto max-w-7xl py-8 lg:flex lg:gap-x-4 lg:px-16">
      <aside className="flex overflow-x-auto border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-gray-200 text-primary dark:bg-zinc-800 dark:text-gray-200'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-200 dark:text-gray-200',
                    'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold',
                  )}
                >
                  <item.icon
                    className={classNames(
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-gray-400 group-hover:text-primary',
                      'h-6 w-6 shrink-0 dark:text-gray-200',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
        <div className="divide-y dark:divide-white/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 dark:text-gray-200">
                Personal Information
              </h2>
            </div>

            <form action={updateEmail} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 dark:text-gray-200"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 dark:bg-white/5 py-1.5 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      defaultValue={user?.email}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 dark:text-gray-200">
                Change password
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Update your password associated with your account.
              </p>
            </div>

            <form action={updatePassword} ref={passwordForm} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium leading-6 dark:text-gray-200"
                  >
                    Current password
                  </label>
                  <div className="mt-2">
                    <input
                      id="current-password"
                      name="current_password"
                      type="password"
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 dark:bg-white/5 py-1.5 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium leading-6 dark:text-gray-200"
                  >
                    New password
                  </label>
                  <div className="mt-2">
                    <input
                      id="new-password"
                      name="new_password"
                      type="password"
                      autoComplete="new-password"
                      className="block w-full rounded-md border-0 dark:bg-white/5 py-1.5 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium leading-6 dark:text-gray-200"
                  >
                    Confirm password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirm-password"
                      name="confirm_password"
                      type="password"
                      autoComplete="new-password"
                      className="block w-full rounded-md border-0 dark:bg-white/5 py-1.5 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 dark:text-gray-200">
                Sign out of your account
              </h2>
            </div>

            <div className="flex">
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
