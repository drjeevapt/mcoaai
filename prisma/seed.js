const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MCOA database...");

  // 1. Seed Branches
  const branches = [
    {
      id: "chennai-hq",
      name: "Chennai Head Office",
      code: "CHN-HQ",
      address: "#80/1, 200 Feet Radial Road (Thoraipakkam to Pallavaram), Near A2B Hotel, Narayanapuram Lake, Pallikaranai",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600100",
      phone: "+91 8072020716",
      email: "chennai@medicalcodingofficersacademy.com",
      isHeadOffice: true,
    },
    {
      id: "perambalur",
      name: "Perambalur Regional Campus",
      code: "PBL-01",
      address: "3rd Floor, Annai Hospital, VRM IAS Academy, Near Krishna Theatre",
      city: "Perambalur",
      state: "Tamil Nadu",
      postalCode: "621212",
      phone: "+91 8072020716",
      email: "perambalur@medicalcodingofficersacademy.com",
      isHeadOffice: false,
    },
    {
      id: "coimbatore",
      name: "Coimbatore Innovation Hub",
      code: "CBE-01",
      address: "#17 Sangam Street, Sundarapuram Post",
      city: "Coimbatore",
      state: "Tamil Nadu",
      postalCode: "641024",
      phone: "+91 8072020716",
      email: "coimbatore@medicalcodingofficersacademy.com",
      isHeadOffice: false,
    },
    {
      id: "karaikudi",
      name: "Karaikudi Learning Centre",
      code: "KKD-01",
      address: "#52, 5th Cross, TT Nagar, Near Corner Bakery",
      city: "Karaikudi",
      state: "Tamil Nadu",
      postalCode: "600001",
      phone: "+91 8072020716",
      email: "karaikudi@medicalcodingofficersacademy.com",
      isHeadOffice: false,
    },
  ];

  for (const b of branches) {
    await prisma.branch.upsert({
      where: { code: b.code },
      update: b,
      create: b,
    });
  }
  console.log("Branches seeded.");

  // 2. Seed Users
  const founderUser = await prisma.user.upsert({
    where: { email: "dr.jeeva@medicalcodingofficersacademy.com" },
    update: {},
    create: {
      email: "dr.jeeva@medicalcodingofficersacademy.com",
      name: "Dr. Jeevanantham Mariappan",
      passwordHash: "mcoa-secure-hash-demo",
      role: "Super Admin",
      phone: "+91 8072020716",
      branchId: "chennai-hq",
    },
  });

  const counselorUser = await prisma.user.upsert({
    where: { email: "admissions@medicalcodingofficersacademy.com" },
    update: {},
    create: {
      email: "admissions@medicalcodingofficersacademy.com",
      name: "Kavitha Sundaram (Senior Counselor)",
      passwordHash: "mcoa-secure-hash-demo",
      role: "Admissions Counselor",
      phone: "+91 8072020716",
      branchId: "chennai-hq",
    },
  });
  console.log("Staff users seeded.");

  // 3. Seed Courses
  const courses = [
    {
      id: "advanced-medical-coding",
      slug: "advanced-medical-coding",
      title: "Advanced Medical Coding Masterclass",
      shortCode: "AMC-MASTER",
      category: "Medical Coding",
      summary: "Our flagship comprehensive program covering Medical Terminology, Anatomy & Physiology, ICD-10-CM, CPT, and HCPCS Level II with real-world chart auditing.",
      description: "The Advanced Medical Coding Masterclass at MCOA is an intensive, career-transforming curriculum engineered by Dr. Jeevanantham Mariappan. Built for life sciences, pharmacy, nursing, and healthcare graduates, this program bridges clinical knowledge with international revenue cycle standards.",
      duration: "3 Months (240 Hours)",
      feeInr: 32000,
      discountFeeInr: 27500,
      certificationTrack: "AAPC CPC / AHIMA Ready",
      trainingModes: JSON.stringify(["Classroom", "Live Interactive Online", "Hybrid Flex"]),
      eligibility: JSON.stringify([
        "Graduates & Postgraduates in Life Sciences, Biotechnology, Microbiology, Biochemistry, Nursing, Pharmacy, Physiotherapy, BDS, BAMS, BHMS, or Allied Health.",
        "Graduates from other disciplines seeking international healthcare IT careers."
      ]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: Clinical Foundations & Medical Terminology",
          topics: [
            "Prefixes, suffixes, combining forms and anatomical directional terminology",
            "Comprehensive body systems: Musculoskeletal, Cardiovascular, Respiratory, Digestive, Nervous, Endocrine",
            "Pathophysiology, disease progression, diagnostic labs, and clinical pharmacotherapy"
          ]
        },
        {
          moduleTitle: "Module 2: ICD-10-CM Diagnosis Coding Mastery",
          topics: [
            "Official Guidelines for Coding and Reporting (OGCR) deep-dive",
            "Chapters 1 through 22 coding conventions, sequencing rules, and combination codes",
            "Infectious diseases, Neoplasms, Diabetes manifestations, Circulatory diseases, External causes"
          ]
        },
        {
          moduleTitle: "Module 3: CPT & HCPCS Level II Procedural Coding",
          topics: [
            "Format, symbols, unlisted procedures, and modifier logic (25, 59, 51, 78, 79)",
            "Integumentary, Musculoskeletal, and Cardiovascular procedural chart review",
            "HCPCS Level II national codes, durable medical equipment (DME), injectable drugs"
          ]
        },
        {
          moduleTitle: "Module 4: Practical Chart Review & Placement Prep",
          topics: [
            "100+ de-identified authentic inpatient and outpatient medical charts",
            "Revenue cycle management, claim denial prevention, compliance audits",
            "Resume building, technical mock interviews, placement drives"
          ]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Is prior coding experience required for this course?",
          answer: "No. The course begins from fundamental medical terminology and anatomy, making it perfect for both fresh life science graduates and healthcare professionals looking to transition."
        },
        {
          question: "Is placement assistance included?",
          answer: "Yes, MCOA provides dedicated placement support including resume curation, mock interview rounds, and interview schedules with our 40+ healthcare IT hiring partners."
        }
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "cpc-certification-prep",
      slug: "cpc-certification-prep",
      title: "CPC® (Certified Professional Coder) Exam Prep",
      shortCode: "CPC-PREP",
      category: "Certification Prep",
      summary: "Dedicated AAPC CPC® exam training designed to clear the certification in your first attempt with time management drills and 1,500+ practice questions.",
      description: "The AAPC Certified Professional Coder (CPC) credential is the gold standard in outpatient medical coding worldwide. MCOA's targeted preparation course provides deep-focus speed drills, guideline cross-indexing, code elimination techniques, and five full-length mock examinations.",
      duration: "2 Months (160 Hours)",
      feeInr: 28000,
      discountFeeInr: 23500,
      certificationTrack: "AAPC CPC® Credential",
      trainingModes: JSON.stringify(["Live Online Weekend & Evening", "Classroom Intensive"]),
      eligibility: JSON.stringify([
        "Completed foundational training in ICD-10-CM and CPT coding, or working coders seeking certification advancement."
      ]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: AAPC Exam Blueprint & Time Strategies",
          topics: ["100-question 4-hour exam structure", "Rapid indexing techniques", "Process of elimination"]
        },
        {
          moduleTitle: "Module 2: 10,000 to 60,000 Surgical Series Coding Drills",
          topics: ["Integumentary, Musculoskeletal, Respiratory, Cardiovascular, Digestive surgeries", "Operative reports analysis"]
        },
        {
          moduleTitle: "Module 3: Full-Length Diagnostic Mock Exams",
          topics: ["5 AAPC-aligned simulated exams", "Domain-level weakness remediation", "Post-test rationales"]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "What is MCOA's pass rate for CPC?",
          answer: "MCOA students maintain a verified first-attempt pass rate exceeding 94% through our rigorous diagnostic mock system."
        }
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "ccs-certification-prep",
      slug: "ccs-certification-prep",
      title: "CCS® (Certified Coding Specialist) Inpatient Prep",
      shortCode: "CCS-INPATIENT",
      category: "Certification Prep",
      summary: "Advanced AHIMA CCS® certification program focusing on ICD-10-PCS hospital inpatient procedure coding, POA indicators, and MS-DRG grouping.",
      description: "The Certified Coding Specialist (CCS) credential from AHIMA demonstrates mastery in hospital inpatient coding. This intensive course teaches students the complex root operation tables of ICD-10-PCS, inpatient principal diagnosis sequencing, and MS-DRG grouping.",
      duration: "2.5 Months (180 Hours)",
      feeInr: 35000,
      discountFeeInr: 29500,
      certificationTrack: "AHIMA CCS® Credential",
      trainingModes: JSON.stringify(["Live Online", "Classroom Weekend"]),
      eligibility: JSON.stringify(["Prior knowledge of ICD-10-CM diagnosis coding or CPC holders"]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: ICD-10-PCS Structure & Root Operations",
          topics: ["7-character alphanumeric structure", "31 Medical/Surgical root operations", "Approach and Device values"]
        },
        {
          moduleTitle: "Module 2: Inpatient Sequencing & POA Guidelines",
          topics: ["UHDDS guidelines", "Comorbidities (CC) & Major Comorbidities (MCC)", "Present on Admission (POA)"]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Why should I pursue CCS after CPC?",
          answer: "CCS qualifies you for inpatient hospital medical records departments with higher compensation tiers."
        }
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "crc-risk-adjustment",
      slug: "crc-risk-adjustment",
      title: "CRC® (Certified Risk Adjustment Coder)",
      shortCode: "CRC-RISK",
      category: "Specialty Coding",
      summary: "Master Hierarchical Condition Categories (HCC), Medicare Advantage risk score modeling, and chronic condition documentation compliance.",
      description: "Risk Adjustment coding is one of the fastest growing sectors in international healthcare billing. MCOA's CRC course instructs students on CMS-HCC risk adjustment methodology, RAF scores, and quality audits.",
      duration: "1.5 Months (120 Hours)",
      feeInr: 25000,
      discountFeeInr: 21000,
      certificationTrack: "AAPC CRC® Credential",
      trainingModes: JSON.stringify(["Live Online Interactive", "Hybrid"]),
      eligibility: JSON.stringify(["Life sciences graduates, CPC certified coders, or healthcare data analysts"]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: Risk Adjustment Models & MEAT Criteria",
          topics: ["CMS-HCC Model versions", "RAF calculation", "MEAT documentation standards"]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Are there remote job options for CRC coders?",
          answer: "Yes, Risk Adjustment coders are highly demanded for US remote chart review projects."
        }
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "cpma-medical-auditor",
      slug: "cpma-medical-auditor",
      title: "CPMA® (Certified Professional Medical Auditor)",
      shortCode: "CPMA-AUDIT",
      category: "Specialty Coding",
      summary: "Elevate your career into healthcare auditing, fraud prevention, OIG compliance plans, and statistical sampling of medical records.",
      description: "Designed for experienced medical coders and clinical documentation specialists looking to lead audit teams.",
      duration: "2 Months (140 Hours)",
      feeInr: 32000,
      discountFeeInr: 28000,
      certificationTrack: "AAPC CPMA® Credential",
      trainingModes: JSON.stringify(["Live Online Weekend"]),
      eligibility: JSON.stringify(["Minimum 1-2 years coding experience or CPC/CCS credential holder"]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: Healthcare Auditing & OIG Compliance",
          topics: ["False Claims Act, Stark Law, Anti-Kickback", "Statistical sampling and risk calculation"]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Who employs CPMAs?",
          answer: "Hospitals, large physician groups, payers, and healthcare consulting organizations."
        }
      ]),
      isFeatured: false,
      isPublished: true,
    },
    {
      id: "evaluation-and-management-mastery",
      slug: "evaluation-and-management-mastery",
      title: "E&M (Evaluation & Management) Specialty Mastery",
      shortCode: "EM-SPECIALTY",
      category: "Specialty Coding",
      summary: "Master outpatient office visits, inpatient admissions, emergency department charts, and consultation coding under current AMA/CMS guidelines.",
      description: "Deep dive into 2021 & 2023 AMA/CMS Evaluation and Management revisions with MDM problem, data, and risk calculations.",
      duration: "4 Weeks (40 Hours)",
      feeInr: 12000,
      discountFeeInr: 9500,
      certificationTrack: "Specialty Practice Certificate",
      trainingModes: JSON.stringify(["Live Online Interactive"]),
      eligibility: JSON.stringify(["Working coders or medical graduates with CPT knowledge"]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: MDM Grid & Time-Based Calculation",
          topics: ["Problems complexity, Data review, Risk of morbidity", "Office 99202-99215 and Hospital 99221-99239"]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Is this updated to current E&M guidelines?",
          answer: "Yes, 100% updated with all current AMA/CMS guidelines."
        }
      ]),
      isFeatured: false,
      isPublished: true,
    },
    {
      id: "medical-billing-fundamentals",
      slug: "medical-billing-fundamentals",
      title: "US Medical Billing & Denial Management",
      shortCode: "BILLING-RCM",
      category: "Billing & Compliance",
      summary: "End-to-end revenue cycle management from patient eligibility, charge entry, claim submission (CMS-1500 / UB-04), to AR follow-up and appeals.",
      description: "Equips students with comprehensive operational expertise in US healthcare reimbursement, CARC/RARC codes, and payer appeals.",
      duration: "6 Weeks (60 Hours)",
      feeInr: 16000,
      discountFeeInr: 13500,
      certificationTrack: "MCOA RCM Professional Certificate",
      trainingModes: JSON.stringify(["Classroom", "Live Online"]),
      eligibility: JSON.stringify(["Graduates of any discipline seeking rapid entry into US healthcare revenue cycle operations"]),
      syllabus: JSON.stringify([
        {
          moduleTitle: "Module 1: Claims & Reimbursement Cycle",
          topics: ["CMS-1500 and UB-04 forms", "Insurance verification, Prior auth, Clearinghouses"]
        },
        {
          moduleTitle: "Module 2: Denial Management & AR Follow-Up",
          topics: ["CARC / RARC analysis", "Timely filing and medical necessity appeals"]
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Can arts/commerce graduates apply?",
          answer: "Yes, medical billing is ideal for graduates from any educational background."
        }
      ]),
      isFeatured: false,
      isPublished: true,
    }
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log("Courses seeded.");

  // 4. Seed Initial Leads for CRM
  const sampleLeads = [
    {
      fullName: "Ananya Ramesh",
      email: "ananya.ramesh.bio@example.com",
      phone: "+91 98401 23456",
      educationBackground: "Biotechnology & Bioinformatics",
      mode: "Classroom",
      preferredBatch: "Weekend",
      status: "New",
      source: "Homepage Inquiry",
      notes: "Completed B.Tech Biotech in 2025. Interested in Chennai Head Office classroom batch.",
      courseId: "advanced-medical-coding",
      branchId: "chennai-hq",
      assignedCounselorId: counselorUser.id,
    },
    {
      fullName: "Dr. Karthik Sundar",
      email: "karthik.bds@example.com",
      phone: "+91 97890 87654",
      educationBackground: "Dental (BDS, MDS)",
      mode: "Live Interactive Online",
      preferredBatch: "Evening",
      status: "Counseling Scheduled",
      source: "Google Search",
      notes: "BDS graduate looking for international CPC certification for US healthcare remote work.",
      courseId: "cpc-certification-prep",
      branchId: "coimbatore",
      assignedCounselorId: counselorUser.id,
    },
    {
      fullName: "Priya Senthil",
      email: "priya.nursing@example.com",
      phone: "+91 94432 11223",
      educationBackground: "Nursing (B.Sc, Post Basic, GNM)",
      mode: "Hybrid Flex",
      preferredBatch: "Weekday",
      status: "Qualified",
      source: "Facebook Campaign",
      notes: "Staff nurse in Perambalur hospital with 2 years experience. Wants CCS hospital inpatient coding.",
      courseId: "ccs-certification-prep",
      branchId: "perambalur",
      assignedCounselorId: counselorUser.id,
    },
    {
      fullName: "Mohamed Farooq",
      email: "farooq.pharm@example.com",
      phone: "+91 96291 44556",
      educationBackground: "Pharmacy (B.Pharm, M.Pharm, Pharm.D)",
      mode: "Classroom",
      preferredBatch: "Weekend",
      status: "Enrolled",
      source: "Referral / Senior Student",
      notes: "B.Pharm graduate, fee installment 1 paid. Batch starting next Saturday in Karaikudi.",
      courseId: "advanced-medical-coding",
      branchId: "karaikudi",
      assignedCounselorId: counselorUser.id,
    },
    {
      fullName: "Deepa Natarajan",
      email: "deepa.nat@example.com",
      phone: "+91 98840 99887",
      educationBackground: "Microbiology & Biochemistry",
      mode: "Live Interactive Online",
      preferredBatch: "Weekend",
      status: "Demo Scheduled",
      source: "Brochure Download",
      notes: "Attending free demo session on Saturday 10 AM with Dr. Jeevanantham.",
      courseId: "crc-risk-adjustment",
      branchId: "chennai-hq",
      assignedCounselorId: counselorUser.id,
    },
  ];

  for (const l of sampleLeads) {
    const existing = await prisma.lead.findFirst({ where: { email: l.email } });
    if (!existing) {
      await prisma.lead.create({
        data: l,
      });
    }
  }
  console.log("Sample CRM leads seeded.");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
