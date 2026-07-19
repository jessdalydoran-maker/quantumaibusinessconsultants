import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-bronze">404</p>
        <h1 className="mt-4 font-display text-4xl text-text md:text-5xl">
          That page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-text-muted">
          The page you&apos;re looking for may have moved. Try the homepage, or get in touch if
          you followed a broken link.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/contact" variant="secondary">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
