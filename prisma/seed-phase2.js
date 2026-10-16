const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPhase2() {
  console.log("Seeding Phase 2: Admissions, Cohort Batches & Student LMS...");

  // 1. Create Trainer User
  const trainer = await prisma.user.upsert({
    where: { email: "trainer.rajesh@medicalcodingofficersacademy.com" },
    update: {},
    create: {
      email: "trainer.rajesh@medicalcodingofficersacademy.com",
      name: "Dr. Rajesh Kannan, CPC, CCS",
      passwordHash: "mcoa-secure-hash-demo",
      role: "Trainer",
      phone: "+91 98402 33445",
      branchId: "chennai-hq",
    },
  });

  // 2. Create Student User (Sneha Ramachandran)
  const student = await prisma.user.upsert({
    where: { email: "sneha.student@example.com" },
    update: {},
    create: {
      email: "sneha.student@example.com",
      name: "Sneha Ramachandran",
      passwordHash: "mcoa-secure-hash-demo",
      role: "Student",
      phone: "+91 98765 43210",
      branchId: "chennai-hq",
    },
  });

  console.log("Staff & Student accounts created.");

  // 3. Create Batches
  const amcCourse = await prisma.course.findUnique({
    where: { slug: "advanced-medical-coding" },
  });

  const cpcCourse = await prisma.course.findUnique({
    where: { slug: "cpc-certification-prep" },
  });

  if (!amcCourse || !cpcCourse) {
    throw new Error("Courses must exist before seeding batches.");
  }

  const batch1 = await prisma.batch.upsert({
    where: { code: "CHN-AMC-OCT26-WE" },
    update: {},
    create: {
      name: "Chennai AMC Weekend Cohort Oct 2026",
      code: "CHN-AMC-OCT26-WE",
      mode: "Classroom",
      timing: "Weekend (Sat & Sun 10:00 AM - 1:00 PM)",
      startDate: new Date("2026-10-01"),
      capacity: 35,
      status: "Active",
      branchId: "chennai-hq",
      courseId: amcCourse.id,
      trainerId: trainer.id,
    },
  });

  const batch2 = await prisma.batch.upsert({
    where: { code: "CBE-CPC-NOV26-EV" },
    update: {},
    create: {
      name: "Coimbatore CPC Fast-Track Evening Cohort",
      code: "CBE-CPC-NOV26-EV",
      mode: "Live Interactive Online",
      timing: "Evening (Mon - Fri 6:30 PM - 8:30 PM)",
      startDate: new Date("2026-11-01"),
      capacity: 30,
      status: "Upcoming",
      branchId: "coimbatore",
      courseId: cpcCourse.id,
      trainerId: trainer.id,
    },
  });

  const batch3 = await prisma.batch.upsert({
    where: { code: "PBL-AMC-OCT26-CL" },
    update: {},
    create: {
      name: "Perambalur AMC Regular Weekday Cohort",
      code: "PBL-AMC-OCT26-CL",
      mode: "Classroom",
      timing: "Weekday Regular (10:00 AM - 2:00 PM)",
      startDate: new Date("2026-10-10"),
      capacity: 25,
      status: "Active",
      branchId: "perambalur",
      courseId: amcCourse.id,
      trainerId: trainer.id,
    },
  });

  const batch4 = await prisma.batch.upsert({
    where: { code: "KKD-AMC-NOV26-HY" },
    update: {},
    create: {
      name: "Karaikudi AMC Hybrid Flex Cohort",
      code: "KKD-AMC-NOV26-HY",
      mode: "Hybrid Flex",
      timing: "Weekend Classroom + Online Weekday",
      startDate: new Date("2026-11-05"),
      capacity: 25,
      status: "Upcoming",
      branchId: "karaikudi",
      courseId: amcCourse.id,
      trainerId: trainer.id,
    },
  });

  console.log("Cohort batches seeded across Chennai, Coimbatore, Perambalur, and Karaikudi.");

  // 4. Create Batch Sessions & Attendance
  const session1 = await prisma.batchSession.create({
    data: {
      batchId: batch1.id,
      title: "Module 1: Clinical Terminology & Anatomy Review",
      sessionDate: new Date("2026-10-04T10:00:00Z"),
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      meetUrl: "https://meet.google.com/mcoa-amc-class",
      recordingUrl: "https://player.vimeo.com/video/76979871",
      status: "Completed",
    },
  });

  const session2 = await prisma.batchSession.create({
    data: {
      batchId: batch1.id,
      title: "Module 2: ICD-10-CM Official Coding Conventions & Neoplasms",
      sessionDate: new Date("2026-10-11T10:00:00Z"),
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      meetUrl: "https://meet.google.com/mcoa-amc-class",
      recordingUrl: "https://player.vimeo.com/video/76979871",
      status: "Completed",
    },
  });

  const session3 = await prisma.batchSession.create({
    data: {
      batchId: batch1.id,
      title: "Module 2: Circulatory, Respiratory & Endocrine Manifestations",
      sessionDate: new Date("2026-10-18T10:00:00Z"),
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      meetUrl: "https://meet.google.com/mcoa-amc-class",
      status: "Scheduled",
    },
  });

  // 5. Create Modules & Lessons for AMC Course
  let mod1 = await prisma.module.findFirst({
    where: { courseId: amcCourse.id, title: "Module 1: Clinical Foundations & Medical Terminology" },
  });

  if (!mod1) {
    mod1 = await prisma.module.create({
      data: {
        courseId: amcCourse.id,
        title: "Module 1: Clinical Foundations & Medical Terminology",
        order: 1,
        lessons: {
          create: [
            {
              title: "Lesson 1: Introduction to US Healthcare RCM & Medical Coding Roles",
              order: 1,
              duration: "45 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              content: `### Welcome to Medical Coding Officers Academy (MCOA)
In this fundamental lecture, Dr. Jeevanantham introduces the global revenue cycle framework. 
Key Concepts Covered:
1. Payer, Provider, and Patient triad in US Healthcare
2. Difference between Inpatient (Facility) and Outpatient (Professional) billing
3. The role of AAPC CPC and AHIMA CCS credentials
4. Ethical code sequencing and compliance basics.`,
              pdfUrl: "/materials/mcoa_m1_l1_introduction.pdf",
              isFreePreview: true,
            },
            {
              title: "Lesson 2: Anatomical Directional Terms & Body Planes",
              order: 2,
              duration: "55 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              content: `### Anatomical Terminology for Medical Coders
Understanding directional planes is critical for procedural coding (CPT) and inpatient approaches (ICD-10-PCS).
Topics:
- Anterior (Ventral) vs Posterior (Dorsal)
- Medial, Lateral, Proximal, Distal
- Sagittal, Coronal, and Transverse sections
- Body cavities: Cranial, Thoracic, Abdominal, Pelvic.`,
              pdfUrl: "/materials/mcoa_m1_l2_anatomy.pdf",
            },
            {
              title: "Lesson 3: Pathophysiology & Diagnostic Laboratory Tests",
              order: 3,
              duration: "60 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              content: `### Pathophysiology & Lab Values
How to link physician diagnostic findings with lab results:
- Complete Blood Count (CBC) with differential
- Comprehensive Metabolic Panel (CMP)
- Arterial Blood Gas (ABG) for respiratory failure
- Microbiology culture and sensitivity interpretations.`,
              pdfUrl: "/materials/mcoa_m1_l3_patho.pdf",
            },
          ],
        },
      },
    });
  }

  let mod2 = await prisma.module.findFirst({
    where: { courseId: amcCourse.id, title: "Module 2: ICD-10-CM Diagnosis Coding Mastery" },
  });

  if (!mod2) {
    mod2 = await prisma.module.create({
      data: {
        courseId: amcCourse.id,
        title: "Module 2: ICD-10-CM Diagnosis Coding Mastery",
        order: 2,
        lessons: {
          create: [
            {
              title: "Lesson 4: Official Guidelines for Coding and Reporting (OGCR)",
              order: 1,
              duration: "65 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              content: `### ICD-10-CM Conventions & General Rules
- Excludes1 (Not coded here!) vs Excludes2 (Not included here)
- "Code First" and "Use Additional Code" instructions
- Signs and symptoms vs definitive diagnoses
- Acute and chronic condition sequencing priority.`,
              pdfUrl: "/materials/mcoa_m2_l4_guidelines.pdf",
            },
            {
              title: "Lesson 5: Chapter 2 Neoplasms & Histology Cross-Referencing",
              order: 2,
              duration: "70 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              content: `### Neoplasm Coding Strategies
- Malignant Primary vs Secondary (Metastatic)
- Carcinoma in Situ vs Benign vs Uncertain Behavior
- Sequencing surgical excision vs chemotherapy encounters
- Pathology report dissection.`,
              pdfUrl: "/materials/mcoa_m2_l5_neoplasms.pdf",
            },
            {
              title: "Lesson 6: Chapter 4 Endocrine & Diabetes Manifestations",
              order: 3,
              duration: "60 mins",
              videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
              content: `### Diabetes Mellitus (E08 - E13)
- Type 1 (E10) vs Type 2 (E11) diabetes
- Combination codes for nephropathy, retinopathy, and neuropathy
- Insulin dependence (Z79.4) vs oral hypoglycemic agents (Z79.84).`,
              pdfUrl: "/materials/mcoa_m2_l6_diabetes.pdf",
            },
          ],
        },
      },
    });
  }

  console.log("Modules and lessons created with rich curriculum content.");

  // 6. Create Student Enrollment for Sneha
  const enrollment = await prisma.enrollment.upsert({
    where: { studentIdNumber: "MCOA-2026-CHN-0082" },
    update: {},
    create: {
      studentIdNumber: "MCOA-2026-CHN-0082",
      userId: student.id,
      courseId: amcCourse.id,
      batchId: batch1.id,
      status: "Active",
      totalFee: 27500,
      paidFee: 27500,
      progressPercent: 68,
      certificateIssued: true,
      certificateId: "MCOA-CERT-2026-0082",
      enrollmentDate: new Date("2026-10-01"),
    },
  });

  // 7. Mark first 3 lessons completed for Sneha
  const lessons = await prisma.lesson.findMany({
    take: 3,
  });

  for (const l of lessons) {
    await prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId: l.id,
          userId: student.id,
        },
      },
      update: {},
      create: {
        lessonId: l.id,
        userId: student.id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  // 8. Log Attendance Records for Sneha
  await prisma.attendanceRecord.upsert({
    where: {
      sessionId_userId: {
        sessionId: session1.id,
        userId: student.id,
      },
    },
    update: {},
    create: {
      sessionId: session1.id,
      userId: student.id,
      status: "Present",
    },
  });

  await prisma.attendanceRecord.upsert({
    where: {
      sessionId_userId: {
        sessionId: session2.id,
        userId: student.id,
      },
    },
    update: {},
    create: {
      sessionId: session2.id,
      userId: student.id,
      status: "Present",
    },
  });

  // 9. Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      courseId: amcCourse.id,
      title: "Chart Review Case #1: Laparoscopic Cholecystectomy with Cholangiogram",
      description: "Review the attached operative note. Identify the primary diagnosis, secondary comorbidities, operative procedure CPT code, and modifier 51 applicability.",
      chartData: `PREOPERATIVE DIAGNOSIS: Symptomatic cholelithiasis with chronic cholecystitis.
POSTOPERATIVE DIAGNOSIS: Acute and chronic cholecystitis with cholelithiasis.
PROCEDURE PERFORMED: Laparoscopic cholecystectomy with intraoperative fluoroscopic cholangiogram.
FINDINGS: The gallbladder was acutely distended with multiple pigmented gallstones. Normal cystic duct and common bile duct caliber confirmed on cholangiogram.`,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      maxScore: 100,
    },
  });

  // Student submission for assignment 1
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      userId: student.id,
      content: `Diagnosis Codes:
1. K80.12 - Calculus of gallbladder with acute and chronic cholecystitis without obstruction (Primary)

CPT Procedure Codes:
1. 47563 - Laparoscopy, surgical; cholecystectomy with cholangiography.
Modifier Notes: Modifier 51 is not needed because 47563 is a comprehensive single code that includes both laparoscopic cholecystectomy and intraoperative cholangiography.`,
      score: 95,
      feedback: "Outstanding work, Sneha! Perfect understanding that CPT 47563 bundles both the cholecystectomy and the cholangiography without requiring separate reporting or modifier 51. Keep up the high standard. - Dr. Rajesh Kannan",
      gradedAt: new Date(),
      gradedBy: trainer.name,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      courseId: amcCourse.id,
      title: "Chart Review Case #2: Type 2 Diabetes with Diabetic Chronic Kidney Disease Stage 4",
      description: "Code the diagnosis sequencing for an outpatient encounter with Type 2 Diabetes Mellitus with diabetic nephropathy and CKD stage 4 on long-term insulin therapy.",
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      maxScore: 100,
    },
  });

  console.log("Assignments & graded submissions seeded.");
  console.log("Phase 2 Seeding Completed Successfully!");
}

seedPhase2()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
