"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const secondaryNavigation = [
  {
    name: "General",
    href: "/manage/settings",
    icon: UserCircleIcon,
  },
  // {
  //   name: "Security",
  //   href: "/manage/settings/security",
  //   icon: FingerPrintIcon,
  // },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] =
    useState(true);

  return (
    <div className="mx-auto max-w-7xl py-8 lg:flex lg:gap-x-4 lg:px-16">
      <aside className="flex overflow-x-auto border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul
            role="list"
            className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-gray-200 text-primary dark:bg-zinc-800 dark:text-gray-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-200 dark:text-gray-200",
                    "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
                  )}
                >
                  <item.icon
                    className={classNames(
                      pathname === item.href
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-primary",
                      "h-6 w-6 shrink-0 dark:text-gray-200"
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

      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">{children}</main>
    </div>
  );
}
