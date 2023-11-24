"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/manage/events");
  });
}
