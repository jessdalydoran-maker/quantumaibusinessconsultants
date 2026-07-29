import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/Container";
import { ChangeRequestForm } from "@/components/ChangeRequestForm";

export const metadata: Metadata = {
  title: "Request a Change",
  description: "Already a client? Tell us what you'd like changed on your site or system.",
  alternates: { canonical: "/request-change" },
};

export default function RequestChangePage() {
  return (
    <>
      <PageHero
        eyebrow="Existing Customers"
        title="Need something changed? We're a friendly bunch."
        dek="Whether it's a quick content tweak, a design change, or something's not working quite right, we love hearing from you. Fill in a few details below and it'll land directly with Jess."
        breadcrumbs={[{ name: "Request a Change", href: "/request-change" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-2xl rounded-sm border border-border bg-bg-alt p-8 md:p-10">
            <ChangeRequestForm />
          </div>
        </Container>
      </section>
    </>
  );
}
