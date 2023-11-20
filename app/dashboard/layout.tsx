"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login");
      }
    };

    getUser();
  });

  return (
    <div className="min-h-full">
      <Header />

      {children}
    </div>
  );
}
