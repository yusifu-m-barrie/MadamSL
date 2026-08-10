import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { StaffGrid } from "@/components/sections/SectionRenderer";
import { getStaffByTeam } from "@/lib/content";

export const metadata: Metadata = { title: "Projects Staff" };

export default async function ProjectsStaffPage() {
  const staff = await getStaffByTeam("projects");
  return (
    <>
      <PageHero title="Our Projects Staff" />
      <Section>
        <Container>
          <SectionHeading title="OUR PROJECTS STAFF" />
          <StaffGrid staff={staff} groupByProjectTeam />
        </Container>
      </Section>
    </>
  );
}
