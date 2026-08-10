import type { CurrentUser } from "sanity";

/**
 * Soft access control for the communications officer.
 *
 * Default behaviour (recommended for deploy):
 * - Administrators → full Studio (all pages, projects, staff, etc.)
 * - Everyone else (Editor / Contributor) → News desk only
 *
 * Optional: set NEXT_PUBLIC_SANITY_NEWS_EDITOR_EMAILS (comma-separated)
 * to lock the News desk to specific emails only. Until that is set,
 * any non-admin member invited as Editor only sees News.
 *
 * Invite the officer as Editor (not Contributor) so they can publish,
 * edit, and delete posts without your approval.
 *
 * This is UI-level protection. API-hard locks need Sanity Enterprise.
 */
const HARDCODED_NEWS_EDITOR_EMAILS: string[] = [
  // Optional fallback if you prefer not to use env, e.g.:
  // "comms@madam-sl.org",
];

function parseEnvEmails(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function newsEditorEmails(): string[] {
  const fromEnv = parseEnvEmails(process.env.NEXT_PUBLIC_SANITY_NEWS_EDITOR_EMAILS);
  const hardcoded = HARDCODED_NEWS_EDITOR_EMAILS.map((e) => e.trim().toLowerCase()).filter(
    Boolean,
  );
  return [...new Set([...hardcoded, ...fromEnv])];
}

export function isAdministrator(user: CurrentUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.roles?.some((r) => r.name === "administrator") ||
    (user as { role?: string }).role === "administrator"
  );
}

export function isNewsOnlyEditor(user: CurrentUser | null | undefined): boolean {
  if (!user) return false;
  if (isAdministrator(user)) return false;

  const allowlist = newsEditorEmails();
  // No allowlist yet → every non-admin is news-only (safe default for MADAM)
  if (!allowlist.length) return true;

  if (!user.email) return true;
  return allowlist.includes(user.email.toLowerCase());
}
