"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Scroll-triggered fade/rise-in, used to give static content sections the
// same "the page is alive" feel as the pinned hero/orb sections, without
// needing a graphic behind every single block of text. `once: true` so it
// never re-triggers scrolling back up — a reveal, not a repeating loop.
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const prefersReducedMotion = useReducedMotion();
  const Component = as === "li" ? motion.li : motion.div;

  return (
    <Component
      className={className}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

// For a row of cards/list items: each child reveals in sequence rather
// than all at once, via a small delay per index.
export function RevealStagger({
  children,
  className,
  itemClassName,
  step = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  step?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
