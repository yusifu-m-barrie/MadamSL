import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ProjectGrid } from "@/components/sections/SectionRenderer";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Ongoing Projects" };

export default async function OngoingProjectsPage() {
  const projects = await getProjects("ongoing");
  return (
    <>
      <PageHero title="Ongoing Projects" />
      <Section>
        <Container>
          <SectionHeading title="Ongoing Projects" />
          <ProjectGrid projects={projects} />
        </Container>
      </Section>
    </>
  );
}
