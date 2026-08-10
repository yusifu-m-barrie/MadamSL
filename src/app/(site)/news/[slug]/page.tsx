import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  User,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { RichText, PlainParagraphs } from "@/components/content/RichText";
import { NewsGrid } from "@/components/sections/SectionRenderer";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getPosts } from "@/lib/content";
import { resolveImageSrc } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "News" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.18 2.09 16.09 2 15 2c-2.9 0-5 1.72-5 5v2.5H7v4h3V22h4z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.94 6.5A2.19 2.19 0 1 1 4.75 4.3 2.19 2.19 0 0 1 6.94 6.5zM4.9 8.64h4.08V20H4.9zm6.53 0h3.91v1.55h.06c.54-1.03 1.87-2.12 3.85-2.12 4.12 0 4.88 2.71 4.88 6.24V20h-4.08v-5.39c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.07 1.4-2.07 2.85V20h-4.06z" />
    </svg>
  );
}

function ShareLinks({ title, slug }: { title: string; slug: string }) {
  const url =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/news/${slug}`
      : `https://www.madam-sl.org/news/${slug}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--madam-muted)]">
      <span className="font-medium">Share on</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1877f2] text-white transition hover:opacity-90"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="h-4 w-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:opacity-90"
        aria-label="Share on X"
      >
        <span className="text-xs font-bold">𝕏</span>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0a66c2] text-white transition hover:opacity-90"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="h-4 w-4" />
      </a>
    </div>
  );
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPosts();
  const index = allPosts.findIndex((p) => p.slug === slug);
  const prev = index >= 0 ? allPosts[index + 1] : undefined; // older
  const next = index > 0 ? allPosts[index - 1] : undefined; // newer
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const body = "body" in post ? post.body : undefined;
  const mainSrc = resolveImageSrc(
    post.mainImage as SanityImage | undefined,
    1200,
    700,
  );
  const author =
    ("author" in post && post.author && typeof post.author === "object"
      ? (post.author as { name?: string }).name
      : undefined) || "madam";

  return (
    <>
      <Section className="pt-10 md:pt-14">
        <Container className="max-w-3xl">
          {mainSrc ? (
            <div className="relative mb-8 aspect-[16/10] w-full overflow-hidden bg-[var(--madam-surface)]">
              <Image
                src={mainSrc}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                quality={78}
                priority
              />
            </div>
          ) : null}

          <h1 className="text-3xl font-bold leading-tight text-[var(--madam-ink)] md:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-col gap-4 border-b border-[var(--madam-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--madam-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" aria-hidden />
                {author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" aria-hidden />
                No Comment
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" aria-hidden />
                Views
              </span>
            </div>
            <ShareLinks title={post.title} slug={slug} />
          </div>

          <div className="mt-8">
            {body ? (
              <RichText value={body} />
            ) : post.excerpt ? (
              <PlainParagraphs text={post.excerpt} />
            ) : null}
          </div>

          <nav
            className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--madam-border)] pt-6"
            aria-label="Post navigation"
          >
            {prev ? (
              <Link
                href={`/news/${prev.slug}`}
                className="group flex max-w-[45%] items-center gap-2 text-sm font-semibold text-[var(--madam-green)] transition hover:text-[var(--madam-green-dark)]"
              >
                <ChevronLeft className="h-5 w-5 shrink-0" />
                <span className="line-clamp-2 group-hover:underline">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/news/${next.slug}`}
                className="group flex max-w-[45%] items-center justify-end gap-2 text-right text-sm font-semibold text-[var(--madam-green)] transition hover:text-[var(--madam-green-dark)]"
              >
                <span className="line-clamp-2 group-hover:underline">
                  {next.title}
                </span>
                <ChevronRight className="h-5 w-5 shrink-0" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </Container>
      </Section>

      {related.length ? (
        <Section className="bg-[var(--madam-surface)]">
          <Container>
            <SectionHeading title="Related Posts" />
            <NewsGrid posts={related} />
            <div className="mt-8 text-center">
              <Link
                href="/news"
                className="inline-flex items-center justify-center border-2 border-[var(--madam-green)] px-7 py-3.5 text-base font-semibold uppercase tracking-wide text-[var(--madam-green)] transition hover:bg-[var(--madam-green)] hover:text-white"
              >
                More News
              </Link>
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
