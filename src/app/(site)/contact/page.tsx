import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { ContactForm } from "@/components/content/ContactForm";
import { ContactMap } from "@/components/content/ContactMap";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Contact" };

function formatAddressLines(address: string) {
  // Prefer a clean two-line split like the live site
  const cleaned = address.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.*?Highway),?\s*(.+)$/i);
  if (match) {
    return [`${match[1].replace(/,$/, "")},`, match[2]];
  }
  const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return [`${parts[0]},`, parts.slice(1).join(", ")];
  }
  return [cleaned];
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const address =
    settings.address || "250 Makambo Magburaka Highway, Makeni, Sierra Leone";
  const phone = settings.phone || "+232-76 687 091";
  const email = settings.email || "info@madam-sl.org";
  const addressLines = formatAddressLines(address);

  return (
    <>
      <PageHero title="Contact Us" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-3 md:gap-0">
            <ContactFact
              watermark="visit us"
              label="Address"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              lines={addressLines}
              bordered
            />
            <ContactFact
              watermark="call us"
              label="Phone"
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              lines={[phone]}
              bordered
            />
            <ContactFact
              watermark="contact us"
              label="Email"
              href={`mailto:${email}`}
              lines={[email]}
            />
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <ContactForm />
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <ContactMap address={address} mapEmbedUrl={settings.mapEmbedUrl} />
        </Container>
      </Section>
    </>
  );
}

function ContactFact({
  watermark,
  label,
  lines,
  href,
  bordered,
}: {
  watermark: string;
  label: string;
  lines: string[];
  href?: string;
  bordered?: boolean;
}) {
  const value = (
    <span className="mt-3 block text-lg font-medium leading-snug text-[var(--madam-green)] md:text-xl">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`relative px-2 py-6 md:px-8 md:py-8 ${
        bordered
          ? "md:border-r md:border-[var(--madam-border)]"
          : ""
      }`}
    >
      <p
        className="pointer-events-none absolute left-2 top-4 select-none text-4xl font-bold uppercase tracking-wide text-black/[0.06] md:left-8 md:top-6 md:text-5xl lg:text-6xl"
        aria-hidden
      >
        {watermark}
      </p>
      <div className="relative">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--madam-ink)]">
          {label}
        </h2>
        {href ? (
          <a
            href={href}
            className="transition hover:opacity-80"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
