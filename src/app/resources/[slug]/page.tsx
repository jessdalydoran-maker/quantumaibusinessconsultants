import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Container } from "@/components/Container";
import { getAllResources, getResourceBySlug } from "@/lib/content/resources";
import { site } from "@/lib/site";
import { articleSchema, jsonLdScript } from "@/lib/schema";

export function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: resource.meta.title,
    description: resource.meta.description,
    alternates: { canonical: `/resources/${slug}` },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  const { meta, content } = resource;

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={meta.title}
        dek={meta.excerpt}
        breadcrumbs={[
          { name: "Resources", href: "/resources" },
          { name: meta.title, href: `/resources/${slug}` },
        ]}
      >
        <p className="mt-6 text-xs uppercase tracking-wide text-text-muted">
          {meta.author} &middot;{" "}
          {new Date(meta.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </PageHero>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleSchema({
            headline: meta.title,
            description: meta.description,
            url: `${site.url}/resources/${slug}`,
            datePublished: meta.date,
            authorName: meta.author,
          })
        )}
      />

      <section className="py-16 md:py-24">
        <Container>
          <article className="prose prose-invert max-w-3xl prose-headings:font-display prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-text">
            <MDXRemote source={content} />
          </article>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
