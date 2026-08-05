"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";

export function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Close (scaled up, cropped) at the start, full image visible at the
  // midpoint, close again by the end — a scroll-scale "breathe" rather than
  // a fixed image. Disabled entirely under prefers-reduced-motion.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.28, 1, 1.28]
  );

  return (
    <div ref={containerRef} className="relative h-[130dvh] sm:h-[170dvh] md:h-[220dvh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden border-b border-border bg-bg">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <div className={`absolute inset-0 ${prefersReducedMotion ? "" : "hero-ambient-move"}`}>
            <Image
              src="/hero.png"
              alt="An illuminated globe with data connections converging to a single point, representing enquiries from every channel unified into one AI system."
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "78% 45%" }}
            />
          </div>
        </motion.div>

        {/* A light, even scrim rather than a solid wash — the image stays the
            backdrop the whole way across, with the copy sitting as an overlay
            on top of it (helped along by the text-shadow on the copy below)
            instead of the image being half-hidden behind a gradient. */}
        <div className="absolute inset-0 bg-bg/35" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent"
          aria-hidden
        />

        {!prefersReducedMotion && (
          <>
            <div className="hero-flash-pulse" aria-hidden style={{ mixBlendMode: "screen" }} />
            <div className="hero-light-sweep" aria-hidden style={{ mixBlendMode: "screen" }} />
          </>
        )}

        <div className="pointer-events-none absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-bg/60 backdrop-blur-sm sm:right-10 sm:top-10 sm:h-16 sm:w-16">
          <Image src="/logo-mark.png" alt="" width={28} height={28} className="opacity-90" />
        </div>

        <div className="relative flex h-dvh items-center" style={{ textShadow: "0 2px 24px rgba(2, 19, 10, 0.85)" }}>
          <Container>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">
              AI Systems for Trades &amp; Service Businesses
            </p>
            <h1 className="text-balance mt-6 max-w-2xl font-display text-5xl leading-[1.05] text-text md:text-7xl">
              Stop running your business.
              <br />
              <span className="text-gold">Let it run itself.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-text-muted">
              We build bespoke AI systems that handle your enquiries, bookings, follow-ups, and
              admin, so you can focus on the work that actually grows your business.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={site.bookingUrl} variant="primary">
                Book a Discovery Call
              </Button>
              <Button href="/services" variant="secondary">
                See What We Build
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
