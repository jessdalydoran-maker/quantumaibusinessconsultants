import { ReactNode } from "react";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  dek,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  breadcrumbs: { name: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border py-16 md:py-24">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-bronze">{eyebrow}</p>
        <h1 className="text-balance mt-4 max-w-3xl font-display text-4xl leading-tight text-text md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-muted">{dek}</p>
        {children}
      </Container>
    </section>
  );
}
