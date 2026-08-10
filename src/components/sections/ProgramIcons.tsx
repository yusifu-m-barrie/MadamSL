/** Simple green icons matching the live MADAM programs band */
export function ProgramIcon({
  kind,
}: {
  kind: "agriculture" | "skills" | "income";
}) {
  const className = "mx-auto h-16 w-16 text-[var(--madam-green)] md:h-[72px] md:w-[72px]";

  if (kind === "agriculture") {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M32 42V28M32 28c0-6 4-10 10-12-2 8-6 12-10 12zm0 0c0-6-4-10-10-12 2 8 6 12 10 12z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 44h24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 44c2 3 5 4 8 4s6-1 8-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "skills") {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path
          d="M20 40c0-4 3.5-7 8-7h8c4.5 0 8 3 8 7v2H20v-2z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="24" r="6" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M14 36c0-3 2.5-5.5 6-5.5M50 36c0-3-2.5-5.5-6-5.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="26" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="26" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M26 14l1.5 3H31l-2.8 2 1 3L26 20l-3.2 2 1-3L21 17h3.5L26 14zM38 12l1.2 2.5H42l-2.3 1.7.9 2.5L38 17.5 35.4 19l.9-2.5L34 14.5h2.8L38 12z"
          fill="currentColor"
        />
        <circle cx="46" cy="44" r="8" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M46 40v8M42 44h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M14 48V28h8v20H14z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 48V20h8v28h-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 48V12h8v36h-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path
        d="M12 50h40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M18 22l12-8 10 6 12-10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 10h6v6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function iconKindFromTitle(title?: string): "agriculture" | "skills" | "income" {
  const t = (title || "").toLowerCase();
  if (t.includes("skill") || t.includes("youth")) return "skills";
  if (t.includes("income") || t.includes("generat")) return "income";
  return "agriculture";
}
