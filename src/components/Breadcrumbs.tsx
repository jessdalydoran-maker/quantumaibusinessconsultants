import Link from "next/link";
import { site } from "@/lib/site";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const full = [{ name: "Home", href: "/" }, ...items];
  const schema = breadcrumbSchema(full.map((i) => ({ name: i.name, url: `${site.url}${i.href}` })));

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-text-muted">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schema)} />
      <ol className="flex flex-wrap items-center gap-2">
        {full.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === full.length - 1 ? (
              <span className="text-text">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-gold">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
