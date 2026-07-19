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

            <h2>Use of this website</h2>
            <p>
              This website is provided for information about {site.name}&apos;s services. You
              may browse and use it for lawful purposes only. Content on this site — including
              copy, case studies, and design — is owned by {site.name} unless otherwise
              stated, and may not be reproduced without permission.
            </p>

            <h2>The AI chat assistant</h2>
            <p>
              The chat assistant on this site is provided to answer general questions about our
              services. It is not a substitute for a discovery call or a formal proposal, and
              nothing it says constitutes a binding quote, contract, or professional advice. For
              anything specific to your business, please book a discovery call.
            </p>

            <h2>No published pricing</h2>
            <p>
              We do not publish prices on this site. Any figures referenced in tools such as our
              admin-cost calculator are illustrative estimates based on inputs you provide, not
              quotes, and do not constitute an offer.
            </p>

            <h2>Client engagements</h2>
            <p>
              Services delivered to clients are governed by a separate written agreement entered
              into following a discovery call and proposal, not by these website terms.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              While we take care to keep this site accurate, we make no warranty that its
              content is complete or error-free, and accept no liability for reliance on
              information here in place of a direct conversation with us.
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
