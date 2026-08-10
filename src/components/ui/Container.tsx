import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string;
  title?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-12", align === "center" && "text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-base font-semibold uppercase tracking-[0.16em] text-[var(--madam-coral)] md:text-lg">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="text-3xl font-bold leading-tight text-[var(--madam-ink)] md:text-4xl lg:text-5xl">
          {title}
        </h2>
      ) : null}
      <div
        className={cn(
          "mt-5 h-1.5 w-20 bg-[var(--madam-green)]",
          align === "center" && "mx-auto",
        )}
      />
    </div>
  );
}
