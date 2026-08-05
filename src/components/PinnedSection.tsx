"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";

// The Cerebrium-style pattern applied to a regular content section: a
// graphic (photo or GlowOrb) pins behind the copy and scales slightly in
// on scroll, with the copy sitting over it as an overlay, then releases
// into whatever comes next. Shorter scroll range than the hero — this is
// a supporting beat down the page, not the opening statement.
export function PinnedSection({
  eyebrow,
  title,
  children,
  graphic,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  graphic: ReactNode;
  align?: "left" | "right" | "center";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.15, 1, 1.15]
  );

  return (
    <div ref={containerRef} className="relative h-[105dvh] sm:h-[130dvh] md:h-[170dvh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden border-b border-border bg-bg">
        <motion.div className="absolute inset-0" style={{ scale }}>
          {graphic}
        </motion.div>

        <div className="absolute inset-0 bg-bg/40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-bg/75 via-transparent to-transparent"
          aria-hidden
        />

        <div
          className="relative flex h-dvh items-center"
          style={{ textShadow: "0 2px 24px rgba(2, 19, 10, 0.85)" }}
        >
          <Container>
            <div
              className={`max-w-xl ${
                align === "right" ? "ml-auto text-right" : align === "center" ? "mx-auto text-center" : ""
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">{eyebrow}</p>
              <h2 className="text-balance mt-4 font-display text-3xl text-text md:text-5xl">{title}</h2>
              <div className="mt-6 text-text-muted">{children}</div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
