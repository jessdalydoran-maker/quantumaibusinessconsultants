import type { Faq } from "@/lib/content/services";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;

  return (
    <div className="divide-y divide-border border-t border-border">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
            <span className="min-w-0 break-words font-display text-lg text-text">{faq.question}</span>
            <span
              aria-hidden
              className="shrink-0 text-2xl text-gold transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl text-text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
