"use client";

import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section>
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--madam-muted)]">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button href="/" variant="outline">
            Home
          </Button>
        </div>
      </Container>
    </Section>
  );
}
