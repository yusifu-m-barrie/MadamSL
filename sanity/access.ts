import type { CurrentUser } from "sanity";

/**
 * Studio access is allowlist + role based.
 *
 * 1. Invite the person in Sanity Manage (Editor for content roles, Admin for full CMS).
 * 2. Add their email to the matching NEXT_PUBLIC_SANITY_*_EMAILS list and redeploy.
 *
 * Unlisted Editor accounts see an "Access denied" desk (no documents).
 * Listed restricted emails never get the full desk — even if invited as Admin.
 * Unlisted Sanity Administrators keep full Studio so the project owner is not locked out.
 *
 * UI lockdown only — API hard-locks need Sanity Enterprise custom roles.
 */

export const STUDIO_ROLES = {
  admin: {
    label: "Administrator",
    types: "*" as const,
  },
  news: {
    label: "News",
    types: ["post", "newsletterIssue"] as const,
  },
  projects: {
    label: "Projects",
    types: ["project"] as const,
  },
  staff: {
    label: "Staff",
    types: ["staffMember"] as const,
  },
  pages: {
    label: "Pages",
    types: ["page", "whatWeDoPage"] as const,
  },
  communications: {
    label: "Communications",
    types: ["post", "newsletterIssue", "project"] as const,
  },
} as const;

export type StudioRole = keyof typeof STUDIO_ROLES;

export type StudioAccess =
  | { kind: "denied" }
  | { kind: "admin"; roles: StudioRole[] }
  | { kind: "restricted"; roles: StudioRole[]; types: string[]; deskTitle: string };

const ROLE_ENV: Record<StudioRole, string> = {
  admin: "NEXT_PUBLIC_SANITY_ADMIN_EMAILS",
  news: "NEXT_PUBLIC_SANITY_NEWS_EMAILS",
  projects: "NEXT_PUBLIC_SANITY_PROJECTS_EMAILS",
  staff: "NEXT_PUBLIC_SANITY_STAFF_EMAILS",
  pages: "NEXT_PUBLIC_SANITY_PAGES_EMAILS",
  communications: "NEXT_PUBLIC_SANITY_COMMS_EMAILS",
};

/** Always-restricted communications officers (also set via env). */
const HARDCODED_ROLE_EMAILS: Partial<Record<StudioRole, string[]>> = {
  admin: ["ayonbarrie4@gmail.com"],
  communications: ["usifumbarrie3360@gmail.com"],
  pages: ["codewithbah@gmail.com"],
};

/** Page editors cannot open or change these CMS pages. */
export const LOCKED_PAGE_SLUGS = ["home", "contact"] as const;
export const LOCKED_PAGE_IDS = ["page-home", "page-contact"] as const;

const DESK_TITLE: Record<Exclude<StudioRole, "admin">, string> = {
  news: "News",
  projects: "Projects",
  staff: "Staff",
  pages: "Pages",
  communications: "Communications",
};

function parseEnvEmails(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function emailsForRole(role: StudioRole): string[] {
  const fromEnv = parseEnvEmails(process.env[ROLE_ENV[role]]);
  const hardcoded = (HARDCODED_ROLE_EMAILS[role] ?? []).map((e) => e.trim().toLowerCase());
  const extra =
    role === "communications"
      ? parseEnvEmails(process.env.NEXT_PUBLIC_SANITY_NEWS_EDITOR_EMAILS)
      : [];
  return [...new Set([...hardcoded, ...fromEnv, ...extra])];
}

function userEmail(user: CurrentUser | null | undefined): string | undefined {
  const email = user?.email?.trim().toLowerCase();
  return email || undefined;
}

export function isAdministrator(user: CurrentUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.roles?.some((r) => r.name === "administrator") ||
    (user as { role?: string }).role === "administrator"
  );
}

export function rolesForUser(user: CurrentUser | null | undefined): StudioRole[] {
  const email = userEmail(user);
  if (!email) return [];

  return (Object.keys(STUDIO_ROLES) as StudioRole[]).filter((role) =>
    emailsForRole(role).includes(email),
  );
}

function unionTypes(roles: StudioRole[]): string[] {
  const types = new Set<string>();
  for (const role of roles) {
    const spec = STUDIO_ROLES[role].types;
    if (spec === "*") continue;
    for (const type of spec) types.add(type);
  }
  return [...types];
}

function restrictedDeskTitle(roles: StudioRole[]): string {
  const named = roles.filter((role): role is Exclude<StudioRole, "admin"> => role !== "admin");
  if (named.length === 1) return DESK_TITLE[named[0]];
  if (named.length === 0) return "Studio";
  return "Studio";
}

export function studioAccess(user: CurrentUser | null | undefined): StudioAccess {
  if (!user) return { kind: "denied" };

  const roles = rolesForUser(user);

  if (roles.includes("admin")) {
    return { kind: "admin", roles };
  }

  if (roles.length > 0) {
    return {
      kind: "restricted",
      roles,
      types: unionTypes(roles),
      deskTitle: restrictedDeskTitle(roles),
    };
  }

  // Project owner escape hatch — not on the allowlist, but already a Sanity Admin.
  if (isAdministrator(user)) {
    return { kind: "admin", roles: ["admin"] };
  }

  return { kind: "denied" };
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
  const access = studioAccess(user);
  return access.kind === "restricted" && access.roles.includes("pages");
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

/** @deprecated Use studioAccess / canEditSchemaType */
export const NEWS_DESK_TYPES = STUDIO_ROLES.communications.types;
export type NewsDeskType = (typeof NEWS_DESK_TYPES)[number];

export function isNewsDeskType(schemaType: string): boolean {
  return (NEWS_DESK_TYPES as readonly string[]).includes(schemaType);
}

export function isNewsOnlyEditor(user: CurrentUser | null | undefined): boolean {
  return isRestrictedEditor(user);
}

export function newsEditorEmails(): string[] {
  return emailsForRole("communications");
}
