import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { StaffGrid } from "@/components/sections/SectionRenderer";
import { getStaffByTeam } from "@/lib/content";

export const metadata: Metadata = { title: "Administrative Staff" };

export default async function OurStaffPage() {
  const staff = await getStaffByTeam("administrative");
  return (
    <>
      <PageHero title="Administrative Staff" />
      <Section>
        <Container>
          <SectionHeading title="ADMINISTRATIVE STAFF" />
          <StaffGrid staff={staff} />
        </Container>
      </Section>
    </>
  );
}
