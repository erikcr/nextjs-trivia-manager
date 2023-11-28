"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function EventByIdPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.push(`${pathname}/editor`);
  });
}
