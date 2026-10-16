"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "graded">("pending");
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/student/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: "demo-assignment-2",
          content: submissionText,
        }),
      });

      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
            Clinical Practice & Grading
          </span>
          <h1 className="text-2xl font-bold font-montserrat text-mcoa-midnight mt-0.5">
            Synthetic Medical Chart Assignments
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-world operative reports, pathology logs, and inpatient encounters authored by Dr. Jeevanantham's faculty.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-mcoa-pearl p-1 rounded-xl border border-mcoa-lavender/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "pending"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:text-mcoa-midnight"
            }`}
          >
            Pending / In Progress (1)
          </button>
          <button
            onClick={() => setActiveTab("graded")}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === "graded"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:text-mcoa-midnight"
            }`}
          >
            Graded Submissions (1)
          </button>
        </div>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "pending" ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Action Required
              </span>
              <h2 className="text-lg font-bold font-montserrat text-mcoa-midnight mt-2">
                Case #2: Type 2 Diabetes with Diabetic Chronic Kidney Disease Stage 4
              </h2>
              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                <span>Due Date: <strong>In 12 Days</strong></span>
                <span>•</span>
                <span>Max Points: <strong>100</strong></span>
                <span>•</span>
                <span>Course: <strong>Advanced Medical Coding</strong></span>
              </div>
            </div>
          </div>

          {/* Clinical Scenario Box */}
          <div className="space-y-2">
            <h3 className="font-montserrat font-bold text-xs uppercase tracking-wider text-mcoa-midnight">
              De-identified Outpatient Medical Chart:
            </h3>
            <div className="bg-mcoa-pearl/40 p-5 rounded-2xl border border-mcoa-lavender/40 text-xs text-gray-800 leading-relaxed font-mono whitespace-pre-line">
{`PATIENT ENCOUNTER NOTE
Patient: 62-year-old female established patient.
CHIEF COMPLAINT: Follow-up for uncontrolled type 2 diabetes mellitus and chronic kidney disease.
HISTORY OF PRESENT ILLNESS: Patient has longstanding type 2 diabetes mellitus with known diabetic nephropathy. Renal panel confirms stage 4 CKD (eGFR 24 mL/min/1.73m²). Blood glucose logs indicate fluctuating hyperglycemia. Patient is maintained on Lantus subcutaneous insulin daily.

ASSESSMENT & PLAN:
1. Type 2 diabetes mellitus with diabetic chronic kidney disease.
2. Chronic kidney disease, stage 4 (severe).
3. Long-term (current) use of insulin.
Plan: Continue current basal insulin regimen. Renal diet reinforced. Recheck serum creatinine in 4 weeks.`}
            </div>
          </div>

          {/* Submission Form */}
          {submittedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-montserrat font-bold text-emerald-950 text-base">
                Assignment Successfully Submitted!
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your coding rationale has been sent to <strong>Dr. Rajesh Kannan</strong> for review. You will receive email/portal notification with your score within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-gray-800 font-bold text-xs font-montserrat mb-1">
                  Your Coded Answers & Guideline Rationale:
                </label>
                <textarea
                  rows={6}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder={`Example submission format:
1. Primary Diagnosis: E11.22 (Type 2 diabetes mellitus with diabetic chronic kidney disease)
2. Secondary Diagnosis: N18.4 (Chronic kidney disease, stage 4)
3. Z-code: Z79.4 (Long term use of insulin)
Rationale: Per ICD-10-CM guideline Chapter 4, sequencing of combination code E11.22 requires an additional code from category N18 to identify the stage of CKD.`}
                  className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl text-xs text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-mcoa-amethyst font-mono transition"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Ensure you cite the relevant ICD-10-CM guidelines for maximum score.
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Solution for Grading</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Graded Submissions Tab */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                  Graded & Approved
                </span>
                <h2 className="text-lg font-bold font-montserrat text-mcoa-midnight mt-2">
                  Case #1: Laparoscopic Cholecystectomy with Cholangiogram
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  Evaluated by: <strong>Dr. Rajesh Kannan, CPC, CCS</strong>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Final Score</span>
                <div className="text-2xl font-extrabold font-montserrat text-emerald-900">
                  95 / 100
                </div>
              </div>
            </div>

            {/* Sneha's Submission */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Sneha's Submitted Codes:
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 whitespace-pre-line">
{`Diagnosis Codes:
1. K80.12 - Calculus of gallbladder with acute and chronic cholecystitis without obstruction (Primary)

CPT Procedure Codes:
1. 47563 - Laparoscopy, surgical; cholecystectomy with cholangiography.
Modifier Notes: Modifier 51 is not needed because 47563 is a comprehensive single code that includes both laparoscopic cholecystectomy and intraoperative cholangiography.`}
              </div>
            </div>

            {/* Instructor Feedback Box */}
            <div className="bg-mcoa-pearl p-5 rounded-2xl border border-mcoa-lavender/40 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-mcoa-midnight font-montserrat">
                <Award className="w-4 h-4 text-mcoa-gold" />
                <span>Instructor Feedback from Dr. Rajesh:</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                "Outstanding work, Sneha! Perfect understanding that CPT 47563 bundles both the cholecystectomy and the cholangiography without requiring separate reporting or modifier 51. Keep up the high standard. You are in the top 5% of your batch."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
