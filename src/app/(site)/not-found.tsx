import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section>
      <Container className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--madam-coral)]">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--madam-muted)]">
          The page you requested does not exist or may have moved as part of the website migration.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Home</Button>
          <Button href="/contact" variant="outline">
            Contact
          </Button>
        </div>
        <p className="mt-6 text-sm">
          <Link href="/news" className="text-[var(--madam-green)] underline">
            Browse news
          </Link>
        </p>
      </Container>
    </Section>
  );
}
