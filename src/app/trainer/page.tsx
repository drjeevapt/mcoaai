"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Award,
  Send,
  Loader2,
  Calendar,
  Building2,
} from "lucide-react";

export default function TrainerDashboardPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [scoreInput, setScoreInput] = useState("95");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [gradingLoading, setGradingLoading] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Sample pending submissions
  const [submissions, setSubmissions] = useState([
    {
      id: "sub-101",
      studentName: "Sneha Ramachandran",
      studentId: "MCOA-2026-CHN-0082",
      course: "Advanced Medical Coding",
      batch: "CHN-AMC-OCT26-WE",
      assignmentTitle: "Case #1: Laparoscopic Cholecystectomy with Cholangiogram",
      submittedDate: "Today, 10:45 AM",
      content: `Diagnosis Codes:
1. K80.12 - Calculus of gallbladder with acute and chronic cholecystitis without obstruction (Primary)

CPT Procedure Codes:
1. 47563 - Laparoscopy, surgical; cholecystectomy with cholangiography.
Modifier Notes: Modifier 51 is not needed because 47563 is a comprehensive single code that includes both laparoscopic cholecystectomy and intraoperative cholangiography.`,
      score: 95,
      feedback: "Outstanding work, Sneha! Perfect understanding that CPT 47563 bundles both the cholecystectomy and the cholangiography without requiring separate reporting or modifier 51. Keep up the high standard. - Dr. Rajesh Kannan",
      status: "Graded",
    },
    {
      id: "sub-102",
      studentName: "Ananya Ramesh",
      studentId: "MCOA-2026-CHN-0083",
      course: "Advanced Medical Coding",
      batch: "CHN-AMC-OCT26-WE",
      assignmentTitle: "Case #2: Type 2 Diabetes with CKD Stage 4",
      submittedDate: "Yesterday, 4:20 PM",
      content: `Diagnosis Codes:
1. E11.22 - Type 2 diabetes mellitus with diabetic chronic kidney disease
2. N18.4 - Chronic kidney disease, stage 4
3. Z79.4 - Long term (current) use of insulin
Rationale: Sequenced combination code first followed by stage 4 manifestation code.`,
      score: null,
      feedback: "",
      status: "Pending Grade",
    },
  ]);

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setGradingLoading(true);
    try {
      await fetch("/api/trainer/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          score: Number(scoreInput),
          feedback: feedbackInput,
          gradedBy: "Dr. Rajesh Kannan, CPC, CCS",
        }),
      });

      // Update state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                score: Number(scoreInput),
                feedback: feedbackInput,
                status: "Graded",
              }
            : s
        )
      );

      setGradeSuccess(true);
      setTimeout(() => {
        setGradeSuccess(false);
        setSelectedSubmission(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setGradingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Top Header */}
      <header className="bg-mcoa-midnight text-white h-16 border-b border-mcoa-amethyst/30 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-white/95 rounded px-2 py-1">
              <Image
                src="/mcoa-logo.png"
                alt="MCOA Logo"
                width={120}
                height={32}
                className="object-contain h-6 w-auto"
              />
            </div>
            <span className="font-montserrat font-bold text-xs uppercase tracking-wider text-mcoa-gold">
              Trainer & Instructor Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="text-right">
            <div className="font-bold text-white text-xs">Dr. Rajesh Kannan, CPC, CCS</div>
            <div className="text-[10px] text-mcoa-gold">Senior Medical Coding Faculty</div>
          </div>
          <Link
            href="/login"
            className="text-white/70 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition"
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 flex-grow">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-mcoa-midnight via-[#302263] to-mcoa-amethyst rounded-2xl p-6 sm:p-8 text-white shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-mcoa-gold font-bold">
              Faculty Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat mt-1">
              Welcome, Dr. Rajesh
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Manage your assigned student cohorts across Chennai and Coimbatore. Conduct live coding sessions, review de-identified chart submissions, and post detailed feedback.
            </p>
          </div>

          <a
            href="https://meet.google.com/mcoa-amc-class"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center space-x-2 shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>Launch Live Virtual Classroom</span>
          </a>
        </div>

        {/* Faculty KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Assigned Batches</div>
              <div className="text-2xl font-bold text-mcoa-midnight font-montserrat mt-1">2 Cohorts</div>
              <div className="text-[11px] text-emerald-600 font-medium">65 Active Students</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-mcoa-pearl text-mcoa-amethyst flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Chart Reviews Pending</div>
              <div className="text-2xl font-bold text-amber-600 font-montserrat mt-1">1 Case</div>
              <div className="text-[11px] text-gray-400">Action needed within 48h</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Next Scheduled Session</div>
              <div className="text-base font-bold text-mcoa-midnight font-montserrat mt-1">
                Sunday, 10:00 AM
              </div>
              <div className="text-[11px] text-mcoa-amethyst font-medium">Cardiovascular & Endocrine</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-mcoa-pearl text-mcoa-amethyst flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Assigned Batches Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold font-montserrat text-mcoa-midnight">
            My Assigned Cohorts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-mcoa-amethyst bg-mcoa-pearl px-2.5 py-0.5 rounded">
                  CHN-AMC-OCT26-WE
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
                Chennai AMC Weekend Cohort Oct 2026
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Campus: <strong>Chennai Head Office (Pallikaranai)</strong></div>
                <div>Timing: <strong>Weekend (Sat & Sun 10:00 AM - 1:00 PM)</strong></div>
                <div>Enrolled: <strong>35 / 35 Students</strong> (Capacity Full)</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-mcoa-amethyst bg-mcoa-pearl px-2.5 py-0.5 rounded">
                  CBE-CPC-NOV26-EV
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Upcoming
                </span>
              </div>
              <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
                Coimbatore CPC Fast-Track Evening Cohort
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Campus: <strong>Coimbatore Hub & Live Interactive Online</strong></div>
                <div>Timing: <strong>Evening (Mon - Fri 6:30 PM - 8:30 PM)</strong></div>
                <div>Enrolled: <strong>22 / 30 Students</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Chart Submissions & Grading Workbench */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-montserrat font-bold text-base text-mcoa-midnight">
                Student Chart Review Submissions
              </h2>
              <p className="text-xs text-gray-500">
                Review submitted code rationales, verify ICD-10-CM / CPT guidelines, and post feedback.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-inter">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Case Assignment</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4">Status & Score</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/80">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-mcoa-midnight">{sub.studentName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{sub.studentId}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      {sub.assignmentTitle}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500">
                      {sub.submittedDate}
                    </td>

                    <td className="py-3.5 px-4">
                      {sub.status === "Graded" ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                          Graded: {sub.score} / 100
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded">
                          Needs Grading
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setScoreInput(sub.score ? String(sub.score) : "95");
                          setFeedbackInput(sub.feedback || "");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-mcoa-midnight text-white hover:bg-mcoa-amethyst text-xs font-semibold transition"
                      >
                        {sub.status === "Graded" ? "View / Edit Grade" : "Evaluate Case"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grading Drawer / Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl relative border border-gray-200">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
                  Faculty Grading Console
                </span>
                <h3 className="text-lg font-bold font-montserrat text-mcoa-midnight mt-0.5">
                  {selectedSubmission.assignmentTitle}
                </h3>
                <div className="text-xs text-gray-500">
                  Student: <strong>{selectedSubmission.studentName}</strong> ({selectedSubmission.studentId})
                </div>
              </div>

              {/* Student Answer */}
              <div className="space-y-2 mb-4 text-xs">
                <label className="font-bold text-gray-700">Student Submitted Codes & Rationale:</label>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-gray-800 whitespace-pre-line text-[11px]">
                  {selectedSubmission.content}
                </div>
              </div>

              {gradeSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900 text-xs">Grade and Feedback Successfully Recorded!</div>
                </div>
              ) : (
                <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs font-inter">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Score (out of 100):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-mcoa-midnight outline-none focus:ring-2 focus:ring-mcoa-amethyst"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Instructor Feedback & Guideline Review:
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Comment on code sequencing, proper modifier selection, and guidance for final exam..."
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-mcoa-amethyst"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={gradingLoading}
                      className="px-5 py-2 rounded-lg bg-mcoa-midnight text-white hover:bg-mcoa-amethyst font-semibold flex items-center space-x-1.5"
                    >
                      {gradingLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Recording...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-mcoa-gold" />
                          <span>Submit Grade & Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
