import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courseCount = await prisma.course.count();
    const branchCount = await prisma.branch.count();
    const kbCount = await prisma.aiKnowledgeItem.count();

    // If branches are missing, populate core branches
    if (branchCount === 0) {
      await prisma.branch.createMany({
        data: [
          {
            id: "chennai-hq",
            name: "Chennai Head Office",
            code: "CHN-HQ",
            address: "#80/1, 200 Feet Radial Road, Narayanapuram Lake, Pallikaranai",
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
            address: "3rd Floor, Annai Hospital, VRM IAS Academy",
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
            address: "#52, 5th Cross, TT Nagar",
            city: "Karaikudi",
            state: "Tamil Nadu",
            postalCode: "600001",
            phone: "+91 8072020716",
            email: "karaikudi@medicalcodingofficersacademy.com",
            isHeadOffice: false,
          },
        ]
      });
    }

    // If courses are missing, populate flagship courses
    if (courseCount === 0) {
      await prisma.course.createMany({
        data: [
          {
            slug: "advanced-medical-coding",
            title: "Advanced Medical Coding Masterclass (CPC® + CCS®)",
            summary: "Comprehensive healthcare revenue cycle training covering ICD-10-CM, CPT, HCPCS, E&M leveling, and inpatient MS-DRGs.",
            category: "Flagship",
            certificationTrack: "AAPC CPC & AHIMA CCS",
            durationWeeks: 16,
            totalHours: 180,
            feeINR: 45000,
            learningMode: "Hybrid / Live Online / Offline",
            published: true,
            featured: true,
            syllabusSummary: "ICD-10-CM, CPT-4 Surgery, E&M 2026 MDM rules, ICD-10-PCS, and MS-DRGs."
          },
          {
            slug: "cpc-certification-prep",
            title: "AAPC CPC® Fast-Track Certification Bootcamp",
            summary: "Intensive 90-day exam preparation with 3 full-length timed mock exams and process-of-elimination test mastery.",
            category: "Certification Track",
            certificationTrack: "AAPC CPC®",
            durationWeeks: 12,
            totalHours: 120,
            feeINR: 35000,
            learningMode: "Live Online & Classroom",
            published: true,
            featured: true,
            syllabusSummary: "AAPC official exam blueprint, CPT sections, HCPCS Level II, and HIPAA compliance."
          },
          {
            slug: "ccs-certification-prep",
            title: "AHIMA CCS® Inpatient Hospital Coding Program",
            summary: "Advanced inpatient hospital facility coding covering ICD-10-PCS root operations, MS-DRG grouping, and POA guidelines.",
            category: "Certification Track",
            certificationTrack: "AHIMA CCS®",
            durationWeeks: 12,
            totalHours: 120,
            feeINR: 38000,
            learningMode: "Live Online",
            published: true,
            featured: false,
            syllabusSummary: "Inpatient prospective payment systems, MS-DRG grouper logic, and surgical coding."
          }
        ]
      });
    }

    // If AI Knowledge base is empty, populate core facts
    if (kbCount === 0) {
      await prisma.aiKnowledgeItem.createMany({
        data: [
          {
            title: 'MCOA Academy Overview & Campuses',
            category: 'courses',
            keywords: 'about, mcoa, founder, jeevanantham, campuses, chennai, perambalur, coimbatore, karaikudi, contact, phone',
            content: 'Medical Coding Officers Academy (MCOA) is India\'s leading healthcare revenue cycle training institution founded by Dr. Jeevanantham Mariappan. Campuses in Chennai (#80/1 200 Feet Radial Road, Pallikaranai), Perambalur, Coimbatore, and Karaikudi. Admissions Hotline: +91 8072020716.',
            source: 'MCOA Official Directory 2026'
          },
          {
            title: 'Tuition Fees & 3-Installment Schedule',
            category: 'courses',
            keywords: 'fees, cost, installments, price, payment schedule, duration',
            content: 'Our flagship 4-Month Advanced Medical Coding & AAPC CPC Preparation Program is priced at ₹45,000 (inclusive of 18% GST). MCOA offers a flexible 3-installment plan: Installment 1 (Down Payment upon admission): ₹15,000; Installment 2 (Month 1): ₹15,000; Installment 3 (Month 2): ₹15,000.',
            source: 'MCOA Board of Governors Fee Structure 2026'
          },
          {
            title: '100% Placement Assistance & Hiring Partners',
            category: 'career_rcm',
            keywords: 'placements, jobs, salary, package, omega, access healthcare, episource',
            content: 'MCOA provides dedicated placement support with corporate RCM partners including Omega Healthcare, Access Healthcare, Episource, and AGS Health. Certified CPC freshers typically receive starting packages ranging from ₹3.50 LPA to ₹5.20 LPA.',
            source: 'MCOA Corporate Placement Cell'
          }
        ]
      });
    }

    return NextResponse.json({
      success: true,
      status: 'Database active and initialized',
      stats: {
        branches: await prisma.branch.count(),
        courses: await prisma.course.count(),
        knowledgeItems: await prisma.aiKnowledgeItem.count()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database init error', details: error.message }, { status: 500 });
  }
}
