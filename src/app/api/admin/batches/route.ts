import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        branch: { select: { name: true, city: true } },
        course: { select: { title: true, slug: true } },
        trainer: { select: { name: true, email: true } },
        _count: { select: { enrollments: true, sessions: true } },
      },
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json({ success: true, batches });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code, mode, timing, startDate, capacity, branchId, courseId, trainerId } = body;

    const batch = await prisma.batch.create({
      data: {
        name,
        code,
        mode: mode || "Classroom",
        timing: timing || "Weekend",
        startDate: new Date(startDate),
        capacity: Number(capacity) || 30,
        status: "Upcoming",
        branchId: branchId || null,
        courseId,
        trainerId: trainerId || null,
      },
    });

    return NextResponse.json({ success: true, batch });
  } catch (err: any) {
    console.error("Error creating batch:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
