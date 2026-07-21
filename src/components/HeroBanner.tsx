import Image from "next/image";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";

export function HeroBanner() {
  return (
    <div className="relative min-h-[460px] w-full overflow-hidden border-b border-border bg-bg sm:min-h-[560px] md:min-h-[640px]">
      <Image
        src="/hero.png"
        alt="An illuminated globe with data connections converging to a single point, representing enquiries from every channel unified into one AI system."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent md:from-bg md:via-bg/55 md:to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-[460px] items-center sm:min-h-[560px] md:min-h-[640px]">
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
  );
}
