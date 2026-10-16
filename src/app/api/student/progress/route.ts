import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { lessonId, userId, completed } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ success: false, error: "lessonId required" }, { status: 400 });
    }

    // Default to student user if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const student = await prisma.user.findFirst({ where: { role: "Student" } });
      if (student) targetUserId = student.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId,
          userId: targetUserId,
        },
      },
      update: {
        completed: completed !== undefined ? completed : true,
        completedAt: new Date(),
      },
      create: {
        lessonId,
        userId: targetUserId,
        completed: completed !== undefined ? completed : true,
        completedAt: new Date(),
      },
    });

    // Update overall course enrollment progress percent
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (lesson) {
      const totalLessons = await prisma.lesson.count({
        where: { module: { courseId: lesson.module.courseId } },
      });

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId: targetUserId,
          completed: true,
          lesson: { module: { courseId: lesson.module.courseId } },
        },
      });

      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      await prisma.enrollment.updateMany({
        where: {
          userId: targetUserId,
          courseId: lesson.module.courseId,
        },
        data: {
          progressPercent,
        },
      });
    }

    return NextResponse.json({ success: true, progress });
  } catch (err: any) {
    console.error("Error updating lesson progress:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
