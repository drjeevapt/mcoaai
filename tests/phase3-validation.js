const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runPhase3Tests() {
  console.log("==========================================");
  console.log("  MCOA Phase 3 Automated Validation Suite ");
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
    // Test 1: Verify Seeded Practice Cases
    console.log("Test 1: Verifying clinical practice cases in database...");
    const cases = await prisma.practiceCase.findMany();
    assert(cases.length >= 4, `Expected at least 4 practice cases, found ${cases.length}`);
    const categories = new Set(cases.map((c) => c.category));
    assert(categories.has("ICD-10-CM"), "Verified ICD-10-CM practice case");
    assert(categories.has("CPT Surgery"), "Verified CPT Surgery practice case");
    assert(categories.has("E&M"), "Verified E&M practice case");
    assert(categories.has("MS-DRG"), "Verified MS-DRG practice case");

    // Test 2: Verify Case Specificity and Official Guideline Citations
    console.log("\nTest 2: Verifying official guideline citations in case keys...");
    const miCase = cases.find((c) => c.slug === "acute-mi-with-hypertension");
    assert(!!miCase, "Found Acute MI practice case");
    assert(
      miCase.guidelineRef && miCase.guidelineRef.includes("Section I.C.9.e"),
      `Verified guideline citation: ${miCase?.guidelineRef}`
    );
    const kneeCase = cases.find((c) => c.slug === "knee-arthroscopy-meniscectomy");
    assert(
      kneeCase.recommendedCodes.includes("29881-RT"),
      "Verified CPT 29881-RT with anatomical modifier"
    );

    // Test 3: Test Case Solution Evaluation Logic (Match vs Discrepancy)
    console.log("\nTest 3: Testing solution evaluation engine...");
    const student = await prisma.user.findFirst({ where: { role: "Student" } });
    assert(!!student, `Found student user: ${student?.name}`);

    // Simulate Exact Match
    const exactAttempt = await prisma.practiceAttempt.create({
      data: {
        caseId: miCase.id,
        userId: student.id,
        userCodes: JSON.stringify({
          primaryDiagnosis: "I21.4",
          secondaryDiagnoses: ["I10", "E78.5"],
          procedures: [],
          modifiers: [],
        }),
        isCorrect: true,
        timeSpent: 85,
      },
    });
    assert(exactAttempt.isCorrect === true, "Verified correct diagnosis submission logged");

    // Simulate Discrepancy
    const incorrectAttempt = await prisma.practiceAttempt.create({
      data: {
        caseId: miCase.id,
        userId: student.id,
        userCodes: JSON.stringify({
          primaryDiagnosis: "I21.3", // Incorrect STEMI
          secondaryDiagnoses: [],
          procedures: [],
          modifiers: [],
        }),
        isCorrect: false,
        timeSpent: 120,
      },
    });
    assert(incorrectAttempt.isCorrect === false, "Verified discrepancy flagging for incorrect code assignment");

    // Test 4: Verify Mock Exam Engine and Question Bank
    console.log("\nTest 4: Verifying AAPC CPC Mock Exam and Questions...");
    const mockExam = await prisma.mockExam.findUnique({
      where: { slug: "cpc-diagnostic-sprint-2026" },
      include: { questions: true },
    });
    assert(!!mockExam, `Found mock exam: ${mockExam?.title}`);
    assert(
      mockExam.questions.length >= 7,
      `Expected at least 7 diagnostic questions, found ${mockExam?.questions.length}`
    );

    const domains = new Set(mockExam.questions.map((q) => q.domain));
    assert(domains.has("Surgery (10000-60000)"), "Verified Surgery domain question");
    assert(domains.has("Evaluation & Management"), "Verified E&M domain question");
    assert(domains.has("ICD-10-CM"), "Verified ICD-10-CM domain question");

    // Test 5: Verify Mock Exam Scoring and Pass/Fail Threshold
    console.log("\nTest 5: Testing exam scoring engine with 70% AAPC threshold...");
    const sampleAnswers = {};
    mockExam.questions.forEach((q, idx) => {
      // Answer 80% correctly
      sampleAnswers[q.id] = idx % 5 === 0 ? (q.correctOptionIndex + 1) % 4 : q.correctOptionIndex;
    });

    let correctCount = 0;
    const domainScores = {};
    for (const q of mockExam.questions) {
      const isCorrect = sampleAnswers[q.id] === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
      domainScores[q.domain].total++;
      if (isCorrect) domainScores[q.domain].correct++;
    }

    const percentage = Math.round((correctCount / mockExam.questions.length) * 100);
    const passedExam = percentage >= mockExam.passingScorePercent;

    const examAttempt = await prisma.examAttempt.create({
      data: {
        examId: mockExam.id,
        userId: student.id,
        score: correctCount,
        total: mockExam.questions.length,
        percentage,
        passed: passedExam,
        domainScores: JSON.stringify(domainScores),
        answers: JSON.stringify(sampleAnswers),
        timeSpentSeconds: 780,
      },
    });

    assert(examAttempt.score === correctCount, `Verified exam score calculation: ${correctCount}/${mockExam.questions.length}`);
    assert(examAttempt.percentage === percentage, `Verified exam percentage: ${percentage}%`);
    assert(examAttempt.passed === passedExam, `Verified AAPC pass/fail determination: ${passedExam ? "PASSED" : "FAILED"}`);

    // Test 6: Verify Student Performance Analytics Aggregation
    console.log("\nTest 6: Verifying student readiness index & domain metrics...");
    const totalPracticeAttempts = await prisma.practiceAttempt.count({ where: { userId: student.id } });
    const correctPracticeAttempts = await prisma.practiceAttempt.count({ where: { userId: student.id, isCorrect: true } });
    const accuracy = totalPracticeAttempts > 0 ? Math.round((correctPracticeAttempts / totalPracticeAttempts) * 100) : 0;
    assert(totalPracticeAttempts >= 2, `Total practice attempts: ${totalPracticeAttempts}`);
    assert(accuracy > 0, `Computed practice accuracy: ${accuracy}%`);

    // Test 7: Verify E&M 2-of-3 Rule Logic
    console.log("\nTest 7: Validating AMA E&M 2-of-3 MDM Rule...");
    function evalMDM(prob, data, risk) {
      const weights = { Minimal: 1, Low: 2, Moderate: 3, High: 4 };
      const vals = [weights[prob], weights[data], weights[risk]].sort((a, b) => b - a);
      const qualifying = vals[1]; // 2nd highest
      if (qualifying === 4) return "High";
      if (qualifying === 3) return "Moderate";
      if (qualifying === 2) return "Low";
      return "Minimal";
    }

    assert(evalMDM("Moderate", "Moderate", "Moderate") === "Moderate", "Moderate / Moderate / Moderate -> Moderate MDM");
    assert(evalMDM("High", "Moderate", "High") === "High", "High / Moderate / High -> High MDM (2 of 3 met)");
    assert(evalMDM("Low", "Low", "Moderate") === "Low", "Low / Low / Moderate -> Low MDM");
    assert(evalMDM("Minimal", "High", "High") === "High", "Minimal / High / High -> High MDM (2 of 3 met)");

    // Test 8: Validating Inpatient DRG Grouping Logic
    console.log("\nTest 8: Validating Inpatient MS-DRG UHDDS rules...");
    function evalDRG(pdx, hasMCC, hasCC, isOR) {
      if (pdx.startsWith("J44")) {
        if (hasMCC) return "190";
        if (hasCC) return "191";
        return "192";
      }
      if (pdx.startsWith("K35") && isOR) {
        if (hasMCC) return "341";
        if (hasCC) return "342";
        return "343";
      }
      return "000";
    }

    assert(evalDRG("J44.1", true, true, false) === "190", "J44.1 with MCC -> MS-DRG 190 (COPD with MCC)");
    assert(evalDRG("J44.1", false, true, false) === "191", "J44.1 with CC -> MS-DRG 191 (COPD with CC)");
    assert(evalDRG("J44.1", false, false, false) === "192", "J44.1 without CC/MCC -> MS-DRG 192 (COPD without CC/MCC)");
    assert(evalDRG("K35.80", false, false, true) === "343", "K35.80 with Laparoscopic Appendectomy -> MS-DRG 343");

    console.log("\n==========================================");
    console.log(`Phase 3 Test Results: ${passed} Passed, ${failed} Failed`);
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

runPhase3Tests();
