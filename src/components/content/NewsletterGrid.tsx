import { Download } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { formatNewsletterDate } from "@/lib/utils";
import { resolveImageSrc } from "@/sanity/lib/image";
import type { NewsletterIssue } from "@/sanity/types";

function coverUrl(issue: NewsletterIssue): string | null {
  const fromSanity = resolveImageSrc(issue.coverImage, 1000, 320);
  if (fromSanity) return fromSanity;
  return issue.coverImage?.asset?.url || null;
}

export function NewsletterGrid({ issues }: { issues: NewsletterIssue[] }) {
  if (!issues.length) {
    return (
      <p className="text-[var(--madam-muted)]">
        Newsletter downloads will appear here once uploaded in Sanity Studio.
      </p>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {issues.map((issue, i) => {
        const coverSrc = coverUrl(issue);
        const href = issue.fileUrl || "#";
        return (
          <Reveal key={issue._id} delayMs={Math.min(i * 50, 150)}>
            <article className="flex h-full flex-col border border-[var(--madam-border)] bg-[var(--madam-card)] p-5 shadow-sm md:p-6">
              {coverSrc ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mb-5 block w-full overflow-hidden bg-white"
                  aria-label={`Open ${issue.title}`}
                >
                  {/* Cover graphic already includes logos, date, and title */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverSrc}
                    alt={issue.title}
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  />
                </a>
              ) : (
                <div className="mb-5 space-y-4 text-center">
                  {issue.date ? (
                    <div className="relative py-2">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--madam-green)]" />
                      <span className="relative bg-[var(--madam-card)] px-3 text-sm font-bold uppercase tracking-wide text-[var(--madam-green)]">
                        {formatNewsletterDate(issue.date)}
                      </span>
                    </div>
                  ) : null}
                  <h3 className="text-lg font-bold uppercase leading-snug text-[var(--madam-green)] md:text-xl">
                    {issue.title}
                  </h3>
                </div>
              )}

              <div className="mt-auto">
                {issue.fileUrl ? (
                  <a
                    href={issue.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 bg-[var(--madam-green)] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--madam-green-dark)]"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    Download News Letter
                  </a>
                ) : (
                  <span className="text-sm text-[var(--madam-muted)]">
                    PDF not uploaded yet
                  </span>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
