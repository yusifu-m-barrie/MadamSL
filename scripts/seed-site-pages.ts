/**
 * Seed remaining site pages (About, Mission, Values, DEI, Where we work, Support Us)
 * into Sanity as editable `page` documents.
 *
 * Usage: npx tsx scripts/seed-site-pages.ts
 */
import { config } from "dotenv";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "../.env.local"), override: true });

const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n5hnlyba",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function blocks(...paragraphs: string[]) {
  return paragraphs.filter(Boolean).map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

const pages = [
  {
    _id: "page-about",
    _type: "page",
    title: "About Us",
    slug: { _type: "slug", current: "about" },
    showHero: true,
    sections: [
      {
        _type: "richTextSection",
        _key: key(),
        heading: "ABOUT US",
        align: "left",
        body: blocks(
          "MADAM is a National Non-Governmental Organization, initially established as a community-based organization in Magburaka in 1991. The oranisation was registered as a National Non-Governmental Organization (NNGO) in 1999, and since then we have grown to one of the most successful, high performing and reliable organizations in Sierra Leone.",
          "The objective of MADAM is to help alleviate people out of poverty and reduce youth unemployment through the promotion of skills training. MADAM is increasing its interest in improving the welfare of vulnerable communities, women, youths and children social and economic conditions in rural and urban areas.",
          "Over the past 30 years, MADAM has systematically worked to improve on its strategy and reach out to as many beneficiaries as possible. This has been accomplished though a diverse set interventions that are characterized into our two broad programmes: Agriculture and Community Livelihoods (ACoL), Youth Education and Enterprise Development (YEED).",
        ),
        ctas: [
          {
            _type: "cta",
            _key: key(),
            label: "Mission & Vision",
            href: "/mission-vision",
            style: "primary",
          },
          {
            _type: "cta",
            _key: key(),
            label: "Core Values",
            href: "/core-values",
            style: "outline",
          },
        ],
      },
      {
        _type: "testimonials",
        _key: key(),
        heading: "Testimonials",
        items: [
          {
            _key: key(),
            name: "Fatiza",
            role: "MADAM-YTSC",
            quote:
              "My name is Fatiza, and my perception of skills training has changed since I joined MADAM as a student at the YTSC. Initially, I believed that skills training was only for dropouts or those without university qualifications. However, I have come to realize that skill-based work is highly beneficial for young people and the nation as a whole. It provides individuals with the opportunity to earn a living or start their businesses. After completing this course, I plan to attend university to study Mass Communication.",
          },
          {
            _key: key(),
            name: "Ramatu",
            role: "MADAM",
            quote:
              "My name is Ramatu Salim Kamara. I started working at MADAM as an intern in 2008 and have since gained experience in administration and finance, as well as serving as a field officer. Over the years, I have advanced through the ranks and am now the entrepreneurship coordinator. Earlier this year, I completed my Master's program in Entrepreneurship. Working at MADAM has empowered me to the extent that I can now support the education of my siblings and other relatives.",
          },
        ],
      },
    ],
  },
  {
    _id: "page-mission-vision",
    _type: "page",
    title: "Mission & Vision",
    slug: { _type: "slug", current: "mission-vision" },
    showHero: true,
    sections: [
      {
        _type: "missionVision",
        _key: key(),
        missionHeading: "OUR MISSION",
        missionText:
          '"A leading and innovative national organisation enabling communities to realize their development aspirations through inclusive partnership with private, public and NGOs for improved livelihoods in Sierra Leone"',
        visionHeading: "OUR VISION",
        visionText:
          '"A strong organization, improved livelihoods for target groups, and effective and efficient services delivery in Sierra Leone"',
      },
    ],
  },
  {
    _id: "page-core-values",
    _type: "page",
    title: "Core Values",
    slug: { _type: "slug", current: "core-values" },
    showHero: true,
    sections: [
      {
        _type: "richTextSection",
        _key: key(),
        heading: "CORE VALUES",
        align: "left",
        body: blocks(
          "MADAM is committed to demonstrate the following core values in all activities.",
          "Integrity - showing honesty and respect for people in our operational communities.",
          "Transparent and accountable - own and explain our actions in an open manner to communities, stakeholders and partners.",
          "Commitment - go the extra mile to work towards meeting the challenges in our communities and organisation.",
          "Inclusiveness - move along with all without any discrimination.",
          "Our strategic plan 2023 - 2028",
          "IN the next five years spanning the period 2023 through to 2028, these five pillars will guide MADAM's interventions:",
          "Pillar 1 - Food Security;",
          "Pillar 2 - Human Development;",
          "Pillar 3 - Climate Change, Emergency Preparedness and Response;",
          "Pillar 4 - Gender Promotion and Mainstreaming;",
          "Pillar 5 - Monitoring, Evaluation, Accountability and Learning (MEAL).",
        ),
      },
    ],
  },
  {
    _id: "page-dei",
    _type: "page",
    title: "Diversity, Equity & Inclusion",
    slug: { _type: "slug", current: "diversity-equity-inclusion" },
    showHero: true,
    sections: [
      {
        _type: "richTextSection",
        _key: key(),
        heading: "Diversity, Equity and Inclusion Policies",
        align: "left",
        body: blocks(
          "MADAM envisions a world where everyone has equal opportunities, resources, and a voice in decision-making processes. Gender equality and women's empowerment are central to MADAM's work, and the new MADAM gender policy (2023-2028) builds on lessons learned from the previous policy (2016-2021), and reaffirms the organization's commitment to valuing the perspectives and priorities of affected populations while promoting diversity, inclusion, and gender equality. The Gender Equality and Women's Empowerment Policy of Mankind's Activities for Development Accreditation Movement (MADAM-SL) is aligned with the Sustainable Development Goals (SDGs) established by the United Nations.",
          "MADAM also actively encourages those with a disability to apply for a job or a course with MADAM. Several students with a disability have completed their studies successfully and have gone on to secure a job in their chosen field. MADAM also employs several disabled workers successfully.",
        ),
      },
    ],
  },
  {
    _id: "page-where-we-work",
    _type: "page",
    title: "Where We Work",
    slug: { _type: "slug", current: "where-we-work" },
    showHero: true,
    sections: [
      {
        _type: "locationsMap",
        _key: key(),
        heading: "Where we work",
        showMap: true,
        showLocationCards: false,
        mapCaption:
          "Sierra Leone districts where MADAM operates — pins mark programme and office locations (HQ in Bombali / Makeni).",
        body: blocks(
          "MADAM established its headquarters in Makeni city Bombali District, Northern Sierra Leone from where we coordinate all our actions in the other project regions.",
          "Offices in Bombali and Tonkolili Districts in the North, Kenema in the eastern region, Bo districts in the Southern region, Karene and Port Loko Districts in the North Western region, and the Western Rural and Western Urban regions.",
          "Project Locations Skill Up!",
          "Project Locations: Western Area Rural, Western Area Urban, Bombali District, Tonkolili District, Karene District, Bo District, and Kenema District",
          "In this project, MADAM has been the lead NGO in a consortium with several organizations: the Christian Farmers Development Association (CFADA), which is active in Tonkolili District; the Borish Foundation, operating in Kambia District; and the Binkolo Agribusiness Centre in Bombali District as the private entity focussing on value addition element.",
          "EncompasE aims to improve literacy and numeracy for adults in villages in Bombali and Tonkolili",
          "Psufons; in Moyamba and Karene districts.",
          "ProFons: Falaba District. Thirty communities in the Mongo Chiefdom and Neya Chiefdom",
          "PSAVE: Paki Massabong (Bombali District) and Tane and Kunike Barina (Tonkolili District).",
        ),
      },
    ],
  },
  {
    _id: "page-support-us",
    _type: "page",
    title: "Support Us",
    slug: { _type: "slug", current: "support-us" },
    showHero: true,
    heroSubtitle:
      "Partner with MADAM to improve livelihoods for women, youth and rural communities.",
    sections: [
      {
        _type: "richTextSection",
        _key: key(),
        heading: "How you can support MADAM",
        align: "left",
        body: blocks(
          "MADAM welcomes partnerships, donations, and collaboration with individuals, institutions, and organisations who share our commitment to sustainable development in Sierra Leone.",
          "Online donation checkout from the previous WordPress GiveWP plugin is being replaced. For partnership and funding enquiries, please contact us directly via the contact details in Site Settings, or use the Contact Us page.",
        ),
        ctas: [
          {
            _type: "cta",
            _key: key(),
            label: "Contact Us",
            href: "/contact",
            style: "primary",
          },
          {
            _type: "cta",
            _key: key(),
            label: "Income-generating units",
            href: "/what-we-do/generating-income",
            style: "outline",
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const doc of pages) {
    await client.createOrReplace(doc as { _id: string; _type: string });
    console.log("✓", doc.slug.current);
  }
  console.log("\nDone. Edit in Studio → Pages.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
