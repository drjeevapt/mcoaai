import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseSlug = searchParams.get("slug") || "advanced-medical-coding";

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                progress: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const student = await prisma.user.findFirst({ where: { role: "Student" } });

    // Format modules with student completion status
    const formattedModules = course.modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      order: mod.order,
      lessons: mod.lessons.map((les) => {
        const isCompleted = les.progress.some(
          (p) => p.userId === student?.id && p.completed
        );
        return {
          id: les.id,
          title: les.title,
          order: les.order,
          duration: les.duration,
          videoUrl: les.videoUrl,
          content: les.content,
          pdfUrl: les.pdfUrl,
          completed: isCompleted,
        };
      }),
    }));

    return NextResponse.json({ success: true, modules: formattedModules });
  } catch (err: any) {
    console.error("Error fetching curriculum:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
