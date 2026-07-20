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
        dek={`Last updated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. This policy explains what data ${site.name} collects, why, how it's protected, and what rights you have over it.`}
        breadcrumbs={[{ name: "Privacy", href: "/legal/privacy" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-display prose-a:text-gold">
            <p className="rounded-sm border border-bronze/40 bg-bg-alt p-6 text-sm not-prose text-text-muted">
              <strong className="text-text">[INSERT: solicitor review]</strong> — this policy is
              drafted to reflect UK GDPR principles in plain language and covers the processors
              actually used by this site, but it has not yet been reviewed by a qualified
              solicitor. Please have it checked before this page is relied on publicly,
              particularly the sections covering data processed by AI systems built for clients.
            </p>

            <h2>Who we are</h2>
            <p>
              {site.name} ({site.legacyDomain}) is a Belfast-based consultancy that designs and
              builds AI systems for independent trades and service businesses. For the purposes
              of UK data protection law, {site.name} is the data controller for personal data
              collected through this website. This policy covers both our own website and, in
              general terms, the kind of data our client systems process on our clients&apos;
              behalf — client-specific data handling is documented separately for each
              engagement, since it depends on the system being built.
            </p>

            <h2>What we collect and why</h2>
            <p>We collect the following categories of personal data through this website:</p>
            <ul>
              <li>
                <strong>Contact and enquiry data</strong> — name, email address, business name,
                and the content of your message, submitted through our enquiry form, discovery
                call booking, or by emailing us directly. We collect this to respond to your
                enquiry and, if you proceed, to scope and deliver a project.
              </li>
              <li>
                <strong>AI chat conversation data</strong> — messages you send to the AI
                receptionist widget on this site, including any contact details you choose to
                share with it. We collect this to answer your questions and, where you ask to be
                contacted, to pass your enquiry to our team.
              </li>
              <li>
                <strong>Analytics data</strong> — pages visited, approximate location (derived
                from IP address, not precise), device and browser type, and general usage
                patterns, collected via Google Analytics only where you have consented to
                non-essential cookies.
              </li>
            </ul>

            <h2>Our lawful basis for processing</h2>
            <p>
              We rely on the following lawful bases under UK GDPR, depending on the activity:
              <strong> legitimate interests</strong> to respond to enquiries and operate this
              website (weighed against your rights and freedoms, and not used where they would be
              overridden); <strong>consent</strong> for non-essential analytics cookies, which you
              can withdraw at any time; and <strong>contract</strong> where processing is
              necessary to take steps toward, or perform, an agreement with you as a client.
            </p>

            <h2>Third-party processors</h2>
            <p>
              We use a small number of third-party services to operate this website and its
              enquiry and chat systems. Each acts as a data processor on our behalf and only
              processes personal data in line with our instructions and their own data protection
              terms:
            </p>
            <ul>
              <li>
                <strong>Anthropic</strong> (anthropic.com) — powers the AI receptionist chat
                widget. Messages sent to the widget are processed to generate a response, in line
                with Anthropic&apos;s standard commercial data handling terms, and are not used to
                train Anthropic&apos;s models.
              </li>
              <li>
                <strong>Resend</strong> (resend.com) — delivers enquiry form submissions and
                AI-captured leads to our team by email.
              </li>
              <li>
                <strong>Vercel</strong> (vercel.com) — hosts this website and processes standard
                web server logs (IP address, request metadata) as part of hosting infrastructure.
              </li>
              <li>
                <strong>Google Analytics</strong> (google.com) — provides anonymised usage
                analytics, only loaded where you&apos;ve consented to non-essential cookies.
              </li>
            </ul>

            <h2>How AI processes enquiry data</h2>
            <p>
              Our website&apos;s AI chat assistant is built on Anthropic&apos;s Claude models.
              Messages you send to it are processed to generate a response and are not used to
              train third-party models beyond the provider&apos;s standard commercial data
              handling terms. Where you share contact details with the assistant so we can follow
              up, that information is treated the same as an enquiry submitted through our contact
              form, and is emailed directly to our team rather than stored in a separate system.
            </p>
            <p>
              For client projects, the specifics of what data an AI system processes, where
              it&apos;s stored, and who can access it are agreed individually during scoping and
              documented for each client — because the answer genuinely depends on the system
              being built, the sector, and whether any special category data (such as health
              information, in a clinic setting) is involved.
            </p>

            <h2>International data transfers</h2>
            <p>
              Some of the processors listed above may process data outside the UK and European
              Economic Area, including in the United States. Where this happens, we rely on
              those providers&apos; standard contractual clauses or equivalent safeguards
              recognised under UK GDPR as providing an adequate level of protection.
            </p>

            <h2>Data retention</h2>
            <p>
              We retain enquiry and contact data for as long as reasonably necessary to respond
              to you and, if you become a client, to maintain business and accounting records —
              generally no longer than seven years after the end of a client relationship, in
              line with standard UK accounting and tax obligations. Where you contact us but do
              not proceed to a client relationship, we retain your enquiry only as long as
              reasonably needed to respond to you and for a limited period afterwards in case you
              get back in touch, after which it is deleted. [INSERT: confirm exact retention
              periods once finalised].
            </p>

            <h2>Your rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul>
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate personal data</li>
              <li>Request deletion of your personal data, in certain circumstances</li>
              <li>Object to or request restriction of certain processing</li>
              <li>Request a portable copy of data you&apos;ve provided to us</li>
              <li>Withdraw consent at any time, where processing is based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. We&apos;ll respond
              within one month, as required by law. If you&apos;re unhappy with how we&apos;ve
              handled your data, you also have the right to complain to the UK Information
              Commissioner&apos;s Office (ICO) at ico.org.uk.
            </p>

            <h2>Children&apos;s data</h2>
            <p>
              This website and our services are directed at business owners and are not intended
              for use by children. We do not knowingly collect personal data from children.
            </p>

            <h2>Cookies</h2>
            <p>
              We use essential cookies required for the site to function (for example, remembering
              your cookie consent choice), and — only with your consent — analytics cookies via
              Google Analytics to understand how the site is used. No advertising or tracking
              cookies unrelated to analytics are used. You can withdraw consent at any time by
              clearing your browser&apos;s cookies for this site.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time, for example if we change the
              third-party services we use. The &quot;last updated&quot; date at the top of this
              page reflects the most recent revision. Material changes will be reflected here
              directly rather than communicated individually.
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
