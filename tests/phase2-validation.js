const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runPhase2Tests() {
  console.log("==========================================");
  console.log("  MCOA Phase 2 Automated Validation Suite ");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✖ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Verify Active Batches Across Campuses
    console.log("Test 1: Verifying cohort batches across campuses...");
    const batches = await prisma.batch.findMany({ include: { branch: true, course: true } });
    assert(batches.length >= 4, `Expected at least 4 batches, found ${batches.length}`);
    const chnBatch = batches.find((b) => b.code === "CHN-AMC-OCT26-WE");
    assert(chnBatch && chnBatch.status === "Active", "Chennai AMC Weekend active batch verified");

    // Test 2: Verify Modules and Lessons Hierarchy
    console.log("\nTest 2: Verifying LMS module and lesson hierarchy...");
    const modules = await prisma.module.findMany({ include: { lessons: true } });
    assert(modules.length >= 2, `Expected at least 2 modules, found ${modules.length}`);
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    assert(totalLessons >= 6, `Expected at least 6 lessons, found ${totalLessons}`);

    // Test 3: Verify Student Enrollment and ID
    console.log("\nTest 3: Verifying student enrollment & Student ID...");
    const student = await prisma.user.findFirst({
      where: { role: "Student" },
      include: { enrollments: true },
    });
    assert(!!student, `Found student user: ${student?.name}`);
    const enrollment = student?.enrollments[0];
    assert(
      enrollment && enrollment.studentIdNumber.startsWith("MCOA-2026-"),
      `Verified official Student ID: ${enrollment?.studentIdNumber}`
    );

    // Test 4: Verify Lesson Progress Tracking
    console.log("\nTest 4: Testing lesson progress tracking...");
    const progressCount = await prisma.lessonProgress.count({
      where: { userId: student.id, completed: true },
    });
    assert(progressCount >= 3, `Expected at least 3 completed lessons, found ${progressCount}`);

    // Test 5: Verify Chart Review Assignments & Trainer Grading
    console.log("\nTest 5: Testing chart review assignments & grading...");
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { userId: student.id },
      include: { assignment: true },
    });
    assert(submissions.length >= 1, `Found ${submissions.length} assignment submission`);
    const graded = submissions.find((s) => s.score !== null);
    assert(graded && graded.score === 95, `Assignment graded with score ${graded?.score}/100 and instructor feedback`);

    // Test 6: Verify Attendance Logging
    console.log("\nTest 6: Testing attendance records & rate...");
    const attendance = await prisma.attendanceRecord.findMany({
      where: { userId: student.id },
    });
    assert(attendance.length >= 2, `Verified ${attendance.length} session attendance records`);

    // Test 7: Verify Certificate Issuance
    console.log("\nTest 7: Testing certificate issuance...");
    assert(
      enrollment?.certificateIssued && enrollment?.certificateId === "MCOA-CERT-2026-0082",
      `Verified certificate ID: ${enrollment?.certificateId}`
    );

    console.log("\n==========================================");
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log("==========================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
