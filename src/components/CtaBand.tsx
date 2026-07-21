import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Ready to talk about your business specifically?",
  dek = "Book a no-obligation discovery call. No jargon, no pitch — just an hour spent understanding how you actually work.",
}: {
  title?: string;
  dek?: string;
}) {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <Container className="text-center">
        <h2 className="text-balance mx-auto max-w-2xl font-display text-3xl text-text md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-text-muted">{dek}</p>
        <div className="mt-8">
          <Button href={site.bookingUrl} variant="primary">
            Book a Discovery Call
          </Button>
        </div>
      </Container>
    </section>
  );
}
