import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ProjectGrid } from "@/components/sections/SectionRenderer";
import { Button } from "@/components/ui/Button";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Our Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects("all");
  return (
    <>
      <PageHero title="Our Projects" />
      <Section>
        <Container>
          <div className="mb-8 flex flex-wrap gap-3">
            <Button href="/projects/ongoing">Ongoing Projects</Button>
            <Button href="/projects/past" variant="outline">
              Past Projects
            </Button>
          </div>
          <SectionHeading title="All Projects" />
          <ProjectGrid projects={projects} />
        </Container>
      </Section>
    </>
  );
}
