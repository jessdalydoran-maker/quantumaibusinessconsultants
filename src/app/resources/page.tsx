import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { getAllResources } from "@/lib/content/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Straight answers to the questions independent trades and service business owners actually ask about AI automation.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const posts = getAllResources();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Straight answers, not AI trend pieces."
        dek="Written for the questions independent business owners actually ask before adopting AI — updated as our thinking and the field move on."
        breadcrumbs={[{ name: "Resources", href: "/resources" }]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="divide-y divide-border border-t border-border">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/resources/${post.slug}`}
                className="group flex flex-col gap-3 py-10 hover:bg-bg-alt md:flex-row md:items-start md:gap-10 md:px-4"
              >
                <span className="shrink-0 text-xs uppercase tracking-wide text-text-muted md:w-32">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div>
                  <h2 className="font-display text-xl text-text group-hover:text-gold md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-text-muted">{post.excerpt}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-bronze">
                    {post.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
