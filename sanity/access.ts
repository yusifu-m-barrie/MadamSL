import type { CurrentUser } from "sanity";

/**
 * Studio UI access:
 *
 * - Listed admin emails → full CMS (settings, navigation, images, videos, etc.)
 * - Every other invited member → content sections only
 *   Pages (including Home and Contact), News, What We Do, Projects, Staff,
 *   Partners, News Letters, Locations
 *
 * On the Free plan invite people as Administrator; this still hides admin sections.
 * UI lockdown only — API hard-locks need Sanity Enterprise custom roles.
 */

export const CONTENT_EDITOR_TYPES = [
  "page",
  "siteSettings",
  "post",
  "whatWeDoPage",
  "project",
  "staffMember",
  "partner",
  "newsletterIssue",
  "location",
] as const;

const HARDCODED_ADMIN_EMAILS = ["ayonbarrie4@gmail.com"];

/** Contact details live on siteSettings; editors may change only these fields. */
export const EDITOR_CONTACT_FIELDS = ["address", "phone", "email", "mapEmbedUrl"] as const;

export type StudioAccess =
  | { kind: "denied" }
  | { kind: "admin" }
  | { kind: "restricted"; types: string[]; deskTitle: string };

function parseEnvEmails(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function userEmail(user: CurrentUser | null | undefined): string | undefined {
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

export function isListedAdmin(user: CurrentUser | null | undefined): boolean {
  const email = userEmail(user);
  if (!email) return false;
  return adminEmails().includes(email);
}

export function isAdministrator(user: CurrentUser | null | undefined): boolean {
  return isListedAdmin(user);
}

export function studioAccess(user: CurrentUser | null | undefined): StudioAccess {
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

export function isRestrictedEditor(user: CurrentUser | null | undefined): boolean {
  return studioAccess(user).kind === "restricted";
}

/** Hide non-contact Site Settings fields from invited editors. */
export function hideAdminOnlySiteSetting(
  fieldName: string,
  user: CurrentUser | null | undefined,
): boolean {
  if (!isRestrictedEditor(user)) return false;
  return !(EDITOR_CONTACT_FIELDS as readonly string[]).includes(fieldName);
}

export function canEditSchemaType(
  user: CurrentUser | null | undefined,
  schemaType: string,
): boolean {
  const access = studioAccess(user);
  if (access.kind === "denied") return false;
  if (access.kind === "admin") return true;
  return access.types.includes(schemaType);
}

export function canEditDocument(
  user: CurrentUser | null | undefined,
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

export function isNewsOnlyEditor(user: CurrentUser | null | undefined): boolean {
  return isRestrictedEditor(user);
}

export function newsEditorEmails(): string[] {
  return [];
}
