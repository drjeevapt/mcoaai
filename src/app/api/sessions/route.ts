import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");

    const where: any = {};
    if (batchId) where.batchId = batchId;

    const sessions = await prisma.liveSession.findMany({
      where,
      include: {
        batch: { include: { branch: true } },
        course: true,
        trainer: true,
      },
      orderBy: { scheduledStartTime: "asc" },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (err: any) {
    console.error("Error fetching live sessions:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, batchId, courseId, trainerId, platform, meetingUrl, meetingId, passcode, scheduledStartTime, scheduledEndTime, agenda } = body;

    if (!title || !meetingUrl || !scheduledStartTime) {
      return NextResponse.json({ success: false, error: "Title, meetingUrl, and scheduledStartTime are required" }, { status: 400 });
    }

    const session = await prisma.liveSession.create({
      data: {
        title,
        batchId: batchId || null,
        courseId: courseId || null,
        trainerId: trainerId || null,
        platform: platform || "Zoom",
        meetingUrl,
        meetingId: meetingId || null,
        passcode: passcode || null,
        scheduledStartTime: new Date(scheduledStartTime),
        scheduledEndTime: scheduledEndTime ? new Date(scheduledEndTime) : new Date(new Date(scheduledStartTime).getTime() + 2 * 60 * 60 * 1000),
        status: "Scheduled",
        agenda: agenda || null,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "LIVE_SESSION_SCHEDULED",
        entityType: "LiveSession",
        entityId: session.id,
        details: JSON.stringify({ title, platform, meetingUrl }),
      },
    });

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    console.error("Error scheduling live session:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
