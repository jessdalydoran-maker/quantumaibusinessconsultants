import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { AuthorByline } from "@/components/AuthorByline";
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
  const related = getAllResources()
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

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
          <div className="max-w-3xl">
            <AuthorByline authorName={meta.author} />
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border py-16 md:py-24">
          <Container>
            <h2 className="font-display text-xl text-text">Related reading</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/resources/${post.slug}`}
                  className="group block rounded-sm border border-border p-6 hover:border-gold"
                >
                  <h3 className="font-display text-lg text-text group-hover:text-gold">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
