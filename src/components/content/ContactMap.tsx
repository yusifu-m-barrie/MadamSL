import { MapPin } from "lucide-react";

type Props = {
  address: string;
  /** Optional custom Google Maps embed URL from Studio */
  mapEmbedUrl?: string;
};

function buildEmbedUrl(address: string) {
  const q = encodeURIComponent(address);
  return `https://maps.google.com/maps?q=${q}&z=16&hl=en&output=embed`;
}

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function ContactMap({ address, mapEmbedUrl }: Props) {
  const src = mapEmbedUrl?.trim() || buildEmbedUrl(address);

  return (
    <div className="overflow-hidden border border-[var(--madam-border)] bg-[var(--madam-surface)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--madam-border)] bg-[var(--madam-card)] px-4 py-3">
        <p className="flex items-start gap-2 text-sm text-[var(--madam-ink)] md:text-base">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--madam-green)]"
            aria-hidden
          />
          <span>{address}</span>
        </p>
        <a
          href={mapsLink(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--madam-green)] transition hover:text-[var(--madam-green-dark)]"
        >
          Open in Maps
          <span aria-hidden>↗</span>
        </a>
      </div>
      <div className="relative aspect-[16/9] w-full min-h-[280px] md:min-h-[380px]">
        <iframe
          title={`Map — ${address}`}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
