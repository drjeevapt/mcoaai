import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { assignmentId, userId, content } = await req.json();

    if (!assignmentId || !content) {
      return NextResponse.json({ success: false, error: "assignmentId and content required" }, { status: 400 });
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const student = await prisma.user.findFirst({ where: { role: "Student" } });
      if (student) targetUserId = student.id;
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId: targetUserId,
        content,
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    console.error("Error submitting assignment:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
