"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentPropsWithoutRef } from "react";
import type { NavItem, SiteSettings } from "@/sanity/types";
import type { SanityImage } from "@/sanity/types";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { ChevronDown, Mail, MapPin, Menu, X } from "lucide-react";

function FacebookIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="10" rx="5" ry="5" />
      <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
    </svg>
  );
}

const socialIconMap = {
  facebook: FacebookIcon,
  x: X,
  youtube: YoutubeIcon,
} as const;

const socialBrandColors: Record<string, string> = {
  facebook: "#1877F2",
  youtube: "#FF0000",
  x: "#1DA1F2",
};
function LogoMark({
  siteName,
  logo,
}: {
  siteName: string;
  logo?: SanityImage;
}) {
  const sanitySrc = logo?.asset
    ? urlForImage(logo).height(80).quality(80).auto("format").url()
    : null;

  return (
    <Link href="/" className="flex items-center gap-2 py-1" aria-label={`${siteName} home`}>
      {sanitySrc ? (
        <Image
          src={sanitySrc}
          alt={siteName}
          width={160}
          height={56}
          className="h-12 w-auto object-contain md:h-14"
          priority
        />
      ) : (
        <Image
          src="/images/logo.png"
          alt={siteName}
          width={160}
          height={56}
          className="h-12 w-auto object-contain md:h-14"
          priority
        />
      )}
    </Link>
  );
}

function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden items-center gap-0 xl:flex" aria-label="Primary">
      {items.map((item) => (
        <div key={item.href + item.label} className="group relative">
          <Link
            href={item.href}
            className="inline-flex items-center gap-1 px-2.5 py-3 text-[15px] font-semibold uppercase tracking-wide text-[var(--madam-ink)] transition hover:text-[var(--madam-green)]"
          >
            {item.label}
            {item.children?.length ? (
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
            ) : null}
          </Link>
          {item.children?.length ? (
            <div className="invisible absolute left-0 top-full z-50 min-w-[280px] border-t-[3px] border-[var(--madam-green)] bg-[var(--madam-card)] py-2 opacity-0 shadow-lg transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {item.children.map((child) => (
                <div
                  key={child.href + child.label}
                  className="group/sub relative"
                >
                  <Link
                    href={child.href}
                    className="flex items-center justify-between gap-2 px-4 py-3 text-base text-[var(--madam-ink)] transition hover:bg-[var(--madam-surface)] hover:text-[var(--madam-green)]"
                  >
                    <span>{child.label}</span>
                    {child.children?.length ? (
                      <ChevronDown className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                    ) : null}
                  </Link>
                  {/* Nested items (e.g. OUR STAFF teams) — only after hover */}
                  {child.children?.length ? (
                    <ul
                      className="invisible max-h-0 overflow-hidden border-t border-black/5 bg-[var(--madam-surface)] opacity-0 transition-[max-height,opacity,visibility] duration-200 group-hover/sub:visible group-hover/sub:max-h-96 group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:max-h-96 group-focus-within/sub:opacity-100"
                    >
                      {child.children.map((gc) => (
                        <li key={gc.href}>
                          <Link
                            href={gc.href}
                            className="block px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-[var(--madam-muted)] hover:bg-white hover:text-[var(--madam-green)]"
                          >
                            {gc.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  );
}

export function Header({
  settings,
  navigation,
  logo,
}: {
  settings: SiteSettings;
  navigation: NavItem[];
  logo?: SanityImage;
}) {
  const [open, setOpen] = useState(false);
  const [expandedNested, setExpandedNested] = useState<string | null>(null);
  const siteName = settings.siteName || "MADAM";
  const address = settings.address;
  const email = settings.email;
  const socialLinks = settings.socialLinks ?? [];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[var(--madam-green)] text-white">
        <Container className="flex flex-col items-start justify-between gap-2 py-1.5 text-[13px] sm:flex-row sm:items-center sm:gap-0">
          <div className="flex w-full flex-col gap-1 text-white/90 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            {address ? (
              <div className="inline-flex items-center gap-1 sm:gap-2">
                <MapPin className="h-4 w-4" aria-hidden />
                <span>{address}</span>
              </div>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1 text-[13px] text-white/90 transition hover:text-white sm:gap-2"
              >
                <Mail className="h-4 w-4" aria-hidden />
                <span>{email}</span>
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {socialLinks.map((social) => {
              if (!social.url || !social.network) return null;
              const rawKey = social.network.toLowerCase().trim();
              if (rawKey === "youtube" || rawKey.includes("youtube") || rawKey.includes("yt")) return null;
              if (rawKey === "instagram" || rawKey.includes("insta")) return null;
              let key = rawKey;
              if (!Object.prototype.hasOwnProperty.call(socialIconMap, rawKey)) {
                if (rawKey.includes("face")) key = "facebook";
                else if (rawKey === "twitter") key = "x";
              }
              const Icon = socialIconMap[key as keyof typeof socialIconMap];
              const color = socialBrandColors[key] ?? undefined;
              return (
                <a
                  key={social.network}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white transition hover:opacity-90"
                  aria-label={social.network}
                >
                  {Icon ? (
                    <Icon className="h-4 w-4" style={{ color }} aria-hidden />
                  ) : (
                    social.network
                  )}
                </a>
              );
            })}
          </div>
        </Container>
      </div>

      <div className="dark-header border-b border-[var(--madam-border)] bg-[var(--madam-header)] shadow-sm backdrop-blur-sm">
        <Container className="flex items-center justify-between gap-4 py-2">
          <LogoMark siteName={siteName} logo={logo || settings.logo} />
          <DesktopNav items={navigation} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-[var(--madam-border)] text-[var(--madam-ink)] xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </Container>

        <div
          id="mobile-menu"
          className={cn(
            "border-t border-[var(--madam-border)] bg-[var(--madam-header)] xl:hidden",
            open ? "block" : "hidden",
          )}
        >
          <Container className="max-h-[80vh] overflow-y-auto py-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block px-2 py-2 text-sm font-semibold uppercase tracking-wide"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mb-2 ml-3 border-l-2 border-[var(--madam-green)] pl-3">
                    {item.children.map((child) => {
                      const nestedKey = `${item.href}-${child.href}-${child.label}`;
                      const isExpanded = expandedNested === nestedKey;
                      return (
                        <li key={child.href + child.label}>
                          <div className="flex items-center gap-1">
                            <Link
                              href={child.href}
                              className="block flex-1 py-1.5 text-sm text-[var(--madam-muted)]"
                              onClick={() => setOpen(false)}
                            >
                              {child.label}
                            </Link>
                            {child.children?.length ? (
                              <button
                                type="button"
                                className="px-2 py-1 text-[var(--madam-muted)]"
                                aria-expanded={isExpanded}
                                aria-label={`${isExpanded ? "Hide" : "Show"} ${child.label} links`}
                                onClick={() =>
                                  setExpandedNested(isExpanded ? null : nestedKey)
                                }
                              >
                                <svg
                                  className={cn(
                                    "h-3 w-3 transition",
                                    isExpanded && "rotate-180",
                                  )}
                                  viewBox="0 0 12 12"
                                  aria-hidden
                                >
                                  <path fill="currentColor" d="M2 4l4 4 4-4" />
                                </svg>
                              </button>
                            ) : null}
                          </div>
                          {child.children?.length && isExpanded ? (
                            <ul className="ml-2 border-l border-black/10 pl-2">
                              {child.children.map((gc) => (
                                <li key={gc.href}>
                                  <Link
                                    href={gc.href}
                                    className="block py-1 text-xs uppercase text-[var(--madam-muted)]"
                                    onClick={() => setOpen(false)}
                                  >
                                    {gc.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </div>
    </header>
  );
}
