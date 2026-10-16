import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { submissionId, score, feedback, gradedBy } = await req.json();

    if (!submissionId || score === undefined) {
      return NextResponse.json({ success: false, error: "submissionId and score required" }, { status: 400 });
    }

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: Number(score),
        feedback,
        gradedAt: new Date(),
        gradedBy: gradedBy || "Dr. Rajesh Kannan",
      },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (err: any) {
    console.error("Error grading submission:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
