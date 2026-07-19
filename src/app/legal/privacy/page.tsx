import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects personal data, including data processed by our AI systems.`,
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        dek={`Last updated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. This policy explains what data ${site.name} collects, why, and how it's protected.`}
        breadcrumbs={[{ name: "Privacy", href: "/legal/privacy" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-display prose-a:text-gold">
            <p className="rounded-sm border border-bronze/40 bg-bg-alt p-6 text-sm not-prose text-text-muted">
              <strong className="text-text">[INSERT: solicitor review]</strong> — this policy is
              drafted to reflect UK GDPR principles in plain language, but has not yet been
              reviewed by a qualified solicitor. Please have it checked before this page is
              relied on publicly, particularly the sections covering data processed by AI
              systems built for clients.
            </p>

            <h2>Who we are</h2>
            <p>
              {site.name} ({site.legacyDomain}) is a Belfast-based consultancy that designs and
              builds AI systems for independent businesses. This policy covers both our own
              website and, in general terms, the kind of data our client systems process on our
              clients&apos; behalf.
            </p>

            <h2>What we collect on this website</h2>
            <ul>
              <li>
                Contact details you provide through our enquiry form or discovery call booking
                (name, email, business name, and the content of your message).
              </li>
              <li>
                Messages you send to our AI chat assistant on this site, including any contact
                details you choose to share with it.
              </li>
              <li>
                Basic analytics data (pages visited, general location, device type) via Google
                Analytics, where you have consented to non-essential cookies.
              </li>
            </ul>

            <h2>How we use it</h2>
            <p>
              We use the information you provide to respond to enquiries, arrange discovery
              calls, and — only where you&apos;ve explicitly agreed — to send you relevant
              follow-up. We do not sell personal data to third parties.
            </p>

            <h2>How AI processes enquiry data</h2>
            <p>
              Our website&apos;s AI chat assistant is built on a third-party large language
              model provider. Messages you send to it are processed to generate a response and
              are not used to train third-party models beyond the provider&apos;s standard data
              handling terms. Where you share contact details with the assistant so we can
              follow up, that information is treated the same as an enquiry submitted through
              our contact form.
            </p>
            <p>
              For client projects, the specifics of what data an AI system processes, where
              it&apos;s stored, and who can access it are agreed individually during scoping and
              documented for each client — because the answer genuinely depends on the system
              being built.
            </p>

            <h2>Data retention</h2>
            <p>
              We retain enquiry and contact data for as long as reasonably necessary to respond
              to you and maintain business records, and no longer than legally required
              afterwards. [INSERT: specific retention periods once confirmed].
            </p>

            <h2>Your rights</h2>
            <p>
              Under UK GDPR, you have the right to access, correct, or request deletion of your
              personal data, and to object to or restrict certain processing. To exercise any of
              these rights, contact us at{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </p>

            <h2>Cookies</h2>
            <p>
              We use essential cookies required for the site to function, and — only with your
              consent — analytics cookies to understand how the site is used. You can withdraw
              consent at any time.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy or how your data is handled: email{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. We&apos;re based in{" "}
              {site.location.locality}, {site.location.region}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
