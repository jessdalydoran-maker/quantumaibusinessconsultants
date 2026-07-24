"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

// The CRM (/app/**) renders its own nav/shell (see src/app/app/layout.tsx) and
// must never show the marketing header, footer, or AI receptionist widget.
// This is the only change made to the shared root layout to add the CRM.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCrm = pathname?.startsWith("/app");

  if (isCrm) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
