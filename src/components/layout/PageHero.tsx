import { Container } from "@/components/ui/Container";

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(105deg,#0a3d14_0%,#1FB53A_55%,#0d4d18_100%)] py-16 text-white md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.2), transparent 40%)",
        }}
        aria-hidden
      />
      <Container className="relative page-enter">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{title}</h1>
        {subtitle ? (
          <p className="mt-4 max-w-3xl text-lg text-white/90 md:text-xl">{subtitle}</p>
        ) : null}
      </Container>
    </div>
  );
}
