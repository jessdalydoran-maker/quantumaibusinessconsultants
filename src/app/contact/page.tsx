import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a no-obligation discovery call or send an enquiry — we respond within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your business."
        dek="Book a no-obligation discovery call, or send an enquiry below — we respond within 24 hours."
        breadcrumbs={[{ name: "Contact", href: "/contact" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-2xl text-text">Book a discovery call</h2>
              <p className="mt-3 text-text-muted">
                An hour, no obligation. We&apos;ll ask about how enquiries reach you today and
                where things slip — no pitch, just a conversation.
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
    </>
  );
}
