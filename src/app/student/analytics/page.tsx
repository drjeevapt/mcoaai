"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart2,
  Layers,
  Calendar,
  Flame,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function StudentAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await fetch("/api/student/analytics");
        const data = await res.json();
        if (data.success) {
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center font-inter">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-mcoa-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-mcoa-midnight">Analyzing Coding Competency Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-widest font-montserrat">
            Performance Diagnostics & Readiness
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-mcoa-midnight font-montserrat">
            Weekly Student Coding Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time competency tracking across 8 core medical coding domains, case auditing velocity, and AAPC CPC® certification readiness.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/practice"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center space-x-1.5"
          >
            <span>Practice Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/mock-exams"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition flex items-center space-x-1.5"
          >
            <Award className="w-3.5 h-3.5 text-mcoa-gold" />
            <span>Mock Exam Engine</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Index */}
        <div className="bg-gradient-to-br from-mcoa-midnight to-mcoa-amethyst text-white p-5 rounded-2xl shadow-royal space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-mcoa-gold text-[10px]">
              Readiness Index
            </span>
            <Award className="w-4 h-4 text-mcoa-gold" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {analytics?.readinessIndex || 82}%
          </div>
          <div className="text-[11px] text-white/80 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>AAPC CPC® Credential Ready</span>
          </div>
        </div>

        {/* Practice Chart Accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-gray-500 text-[10px]">
              Chart Coding Accuracy
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-mcoa-midnight">
            {analytics?.practiceAccuracy || 85}%
          </div>
          <div className="text-[11px] text-gray-500">
            {analytics?.totalPracticeCasesCoded || 35} Clinical Cases Audited
          </div>
        </div>

        {/* Mock Exams Completed */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-gray-500 text-[10px]">
              Diagnostic Assessments
            </span>
            <BarChart2 className="w-4 h-4 text-mcoa-amethyst" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-mcoa-midnight">
            {analytics?.mockExamsCompleted || 2} <span className="text-sm font-normal text-gray-500">Attempts</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
            <span>Latest: 80% Pass (AAPC Standard)</span>
          </div>
        </div>

        {/* Weekly Study Velocity */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-montserrat font-bold uppercase tracking-wider text-gray-500 text-[10px]">
              Weekly Velocity
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-mcoa-midnight">
            {analytics?.hoursLoggedThisWeek || 14.5} <span className="text-sm font-normal text-gray-500">Hours</span>
          </div>
          <div className="text-[11px] text-gray-500">
            Attendance: {analytics?.attendanceRate || 96}% (Batch Top 5%)
          </div>
        </div>
      </div>

      {/* Domain Mastery Matrix (8 Core Coding Disciplines) */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-wider font-montserrat">
              Specialty Competency Breakdown
            </span>
            <h2 className="font-montserrat font-bold text-lg text-mcoa-midnight">
              8-Domain Coding Competency Matrix
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">Benchmark Threshold: 70%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics?.domainMastery?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3 hover:border-mcoa-amethyst/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-montserrat font-bold text-xs text-mcoa-midnight">
                  {item.domain}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.status === "Mastered"
                      ? "bg-emerald-100 text-emerald-800"
                      : item.status === "On Track"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.status} ({item.accuracy}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.accuracy >= 85
                      ? "bg-emerald-500"
                      : item.accuracy >= 70
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${item.accuracy}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>{item.casesCompleted} Cases Completed</span>
                {item.status === "Action Needed" ? (
                  <Link
                    href="/practice"
                    className="text-mcoa-amethyst font-bold hover:underline"
                  >
                    Practice Domain →
                  </Link>
                ) : (
                  <span>Benchmark Satisfied</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Clinical Intervention Advice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="font-montserrat font-bold text-sm text-amber-950">
              Faculty Intervention Recommendation for Sneha
            </div>
            <p className="text-xs text-amber-900 leading-relaxed max-w-2xl">
              "Your outpatient CPT surgery and ICD-10-CM sequencing are outstanding (88-92%). Prioritize 3 practice sessions this week in the <span className="font-bold">Inpatient DRG Simulator</span> and review <span className="font-bold">UHDDS Acute Respiratory Failure sequencing</span> to raise your inpatient score above 80%."
            </p>
            <div className="text-[10px] text-amber-800 font-semibold italic">
              — Dr. Jeevanantham Mariappan, Academic Director
            </div>
          </div>
        </div>

        <Link
          href="/practice/drg-simulator"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition shadow-royal shrink-0"
        >
          Open DRG Practice →
        </Link>
      </div>

      {/* Attempt History: Practice Cases & Mock Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Practice Cases */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
              Recent Case Simulator Submissions
            </h3>
            <Link
              href="/practice"
              className="text-xs font-semibold text-mcoa-amethyst hover:underline"
            >
              Case Library →
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.recentPracticeAttempts?.length > 0 ? (
              analytics.recentPracticeAttempts.map((att: any) => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-mcoa-midnight">
                      {att.case?.title || "Clinical Chart Scenario"}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      Category: {att.case?.category || "ICD-10-CM"} • Time: {att.timeSpent || 60}s
                    </div>
                  </div>

                  <div>
                    {att.isCorrect ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Exact Match
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Audited
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                No recent case submissions yet. Head to the practice simulator to start!
              </div>
            )}
          </div>
        </div>

        {/* Recent Mock Exam Attempts */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
              AAPC / AHIMA Diagnostic Mock Attempts
            </h3>
            <Link
              href="/mock-exams"
              className="text-xs font-semibold text-mcoa-amethyst hover:underline"
            >
              Mock Exam Engine →
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.recentExamAttempts?.length > 0 ? (
              analytics.recentExamAttempts.map((exam: any) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-mcoa-midnight">
                      {exam.exam?.title || "AAPC CPC® Assessment"}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      Score: {exam.score}/{exam.total} ({exam.percentage}%) • Time: {Math.round((exam.timeSpentSeconds || 600) / 60)} mins
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        exam.passed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {exam.passed ? "PASSED" : "NEEDS PRACTICE"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                No mock exam attempts recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
