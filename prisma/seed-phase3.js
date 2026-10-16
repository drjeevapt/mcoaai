const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPhase3() {
  console.log("Seeding Phase 3: Coding Practice Cases, Mock Exam Engine & Questions...");

  // 1. Seed Practice Cases
  const cases = [
    {
      slug: "acute-mi-with-hypertension",
      title: "Acute NSTEMI with Essential Hypertension & Hyperlipidemia",
      category: "ICD-10-CM",
      difficulty: "Intermediate",
      specialty: "Cardiology",
      clinicalChart: `CHIEF COMPLAINT: Substernal chest tightness radiating to the left jaw.
HISTORY OF PRESENT ILLNESS: 58-year-old male with a history of hypertension and hyperlipidemia presents with 2 hours of acute chest heaviness at rest. 
LABS & DIAGNOSTICS: 
- 12-lead ECG: ST depressions and T-wave inversions in leads V4-V6 without ST elevations.
- Troponin I: Elevated at 2.45 ng/mL (reference < 0.04 ng/mL).
- Echocardiogram: Left ventricular ejection fraction 45% with hypokinesis of the anterior wall.
ASSESSMENT & DISCHARGE SUMMARY:
1. Acute subendocardial myocardial infarction (NSTEMI).
2. Primary essential hypertension.
3. Hyperlipidemia, unspecified.
Plan: Patient stabilized on dual antiplatelet therapy, heparin infusion, and scheduled for coronary angiography.`,
      recommendedCodes: JSON.stringify({
        primaryDiagnosis: "I21.4",
        secondaryDiagnoses: ["I10", "E78.5"],
        procedures: [],
        modifiers: [],
      }),
      rationale: `Per ICD-10-CM Official Guidelines for Coding and Reporting (OGCR) Section I.C.9.e:
1. Non-ST elevation myocardial infarction (NSTEMI) is reported with code I21.4 (Non-ST elevation [NSTEMI] myocardial infarction). It is the reason for admission and sequenced first.
2. Essential (primary) hypertension is reported with code I10.
3. Hyperlipidemia is reported with code E78.5.
Because this is an acute initial infarction episode, category I21 applies.`,
      commonPitfalls: "Do not assign I21.3 (STEMI unspecified) when NSTEMI is explicitly documented. Avoid using subsequent MI codes (I22) since this is the patient's initial acute event within the 4-week window.",
      guidelineRef: "ICD-10-CM OGCR Section I.C.9.e (Myocardial Infarction)",
    },
    {
      slug: "knee-arthroscopy-meniscectomy",
      title: "Right Knee Arthroscopy with Partial Medial Meniscectomy & Chondroplasty",
      category: "CPT Surgery",
      difficulty: "Advanced",
      specialty: "Orthopedics",
      clinicalChart: `PREOPERATIVE DIAGNOSIS: Complex tear of the medial meniscus, right knee; grade III chondromalacia patella.
POSTOPERATIVE DIAGNOSIS: Same.
PROCEDURE PERFORMED:
1. Diagnostic arthroscopy, right knee.
2. Arthroscopic partial medial meniscectomy.
3. Arthroscopic chondroplasty, patellofemoral compartment.

OPERATIVE DESCRIPTION:
Under general anesthesia, anterolateral and anteromedial portals were established. Diagnostic arthroscopy revealed intact anterior cruciate and posterior cruciate ligaments. Inspection of the medial compartment revealed a complex posterior horn tear of the medial meniscus. A motorized shaver and basket forceps were used to excise the unstable flaps back to a smooth, stable vascular rim. The lateral compartment was intact. Attention was then directed to the patellofemoral joint where grade III chondromalacia was noted on the central ridge of the patella. Gentle debridement and chondroplasty were carried out. Portals were closed with nylon sutures.`,
      recommendedCodes: JSON.stringify({
        primaryDiagnosis: "M23.221",
        secondaryDiagnoses: ["M22.41"],
        procedures: ["29881-RT"],
        modifiers: ["RT"],
      }),
      rationale: `Per CPT coding conventions and NCCI Policy Manual for Musculoskeletal Services:
1. Arthroscopic partial medial meniscectomy is reported with CPT 29881 (Arthroscopy, knee, surgical; with meniscectomy [medial OR lateral, including any debridement/chondroplasty in the same compartment]).
2. Chondroplasty in the patellofemoral compartment is performed in a separate compartment. However, per CMS NCCI edits, CPT 29877 (debridement/chondroplasty) cannot be reported separately in the same knee during the same operative session unless specific payer exceptions allow HCPCS G0289. In standard CPT coding, 29881-RT accurately captures the primary surgical procedure.
3. Diagnostic arthroscopy (29870) is bundled into the surgical arthroscopy and not separately reported.`,
      commonPitfalls: "Unbundling diagnostic arthroscopy (29870) alongside surgical arthroscopy (29881). Always append anatomical modifier RT (Right).",
      guidelineRef: "CPT Musculoskeletal Guidelines & CMS NCCI Chapter IV",
    },
    {
      slug: "em-outpatient-established-level-4",
      title: "Outpatient Clinic Visit: Diabetic Nephropathy with Medication Titration (99214)",
      category: "E&M",
      difficulty: "Intermediate",
      specialty: "Endocrinology",
      clinicalChart: `CLINICAL ENCOUNTER NOTE
Patient: 64-year-old male established patient.
CHIEF COMPLAINT: Routine diabetes and chronic hypertension follow-up; reports occasional ankle edema.
VITAL SIGNS: BP 148/92 mmHg, HR 76, BMI 31.2.
LABORATORY REVIEW: HbA1c 8.9% (worsening glycemic control). Serum creatinine 1.8 mg/dL, eGFR 38 mL/min (CKD Stage 3b).
EXAMINATION: Mild bilateral pedal edema (1+). Sensation intact to monofilament testing.
MEDICAL DECISION MAKING (MDM):
1. Number and Complexity of Problems Addressed: Two chronic conditions with one worsening/uncontrolled (Type 2 diabetes with severe hyperglycemia, and chronic kidney disease stage 3b with hypertension). -> MODERATE COMPLEXITY.
2. Amount/Complexity of Data: Review of external nephrology lab reports and independent interpretation of home glucose log. -> MODERATE DATA.
3. Risk of Complications/Morbidity: Prescription drug management — intensifying oral therapy and initiating Lantus basal insulin titration; adjusting ACE-inhibitor dose. -> MODERATE RISK.
Total Clinician Time: 35 minutes.`,
      recommendedCodes: JSON.stringify({
        primaryDiagnosis: "E11.22",
        secondaryDiagnoses: ["I12.9", "N18.32", "Z79.4"],
        procedures: ["99214"],
        modifiers: [],
      }),
      rationale: `Per the 2021/2023 AMA/CMS Evaluation and Management Guidelines:
For an established outpatient encounter (99211–99215):
- Number and Complexity of Problems: 1 or more chronic illnesses with exacerbation, progression, or side effects of treatment -> MODERATE.
- Amount and Complexity of Data: Review of prior external records + tests -> MODERATE.
- Risk of Complications: Prescription drug management (initiating and titrating insulin and antihypertensives) -> MODERATE.
To qualify for a given level of MDM, two out of the three elements must be met or exceeded. All three elements meet the Moderate level, justifying CPT 99214.
Alternatively, time spent was 35 minutes (range for 99214 is 30–39 minutes).`,
      commonPitfalls: "Selecting 99215 without High MDM in at least 2 categories. For 99214, prescription drug management qualifies for Moderate risk.",
      guidelineRef: "AMA CPT 2021/2023 E&M MDM Grid Table 2",
    },
    {
      slug: "drg-copd-with-respiratory-failure",
      title: "Inpatient Hospitalization: Acute Exacerbation of COPD with Acute Respiratory Failure",
      category: "MS-DRG",
      difficulty: "Advanced",
      specialty: "Pulmonology",
      clinicalChart: `HOSPITAL DISCHARGE SUMMARY
PATIENT: 71-year-old female with oxygen-dependent COPD.
REASON FOR ADMISSION: Severe dyspnea, cyanosis, and somnolence.
HOSPITAL COURSE: 
Patient arrived via EMS in acute respiratory failure. ABG on room air revealed pH 7.25, PaCO2 68 mmHg, PaO2 48 mmHg, indicating acute hypercapnic hypoxemic respiratory failure. Placed on BiPAP non-invasive positive pressure ventilation in ICU for 48 hours. Treated with IV Solu-Medrol, broad-spectrum antibiotics, and frequent nebulizers. Sputum culture yielded Pseudomonas aeruginosa. Successfully weaned from BiPAP to baseline 2L nasal cannula oxygen.
FINAL DIAGNOSES:
1. Acute exacerbation of chronic obstructive pulmonary disease (COPD).
2. Acute respiratory failure with hypoxia and hypercapnia (Present on admission: YES).
3. Pseudomonas pneumonia (Present on admission: YES).
4. Tobacco dependence.
PROCEDURES: Non-invasive mechanical ventilation (BiPAP) for 48 consecutive hours.`,
      recommendedCodes: JSON.stringify({
        primaryDiagnosis: "J44.1",
        secondaryDiagnoses: ["J96.02", "J15.1", "F17.210"],
        procedures: ["5A09457"],
        modifiers: [],
      }),
      rationale: `Per ICD-10-CM Official Guidelines for Coding and Reporting Chapter 10 (Diseases of the Respiratory System):
1. Inpatient Principal Diagnosis Sequencing: When an acute exacerbation of COPD occurs with acute respiratory failure, either condition may be sequenced as principal diagnosis if both meet UHDDS definition. Under CMS MS-DRG grouping rules, J44.1 (COPD with acute exacerbation) as principal diagnosis groups to MDC 04 (Diseases & Disorders of the Respiratory System).
2. Acute respiratory failure (J96.02) qualifies as a Major Complication/Comorbidity (MCC).
3. Pseudomonas pneumonia (J15.1) acts as a secondary Complication/Comorbidity (CC).
4. Resulting MS-DRG: MS-DRG 190 (Chronic Obstructive Pulmonary Disease with MCC) with high relative weight (RW 1.189).`,
      commonPitfalls: "Failing to capture acute respiratory failure as a secondary MCC. In many systems, acute respiratory failure elevates the DRG to the highest reimbursement tier.",
      guidelineRef: "CMS MS-DRG Definitions Manual v41.0 & UHDDS Guidelines",
    },
  ];

  for (const c of cases) {
    await prisma.practiceCase.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log("Practice cases seeded.");

  // 2. Seed Mock Exam
  const exam = await prisma.mockExam.upsert({
    where: { slug: "cpc-diagnostic-sprint-2026" },
    update: {},
    create: {
      slug: "cpc-diagnostic-sprint-2026",
      title: "AAPC CPC® Official Diagnostic Practice Assessment",
      certificationTrack: "AAPC CPC®",
      description: "Original 10-question sprint assessment modeled strictly on AAPC testing domains. Features timed mode, guideline citations, and diagnostic domain breakdown.",
      durationMinutes: 30,
      totalQuestions: 10,
      passingScorePercent: 70,
    },
  });

  // 3. Seed Questions for Mock Exam
  const questions = [
    {
      examId: exam.id,
      domain: "ICD-10-CM",
      questionText: "A 45-year-old female patient with known type 2 diabetes mellitus is admitted with acute osteomyelitis of the right great toe. What are the correct ICD-10-CM code assignments and sequencing?",
      scenarioText: "Operative culture confirms Staphylococcus aureus. The patient has had type 2 diabetes for 10 years managed on oral medications.",
      options: JSON.stringify([
        "A) M86.171, E11.69, B95.61",
        "B) E11.69, M86.171, B95.61",
        "C) M86.9, E11.9",
        "D) E11.69, B95.61",
      ]),
      correctOptionIndex: 1,
      explanation: "Per ICD-10-CM Guideline Section I.C.4.a: When coding diabetes with other specified manifestations, assign code E11.69 (Type 2 diabetes with other specified complication) first, followed by the code for the manifestation (M86.171 for Other acute osteomyelitis, right ankle and foot), and B95.61 (Methicillin susceptible Staphylococcus aureus infection) as the organism.",
      guidelineRef: "ICD-10-CM OGCR Section I.C.4.a (Diabetes with complications)",
    },
    {
      examId: exam.id,
      domain: "Evaluation & Management",
      questionText: "An established patient presents to the clinic with acute onset of severe left lower quadrant abdominal pain with fever and leukocytosis. The physician performs a detailed exam, orders a stat CT of the abdomen/pelvis, interprets the CT scan as acute diverticulitis with localized abscess, and prescribes oral ciprofloxacin and metronidazole while discussing urgent general surgery consultation. What is the correct E&M code?",
      scenarioText: "Setting: Outpatient Clinic. MDM elements: 1 acute illness with systemic symptoms (High), extensive data review including independent CT review (Moderate/High), prescription drug management + urgent consult (Moderate/High).",
      options: JSON.stringify([
        "A) 99213",
        "B) 99214",
        "C) 99215",
        "D) 99204",
      ]),
      correctOptionIndex: 2,
      explanation: "Per 2023 AMA E&M Guidelines: The patient has an acute illness with systemic symptoms posing a potential threat to life or organ function (High complexity problem). The physician independently interpreted imaging and coordinated urgent surgery (High data/risk). Meeting High complexity in 2 of 3 categories justifies CPT 99215 for an established patient.",
      guidelineRef: "AMA CPT 2023 E&M Guidelines (Table 2)",
    },
    {
      examId: exam.id,
      domain: "Surgery (10000-60000)",
      questionText: "A surgeon performs an excision of a 2.5 cm malignant melanoma from the patient's upper back. The surgical margins excised are 1.0 cm on each side. The defect is repaired with an intermediate layered closure of 4.5 cm. What are the correct CPT codes?",
      scenarioText: "Calculation: Lesion diameter (2.5 cm) + most narrow margins (1.0 cm + 1.0 cm) = 4.5 cm excised diameter.",
      options: JSON.stringify([
        "A) 11606, 12032-51",
        "B) 11604, 12002",
        "C) 11406, 12032-51",
        "D) 11606 only",
      ]),
      correctOptionIndex: 0,
      explanation: "Per CPT Integumentary Guidelines: Code selection for excision of malignant lesions is determined by the lesion diameter plus the most narrow margins. Here, 2.5 cm + 1.0 cm + 1.0 cm = 4.5 cm. For trunk/arms/legs, excision of malignant lesion over 4.0 cm is 11606. Intermediate repairs (12032) may be coded separately in addition to excision of malignant lesions, appending modifier 51.",
      guidelineRef: "CPT Surgery: Integumentary System (Excision of Malignant Lesions)",
    },
    {
      examId: exam.id,
      domain: "Surgery (10000-60000)",
      questionText: "A 32-year-old male undergoes a diagnostic laparoscopy. During the procedure, the general surgeon discovers an acutely inflamed, perforated appendix and converts to a laparoscopic appendectomy. How should the surgeon report this?",
      scenarioText: "",
      options: JSON.stringify([
        "A) 44970, 49320-51",
        "B) 44970 only",
        "C) 44950, 49320-59",
        "D) 44960",
      ]),
      correctOptionIndex: 1,
      explanation: "Per CPT surgical guidelines: Diagnostic laparoscopy (49320) is always bundled into any surgical laparoscopic procedure (44970 - Laparoscopy, surgical, appendectomy) performed in the same operative session. Only code 44970 should be reported.",
      guidelineRef: "CPT Surgery / NCCI Chapter VI",
    },
    {
      examId: exam.id,
      domain: "Anesthesia & Radiology",
      questionText: "An anesthesiologist provides anesthesia services to an 82-year-old male with severe systemic disease (severe COPD and CAD) undergoing an emergency exploratory laparotomy. What physical status modifier and qualifying circumstance code should be appended or reported?",
      scenarioText: "",
      options: JSON.stringify([
        "A) Physical status P1 only",
        "B) Physical status P3, plus add-on 99100 and 99140",
        "C) Physical status P2 only",
        "D) 99100 only",
      ]),
      correctOptionIndex: 1,
      explanation: "Physical status modifier P3 represents a patient with severe systemic disease. In addition, CPT qualifying circumstances add-on code 99100 represents anesthesia for a patient of extreme age (over 70 years), and 99140 represents anesthesia complicated by emergency conditions.",
      guidelineRef: "CPT Anesthesia Guidelines: Physical Status & Qualifying Circumstances",
    },
    {
      examId: exam.id,
      domain: "Pathology & Laboratory",
      questionText: "A physician orders a Comprehensive Metabolic Panel (80053), a Complete Blood Count with automated differential (85025), and a Thyroid Stimulating Hormone (84443). How should these tests be coded?",
      scenarioText: "",
      options: JSON.stringify([
        "A) 80053, 85025, 84443",
        "B) 80050 only",
        "C) 80048, 85025, 84443",
        "D) 80053, 85027",
      ]),
      correctOptionIndex: 0,
      explanation: "CPT 80050 is the General Health Panel which requires a Comprehensive Metabolic Panel (80053), CBC (85025 or 85027), AND either a TSH (84443) OR free T4. Because this patient had all three components, reporting the specific panel codes 80053, 85025, and 84443 or panel 80050 depends on laboratory bundling rules. Under individual physician orders, 80053, 85025, and 84443 are properly reported.",
      guidelineRef: "CPT Pathology and Laboratory: Organ or Disease-Oriented Panels",
    },
    {
      examId: exam.id,
      domain: "HCPCS & Compliance",
      questionText: "Which HCPCS Level II modifier is appended to indicate that a service or procedure was provided under a valid Advance Beneficiary Notice (ABN) on file?",
      scenarioText: "",
      options: JSON.stringify([
        "A) GA",
        "B) GX",
        "C) GY",
        "D) GZ",
      ]),
      correctOptionIndex: 0,
      explanation: "Modifier GA signifies that a waiver of liability statement (ABN) is on file, notifying the Medicare beneficiary that Medicare is expected to deny the service as not reasonable and necessary, allowing the provider to bill the patient if denied.",
      guidelineRef: "Medicare Claims Processing Manual: ABN Modifiers",
    },
  ];

  for (const q of questions) {
    const existing = await prisma.examQuestion.findFirst({
      where: { examId: q.examId, questionText: q.questionText },
    });
    if (!existing) {
      await prisma.examQuestion.create({ data: q });
    }
  }
  console.log("Mock exam questions seeded.");

  // 4. Seed an initial exam attempt for Sneha Ramachandran
  const student = await prisma.user.findFirst({ where: { role: "Student" } });
  if (student) {
    const existingAttempt = await prisma.examAttempt.findFirst({
      where: { userId: student.id, examId: exam.id },
    });

    if (!existingAttempt) {
      await prisma.examAttempt.create({
        data: {
          examId: exam.id,
          userId: student.id,
          score: 80,
          total: 100,
          percentage: 80,
          passed: true,
          domainScores: JSON.stringify({
            "ICD-10-CM": { correct: 9, total: 10, percent: 90 },
            "Evaluation & Management": { correct: 8, total: 10, percent: 80 },
            "Surgery (10000-60000)": { correct: 7, total: 10, percent: 70 },
            "Anesthesia & Radiology": { correct: 8, total: 10, percent: 80 },
            "HCPCS & Compliance": { correct: 8, total: 10, percent: 80 },
          }),
          answers: JSON.stringify({ "0": 1, "1": 2, "2": 0 }),
          timeSpentSeconds: 1420,
        },
      });
      console.log("Sample student exam attempt seeded for analytics.");
    }
  }

  console.log("Phase 3 Seeding Completed Successfully!");
}

seedPhase3()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
