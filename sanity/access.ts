import type { CurrentUser } from "sanity";

/**
 * Studio UI access:
 *
 * - Listed admin emails → full CMS (settings, navigation, images, videos, etc.)
 * - Every other invited member → content sections only
 *   Pages, News, What We Do, Projects, Staff, Partners, News Letters, Locations
 *   Home and Contact pages stay locked.
 *
 * On the Free plan invite people as Administrator; this still hides admin sections.
 * UI lockdown only — API hard-locks need Sanity Enterprise custom roles.
 */

export const CONTENT_EDITOR_TYPES = [
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

/** Page editors cannot open or change these CMS pages. */
export const LOCKED_PAGE_SLUGS = ["home", "contact"] as const;
export const LOCKED_PAGE_IDS = ["page-home", "page-contact"] as const;

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

export function canEditSchemaType(
  user: CurrentUser | null | undefined,
  schemaType: string,
): boolean {
  const access = studioAccess(user);
  if (access.kind === "denied") return false;
  if (access.kind === "admin") return true;
  return access.types.includes(schemaType);
}

export function publishedDocumentId(documentId?: string | null): string | undefined {
  if (!documentId) return undefined;
  return documentId.replace(/^drafts\./, "");
}

export function isLockedPageDocument(documentId?: string | null): boolean {
  const id = publishedDocumentId(documentId);
  if (!id) return false;
  if ((LOCKED_PAGE_IDS as readonly string[]).includes(id)) return true;
  return (LOCKED_PAGE_SLUGS as readonly string[]).some((slug) => id === `page-${slug}`);
}

export function shouldHideLockedPages(user: CurrentUser | null | undefined): boolean {
  return studioAccess(user).kind === "restricted";
}

export function lockedPagesGroqFilter(): string {
  const slugs = LOCKED_PAGE_SLUGS.map((slug) => `"${slug}"`).join(", ");
  const ids = LOCKED_PAGE_IDS.flatMap((id) => [`"${id}"`, `"drafts.${id}"`]).join(", ");
  return `!(slug.current in [${slugs}]) && !(_id in [${ids}])`;
}

export function canEditDocument(
  user: CurrentUser | null | undefined,
  schemaType: string,
  documentId?: string | null,
): boolean {
  if (!canEditSchemaType(user, schemaType)) return false;
  if (schemaType === "page" && shouldHideLockedPages(user) && isLockedPageDocument(documentId)) {
    return false;
  }
  return true;
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
