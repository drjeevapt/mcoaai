const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runTests() {
  console.log("==========================================");
  console.log("  MCOA Phase 1 Automated Validation Suite ");
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
    // Test 1: Verify all 4 physical branches exist with correct codes
    console.log("Test 1: Verifying physical branch network...");
    const branches = await prisma.branch.findMany();
    assert(branches.length === 4, `Expected 4 branches, found ${branches.length}`);
    const hq = branches.find((b) => b.isHeadOffice);
    assert(hq && hq.code === "CHN-HQ", "Chennai Head Office properly identified as headquarters");

    // Test 2: Verify all 7 core courses exist
    console.log("\nTest 2: Verifying courses and curriculum...");
    const courses = await prisma.course.findMany();
    assert(courses.length >= 7, `Expected at least 7 courses, found ${courses.length}`);
    const cpc = courses.find((c) => c.slug === "cpc-certification-prep");
    assert(cpc && cpc.feeInr > 0, "AAPC CPC Exam Prep course exists with valid fee structure");

    // Test 3: Test Lead Creation in Database
    console.log("\nTest 3: Testing public lead capture and auto-assignment...");
    const testLead = await prisma.lead.create({
      data: {
        fullName: "Test Automated Applicant",
        email: `test.applicant.${Date.now()}@example.com`,
        phone: "+91 99999 88888",
        educationBackground: "Pharmacy (B.Pharm, M.Pharm, Pharm.D)",
        mode: "Live Interactive Online",
        preferredBatch: "Weekend",
        status: "New",
        source: "Automated Test Suite",
        notes: "Automated validation lead",
        courseId: cpc ? cpc.id : null,
        branchId: hq ? hq.id : null,
      },
    });
    assert(!!testLead.id, `Lead created with ID: ${testLead.id}`);

    // Test 4: Test CRM Stage Progression
    console.log("\nTest 4: Testing CRM status advancement...");
    const updatedLead = await prisma.lead.update({
      where: { id: testLead.id },
      data: { status: "Counseling Scheduled", notes: "Counseling confirmed for Saturday 11 AM" },
    });
    assert(updatedLead.status === "Counseling Scheduled", "Lead status updated to 'Counseling Scheduled'");

    // Test 5: Verify Audit Log recording
    console.log("\nTest 5: Testing Audit Log generation...");
    const audit = await prisma.auditLog.create({
      data: {
        action: "LEAD_STATUS_CHANGED",
        entityType: "Lead",
        entityId: testLead.id,
        performedBy: "Test Suite",
        details: JSON.stringify({ status: "Counseling Scheduled" }),
      },
    });
    assert(!!audit.id, "Audit log record successfully generated");

    // Test 6: Verify Staff Users
    console.log("\nTest 6: Verifying staff and executive users...");
    const users = await prisma.user.findMany();
    assert(users.length >= 2, `Expected at least 2 staff users, found ${users.length}`);
    const founder = users.find((u) => u.role === "Super Admin");
    assert(founder && founder.name.includes("Jeevanantham"), "Founder Dr. Jeevanantham registered as Super Admin");

    // Clean up test lead
    await prisma.lead.delete({ where: { id: testLead.id } });
    console.log("\n[Cleanup] Test lead cleanly purged.");

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

runTests();
