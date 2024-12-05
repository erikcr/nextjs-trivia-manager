'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

import logoTriviaLynxDark from '@/assets/logos/trivialynx-logo-dark.svg';
import logoTriviaLynx from '@/assets/logos/trivialynx-logo.svg';
// Components
import ThemeSwitcher from '@/components/ThemeSwitcher';
// Supabase
import { createClient } from '@/lib/supabase/client';

const navigation: any[] = [
  { name: 'Events', href: '/manage/events', display: true },
  // { name: "Calendar", href: "/manage/calendar", display: true },
  { name: 'Settings', href: '/manage/settings', display: true },
];

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [authenticated, setAuthenticated] = useState(false);

  const signOut = () => {
    supabase.auth.signOut();

    router.push('/');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setAuthenticated(true);
      } else {
        router.push('/auth/magic');
      }
    };

    checkAuth();
  });

  if (!authenticated) {
    return <></>;
  }

  return (
    <div className="min-h-full">
      <div className="bg-primary dark:bg-primary-dark pb-32">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="border-b border-gray-700 dark:border-zinc-800">
            <div className="flex h-16 items-center justify-between px-4 sm:px-0">
              <div className="flex items-center">
                <div className="flex-shrink-0 pt-2">
                  <button onClick={() => router.push('/manage/events')}>
                    <Image
                      src={logoTriviaLynx}
                      alt="Next.js Trivia Manager"
                      className="dark:hidden h-10 w-10 text-gray-100"
                      unoptimized
                    />
                    <Image
                      src={logoTriviaLynxDark}
                      alt="Next.js Trivia Manager"
                      className="hidden dark:block h-10 w-10 text-gray-100"
                      unoptimized
                    />
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {/* {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.href === pathname
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={
                          item.href === pathname ? "page" : undefined
                        }
                      >
                        {item.name}
                      </a>
                    ))} */}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <ThemeSwitcher />

                  <button
                    className="inline-block h-8 w-8 ml-2 overflow-hidden rounded-full bg-gray-900 dark:bg-gray-400"
                    onClick={() => router.push('/manage/settings')}
                  >
                    <svg
                      className="h-full w-full text-gray-300 dark:text-gray-200 dark:hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-100 dark:text-zinc-900">
              {navigation.find((item) => item.href === pathname)?.name}
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 px-5 py-6 shadow dark:shadow-gray-600 sm:px-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
