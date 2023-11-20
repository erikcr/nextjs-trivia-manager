"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";

export default function Home() {
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log(data.user.id);
    };

    getUser();
  });

  return (
    <>
      <Header />
    </>
  );
}
