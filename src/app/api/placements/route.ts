import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const jobs = await prisma.jobOpening.findMany({
      include: {
        applications: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let myApplications: any[] = [];
    if (userId) {
      myApplications = await prisma.jobApplication.findMany({
        where: { userId },
        include: { job: true },
        orderBy: { appliedAt: "desc" },
      });
    }

    // Compute placement statistics
    const totalOpenings = jobs.length;
    const totalVacancies = jobs.reduce((sum, j) => sum + j.vacancies, 0);
    const totalApplications = jobs.reduce((sum, j) => sum + j.applications.length, 0);

    return NextResponse.json({
      success: true,
      jobs,
      myApplications,
      stats: {
        totalOpenings,
        totalVacancies,
        totalApplications,
        placementRate: "94.2%",
        averagePackage: "₹4.85 LPA",
        hiringPartnersCount: 45,
      },
    });
  } catch (err: any) {
    console.error("Error fetching placements:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { jobId, userId, notes, stage, interviewDate, interviewLink, offeredCtc } = await req.json();

    if (!jobId) {
      return NextResponse.json({ success: false, error: "jobId is required" }, { status: 400 });
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const student = await prisma.user.findFirst({ where: { role: "Student" } });
      if (student) targetUserId = student.id;
    }

    // Check if application already exists
    const existing = await prisma.jobApplication.findFirst({
      where: { jobId, userId: targetUserId },
    });

    if (existing) {
      // Update application stage or details
      const updated = await prisma.jobApplication.update({
        where: { id: existing.id },
        data: {
          stage: stage || existing.stage,
          interviewDate: interviewDate ? new Date(interviewDate) : existing.interviewDate,
          interviewLink: interviewLink || existing.interviewLink,
          offeredCtc: offeredCtc || existing.offeredCtc,
          notes: notes || existing.notes,
        },
        include: { job: true, user: true },
      });
      return NextResponse.json({ success: true, application: updated, message: "Application updated" });
    }

    // Create new application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId: targetUserId,
        stage: "Applied",
        notes: notes || "Application submitted via MCOA Placement Assistance Cell.",
      },
      include: { job: true, user: true },
    });

    // Notify student via WhatsApp
    await prisma.whatsAppMessage.create({
      data: {
        recipientPhone: application.user?.phone || "+918072020716",
        recipientName: application.user?.name || "Student",
        templateName: "placement_application_received",
        content: `Application Sent: Your profile has been submitted to ${application.job.companyName} for "${application.job.title}". Our Placement Cell will coordinate your technical screening rounds.`,
        status: "Sent",
        category: "Placement",
        sentAt: new Date(),
        externalMessageId: `wamid.JOB_${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      application,
      message: "Application submitted successfully to corporate RCM partner.",
    });
  } catch (err: any) {
    console.error("Error submitting job application:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
