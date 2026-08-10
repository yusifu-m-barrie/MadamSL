import type {
  NavItem,
  SiteSettings,
  PostListItem,
  ProjectListItem,
  StaffMember,
  Partner,
  NewsletterIssue,
  PageDocument,
} from "@/sanity/types";
import type { WhatWeDoPageDoc } from "@/sanity/types/whatWeDo";

function blocks(...paragraphs: string[]) {
  return paragraphs.filter(Boolean).map((text, i) => ({
    _type: "block" as const,
    _key: `b${i}`,
    style: "normal" as const,
    markDefs: [] as never[],
    children: [
      {
        _type: "span" as const,
        _key: `s${i}`,
        text,
        marks: [] as string[],
      },
    ],
  }));
}

export const seedSettings: SiteSettings = {
  siteName: "MADAM",
  tagline: "Helping People to help themselves",
  address: "250 Makambo Magburaka Highway, Makeni, Sierra Leone",
  phone: "+232-76 687 091",
  email: "info@madam-sl.org",
  socialLinks: [
    { network: "facebook", url: "https://www.facebook.com/africaagrilinks/" },
    { network: "x", url: "https://x.com/madamsl1" },
  ],
  copyright: "Copyright © MADAM SL | Developed By Link Corporation Limited SL",
  supportCtaLabel: "Support Us",
  supportCtaHref: "/support-us",
  defaultSeo: {
    metaTitle: "Home Charity - MADAM",
    metaDescription:
      "MADAM is a national NGO established in 1991, working with the most vulnerable, disadvantaged and marginalized people in Sierra Leone.",
  },
};

export const seedNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Who we are",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Mission & Vision", href: "/mission-vision" },
      { label: "Core Values", href: "/core-values" },
      { label: "Diversity, Equity & Inclusion", href: "/diversity-equity-inclusion" },
      {
        label: "OUR STAFF",
        href: "/our-staff",
        children: [
          { label: "ADMINISTRATIVE STAFF", href: "/our-staff" },
          { label: "OUR PROJECTS STAFF", href: "/our-projects-staff" },
          { label: "YOUTH TRAINING CENTER STAFF", href: "/youth-training-center-staff" },
        ],
      },
    ],
  },
  {
    label: "What We Do",
    href: "/what-we-do/agriculture",
    children: [
      { label: "MADAM & Agriculture", href: "/what-we-do/agriculture" },
      { label: "MADAM & Skills Development", href: "/what-we-do/skills-development" },
      { label: "MADAM & Generating Income", href: "/what-we-do/generating-income" },
      {
        label: "MADAM as part of an (inter-) national network",
        href: "/what-we-do/network",
      },
    ],
  },
  {
    label: "Our Projects",
    href: "/projects",
    children: [
      { label: "ONGOING PROJECTS", href: "/projects/ongoing" },
      { label: "PAST PROJECTS", href: "/projects/past" },
    ],
  },
  { label: "Where We Work", href: "/where-we-work" },
  {
    label: "NEWS",
    href: "/news",
    children: [
      { label: "Latest News", href: "/news" },
      { label: "News Letter", href: "/news-letter" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

export const seedPosts: PostListItem[] = [
  {
    _id: "post-tender",
    title: "Invitation to Tender",
    slug: "invitation-to-tender",
    excerpt:
      "MADAM in partnership with Brot für die Welt seeks consultancy firms or individual consultants to conduct the End Line Evaluation of the PSAVE Project.",
    publishedAt: "2026-07-13T12:55:42.000Z",
  },
  {
    _id: "post-recognition",
    title:
      "MADAM Sierra Leone Recognized for Outstanding Contribution to National Development",
    slug: "madam-sierra-leone-recognized-for-outstanding-contribution-to-national-development",
    excerpt:
      "MADAM Sierra Leone has been recognized for outstanding contribution to national development.",
    publishedAt: "2026-03-04T15:55:34.000Z",
  },
  {
    _id: "post-matriculation",
    title: "MADAM YTSC Holds First Matriculation Ceremony for 272 Trainees",
    slug: "madam-ytsc-holds-first-matriculation-ceremony-for-272-trainees",
    excerpt:
      "The Youth Training and Service Centre held its first matriculation ceremony for 272 trainees.",
    publishedAt: "2026-02-09T15:32:04.000Z",
  },
];

export const seedProjects: ProjectListItem[] = [
  // —— Ongoing (https://www.madam-sl.org/index.php/cause-category/ongoing/) ——
  {
    _id: "proj-c2c",
    title:
      "Classroom to Commerce: Empowering Youth Employability and Entrepreneurship Project",
    slug: "classroom-to-commerce-empowering-youth-employability-and-entrepreneurship",
    status: "ongoing",
    summary:
      "Project goal: To contribute to a reduction in youth unemployment in Sierra Leone by promoting youth entrepreneurship and employability through enhanced TVET and business skills development.",
    locations: ["Bo", "Bombali", "Kenema"],
    partners: [
      "Rofutha Development Association (RODA)",
      "Humanist Watch Salone (Huwasal)",
    ],
    donors: ["European Union (EU)"],
    startDate: "2024-12",
    endDate: "2027-11",
    bodyText: `Project goal:

To contribute to a reduction in youth unemployment in Sierra Leone by promoting youth entrepreneurship and employability through enhanced Technical and Vocational Education and Training (TVET) and business skills development/upscaling and expansion of the MADAM's Entrepreneurship Development Support Services Scheme (EDSSS).

Project objectives:

1. The employability of 1,000 TVET and university graduates through career guidance, job readiness training, internship placements and apprenticeships enhanced.
2. Facilitate favorable access to finance for 1,000 youth-led micro, small and medium enterprises (MSMEs) by creating linkages to the upscaled and expanded entrepreneurship development support services fund (EDSSF) in Bombali, Kenema, and Bo districts.
3. Foster a collaborative digital ecosystem for 100 youth entrepreneurs by strengthening linkages between TVET institutions, National Council for Technical, Vocational and other Academic Awards (NCTVA), private sector partners, and financial institutions.
4. Enhanced intervention capacities of 10 local youth led community-based CBOs working with women, youths, people with disabilities, and other vulnerable groups in upholding and promoting an enabling environment for inclusive dialogue and the implementation and monitoring of public policies for sustainable development.

Project target:

The action directly targets 2,200 youths, including TVET and university graduates (aged 15-35) in focus districts.

Project locations:

Bo, Bombali and Kenema

Project duration:

Three years

Implementation period:

December 2024 to November 2027

Lead partner:

Mankind's Activities for Development Accreditation Movement (MADAM)

Consortium partners:

1. Rofutha Development Association (RODA)
2. Humanist Watch Salone (Huwasal)

Donor:

European Union (EU)`,
  },
  {
    _id: "proj-psave-scale",
    title: "PSAVE project: Promoting sustainable agriculture and vocational education",
    slug: "psave-project-promoting-sustainable-agriculture-and-vocational-education",
    status: "ongoing",
    summary:
      "Sustainable Community Agriculture and Livelihood Expansion (SCALE) Project is a three-year initiative under PSAVE, funded by Bread for the World, operating in Bombali and Tonkolili districts.",
    locations: [
      "Paki Massabong (Bombali)",
      "Tane (Tonkolili)",
      "Kunike Barina (Tonkolili)",
    ],
    donors: ["Bread for the World"],
    startDate: "2024-05-01",
    endDate: "2027-03-31",
    bodyText: `Sustainable Community Agriculture and Livehood Expansion (SCALE) Project is a three-year initiative under the Promoting Sustainable Agriculture and Vocational Education (PSAVE) project, funded by Bread for the World.

Launched on May 1, 2024, and running until March 31, 2027, the project operates in three chiefdoms: Paki Massabong (Bombali District) and Tane and Kunike Barina (Tonkolili District).

Climate Smart Agricultural (CSA) practices are vital for enhancing food security and addressing environmental challenges. The SCALE project tackles issues of food insecurity and limited market access for smallholder farmers through a support services scheme managed by farmers' cooperatives. This initiative improves access to market information, quality seeds, tools, organic fertilizers, and sustainable farming practices, including the cultivation of cash crops, vegetables, and fruit trees. Knowledge, experience and best practice will be shared in two centers of excellence, located in Matula, and Bumba.

To strengthen farmers' incomes, the project emphasizes reducing post-harvest losses and promoting affordable value-added agricultural techniques and irrigation systems. Collaborating with the private sector will help market these products and provide nutritional education, ultimately addressing food insecurity and malnutrition.

Key Activities Include:

- Establishing farmers' cooperatives and creating Village Savings and Loans Associations (VSLAs)
- Forming environmental clubs
- Cultivating seed rice and vegetables
- Promoting integrated pest and post-harvest management
- Providing tools and seeds to 900 farmers
- Establishing centers of excellence for training
- Training farmers on climate adaptation practices
- Planting 150 acres of economic trees and forest corridors

These initiatives aim to empower local communities, enhance livelihoods, and promote sustainable agricultural practices.`,
  },
  {
    _id: "proj-psave-education",
    title: "PSAVE project: Promoting sustainable agriculture and vocational education",
    slug: "psave-project-promoting-sustainable-agriculture-and-vocational-education-2",
    status: "ongoing",
    summary:
      "The educational element of the PSAVE project aims to enhance livelihoods and living standards in Bombali District through market-driven vocational skills, entrepreneurship training, and advocacy for TVET.",
    locations: ["Bombali"],
    donors: ["Bread for the World"],
    startDate: "2024",
    endDate: "2027",
    bodyText: `The goal of the educational element of the PSAVE project is to enhance the livelihoods and living standards of the population in Bombali District.

Improving livelihoods and living conditions in the project area relies on addressing youth unemployment. To successfully integrate into the workforce, whether as apprentices, employees, or self-employed individuals, young people need training in market-driven vocational and specialized skills, including Competency-Based Training (CBT) in entrepreneurship and business development.

To foster job creation and empower young entrepreneurs, the project will provide training in entrepreneurial skills. The establishment of the Entrepreneurship Development Support Services Scheme (EDSSS) fund will help young entrepreneurs' access credit facilities, overcoming barriers to financing and allowing them to grow their businesses. For increased budget allocations to the Ministry of Technical and Higher Education and TVET, it is crucial for the regional network of Technical and Vocational Institutions (NeTVET) to effectively engage policymakers through lobbying and evidence-based advocacy.

In the three years from 2024 to 2027, the objective is firstly to ensure that graduates of the vocational training program will secure employment in fields related to their training. Secondly, NeTVET will strengthen its role as an effective advocate within governmental structures.

The target groups for this are:

- Marginalized youth who have dropped out of school and lack access to formal Technical and Vocational Education and Training (TVET).
- Young graduates from TVET institutions or aspiring entrepreneurs who need business and entrepreneurial skills.
- Member institutions of NeTVET secretariat for capacity building. Enhanced investment in TVET will enable more young people to acquire high-quality skills, improving employment opportunities and shifting perceptions about vocational training.`,
  },
  {
    _id: "proj-psufons",
    title: "PSuFONs project: Promoting Sustainable Food and Nutrition Security",
    slug: "psufons-project-promoting-sustainable-food-and-nutrition-security",
    status: "ongoing",
    summary:
      "The PSuFONs project aims to enhance climate-smart agriculture and livestock farming to improve food and nutrition security in Moyamba and Karene districts.",
    locations: ["Moyamba", "Karene"],
    bodyText: `The PSuFONs project aims to enhance climate-smart agriculture and livestock farming to improve food and nutrition security in Moyamba and Karene districts. Farmers in these areas report decreasing yields and soil fertility amid changing environmental conditions. The community's heavy reliance on conventional agriculture, exacerbated by limited access to inputs such as fertilizers, improved seeds, financing, and agricultural knowledge, contributes to low productivity and heightened food insecurity, especially in the face of climate change.

Within the PSuFONs project, MADAM cooperates with a variety of ministries, departments, and agencies, including local chiefdoms and district councils.`,
  },
  {
    _id: "proj-skillsup",
    title: "Skills Up! Project Overview",
    slug: "skills-up-project-overview",
    status: "ongoing",
    summary:
      "The Skills Up! Project focuses on empowering youth, primarily in rural areas, who are engaged in Sierra Leone's informal economy and often face low productivity.",
    locations: [
      "Western Area Rural",
      "Western Area Urban",
      "Bombali",
      "Tonkolili",
      "Karene",
      "Bo",
      "Kenema",
    ],
    partners: [
      "National Youth Commission (NAYCOM)",
      "Ministry of Technical and Higher Education",
      "Ministry of Tourism and Culture",
      "Ministry of Trade and Industry",
      "Ministry of Agriculture and Food Security",
      "TVET Coalition Sierra Leone",
    ],
    bodyText: `The Skills Up! Project focuses on empowering youth, primarily in rural areas, who are engaged in Sierra Leone's informal economy and often face low productivity. Recognizing their crucial role in social stability, this project addresses the lack of training opportunities that hinder their transition to the formal economy, where better prospects await.

Through the establishment of non-formal Technical Vocational Education and Training (TVET) structures based on the Skills Up! development approach, young men and women can now acquire essential skills for employment or entrepreneurship, significantly improving their livelihoods.

The project has resulted in the issuance of 2,798 accredited certificates across various sectors, including Agriculture, Waste Management, Tourism, Fisheries, and Business Management. We have trained 120 certified facilitators in innovative, competency-based teaching methods to support non-formal education effectively. Additionally, 98 AVSLA groups have been established, providing participants with access to financial resources that enhance their livelihoods and nutrition. Notably, female participants have shown remarkable dedication, with 1,848 women completing the program compared to 950 men, leading to increased empowerment in agriculture, fisheries, and trade.

Key partners in the Skills Up! Project include the National Youth Commission (NAYCOM), the Ministry of Technical and Higher Education, the Ministry of Tourism and Culture, the Ministry of Trade and Industry, the Ministry of Agriculture and Food Security, and district and city councils in Bo, Bombali, Kenema, and the Western Area Rural and Urban, as well as the TVET Coalition Sierra Leone. Together, we are transforming lives and fostering sustainable development in Sierra Leone.`,
  },
  {
    _id: "proj-ytsc",
    title: "Youth Training and Service Centre (YTSC)",
    slug: "youth-training-and-service-centre-ytsc",
    status: "ongoing",
    summary:
      "The Youth Training and Service Centre (YTSC) was founded in 2010 and became a government-assisted institution in 2018. It offers TVET-accredited courses and short courses for youth employability.",
    locations: ["Makeni"],
    partners: [
      "Government of Sierra Leone",
      "Ministry of Technical and Higher Education",
      "Bread for the World (BftW)",
    ],
    bodyText: `The Youth Training and Service Centre (YTSC) was founded in 2010 and became a government-assisted institution in 2018. It received accreditation from the Tertiary Education Commission (TEC) and the National Council for Technical, Vocational and other Academic Awards (NCTVA) in 2022.

Supported by the Government of Sierra Leone, the Ministry of Technical and Higher Education, and Bread for the World (BftW), the YTSC received a World Bank grant in 2021 to train 1,000 youths in market-driven skills.

The Centre offers two-year, TVET accredited courses in Auto Mechanics, Electrical and Solar Installations, Welding, Motor Mechanics, and catering and Hotel Business. There are also a great variety of short courses available, lasting 3-6 month; Hair Dressing, Makeup, Cake Making, Food and Beverage Production, Decsheets, Bead and Ankara Works, and AC and Refrigeration Repair. Since its inception, a total of 4,518 students have graduated from the YTSC.

Entrepreneurship Program:

At the Youth Training and Service Centre (YTSC), our flagship program focuses on Entrepreneurship, where MADAM partners with various local institutions in Makeni. This initiative is designed for youth who have completed their vocational skills training but lack the entrepreneurial skills necessary to launch their own businesses. By equipping young people with these essential skills, we empower them to become independent entrepreneurs and generate employment opportunities within their communities.

Our trainers not only support aspiring entrepreneurs but also provide training for educators at partner institutions. This enables them to independently teach the entrepreneurship curriculum. This collaborative approach enhances the reach and impact of our program, fostering a vibrant entrepreneurial ecosystem in the region.`,
  },
  {
    _id: "proj-kush",
    title: "Addiction and Kush",
    slug: "addiction-and-kush",
    status: "ongoing",
    summary:
      "In response to Sierra Leone's national emergency on drug abuse, MADAM raises awareness on Kush, trains peer counsellors, and supports recovery through psychosocial support and TVET scholarships.",
    locations: ["Makeni"],
    partners: [
      "Civil Peace Service (CPS)",
      "Action for the Rehabilitation of Drug Victims (ARDV)",
    ],
    bodyText: `In 2024, the President of Sierra Leone declared a national emergency due to the rising crisis of drug abuse, particularly concerning "Kush," a cheap synthetic drug that is impacting youth across the nation. In response, MADAM is collaborating with local partners and the Civil Peace Service (CPS) to raise awareness about this critical issue through community engagement meetings.

To further extend our outreach, we have trained peer counsellors who visit schools to educate students about the dangers of Kush and promote healthy choices.

Additionally, we are working with Action for the Rehabilitation of Drug Victims (ARDV), a rehabilitation centre in Makeni to support young men and women who have overcome addiction. Our program offers psychosocial support and scholarships for Technical and Vocational Education and Training (TVET) at MADAM, helping these young people rebuild their lives and reintegrate into society.`,
  },

  // —— Past (https://www.madam-sl.org/index.php/cause-category/past-projects/) ——
  {
    _id: "proj-agrotech",
    title: "Agro-tech Project",
    slug: "agro-tech-project",
    status: "past",
    summary:
      "As part of an EU-funded project that started in 2021, MADAM is the lead in a consortium of local NGOs that work with sweet potato farmers to implement value-added agriculture post-harvest.",
    locations: ["Tonkolili", "Kambia", "Bombali"],
    partners: [
      "Christian Farmers Development Association (CFADA)",
      "Borish Foundation",
      "Binkolo Agribusiness Centre",
    ],
    donors: ["European Union (EU)"],
    bodyText: `As part of an EU-funded project that started in 2021, MADAM is the lead in a consortium of local NGO's that work with sweet potato farmers in order to implement value-added agriculture post-harvest.

This initiative builds on the Inclusive Value Chain (VC) concept developed by the UN Food and Agriculture Organization (FAO), and aims to create social and economic benefits through new market opportunities and enhanced VC integration. The goal of the Agro-tech project is to contribute towards poverty alleviation, food security, improved nutrition, and better resource management in Sierra Leone through enabling producer associations and their service providers to develop strategies for increased production, profitability, and sustainability.

By promoting the "Made in Sierra Leone" brand in food retail outlets, we will also implement quality and food safety standards within the sector. This action focuses on improving the infrastructure of a viable and self-sustaining sweet potato value chain in Sierra Leone, promoting sustainable growth while creating jobs.

We have selected the Orange-Fleshed Sweet Potato (OFSP) due to its financial and nutritional potential for farmers and communities. It is bio-fortified with beta-carotene (a source of vitamin A) and iron, while offering a high carbohydrate content and delicious flavor. OFSP has demonstrated significantly higher productivity compared to standard sweet potatoes under similar growing conditions. By promoting the cultivation of OFSP, we can provide essential micronutrients for children while helping farmers diversify their crops, ultimately improving their livelihoods.

The project objectives of the Agro-tech project are the following:

- Improved OFSP productivity, strengthened farm management and organization and increased farmer revenue – Area of cultivation of improved OFSP varieties expanded with desired nutrition, utilization, and agronomic practices.
- Enhanced performance of the local OFSP value chain – generating social and economic returns through VC collaboration, using appropriate technology.

In this project, MADAM has been the lead NGO in a consortium with several organizations: the Christian Farmers Development Association (CFADA), which is active in Tonkolili District; the Borish Foundation, operating in Kambia District; and the Binkolo Agribusiness Centre in Bombali District as the private entity focussing on value addition element.`,
  },
  {
    _id: "proj-profons",
    title: "ProFoNS Project",
    slug: "profons-project",
    status: "past",
    summary:
      "The ProFoNS project is a three-year initiative launched in 2021, co-funded by BMZ and Welthungerhilfe (WHH), to enhance food and nutrition security in Falaba District.",
    locations: ["Falaba", "Mongo Chiefdom", "Neya Chiefdom"],
    partners: [
      "Ministry of Agriculture (MoA) — Falaba",
      "Falaba District Council (FDC)",
      "Ministry of Environment and Climate Change",
      "Ministry of Marine Resources",
    ],
    donors: [
      "German Federal Ministry of Economic Cooperation and Development (BMZ)",
      "Welthungerhilfe (WHH)",
    ],
    bodyText: `The ProFoNS project is a three-year initiative launched in 2021, co-funded by the German Federal Ministry of Economic Cooperation and Development (BMZ) and Welt Hunger Hilfe (WHH).

Objective:

The primary aim of ProFoNS is to enhance food and nutrition security in the Falaba District by promoting organic farming, facilitating market access, conserving natural resources, and improving access to WASH (Water, Sanitation, and Hygiene) and financial services. We are working with thirty communities in the Mongo and Neya Chiefdoms.

Beneficiaries:

ProFoNS targets 4,000 farming families in the region, with a focus on empowering women—60% of our participants are female, while 40% are male. As we approach the project's completion in 2024, we are proud to report that 3,357 families have already benefited.

Impact:

Our efforts have significantly improved the nutritional status of at-risk populations in Falaba District, including children and pregnant or breastfeeding women. This progress is the result of enhanced agricultural practices, diversified diets, access to safe drinking water, and rural financial services.

Key Achievements:

- Strengthened 15 Farmer-Based Organizations (FBOs) and 6 cooperatives.
- Established 60 Village Savings and Loan Associations.
- Developed 15 community-managed forests.
- Improved access to safe water through the construction of new wells.
- Engaged over 1,000 women in vegetable farming to enhance nutrition.
- Created 15 fishponds in the Inland Valley Swamps (IVS).
- Provided 400 households with access to small ruminants such as cows, sheep, and goats.

Partnerships:

We are collaborating with key partners, including the Ministry of Agriculture (MoA) in Falaba District, the Falaba District Council (FDC), the Ministry of Environment and Climate Change (MoE/Cc), the Ministry of Marine Resources, and local authorities in Falaba District.`,
  },
  {
    _id: "proj-encompase",
    title: "EncompasE/ Alternative Education for Marginalised Youth",
    slug: "encompase-alternative-education-for-marginalised-youth",
    status: "past",
    summary:
      "This project is funded by the UK-based organization Feed the Mind, and consists of two components: adult literacy/numeracy and alternative education for marginalised youth.",
    locations: ["Bombali", "Tonkolili"],
    donors: ["Feed the Mind (UK)"],
    bodyText: `This project is funded by the UK-based organization Feed the Mind, and consists of two components.

Firstly, it aims to improve literacy and numeracy for adults in villages in Bombali and Tonkolili District.

The other component focuses on alternative education for marginalised youth aged 18 to 35. These young people have not completed secondary school as they lack sufficient financial means to continue their education. As part of the EncompasE project they develop skills in entrepreneurship and IT which allows them to start their own business.`,
  },
  {
    _id: "proj-returnee",
    title: "Returnee migrants",
    slug: "returnee-migrants",
    status: "past",
    summary:
      "MADAM is funded by Bread for the World through the Civil Peace Service (CPS) programme, focusing on returnees from the Middle East and entrepreneurship training with DoWAN.",
    partners: ["Domestic Workers Advocacy Network (DoWAN)"],
    donors: ["Bread for the World — Civil Peace Service (CPS)"],
    bodyText: `MADAM remains acutely aware of the challenges facing Sierra Leonean society and strives to support those in need whenever possible. Although not all initiatives are formally funded projects, they reflect a deep commitment to addressing the pressing issues that the country is currently experiencing.

MADAM is funded by Bread for the World through the Civil Peace Service (CPS) programme, focusing on male and female returnees from the Middle East who worked under the Kafala system. In May 2024, MADAM partnered with the Domestic Workers Advocacy Network (DoWAN) to engage with returnees, understanding their experiences and documenting their journeys to raise awareness about the challenges associated with the Kafala system.

DoWAN staff are participating in a Train-the-Trainer program at MADAM, where they learn to deliver the entrepreneurship curriculum. This training empowers returnees to rebuild their lives in Sierra Leone by equipping them with the skills needed to start their own businesses, fostering a path to self-sufficiency and community reintegration.`,
  },
];

export const seedStaffAdmin: StaffMember[] = [
  {
    _id: "staff-msc",
    name: "Mohamed Sorie ConteH",
    position: "Director",
    team: "administrative",
  },
  {
    _id: "staff-ec",
    name: "Edward Conteh",
    position: "Head of Programmes",
    team: "administrative",
  },
  {
    _id: "staff-dk",
    name: "David Kanu",
    position: "Finance Manager",
    team: "administrative",
  },
  {
    _id: "staff-kk",
    name: "Kadiatu Kamara",
    position: "Assistant Administration",
    team: "administrative",
  },
  {
    _id: "staff-sbk",
    name: "Sorie Bakarr Kamara",
    position: "Communications Officer",
    team: "administrative",
  },
  {
    _id: "staff-jf",
    name: "John Fornah",
    position: "IT Officer",
    team: "administrative",
  },
];

export const seedStaffProjects: StaffMember[] = [
  {
    _id: "psave-mk",
    name: "Mohamed Kamara",
    position: "Project Manager",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-iat",
    name: "Ibrahim Alpha Turay",
    position: "Field Supervisor",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-sc",
    name: "Suleiman Conteh",
    position: "Agriculture Field officer",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-mst",
    name: "Momodu Sahr Thoronka",
    position: "Field Officer",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-mt",
    name: "Mohamed Thullah",
    position: "Field Officer",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-mtw",
    name: "Mariama Tarawalie",
    position: "Marketing Officer",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-sac",
    name: "Salamatu Conteh",
    position: "Advocacy Coordinator",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psave-rsk",
    name: "Ramatu Salim Kamara",
    position: "Entrepreneurship Coordinator",
    team: "projects",
    projectTeam: "PSAVE Project Staff",
  },
  {
    _id: "psuf-mlt",
    name: "Momoh Lawrence Turay",
    position: "Project Manager",
    team: "projects",
    projectTeam: "PSuFONs project Staff",
  },
  {
    _id: "psuf-hsc",
    name: "Haja Sorie Conteh",
    position: "Value Chain Officer",
    team: "projects",
    projectTeam: "PSuFONs project Staff",
  },
  {
    _id: "c2c-ajt",
    name: "Abass S. John Trye",
    position: "Project Manager",
    team: "projects",
    projectTeam: "Classroom to commerce Project Staff",
  },
  {
    _id: "enc-hsk",
    name: "Hassan Sorie Koroma",
    position: "Project officer EncompasE",
    team: "projects",
    projectTeam: "EncompasE Staff",
  },
];

export const seedStaffYtsc: StaffMember[] = [
  {
    _id: "ytsc-jsb",
    name: "Rev. John Sembeka Bangura",
    position: "Training & Technical Advisor",
    team: "youthTraining",
  },
  {
    _id: "ytsc-ees",
    name: "Edward E. Sessay",
    position: "Vice Principal YTSC",
    team: "youthTraining",
  },
  {
    _id: "ytsc-ehm",
    name: "Elizabeth Hawa Munu",
    position: "Center Manager / Principal",
    team: "youthTraining",
  },
  {
    _id: "ytsc-tsc",
    name: "Tueslyn S. Caulker",
    position: "Supervisor Hotel Business Department",
    team: "youthTraining",
  },
  {
    _id: "ytsc-ick",
    name: "Iye Christiana Kamara",
    position: "Instructor F&B Department",
    team: "youthTraining",
  },
  {
    _id: "ytsc-tk",
    name: "Thomas Kargbo",
    position: "Electrician & Electrical Instructor",
    team: "youthTraining",
  },
  {
    _id: "ytsc-sb",
    name: "Sheku Bangura",
    position: "Practical Instructor, Welding",
    team: "youthTraining",
  },
  {
    _id: "ytsc-aa",
    name: "Abdul Ajami",
    position: "Practical Instructor Auto Mechanic Department",
    team: "youthTraining",
  },
];

export const seedPartners: Partner[] = [
  { _id: "p-bftw", name: "Brot für die Welt / Bread for the World" },
  { _id: "p-whh", name: "Welthungerhilfe (WHH)" },
  { _id: "p-eu", name: "European Union" },
];

export const seedNewsletters: NewsletterIssue[] = [
  {
    _id: "newsletter-psufons-2024-08",
    title:
      "Promoting Sustainable Food and Nutrition Security Through Climate Smart Livestock Farming Newsletter",
    date: "2024-08-15",
    fileUrl: "/newsletters/MADAM-Newsletter-final.pdf",
    coverImage: {
      asset: { url: "/newsletters/promoting-sustainable.png" },
    },
  },
];

export const seedWhatWeDoPages: WhatWeDoPageDoc[] = [
  {
    _id: "wwd-agriculture",
    title: "MADAM & Agriculture",
    slug: "agriculture",
    heading: "MADAM and Sustainable Agriculture",
    intro: blocks(
      "MADAM works primarily in supporting farmer's development programs geared towards enhancing food security and livelihoods of vulnerable rural communities. Projects focus on production, processing and marketing of agricultural products to enhance the income of farmers.",
      "We train farmers in a variety of income generating activities, particularly capacity building training, value-addition, and Village Savings and Loan Associations (VSLAs). Farmers are encouraged to work together in a cooperative, and are connected to financial services.",
    ),
    sideImage: {
      asset: { url: "/images/what-we-do-agriculture.png" },
      alt: "Women farmers with harvested vegetables in a MADAM agriculture field",
    },
    body: blocks(
      "Currently, there is increasing focus on Climate Smart Agriculture (CSA), where farmers learn to apply organic farming practices in a sustainable manner and farmers are trained in the management of natural resources.",
      "In the past 10 years, MADAM has worked on developing a Monitoring and Evaluation (M&E) department, and currently all projects have an M&E officer attached. Work is ongoing to develop a centralised M&E department.",
      "Find out more about our work in agriculture.",
    ),
    ctaLabel: "To our Projects",
    ctaHref: "/projects",
  },
  {
    _id: "wwd-skills",
    title: "MADAM & Skills Development",
    slug: "skills-development",
    heading: "MADAM and skills development",
    intro: blocks(
      "In 2010 MADAM developed a Youth Training and Service Centre to complement the effort of the government of Sierra Leone in improving access to vocational skills and income generating potential in order to reduce youth unemployment. The Centre offers a great variety of courses that allow young people to develop vocational skills to meet the needs of the job market. Courses in auto mechanics, catering and hospitality, welding and electrical installation (including solar), offer students an official TVET qualification. Key components in all our vocational training projects are market analysis, integrated literacy and work placements.",
    ),
    sideImage: {
      asset: { url: "/images/what-we-do/skills-welding.jpg" },
      alt: "TVET students welding at MADAM Youth Training and Service Centre",
    },
    body: blocks(
      "The training centre also offers short courses in a variety of subjects and it caters for entrepreneurs or those with the ambition of becoming entrepreneurs but need the required and appropriate skills to enhance the development and growth of their business.",
      "MADAM championed the formation of the Network of Technical and Vocational Education Training (NETVET) in Sierra Leone, composed of other actors in the TVET sector. The objective is to promote collective advocacy for improved investment from the government and perception change in the sector. This work has resulted in the number of young people opting for vocational education at MADAM and other TVET institutions increasing significantly.",
      "Find out more about our work in Youth Skills Development and the impact made",
    ),
    ctaLabel: "To our projects",
    ctaHref: "/projects",
  },
  {
    _id: "wwd-income",
    title: "MADAM & Generating Income",
    slug: "generating-income",
    heading: "MADAM and generating income",
    intro: blocks(
      "Whilst MADAM has cooperated for many years with several national and international partners, we aim to fund our youth skills training at least partially though our own income generating activities. This is a critical activity for the organization if it is to be financially viable in the future.",
    ),
    sideImage: {
      asset: { url: "/images/what-we-do/income-restaurant-intro.jpg" },
      alt: "MADAM Nelis guesthouse restaurant",
    },
    sections: [
      {
        _key: "guesthouse",
        heading: "Guesthouse MADAM Nelis",
        body: blocks(
          "MADAM operates a guesthouse with eight double bedrooms, a bar and a restaurant only 5 kilometres outside of Makeni..",
          "The facility offers a quiet and comfortable stay; rooms have A/C and a fan, a TV, internet, and a private bathroom.",
          "The restaurant is open for lunch from Monday to Friday, whilst the bar can be visited by guests and non-guests 7 days per week for a relaxing drink.",
          "The guesthouse generates income that is invested in the education of the TVET students at MADAM. Besides this, the facility offers hospitality students the opportunity to learn the necessary skills in housekeeping, front desk, kitchen, and restaurant. Rooms are priced at Le350/ night including breakfast.",
        ),
        contactHeading: "Contact us for a booking:",
        highlight: "Your stay supports our TVET students!!",
        gallery: [
          {
            _key: "guestroom",
            caption: "Guestroom",
            image: { asset: { url: "/images/what-we-do/income-guestroom.png" } },
          },
          {
            _key: "restaurant",
            caption: "Restaurant",
            image: { asset: { url: "/images/what-we-do/income-restaurant.png" } },
          },
        ],
      },
      {
        _key: "hall",
        heading: "Conference Hall",
        body: blocks(
          "A large conference hall is available for hire for your conference, workshop, trainings or parties. The hall can accommodate up to 100 people, is fully air-conditioned, with alternative fans. You can make use of a projector and screen including PA system. Your event can be fully catered with breakfast, lunch and/ or dinner, and for those travelling from far, there is the option of spending the night in the MADAM Nelis Guesthouse.",
        ),
        contactHeading: "Contact us for a quote or booking",
        gallery: [
          {
            _key: "hall1",
            image: { asset: { url: "/images/what-we-do/income-hall-1.png" } },
          },
          {
            _key: "hall2",
            image: { asset: { url: "/images/what-we-do/income-hall-2.png" } },
          },
        ],
      },
      {
        _key: "garage",
        heading: "Garage",
        body: blocks(
          "Your car can be repaired by the MADAM garage, where highly experienced mechanics work together with the TVET students to repair your car.",
          "Not only does the garage deliver a high quality service, it also allows the students to learn the necessary skills for their courses, whilst being supervised by experienced staff.",
        ),
        contactHeading: "Please contact the garage for a quote",
        gallery: [
          {
            _key: "garage",
            image: { asset: { url: "/images/what-we-do/income-garage.png" } },
          },
        ],
      },
    ],
  },
  {
    _id: "wwd-network",
    title: "(Inter-)national Network",
    slug: "network",
    heading: "MADAM as part of an (inter-)national network",
    intro: blocks(
      "MADAM works in collaboration with several different donors and partners, both in-country and internationally, to deliver its programmes.",
      "MADAM cooperates with local and national NGOs and line Ministries, especially in the Agricultural and Educational sectors.",
    ),
    showPartnerLogos: true,
    body: blocks(
      "Nationally, MADAM is known as a leading and outstanding development entity that neatly collaborates with the Government of Sierra Leone (GoSL).",
      "For our development cooperation MADAM currently works with two major institutional donors based in Germany; Bread for the world (BFTW) and Welt Hunger Hilfe (WHH). We also work with the European Union (EU) on agricultural projects.",
    ),
  },
];

export const homeSeedPage: PageDocument = {
  _id: "page-home",
  title: "Home",
  slug: "home",
  sections: [
    {
      _type: "heroSlider",
      slides: [
        { heading: "Helping People to help themselves" },
        { heading: "PROMOTING CLIMATE SMART AGRICULTURE" },
        { heading: "Helping People to help themselves" },
      ],
    },
    {
      _type: "imageText",
      heading: "ABOUT MADAM",
      imagePosition: "right",
      imageSlot: "aboutImage",
      body: [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: "MADAM is a national NGO established in 1991, working with the most vulnerable, disadvantaged and marginalized people in Sierra Leone, with a specific focus on the northern region. We are committed to improving livelihood security among rural communities, focusing on women, youth and children. MADAM is driven by the belief that sustainability can only be achieved if people are empowered to take the lead in their own development through capacity building advocacy and partnerships.",
            },
          ],
        },
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: "MADAM operates from its own office space along the Makeni – Magburaka highway. This is where the office staff works, the TVET education takes place, and where the MADAM Nelis guesthouse and conference room are located.",
            },
          ],
        },
      ],
    },
    {
      _type: "programCards",
      cards: [
        {
          title: "MADAM & AGRICULTURE",
          description:
            "Developing and implementing sustainable agricultural projects is one of the main activities of MADAM.",
          href: "/what-we-do/agriculture",
          ctaLabel: "Read More",
          imageSlot: "programAgriculture",
        },
        {
          title: "YOUTH SKILLS DEVELOPMENT",
          description:
            "Technical and vocational education and training (TVET) is an increasingly powerful tool to prepare youth for the labour market and plays a key role in the achievement of the 2030 Agenda for Sustainable Development.",
          href: "/what-we-do/skills-development",
          ctaLabel: "Read More",
          imageSlot: "programSkills",
        },
        {
          title: "GENERATING INCOME",
          description:
            "MADAM has developed an income-generating unit that functions with the TVET institution, and consists of an onsite restaurant, an eight-room guesthouse, a bar with communal seating area and a garage.",
          href: "/what-we-do/generating-income",
          ctaLabel: "Read More",
          imageSlot: "programIncome",
        },
      ],
    },
    {
      _type: "impactCards",
      heading: "OUR IMPACT",
      ctaLabel: "SEE MORE ABOUT OUR PROJECTS",
      ctaHref: "/projects",
      items: [
        {
          title: "Climate Smart Agriculture",
          description:
            "Farmers are trained in techniques to use affordable value-added agricultural techniques and so enhance food security and address environmental challenges.",
          imageSlot: "impactClimateSmart",
          href: "/what-we-do/agriculture",
        },
        {
          title: "Agro-tech Project",
          description:
            "MADAM is the lead in a consortium of local NGO’s that work with sweet potato farmers in order to implement value-added agriculture post-harvest",
          imageSlot: "impactAgrotech",
          href: "/projects",
        },
        {
          title: "Promoting Sustainable Food and Nutrition",
          description:
            "Enhancing food and nutrition security by promoting organic farming, conserving natural resources, and facilitating market access.",
          imageSlot: "impactFoodNutrition",
          href: "/projects/psufons",
        },
        {
          title: "Youth Training and Service Centre",
          description:
            "Improving livelihoods and living conditions in the project area relies on addressing youth unemployment. At the YTSC youth can attend short courses, or complete a 2-year TVET course.",
          imageSlot: "impactYtsc",
          href: "/projects/ytsc",
        },
        {
          title: "Generating income",
          description:
            "A guesthouse, restaurant, conference hall and a garage all offer the opportunity to generate income while simultaneously allowing students to learn skills.",
          imageSlot: "impactGeneratingIncome",
          href: "/what-we-do/generating-income",
        },
        {
          title: "Kush Victims",
          description:
            "MADAM is supporting kush-prevention with peer counsellors visiting school, and offering scholarship for those in recovery.",
          imageSlot: "impactKush",
          href: "/projects/addiction-and-kush",
        },
      ],
    },
    {
      _type: "partnerLogos",
      heading: "DONORS & PARTNERS",
    },
    {
      _type: "latestNews",
      heading: "LATEST NEWS",
      limit: 5,
    },
  ],
};
