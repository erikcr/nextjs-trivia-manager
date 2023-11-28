"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.push("/manage/events");
  });
}
