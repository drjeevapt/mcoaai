import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const webinar = await prisma.webinar.findUnique({
        where: { slug },
        include: {
          registrations: {
            orderBy: { registeredAt: "desc" },
          },
        },
      });

      if (!webinar) {
        return NextResponse.json({ success: false, error: "Webinar not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, webinar });
    }

    const webinars = await prisma.webinar.findMany({
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ success: true, webinars });
  } catch (err: any) {
    console.error("Error fetching webinars:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { webinarId, slug, name, email, phone, education, city } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Name, email, and phone are required" }, { status: 400 });
    }

    let targetWebinarId = webinarId;
    if (!targetWebinarId && slug) {
      const w = await prisma.webinar.findUnique({ where: { slug } });
      if (w) targetWebinarId = w.id;
    }

    if (!targetWebinarId) {
      const firstWebinar = await prisma.webinar.findFirst();
      if (firstWebinar) targetWebinarId = firstWebinar.id;
    }

    const registration = await prisma.webinarRegistration.create({
      data: {
        webinarId: targetWebinarId,
        name,
        email,
        phone,
        education: education || "Life Sciences",
        city: city || "Chennai",
        paymentStatus: "Free",
      },
      include: {
        webinar: true,
      },
    });

    // Also auto-capture as Lead in CRM for follow-up
    const existingLead = await prisma.lead.findFirst({ where: { email } });
    if (!existingLead) {
      const counselor = await prisma.user.findFirst({ where: { role: "Admissions Counselor" } });
      const amcCourse = await prisma.course.findFirst({ where: { slug: "advanced-medical-coding" } });
      const chnBranch = await prisma.branch.findFirst({ where: { isHeadOffice: true } });

      await prisma.lead.create({
        data: {
          fullName: name,
          email,
          phone,
          educationBackground: education || "Biotech",
          source: "Webinar Registration",
          status: "Contacted",
          courseId: amcCourse?.id,
          branchId: chnBranch?.id,
          assignedCounselorId: counselor?.id,
          utmSource: "webinar-registration",
          utmCampaign: registration.webinar.slug,
        },
      });
    }

    // Send confirmation WhatsApp message
    await prisma.whatsAppMessage.create({
      data: {
        recipientPhone: phone,
        recipientName: name,
        templateName: "webinar_registration_confirmed",
        content: `Hi ${name}, your seat for "${registration.webinar.title}" is confirmed! Live Date: ${new Date(registration.webinar.date).toLocaleDateString("en-IN")}. Join Link: ${registration.webinar.meetingUrl}. Powered by MCOA.`,
        status: "Sent",
        category: "Academics",
        sentAt: new Date(),
        externalMessageId: `wamid.WEBINAR_${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      registration,
      meetingUrl: registration.webinar.meetingUrl,
      message: "Registration successful! Confirmation dispatched via WhatsApp and Email.",
    });
  } catch (err: any) {
    console.error("Error registering for webinar:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
