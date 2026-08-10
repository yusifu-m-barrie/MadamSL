import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { StaffGrid } from "@/components/sections/SectionRenderer";
import { getStaffByTeam } from "@/lib/content";

export const metadata: Metadata = { title: "Youth Training Center Staff" };

export default async function YtscStaffPage() {
  const staff = await getStaffByTeam("youthTraining");
  return (
    <>
      <PageHero title="Youth Training Center Staff" />
      <Section>
        <Container>
          <SectionHeading title="YOUTH TRAINING CENTER STAFF" />
          <StaffGrid staff={staff} />
        </Container>
      </Section>
    </>
  );
}
