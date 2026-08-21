import Link from "next/link";
import { X } from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";
import type { NavItem, SiteSettings } from "@/sanity/types";
import { Container } from "@/components/ui/Container";

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

export function Footer({
  settings,
  navigation,
}: {
  settings: SiteSettings;
  navigation: NavItem[];
}) {
  return (
    <footer className="mt-auto border-t border-[var(--madam-border)] bg-[var(--madam-surface)] text-[var(--foreground)] shadow-sm shadow-black/5 dark:shadow-white/5">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-2xl font-bold tracking-wide">{settings.siteName || "MADAM"}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--madam-muted)]">
            Mankind&apos;s Activities for Development Accreditation Movement — helping people to help
            themselves through agriculture, skills development, and community partnerships in Sierra
            Leone.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--madam-green)]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[var(--madam-muted)]">
            {navigation.slice(0, 7).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--madam-green)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--madam-green)]">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-[var(--madam-muted)]">
            {settings.address ? <li>{settings.address}</li> : null}
            {settings.phone ? (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-[var(--madam-green)]">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-[var(--madam-green)]">
                  {settings.email}
                </a>
              </li>
            ) : null}
          </ul>
          <div className="mt-4 flex gap-3 text-sm uppercase tracking-wide">
            {settings.socialLinks?.map((s) => {
              if (!s.url || !s.network) return null;
              const rawKey = s.network.toLowerCase().trim();
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
                  key={s.network}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white transition hover:opacity-90"
                  aria-label={s.network}
                >
                  {Icon ? <Icon className="h-4 w-4" style={{ color }} aria-hidden /> : s.network}
                </a>
              );
            })}
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 text-xs text-[var(--madam-muted)] sm:flex-row sm:justify-between">
          <p>
            <CopyrightLine
              text={
                settings.copyright ||
                "Copyright © MADAM SL | Developed By Link Corporation Limited SL"
              }
            />
          </p>
          <p>Helping People to help themselves</p>
        </Container>
      </div>
    </footer>
  );
}

const LINK_CORP_LABEL = "Link Corporation Limited SL";
const LINK_CORP_URL = "https://www.linkcorp-sl.com/";

function CopyrightLine({ text }: { text: string }) {
  const idx = text.indexOf(LINK_CORP_LABEL);
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <a
        href={LINK_CORP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/30 underline-offset-2 transition hover:text-[var(--madam-green)] hover:decoration-[var(--madam-green)]"
      >
        {LINK_CORP_LABEL}
      </a>
      {text.slice(idx + LINK_CORP_LABEL.length)}
    </>
  );
}
