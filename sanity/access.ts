import type { CurrentUser } from "sanity";

/**
 * Soft access control for the communications officer.
 *
 * - Listed officer emails → News, News Letters, and Projects only
 *   (even if they were invited as Administrator by mistake)
 * - Other Administrators → full Studio
 * - Other non-admins (Editor / Contributor) → same limited desk
 *
 * Invite the officer as Editor so they can publish/delete without approval.
 * UI lockdown only — API hard-locks need Sanity Enterprise custom roles.
 */
const HARDCODED_NEWS_EDITOR_EMAILS: string[] = [
  "usifumbarrie3360@gmail.com",
];

/** Document types the communications officer may manage. */
export const NEWS_DESK_TYPES = ["post", "newsletterIssue", "project"] as const;

export type NewsDeskType = (typeof NEWS_DESK_TYPES)[number];

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

function userEmail(user: CurrentUser | null | undefined): string | undefined {
  const email = user?.email?.trim().toLowerCase();
  return email || undefined;
}

export function isListedNewsOfficer(user: CurrentUser | null | undefined): boolean {
  const email = userEmail(user);
  if (!email) return false;
  return newsEditorEmails().includes(email);
}

export function isNewsDeskType(schemaType: string): boolean {
  return (NEWS_DESK_TYPES as readonly string[]).includes(schemaType);
}

/**
 * Restricted News desk for:
 * 1) Explicitly listed communications officers (always), or
 * 2) Any member who is not a project Administrator
 */
export function isNewsOnlyEditor(user: CurrentUser | null | undefined): boolean {
  if (!user) return false;
  // Listed officers never get the full desk — even if invited as Admin
  if (isListedNewsOfficer(user)) return true;
  if (isAdministrator(user)) return false;
  return true;
}
