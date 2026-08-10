"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NavItem, SiteSettings } from "@/sanity/types";
import type { SanityImage } from "@/sanity/types";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { ChevronDown, Menu, X } from "lucide-react";

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

  return (
    <header className="dark-header sticky top-0 z-50 border-b border-[var(--madam-border)] bg-[var(--madam-header)] shadow-sm backdrop-blur-sm">
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
    </header>
  );
}
