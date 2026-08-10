import Link from "next/link";
import type { NavItem, SiteSettings } from "@/sanity/types";
import { Container } from "@/components/ui/Container";

export function Footer({
  settings,
  navigation,
}: {
  settings: SiteSettings;
  navigation: NavItem[];
}) {
  return (
    <footer className="mt-auto bg-[var(--madam-ink)] text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-2xl font-bold tracking-wide">{settings.siteName || "MADAM"}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Mankind&apos;s Activities for Development Accreditation Movement — helping people to help
            themselves through agriculture, skills development, and community partnerships in Sierra
            Leone.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[var(--madam-green)]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
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
          <ul className="space-y-3 text-sm text-white/80">
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
            {settings.socialLinks?.map((s) =>
              s.url ? (
                <a
                  key={s.network}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--madam-green)]"
                >
                  {s.network === "x" ? "X" : s.network}
                </a>
              ) : null,
            )}
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 text-xs text-white/50 sm:flex-row sm:justify-between">
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
