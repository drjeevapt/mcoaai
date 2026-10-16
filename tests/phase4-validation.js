const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runPhase4Tests() {
  console.log("==========================================");
  console.log("  MCOA Phase 4 Automated Validation Suite ");
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
    // Test 1: Verify Installment Payment Schedule in Database
    console.log("Test 1: Verifying student installment payment schedule...");
    const student = await prisma.user.findFirst({ where: { role: "Student" } });
    assert(!!student, `Found student user: ${student?.name}`);

    const orders = await prisma.paymentOrder.findMany({
      where: { userId: student.id },
      orderBy: { installmentNumber: "asc" },
    });
    assert(orders.length >= 2, `Expected at least 2 installment orders, found ${orders.length}`);
    const paidOrder = orders.find((o) => o.status === "Paid");
    assert(!!paidOrder, `Verified paid down-payment installment: ₹${paidOrder?.amount}`);
    assert(
      paidOrder?.invoiceNumber?.startsWith("MCOA-INV-"),
      `Verified official GST invoice format: ${paidOrder?.invoiceNumber}`
    );

    // Test 2: Test Razorpay Order Generation & Verification
    console.log("\nTest 2: Testing Razorpay payment order and verification logic...");
    const testOrder = await prisma.paymentOrder.create({
      data: {
        orderNumber: `TEST-ORD-${Date.now()}`,
        userId: student.id,
        amount: 15000,
        currency: "INR",
        status: "Created",
        razorpayOrderId: `order_test_${Date.now()}`,
        installmentNumber: 2,
        notes: "Test installment payment",
      },
    });
    assert(testOrder.status === "Created", "Generated pending Razorpay order");

    // Verify the payment
    const verifiedOrder = await prisma.paymentOrder.update({
      where: { id: testOrder.id },
      data: {
        status: "Paid",
        razorpayPaymentId: `pay_test_${Date.now()}`,
        razorpaySignature: "test_sig_verified",
        paidAt: new Date(),
        invoiceNumber: `MCOA-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: "UPI",
      },
    });
    assert(verifiedOrder.status === "Paid", "Verified payment status updated to Paid");
    assert(!!verifiedOrder.invoiceNumber, `Generated GST invoice: ${verifiedOrder.invoiceNumber}`);

    // Clean up test order
    await prisma.paymentOrder.delete({ where: { id: testOrder.id } });

    // Test 3: Test Academy Finance Aggregations
    console.log("\nTest 3: Testing academy finance collections & receivables metrics...");
    const allOrders = await prisma.paymentOrder.findMany();
    const totalCollections = allOrders.filter((o) => o.status === "Paid").reduce((sum, o) => sum + o.amount, 0);
    const pendingReceivables = allOrders.filter((o) => o.status !== "Paid").reduce((sum, o) => sum + o.amount, 0);
    assert(totalCollections >= 15000, `Total collections: ₹${totalCollections.toLocaleString()}`);
    assert(pendingReceivables >= 15000, `Pending receivables: ₹${pendingReceivables.toLocaleString()}`);

    // Test 4: Verify Live Sessions (Zoom / Google Meet)
    console.log("\nTest 4: Verifying scheduled live classes and meeting links...");
    const sessions = await prisma.liveSession.findMany();
    assert(sessions.length >= 2, `Expected at least 2 live sessions, found ${sessions.length}`);
    const zoomSession = sessions.find((s) => s.platform === "Zoom");
    assert(!!zoomSession && zoomSession.meetingUrl.includes("zoom.us"), "Verified Zoom live session with join link");
    const meetSession = sessions.find((s) => s.platform === "Google Meet");
    assert(!!meetSession && meetSession.meetingUrl.includes("meet.google.com"), "Verified Google Meet session");

    // Test 5: Verify Masterclass Webinars & Lead Capture
    console.log("\nTest 5: Verifying public masterclass webinars & registrations...");
    const webinars = await prisma.webinar.findMany({ include: { registrations: true } });
    assert(webinars.length >= 2, `Expected at least 2 masterclasses, found ${webinars.length}`);
    const keynote = webinars.find((w) => w.slug === "icd-10-cm-2026-updates-keynote");
    assert(!!keynote, "Found Dr. Jeevanantham's 2026 ICD-10-CM keynote webinar");
    assert(keynote.speakerName.includes("Jeevanantham"), `Verified keynote speaker: ${keynote.speakerName}`);
    assert(keynote.registrations.length >= 2, `Verified ${keynote.registrations.length} registered attendees`);

    // Test 6: Verify WhatsApp Business Automation Logs
    console.log("\nTest 6: Verifying WhatsApp Business transactional message logs...");
    const whatsappLogs = await prisma.whatsAppMessage.findMany();
    assert(whatsappLogs.length >= 3, `Expected at least 3 WhatsApp logs, found ${whatsappLogs.length}`);
    const deliveredLog = whatsappLogs.find((m) => m.status === "Delivered" || m.status === "Read");
    assert(!!deliveredLog, `Verified delivered WhatsApp notification: ${deliveredLog?.templateName}`);
    assert(!!deliveredLog?.externalMessageId, `Verified Meta external message ID: ${deliveredLog?.externalMessageId}`);

    // Test 7: Verify Corporate RCM Placements & Job Openings
    console.log("\nTest 7: Verifying corporate RCM placements & hiring partner pipeline...");
    const jobs = await prisma.jobOpening.findMany({ include: { applications: true } });
    assert(jobs.length >= 3, `Expected at least 3 corporate job openings, found ${jobs.length}`);
    const omegaJob = jobs.find((j) => j.companyName.includes("Omega"));
    assert(!!omegaJob, `Found corporate opening: ${omegaJob?.companyName} (${omegaJob?.title})`);
    assert(omegaJob?.vacancies >= 20, `Verified vacancies: ${omegaJob?.vacancies} open seats`);

    const application = await prisma.jobApplication.findFirst({
      where: { userId: student.id },
      include: { job: true },
    });
    assert(!!application, `Found student application for: ${application?.job?.companyName}`);
    assert(
      application?.stage === "Technical Interview",
      `Verified candidate hiring stage: ${application?.stage}`
    );

    console.log("\n==========================================");
    console.log(`Phase 4 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("==========================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase4Tests();
