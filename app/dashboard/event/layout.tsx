"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { useChat } from "ai/react";
import { HomeIcon, Cog6ToothIcon, CubeIcon } from "@heroicons/react/24/outline";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

import DefaultEventTopHeader from "@/components/defaults/Header";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { eventId } = useParams();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);

  const navigation = [
    {
      name: "Home",
      href: "/dashboard/events",
      icon: HomeIcon,
      current: false,
      divider: true,
    },
    {
      name: "Rounds",
      href: `/dashboard/event/${eventId}`,
      icon: CubeIcon,
      current: true,
      divider: false,
    },
    {
      name: "Settings",
      href: "#",
      icon: Cog6ToothIcon,
      current: false,
      divider: false,
    },
  ];

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data) {
      setUser(data.user);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {/**
       * Primary sidebar
       */}
      <div className="hidden border-r border-gray-200 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-16 lg:overflow-y-auto lg:pb-4 dark:bg-slate-800">
        <div className="flex h-16 shrink-0 items-center justify-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>

        <nav className="mt-8">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
                    "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span className="sr-only">{item.name}</span>
                </a>

                {item.divider && (
                  <div className="relative pt-10">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {children}
    </>
  );
}
