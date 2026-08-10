import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
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
