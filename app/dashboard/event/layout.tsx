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

  return <>{children}</>;
}
