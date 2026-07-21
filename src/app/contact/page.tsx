import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";
import { faqSchema, jsonLdScript } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a no-obligation discovery call or send an enquiry. We respond within 24 hours.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  {
    question: "What actually happens on the discovery call?",
    answer:
      "We spend around an hour understanding your business: how enquiries reach you today, where they slip through the cracks, and what a good outcome would mean for you. It's a genuine conversation, not a sales pitch. We ask questions, listen, and only talk about what we might build once we actually understand the problem.",
  },
  {
    question: "Is the discovery call really free, with no obligation?",
    answer:
      "Yes. You'll leave the call with a clearer picture of where you're losing time or leads, whether or not you go any further with us. If it's not a fit, we'll say so directly rather than pushing a proposal that doesn't make sense for your business.",
  },
  {
    question: "What happens after the call, if I want to go ahead?",
    answer:
      "You'll receive a written proposal built around what came up on the call: what we'd build, how it fits your existing tools, and roughly what it would involve from your side. There's no pressure to decide on the call itself.",
  },
  {
    question: "I'm not sure if I'm ready for a full system yet. Should I still get in touch?",
    answer:
      "Yes. Plenty of people who talk to us start with a small quick win rather than a full bespoke build, and that's a completely normal starting point. Part of the discovery call is figuring out which makes sense for where your business is right now.",
  },
  {
    question: "Do you only work with businesses that already know exactly what they want?",
    answer:
      "No, most people who contact us know what's frustrating about their current process, not what the technical fix should look like. Working that out with you is exactly what the conversation is for.",
  },
  {
    question: "What if I have a general question and I'm not ready to book a call yet?",
    answer:
      "Send it through the enquiry form below, or ask our AI receptionist in the chat widget on this site. It's trained on our services, industries, and how we work, and can answer most general questions directly.",
  },
  {
    question: "Do you cover businesses outside Belfast and Northern Ireland?",
    answer:
      "We're based in Belfast and most of our client base is in Northern Ireland, but the systems we build aren't location-dependent. An AI receptionist works the same way regardless of where your business is. Get in touch and we'll tell you honestly whether we're the right fit.",
  },
  {
    question: "Can I get a quote without booking a full discovery call?",
    answer:
      "Not a meaningful one, honestly. We don't publish prices because they depend entirely on scope, and giving you a number without understanding your business first would mean guessing. See how it works for why we approach pricing this way. A discovery call is the fastest route to an actual answer.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your business."
        dek="Book a no-obligation discovery call, or send an enquiry below. We respond within 24 hours."
        breadcrumbs={[{ name: "Contact", href: "/contact" }]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(faqs))} />

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-2xl text-text">Book a discovery call</h2>
              <p className="mt-3 text-text-muted">
                An hour, no obligation. We&apos;ll ask about how enquiries reach you today and
                where things slip, no pitch, just a conversation. If you want the full detail on
                what happens next, see{" "}
                <a href="/how-it-works" className="text-gold hover:underline">
                  how it works
                </a>
                .
              </p>
              <div className="mt-6">
                <Button href={site.bookingUrl} variant="primary">
                  Book Your Discovery Call
                </Button>
              </div>

              <div className="mt-12 space-y-4 border-t border-border pt-8 text-sm">
                <div>
                  <p className="text-text-muted">Email</p>
                  {site.emails.map((email) => (
                    <a key={email} href={`mailto:${email}`} className="block text-gold hover:underline">
                      {email}
                    </a>
                  ))}
                </div>
                <div>
                  <p className="text-text-muted">Based in</p>
                  <p className="text-text">
                    {site.location.locality}, {site.location.region}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Response time</p>
                  <p className="text-text">Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-border bg-bg-alt p-8 md:p-10">
              <h2 className="font-display text-2xl text-text">Send an enquiry</h2>
              <p className="mt-3 text-sm text-text-muted">
                Prefer to write it out first? Tell us what&apos;s going on and we&apos;ll get
                back to you within 24 hours.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">What Happens Next</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            From your message to a real conversation.
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div>
              <span className="font-display text-3xl text-gold">01</span>
              <h3 className="mt-3 font-display text-lg text-text">You reach out</h3>
              <p className="mt-2 text-sm text-text-muted">
                Whether you book a discovery call directly or send an enquiry through the form,
                it reaches Mark or Jess personally, not a queue or a support ticket system.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-gold">02</span>
              <h3 className="mt-3 font-display text-lg text-text">We respond within 24 hours</h3>
              <p className="mt-2 text-sm text-text-muted">
                If you&apos;ve sent an enquiry, we&apos;ll reply directly, usually to arrange a
                discovery call. If you&apos;ve booked a call already, you&apos;ll get a
                confirmation and anything useful to think about beforehand.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-gold">03</span>
              <h3 className="mt-3 font-display text-lg text-text">We talk it through</h3>
              <p className="mt-2 text-sm text-text-muted">
                An hour, genuinely no obligation. See{" "}
                <a href="/how-it-works" className="text-gold hover:underline">
                  how it works
                </a>{" "}
                for exactly what the call and everything after it involves.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Who You&apos;ll Talk To</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Real people, not a support queue.
          </h2>
          <p className="mt-4 max-w-2xl text-text-muted">
            Whoever you end up speaking to, it&apos;s one of the two people who&apos;ll actually
            be involved in building your system, not a salesperson who hands you off once
            you&apos;ve signed anything.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {site.founders.map((founder) => (
              <div key={founder.name} className="rounded-sm border border-border bg-bg-alt p-8">
                <span className="font-display text-3xl text-gold">{founder.name}</span>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-bronze">{founder.role}</p>
                <p className="mt-4 text-sm text-text-muted">{founder.bio}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-text-muted">
            More on how we work and why we started this on the{" "}
            <a href="/about" className="text-gold hover:underline">
              about page
            </a>
            .
          </p>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Before You Book</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Nothing to prepare, but if you want a head start.
          </h2>
          <p className="mt-6 max-w-2xl text-text-muted">
            You don&apos;t need to prepare anything for the discovery call. Most of the useful
            information comes out through conversation, not a form you fill in beforehand. If you
            do want to get more out of the hour, it can help to have a rough sense of:
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            <li className="flex gap-3 rounded-sm border border-border bg-bg-alt p-5 text-text-muted">
              <span className="text-gold" aria-hidden>
                &mdash;
              </span>
              Roughly how enquiries reach you today: phone, website, WhatsApp, social media, or a mix
            </li>
            <li className="flex gap-3 rounded-sm border border-border bg-bg-alt p-5 text-text-muted">
              <span className="text-gold" aria-hidden>
                &mdash;
              </span>
              What a typical busy day or week looks like for you or your team
            </li>
            <li className="flex gap-3 rounded-sm border border-border bg-bg-alt p-5 text-text-muted">
              <span className="text-gold" aria-hidden>
                &mdash;
              </span>
              Any tools you already use: a booking system, a CRM, a specific phone setup
            </li>
            <li className="flex gap-3 rounded-sm border border-border bg-bg-alt p-5 text-text-muted">
              <span className="text-gold" aria-hidden>
                &mdash;
              </span>
              What a genuinely good outcome would look like for your business
            </li>
          </ul>
        </Container>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <Container>
          <p className="text-xs uppercase tracking-[0.3em] text-bronze">Prefer To Ask First?</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl text-text md:text-4xl">
            Talk to our AI receptionist before you talk to us.
          </h2>
          <p className="mt-6 max-w-2xl text-text-muted">
            If you&apos;re not ready to book a call but want a quick answer, the chat widget in
            the corner of this site is a live example of what we build, trained on our services,
            industries, and how pricing works, so it can answer most general questions directly.
            If it can&apos;t answer something, it&apos;ll offer to pass your details to Mark or
            Jess so a real person follows up. It&apos;s a genuinely useful way to get a feel for
            what an AI receptionist is actually like to talk to, not just read about.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl text-text md:text-3xl">Before you get in touch</h2>
          <div className="mt-8 max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
