const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPhase4() {
  console.log("Seeding Phase 4: Payments, Live Sessions, Webinars, WhatsApp & Placements...");

  // Fetch student, batch, and course
  const student = await prisma.user.findFirst({ where: { role: "Student" } });
  const trainer = await prisma.user.findFirst({ where: { role: "Trainer" } });
  const course = await prisma.course.findFirst({ where: { slug: "advanced-medical-coding" } });
  const batch = await prisma.batch.findFirst({ where: { code: "CHN-AMC-OCT26-WE" } });
  const enrollment = student ? await prisma.enrollment.findFirst({ where: { userId: student.id } }) : null;

  if (!student || !course) {
    console.log("Student or Course not found, skipping user-tied seeds.");
    return;
  }

  // 1. Seed Payment Orders & Installment Plan for Student
  console.log("1. Seeding payment orders & installments...");
  const existingOrders = await prisma.paymentOrder.count({ where: { userId: student.id } });
  if (existingOrders === 0) {
    // Installment 1: Paid Down Payment
    await prisma.paymentOrder.create({
      data: {
        orderNumber: "MCOA-ORD-2026-CHN-0082-1",
        userId: student.id,
        enrollmentId: enrollment?.id,
        amount: 15000,
        currency: "INR",
        status: "Paid",
        razorpayOrderId: "order_PVb9281740aKsd",
        razorpayPaymentId: "pay_Kx928174620aLm",
        razorpaySignature: "sig_928174981720a48b92c",
        installmentNumber: 1,
        paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        invoiceNumber: "MCOA-INV-2026-0082",
        paymentMethod: "UPI",
        notes: "Admission Down Payment (Installment 1 of 3) - Verified via Razorpay",
      },
    });

    // Installment 2: Pending (Due Soon)
    await prisma.paymentOrder.create({
      data: {
        orderNumber: "MCOA-ORD-2026-CHN-0082-2",
        userId: student.id,
        enrollmentId: enrollment?.id,
        amount: 15000,
        currency: "INR",
        status: "Created",
        razorpayOrderId: "order_QWc8392019bMzp",
        installmentNumber: 2,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
        invoiceNumber: "MCOA-INV-2026-0129",
        notes: "Installment 2 of 3 - Mid-term curriculum milestone",
      },
    });

    // Installment 3: Scheduled
    await prisma.paymentOrder.create({
      data: {
        orderNumber: "MCOA-ORD-2026-CHN-0082-3",
        userId: student.id,
        enrollmentId: enrollment?.id,
        amount: 15000,
        currency: "INR",
        status: "Created",
        installmentNumber: 3,
        dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // Due in 40 days
        invoiceNumber: "MCOA-INV-2026-0185",
        notes: "Final Installment 3 of 3 - Pre-certification & placement clearance",
      },
    });
  }

  // 2. Seed Live Interactive Sessions (Zoom / Meet)
  console.log("2. Seeding live scheduled sessions...");
  await prisma.liveSession.deleteMany({});
  await prisma.liveSession.createMany({
    data: [
      {
        title: "Mastering Inpatient ICD-10-PCS Root Operations & Approach Selection",
        batchId: batch?.id,
        courseId: course.id,
        trainerId: trainer?.id,
        platform: "Zoom",
        meetingUrl: "https://zoom.us/j/8072020716?pwd=MCOA_PCS_OCT26",
        meetingId: "807 202 0716",
        passcode: "MCOA2026",
        scheduledStartTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        scheduledEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        status: "Scheduled",
        agenda: "Deep dive into 31 root operations, character 5 surgical approaches, and operative chart coding exercises.",
        attendanceCount: 28,
      },
      {
        title: "E&M 2023 Guidelines: Medical Decision Making Interactive Chart Audits",
        batchId: batch?.id,
        courseId: course.id,
        trainerId: trainer?.id,
        platform: "Google Meet",
        meetingUrl: "https://meet.google.com/mco-medc-off",
        scheduledStartTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
        scheduledEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        status: "Scheduled",
        agenda: "Analyzing Problem complexity, Data review tiers, and Prescription drug management risk scenarios.",
        attendanceCount: 30,
      },
      {
        title: "Cardiovascular System CPT Coding & NCCI Unbundling Rules",
        batchId: batch?.id,
        courseId: course.id,
        trainerId: trainer?.id,
        platform: "Zoom",
        meetingUrl: "https://zoom.us/j/8072020716",
        scheduledStartTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        scheduledEndTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        status: "Completed",
        recordingUrl: "https://player.vimeo.com/video/mcoa-cardio-cpt-rec",
        agenda: "Coronary artery bypass grafting (CABG), cardiac catheterization, pacemaker placements, and modifier -59.",
        attendanceCount: 29,
      },
    ],
  });

  // 3. Seed Masterclass Webinars
  console.log("3. Seeding public webinars...");
  await prisma.webinar.deleteMany({});
  const webinar1 = await prisma.webinar.create({
    data: {
      slug: "icd-10-cm-2026-updates-keynote",
      title: "Demystifying 2026 ICD-10-CM & CPT Coding Changes: Keynote by Dr. Jeevanantham",
      speakerName: "Dr. Jeevanantham Mariappan",
      speakerTitle: "Founder & CEO, Medical Coding Officers Academy",
      description: "Join South India's premier medical coding educator for an exclusive masterclass on the newly published FY 2026 ICD-10-CM guideline revisions, telehealth coding permanence, and RCM hiring trends.",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      durationMinutes: 90,
      isPaid: false,
      priceINR: 0,
      meetingPlatform: "Zoom Live Stream",
      meetingUrl: "https://zoom.us/webinar/register/WN_mcoa2026webinar",
      maxAttendees: 500,
      status: "Upcoming",
    },
  });

  const webinar2 = await prisma.webinar.create({
    data: {
      slug: "crack-cpc-exam-60-days-blueprint",
      title: "How to Crack AAPC CPC® on First Attempt: 60-Day Study Blueprint & Time Strategy",
      speakerName: "Preethi Soundararajan, CPC, CPMA",
      speakerTitle: "Lead Faculty & CPC Master Trainer, MCOA Chennai",
      description: "Proven process of elimination strategies, book tabbing secrets, and time pacing for all 100 AAPC CPC® exam questions.",
      date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      durationMinutes: 75,
      isPaid: false,
      priceINR: 0,
      meetingPlatform: "Google Meet",
      meetingUrl: "https://meet.google.com/mco-cpcb-pri",
      maxAttendees: 300,
      status: "Upcoming",
    },
  });

  // Sample webinar registrations
  await prisma.webinarRegistration.createMany({
    data: [
      {
        webinarId: webinar1.id,
        name: "Karthikeyan Selvam",
        email: "karthik.s@gmail.com",
        phone: "+91 98401 23456",
        education: "B.Pharm",
        city: "Chennai",
        paymentStatus: "Free",
      },
      {
        webinarId: webinar1.id,
        name: "Pooja Venkat",
        email: "pooja.venkat@outlook.com",
        phone: "+91 94432 10987",
        education: "B.Sc Biotechnology",
        city: "Coimbatore",
        paymentStatus: "Free",
      },
    ],
  });

  // 4. Seed WhatsApp Automated Logs
  console.log("4. Seeding WhatsApp Business logs...");
  await prisma.whatsAppMessage.deleteMany({});
  await prisma.whatsAppMessage.createMany({
    data: [
      {
        recipientPhone: "+918072020716",
        recipientName: "Sneha Ramachandran",
        templateName: "admission_confirmation_welcome",
        content: "Dear Sneha, Welcome to MCOA! Your enrollment in Advanced Medical Coding Masterclass (Batch CHN-AMC-OCT26-WE) is confirmed. Your official Student ID is MCOA-2026-CHN-0082. Login to your student LMS at https://medicalcodingofficersacademy.com/student. Central Hotline: +91 8072020716.",
        status: "Read",
        category: "Admissions",
        sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 5000),
        readAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 45000),
        externalMessageId: "wamid.HBgMOTE4MDcyMDIwNzE2FQIAERgSM0Y4OTgyMTA0RkU3MEU4MUZEAA==",
      },
      {
        recipientPhone: "+918072020716",
        recipientName: "Sneha Ramachandran",
        templateName: "fee_receipt_issued",
        content: "Payment Receipt: Received INR 15,000 for Installment 1 (Invoice #MCOA-INV-2026-0082). View and download your official GST statement in your student portal. Thank you for choosing MCOA.",
        status: "Read",
        category: "Finance",
        sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 60000),
        deliveredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 63000),
        readAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 120000),
        externalMessageId: "wamid.HBgMOTE4MDcyMDIwNzE2FQIAERgSMjZBRTgyMDk1RDgzOEFGM0M0AA==",
      },
      {
        recipientPhone: "+918072020716",
        recipientName: "Sneha Ramachandran",
        templateName: "live_session_reminder_2h",
        content: "Class Reminder: Live online interactive session 'Inpatient ICD-10-PCS Root Operations' starts in 2 hours on Zoom. Join link: https://zoom.us/j/8072020716?pwd=MCOA_PCS_OCT26. Faculty: Dr. Jeevanantham Mariappan.",
        status: "Delivered",
        category: "Academics",
        sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 4000),
        externalMessageId: "wamid.HBgMOTE4MDcyMDIwNzE2FQIAERgSN0ExRTIwOTc4MTJBOTFDMEE2AA==",
      },
    ],
  });

  // 5. Seed Corporate Placement Job Openings
  console.log("5. Seeding corporate placement openings...");
  await prisma.jobOpening.deleteMany({});
  const job1 = await prisma.jobOpening.create({
    data: {
      title: "Medical Coder — Outpatient E&M & Same Day Surgery",
      companyName: "Omega Healthcare Management Services",
      companyLogo: "/images/partners/omega.png",
      location: "Chennai (DLF Cybercity) / Hybrid",
      employmentType: "Full-time Permanent",
      salaryRange: "₹4.00 - ₹5.50 LPA",
      vacancies: 25,
      minExperience: "Freshers / CPC-A / CPC Certified",
      requiredCertifications: "AAPC CPC® or AHIMA CCS®",
      jobDescription: "Reviewing US multi-specialty outpatient surgery and emergency department medical records, assigning accurate ICD-10-CM and CPT codes with appropriate modifiers according to NCCI and CMS guidelines.",
      skillsRequired: "ICD-10-CM, CPT Surgery (10000-60000), E&M MDM guidelines, Medical Terminology",
      status: "Active",
    },
  });

  const job2 = await prisma.jobOpening.create({
    data: {
      title: "Inpatient Hospital Coder — ICD-10-PCS & MS-DRG",
      companyName: "Access Healthcare Services",
      companyLogo: "/images/partners/access.png",
      location: "Chennai (Ambattur) / Coimbatore",
      employmentType: "Full-time Permanent",
      salaryRange: "₹4.50 - ₹6.20 LPA",
      vacancies: 15,
      minExperience: "CCS® Certified / Advanced Inpatient Training",
      requiredCertifications: "AHIMA CCS® or AAPC CIC®",
      jobDescription: "Responsible for inpatient discharge summary review, principal diagnosis selection under UHDDS rules, secondary CC/MCC identification, and ICD-10-PCS procedure coding for optimal DRG grouping.",
      skillsRequired: "ICD-10-PCS Root Operations, MS-DRG Grouping, UHDDS Principles, Hospital Revenue Cycle",
      status: "Active",
    },
  });

  const job3 = await prisma.jobOpening.create({
    data: {
      title: "Risk Adjustment Coder (CRC®) — Medicare Advantage",
      companyName: "Episource Healthcare",
      companyLogo: "/images/partners/episource.png",
      location: "Coimbatore / Remote Work-from-Home",
      employmentType: "Full-time",
      salaryRange: "₹3.80 - ₹5.00 LPA",
      vacancies: 20,
      minExperience: "Certified CRC® / Fresh Life Sciences Graduates",
      requiredCertifications: "AAPC CRC® or CPC®",
      jobDescription: "Evaluating annual wellness visits and chronic condition documentation to accurately capture CMS-HCC risk adjustment categories, ensuring compliant risk scores for US Medicare Advantage health plans.",
      skillsRequired: "CMS-HCC Model, Chronic Illness Coding, MEAT Documentation Criteria, RADV Audits",
      status: "Active",
    },
  });

  // Seed sample student application
  await prisma.jobApplication.deleteMany({});
  await prisma.jobApplication.create({
    data: {
      jobId: job1.id,
      userId: student.id,
      stage: "Technical Interview",
      interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      interviewLink: "https://teams.microsoft.com/l/meetup-join/omega-interview-sneha",
      notes: "Cleared Round 1 Anatomy & Terminology assessment with 94% score. Scheduled for technical chart coding evaluation with US Client Lead.",
    },
  });

  console.log("Phase 4 Seeding Completed Successfully!");
}

seedPhase4()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
