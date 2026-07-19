import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mark and Jess, Belfast based, building bespoke AI systems for independent trades and service businesses.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Belfast based. Globally minded."
        dek="We don't sell generic software. We build bespoke systems for independent businesses that want to scale without losing their personal touch."
        breadcrumbs={[{ name: "About", href: "/about" }]}
      />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            {site.founders.map((founder) => (
              <div key={founder.name} className="rounded-sm border border-border bg-bg-alt p-10">
                <span className="font-display text-4xl text-gold">{founder.name}</span>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bronze">
                  {founder.role}
                </p>
                <p className="mt-5 text-text-muted">{founder.bio}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Why this exists</p>
            <h2 className="mt-4 font-display text-3xl text-text md:text-4xl">
              We&apos;ve watched good businesses lose good customers to bad timing.
            </h2>
            <p className="mt-6 text-text-muted">
              Not because the work wasn&apos;t good enough — because the phone rang while someone
              was on a ladder, or a quote sat unanswered for a week while the job went to
              whoever replied first. Mark brings a decade of business strategy experience,
              ensuring every system actually impacts the bottom line rather than just looking
              clever. Jess leads AI development, building the technical architecture that makes
              it work seamlessly, without needing you to become technical yourself.
            </p>
            <p className="mt-4 text-text-muted">
              We&apos;re based in {site.location.locality}, {site.location.region}, working with
              independent businesses who want the benefits of AI without losing what makes their
              business theirs.
            </p>
            <div className="mt-8 flex flex-wrap gap-8 text-sm text-text-muted">
              <span>
                <span className="text-gold">{site.location.locality}</span> &middot; Est.{" "}
                {site.founded}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand title="Want to see if this is a fit for your business?" />
    </>
  );
}
