import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing the use of the ${site.name} website.`,
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        dek={`Last updated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. These terms cover use of this website; project-specific terms are agreed separately for each client engagement.`}
        breadcrumbs={[{ name: "Terms", href: "/legal/terms" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="prose prose-invert max-w-3xl prose-headings:font-display prose-a:text-gold">
            <p className="rounded-sm border border-bronze/40 bg-bg-alt p-6 text-sm not-prose text-text-muted">
              <strong className="text-text">[INSERT: solicitor review]</strong> — drafted as a
              reasonable starting point, not reviewed by a solicitor. Please have it checked
              before relying on it publicly.
            </p>

            <h2>Who these terms apply to</h2>
            <p>
              These terms apply to anyone who visits or uses this website — prospective clients
              researching our services, current clients looking up how-it-works or contact
              details, and anyone reading our resources content. If you&apos;re a client with a
              signed project agreement, that agreement takes precedence over these terms for
              anything it specifically covers.
            </p>

            <h2>Acceptance of these terms</h2>
            <p>
              By accessing or using this website, you agree to these terms of use. If you do not
              agree, please do not continue to use the site. These terms apply to your use of the
              website only — they do not govern services delivered under a signed client
              agreement, which are covered separately below.
            </p>

            <h2>Use of this website</h2>
            <p>
              This website is provided for information about {site.name}&apos;s services, and to
              give prospective clients a genuine sense of what we build and how we work before
              deciding whether to get in touch. You
              may browse and use it for lawful purposes only, and must not attempt to interfere
              with its operation, security, or availability — including through automated
              scraping, overloading our infrastructure, or attempting to bypass access controls.
              Content on this site — including copy, case studies, and design — is owned by{" "}
              {site.name} unless otherwise stated, and may not be reproduced without permission.
            </p>

            <h2>The AI chat assistant</h2>
            <p>
              The chat assistant on this site is provided to answer general questions about our
              services and, where you choose, to capture your details for our team to follow up.
              It is not a substitute for a discovery call or a formal proposal, and nothing it
              says constitutes a binding quote, contract, or professional advice. While the
              assistant is built and trained to answer accurately based on information about our
              own business, it may occasionally be incomplete or imprecise — for anything specific
              to your business or a decision you intend to rely on, please book a discovery call
              or confirm directly with our team.
            </p>

            <h2>No published pricing</h2>
            <p>
              We do not publish prices on this site, by design — see{" "}
              <a href="/how-it-works">how it works</a> for why. Any figures referenced in tools
              such as our admin-cost calculator are illustrative estimates based on inputs you
              provide, not quotes, and do not constitute an offer or a binding commitment of any
              kind.
            </p>

            <h2>Third-party links</h2>
            <p>
              This site may link to third-party websites or tools (for example, a booking
              platform). We are not responsible for the content, accuracy, or practices of
              third-party sites, and linking to them does not imply endorsement of everything they
              contain.
            </p>

            <h2>Client engagements</h2>
            <p>
              Services delivered to clients — the design, build, and ongoing support of AI
              systems — are governed by a separate written agreement entered into following a
              discovery call and proposal, not by these website terms. That agreement will set
              out project scope, fees, timelines, intellectual property, and support terms
              specific to your project, agreed directly between you and {site.name} before any
              build work begins.
            </p>

            <h2>Accounts and enquiry submissions</h2>
            <p>
              This site does not require you to create an account to browse it or read our
              resources. Submitting the enquiry form or messaging the AI chat assistant requires
              you to provide accurate information — please don&apos;t submit false contact details
              or enquiries on behalf of someone else without their knowledge, as this makes it
              harder for us to respond helpfully and can result in us being unable to follow up at
              all. We reserve the right to disregard enquiries that appear spam, abusive, or
              submitted in bad faith.
            </p>

            <h2>Intellectual property</h2>
            <p>
              Unless otherwise agreed in a client contract, {site.name} retains ownership of the
              underlying methods, templates, and general-purpose components used to build client
              systems, while client-specific configuration, content, and data remain the
              client&apos;s. Specific intellectual property terms for a given project are set out
              in that project&apos;s written agreement.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              While we take care to keep this site accurate, we make no warranty that its
              content is complete or error-free, and accept no liability for reliance on
              information here in place of a direct conversation with us. To the fullest extent
              permitted by law, {site.name} is not liable for any indirect, incidental, or
              consequential loss arising from use of this website. Nothing in these terms limits
              liability that cannot be excluded under UK law, including for death or personal
              injury caused by negligence, or for fraud.
            </p>

            <h2>Availability and changes to the website</h2>
            <p>
              We aim to keep this website available and up to date, but we don&apos;t guarantee
              uninterrupted access. We may update, suspend, or withdraw any part of the site,
              including the AI chat assistant or the enquiry form, at any time without notice —
              for example for maintenance, security, or content updates.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable or invalid under
              applicable law, that provision will be limited or removed to the minimum extent
              necessary, and the remaining provisions will continue in full force and effect.
            </p>

            <h2>Entire agreement</h2>
            <p>
              These terms, together with our{" "}
              <a href="/legal/privacy">privacy policy</a>, constitute the entire agreement between
              you and {site.name} regarding use of this website, and supersede any prior
              understanding relating to that use. They do not affect the terms of any separate
              written client agreement.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of Northern Ireland, and any disputes relating
              to this website are subject to the exclusive jurisdiction of the courts of Northern
              Ireland.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We may update these terms from time to time. The &quot;last updated&quot; date at
              the top of this page reflects the most recent revision. Continued use of the site
              after a change constitutes acceptance of the updated terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms: email{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
