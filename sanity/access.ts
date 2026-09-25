/**
 * Studio UI access:
 *
 * - Listed admin emails → full CMS including Categories and Authors
 * - Every other invited member → the Content sidebar:
 *   Site Settings, Website Images, Homepage Videos, Navigation,
 *   Pages, News, What We Do, Projects, Staff, Partners, News Letters, Locations
 *
 * On the Free plan invite people as Administrator; this still hides Vision
 * and taxonomy (Categories / Authors).
 * UI lockdown only — API hard-locks need Sanity Enterprise custom roles.
 */

export const CONTENT_EDITOR_TYPES = [
  "siteSettings",
  "siteImages",
  "homepageVideos",
  "navigation",
  "page",
  "post",
  "whatWeDoPage",
  "project",
  "staffMember",
  "partner",
  "newsletterIssue",
  "location",
] as const;

const HARDCODED_ADMIN_EMAILS = ["ayonbarrie4@gmail.com"];

export type StudioAccess =
  | { kind: "denied" }
  | { kind: "admin" }
  | { kind: "restricted"; types: string[]; deskTitle: string };

/** Studio user as seen in schema callbacks (Sanity omits legacy `role`). */
type StudioUser = {
  email?: string | null;
} | null | undefined;

function parseEnvEmails(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function userEmail(user: StudioUser): string | undefined {
  const email = user?.email?.trim().toLowerCase();
  return email || undefined;
}

export function adminEmails(): string[] {
  return [
    ...new Set([
      ...HARDCODED_ADMIN_EMAILS.map((e) => e.trim().toLowerCase()),
      ...parseEnvEmails(process.env.NEXT_PUBLIC_SANITY_ADMIN_EMAILS),
    ]),
  ];
}

export function isListedAdmin(user: StudioUser): boolean {
  const email = userEmail(user);
  if (!email) return false;
  return adminEmails().includes(email);
}

export function isAdministrator(user: StudioUser): boolean {
  return isListedAdmin(user);
}

export function studioAccess(user: StudioUser): StudioAccess {
  if (!user) return { kind: "denied" };

  if (isListedAdmin(user)) {
    return { kind: "admin" };
  }

  return {
    kind: "restricted",
    types: [...CONTENT_EDITOR_TYPES],
    deskTitle: "Content",
  };
}

export function isRestrictedEditor(user: StudioUser): boolean {
  return studioAccess(user).kind === "restricted";
}

export function canEditSchemaType(user: StudioUser, schemaType: string): boolean {
  const access = studioAccess(user);
  if (access.kind === "denied") return false;
  if (access.kind === "admin") return true;
  return access.types.includes(schemaType);
}

export function canEditDocument(
  user: StudioUser,
  schemaType: string,
  _documentId?: string | null,
): boolean {
  return canEditSchemaType(user, schemaType);
}

/** @deprecated Use CONTENT_EDITOR_TYPES */
export const NEWS_DESK_TYPES = ["post", "newsletterIssue", "project"] as const;
export type NewsDeskType = (typeof NEWS_DESK_TYPES)[number];

export function isNewsDeskType(schemaType: string): boolean {
  return (NEWS_DESK_TYPES as readonly string[]).includes(schemaType);
}

export function isNewsOnlyEditor(user: StudioUser): boolean {
  return isRestrictedEditor(user);
}

export function newsEditorEmails(): string[] {
  return [];
}
