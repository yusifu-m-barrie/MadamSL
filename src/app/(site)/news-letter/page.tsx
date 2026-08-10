import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { NewsletterGrid } from "@/components/content/NewsletterGrid";
import { getNewsletters } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "News Letter" };

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NewsletterPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const all = await getNewsletters();
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(pageParam || "1", 10) || 1),
  );
  const start = (page - 1) * PAGE_SIZE;
  const issues = all.slice(start, start + PAGE_SIZE);

  return (
    <>
      <PageHero title="News Letter" />
      <Section>
        <Container>
          <SectionHeading title="Download News Letter" />
          <NewsletterGrid issues={issues} />

          {totalPages > 1 ? (
            <nav
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label="Newsletter pagination"
            >
              {page > 1 ? (
                <Link
                  href={
                    page === 2 ? "/news-letter" : `/news-letter?page=${page - 1}`
                  }
                  className="inline-flex items-center gap-1 border border-[var(--madam-border)] bg-[var(--madam-card)] px-4 py-2 text-sm font-semibold text-[var(--madam-ink)] transition hover:border-[var(--madam-green)] hover:text-[var(--madam-green)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              ) : null}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? "/news-letter" : `/news-letter?page=${n}`}
                  aria-current={n === page ? "page" : undefined}
                  className={
                    n === page
                      ? "inline-flex h-10 min-w-10 items-center justify-center bg-[var(--madam-green)] px-3 text-sm font-bold text-white"
                      : "inline-flex h-10 min-w-10 items-center justify-center border border-[var(--madam-border)] bg-[var(--madam-card)] px-3 text-sm font-semibold text-[var(--madam-ink)] transition hover:border-[var(--madam-green)] hover:text-[var(--madam-green)]"
                  }
                >
                  {n}
                </Link>
              ))}

              {page < totalPages ? (
                <Link
                  href={`/news-letter?page=${page + 1}`}
                  className="inline-flex items-center gap-1 border border-[var(--madam-border)] bg-[var(--madam-card)] px-4 py-2 text-sm font-semibold text-[var(--madam-ink)] transition hover:border-[var(--madam-green)] hover:text-[var(--madam-green)]"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
