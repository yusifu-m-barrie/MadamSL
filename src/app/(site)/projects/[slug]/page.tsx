import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { RichText } from "@/components/content/RichText";
import { ProjectBodyText } from "@/components/content/ProjectBodyText";
import { ProjectImageGallery } from "@/components/content/ProjectImageGallery";
import { getProjectBySlug, getProjects } from "@/lib/content";
import type { SanityImage } from "@/sanity/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjects("all");
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const body = project.body;
  const featured = project.featuredImage as SanityImage | undefined;
  const gallery = (project.gallery || []) as (SanityImage & {
    alt?: string;
    caption?: string;
  })[];

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.status === "past" ? "PAST PROJECT" : "ONGOING PROJECT"}
      />
      <Section>
        <Container className="max-w-4xl">
          <ProjectImageGallery
            featured={featured}
            gallery={gallery}
            title={project.title}
          />

          {body ? (
            <RichText value={body} />
          ) : project.bodyText ? (
            <ProjectBodyText text={project.bodyText} />
          ) : project.summary ? (
            <p className="text-lg leading-relaxed text-[var(--madam-muted)] md:text-xl">
              {project.summary}
            </p>
          ) : null}

          {(project.locations?.length ||
            project.partners?.length ||
            project.donors?.length ||
            project.startDate ||
            project.endDate) && (
            <dl className="mt-10 grid gap-3 border-t border-black/10 pt-8 text-sm md:text-base">
              {project.locations?.length ? (
                <div>
                  <dt className="font-semibold text-[var(--madam-ink)]">Locations</dt>
                  <dd className="text-[var(--madam-muted)]">
                    {project.locations.join(", ")}
                  </dd>
                </div>
              ) : null}
              {project.partners?.length ? (
                <div>
                  <dt className="font-semibold text-[var(--madam-ink)]">Partners</dt>
                  <dd className="text-[var(--madam-muted)]">
                    {project.partners.join(", ")}
                  </dd>
                </div>
              ) : null}
              {project.donors?.length ? (
                <div>
                  <dt className="font-semibold text-[var(--madam-ink)]">Donor(s)</dt>
                  <dd className="text-[var(--madam-muted)]">
                    {project.donors.join(", ")}
                  </dd>
                </div>
              ) : null}
              {project.startDate || project.endDate ? (
                <div>
                  <dt className="font-semibold text-[var(--madam-ink)]">Period</dt>
                  <dd className="text-[var(--madam-muted)]">
                    {[project.startDate, project.endDate].filter(Boolean).join(" — ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          )}
        </Container>
      </Section>
    </>
  );
}
