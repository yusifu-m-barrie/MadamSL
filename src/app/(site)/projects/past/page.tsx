import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { ProjectGrid } from "@/components/sections/SectionRenderer";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Past Projects" };

export default async function PastProjectsPage() {
  const projects = await getProjects("past");
  return (
    <>
      <PageHero title="Past Projects" />
      <Section>
        <Container>
          <SectionHeading title="Past Projects" />
          <ProjectGrid projects={projects} />
        </Container>
      </Section>
    </>
  );
}
