"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Picks up new inbound messages (widget or email) without a manual reload.
// Renders nothing — just re-fetches the server component's data periodically.
export function ThreadAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
