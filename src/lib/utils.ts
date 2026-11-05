import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Decode a route/search slug, then turn it into a URL-safe kebab-case path. */
export function toUrlSlug(value?: string | null): string {
  if (!value) return "";
  let decoded = value.trim();
  try {
    decoded = decodeURIComponent(decoded.replace(/\+/g, " "));
  } catch {
    decoded = decoded.replace(/\+/g, " ");
  }
  return decoded
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function isUrlSlug(value?: string | null): boolean {
  return Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
}

export function newsPath(slug?: string | null): string {
  const path = toUrlSlug(slug);
  return path ? `/news/${path}` : "/news";
}

export function formatDate(date?: string) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

/** e.g. AUGUST 15TH, 2024 — matches MADAM newsletter cards */
export function formatNewsletterDate(date?: string) {
  if (!date) return "";
  try {
    const d = new Date(date.includes("T") ? date : `${date}T12:00:00`);
    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "ST"
        : day % 10 === 2 && day !== 12
          ? "ND"
          : day % 10 === 3 && day !== 13
            ? "RD"
            : "TH";
    const month = new Intl.DateTimeFormat("en-US", { month: "long" })
      .format(d)
      .toUpperCase();
    return `${month} ${day}${suffix}, ${d.getFullYear()}`;
  } catch {
    return date;
  }
}
