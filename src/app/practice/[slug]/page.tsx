"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Send,
  HelpCircle,
  Plus,
  Trash2,
  Sparkles,
  ShieldAlert,
  Calculator,
  Search,
  ExternalLink,
} from "lucide-react";

export default function CaseWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [practiceCase, setPracticeCase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"chart" | "vitals" | "summary">("chart");

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Coding Inputs
  const [primaryDx, setPrimaryDx] = useState("");
  const [secondaryDxList, setSecondaryDxList] = useState<string[]>([""]);
  const [procedureList, setProcedureList] = useState<string[]>([""]);
  const [modifierList, setModifierList] = useState<string[]>([""]);
  const [studentRationale, setStudentRationale] = useState("");

  // Evaluation Result
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    async function loadCase() {
      try {
        setLoading(true);
        const res = await fetch(`/api/practice/cases?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success) {
          setPracticeCase(data.case);
          // If pre-populated, or reset inputs
        }
      } catch (err) {
        console.error("Error loading case:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadCase();
    }
  }, [slug]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddSecondary = () => {
    setSecondaryDxList([...secondaryDxList, ""]);
  };

  const handleRemoveSecondary = (idx: number) => {
    setSecondaryDxList(secondaryDxList.filter((_, i) => i !== idx));
  };

  const handleUpdateSecondary = (idx: number, val: string) => {
    const updated = [...secondaryDxList];
    updated[idx] = val.toUpperCase();
    setSecondaryDxList(updated);
  };

  const handleAddProcedure = () => {
    setProcedureList([...procedureList, ""]);
  };

  const handleRemoveProcedure = (idx: number) => {
    setProcedureList(procedureList.filter((_, i) => i !== idx));
  };

  const handleUpdateProcedure = (idx: number, val: string) => {
    const updated = [...procedureList];
    updated[idx] = val.toUpperCase();
    setProcedureList(updated);
  };

  const handleAddModifier = () => {
    setModifierList([...modifierList, ""]);
  };

  const handleRemoveModifier = (idx: number) => {
    setModifierList(modifierList.filter((_, i) => i !== idx));
  };

  const handleUpdateModifier = (idx: number, val: string) => {
    const updated = [...modifierList];
    updated[idx] = val.toUpperCase();
    setModifierList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryDx.trim()) {
      alert("Please enter at least a Primary Diagnosis code.");
      return;
    }

    try {
      setSubmitting(true);
      const cleanSecondary = secondaryDxList.map((c) => c.trim()).filter(Boolean);
      const cleanProcedures = procedureList.map((c) => c.trim()).filter(Boolean);
      const cleanModifiers = modifierList.map((c) => c.trim()).filter(Boolean);

      const payload = {
        caseId: practiceCase.id,
        userCodes: {
          primaryDiagnosis: primaryDx.trim().toUpperCase(),
          secondaryDiagnoses: cleanSecondary,
          procedures: cleanProcedures,
          modifiers: cleanModifiers,
          rationale: studentRationale,
        },
        timeSpent: secondsElapsed,
      };

      const res = await fetch("/api/practice/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        setTimerRunning(false);
        // Scroll to result smoothly
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else {
        alert(data.error || "Failed to evaluate case");
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      alert(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-mcoa-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-mcoa-midnight">Loading Medical Chart...</p>
        </div>
      </div>
    );
  }

  if (!practiceCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-mcoa-midnight">Case Scenario Not Found</h2>
          <p className="text-xs text-gray-500">
            The requested practice case does not exist or has been archived.
          </p>
          <Link
            href="/practice"
            className="inline-block px-4 py-2 bg-mcoa-midnight text-white text-xs font-bold rounded-xl"
          >
            Return to Case Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-inter py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="space-y-1">
            <Link
              href="/practice"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-mcoa-amethyst hover:text-mcoa-midnight transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Case Library</span>
            </Link>
            <div className="flex items-center space-x-3 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-mcoa-pearl text-mcoa-amethyst border border-mcoa-lavender/30">
                {practiceCase.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {practiceCase.specialty}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  practiceCase.difficulty === "Beginner"
                    ? "bg-emerald-100 text-emerald-800"
                    : practiceCase.difficulty === "Intermediate"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {practiceCase.difficulty} Level
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-mcoa-midnight font-montserrat">
              {practiceCase.title}
            </h1>
          </div>

          {/* Real-time Encounter Timer & Utilities */}
          <div className="flex items-center space-x-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-mcoa-gold animate-pulse" />
              <div className="text-right">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Encounter Timer
                </div>
                <div className="font-mono text-sm font-bold text-mcoa-midnight">
                  {formatTimer(secondsElapsed)}
                </div>
              </div>
            </div>

            <Link
              href="/practice/references"
              target="_blank"
              className="bg-white hover:bg-mcoa-pearl px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-mcoa-midnight flex items-center space-x-1.5 transition"
              title="Open Digital Reference Manual"
            >
              <BookOpen className="w-4 h-4 text-mcoa-amethyst" />
              <span className="hidden sm:inline">Reference Manual</span>
            </Link>
          </div>
        </div>

        {/* Main 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Authentic EHR Chart Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* EHR Header Banner */}
            <div className="bg-gradient-to-r from-mcoa-midnight to-mcoa-amethyst px-5 py-3 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-mcoa-gold" />
                <span className="font-montserrat font-bold text-xs uppercase tracking-wider">
                  Electronic Health Record (EHR) Documentation
                </span>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono">
                De-Identified Clinical Protocol
              </span>
            </div>

            {/* Sub-Tabs */}
            <div className="border-b border-gray-200 bg-gray-50/60 px-5 flex space-x-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("chart")}
                className={`py-3 border-b-2 transition ${
                  activeTab === "chart"
                    ? "border-mcoa-midnight text-mcoa-midnight font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Clinical Documentation
              </button>
              <button
                onClick={() => setActiveTab("vitals")}
                className={`py-3 border-b-2 transition ${
                  activeTab === "vitals"
                    ? "border-mcoa-midnight text-mcoa-midnight font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Vitals & Diagnostics
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-3 border-b-2 transition ${
                  activeTab === "summary"
                    ? "border-mcoa-midnight text-mcoa-midnight font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Encounter Meta
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 text-xs text-gray-800 leading-relaxed font-mono whitespace-pre-line bg-[#FCFDFE] min-h-[420px] max-h-[580px] overflow-y-auto selection:bg-mcoa-gold selection:text-mcoa-midnight">
              {activeTab === "chart" && practiceCase.clinicalChart}

              {activeTab === "vitals" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                    <span className="font-bold">Faculty Clinical Insight:</span>
                    <p className="text-[11px] leading-normal text-amber-800">
                      When analyzing diagnostic results, note whether abnormal findings were interpreted by the performing physician or reported by an external department (relevant to E&M Data Category 2).
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
                    <div className="font-bold text-mcoa-midnight uppercase text-[11px]">
                      Patient Vitals & Measurements:
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Blood Pressure: 138/86 mmHg (Sitting, Right Arm)</li>
                      <li>Pulse Rate: 78 bpm, Regular</li>
                      <li>Respiratory Rate: 16 bpm</li>
                      <li>Temperature: 98.6 °F (Oral)</li>
                      <li>Oxygen Saturation (SpO2): 98% on Ambient Air</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "summary" && (
                <div className="space-y-3 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Encounter Date</div>
                      <div className="font-semibold text-gray-800">October 2026</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Specialty Discipline</div>
                      <div className="font-semibold text-gray-800">{practiceCase.specialty}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Classification</div>
                      <div className="font-semibold text-gray-800">{practiceCase.category}</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Faculty Author</div>
                      <div className="font-semibold text-mcoa-amethyst">MCOA Clinical Faculty Board</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom EHR Status Bar */}
            <div className="bg-gray-100/80 px-5 py-2.5 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between">
              <span>Tip: Review all documented secondary manifestations before code assignment.</span>
              <span className="font-mono text-gray-400">STATUS: READY_FOR_CODING</span>
            </div>
          </div>

          {/* Right Column: Student Coding Workspace (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-wider font-montserrat">
                  Student Coding Console
                </span>
                <span className="text-[10px] text-gray-400 font-mono">ICD-10-CM / CPT / PCS</span>
              </div>
              <h2 className="font-montserrat font-bold text-base text-mcoa-midnight mt-0.5">
                Assign Codes & Rationale
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Primary Diagnosis */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-mcoa-midnight flex items-center justify-between">
                  <span>
                    Primary / Principal Diagnosis Code <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">e.g. I21.4, M23.221, J44.1</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={primaryDx}
                    onChange={(e) => setPrimaryDx(e.target.value.toUpperCase())}
                    placeholder="Enter ICD-10-CM code"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-mcoa-amethyst focus:ring-2 focus:ring-mcoa-pearl text-xs font-mono font-bold uppercase tracking-wider text-mcoa-midnight"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Secondary Diagnoses */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-mcoa-midnight">
                    Secondary Diagnoses (CC / Comorbidities)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSecondary}
                    className="text-[11px] font-bold text-mcoa-amethyst hover:text-mcoa-midnight flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Code</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {secondaryDxList.map((val, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleUpdateSecondary(idx, e.target.value)}
                        placeholder={`Secondary ICD-10-CM #${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-mcoa-amethyst text-xs font-mono font-bold uppercase tracking-wider text-mcoa-midnight"
                      />
                      {secondaryDxList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSecondary(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedure Codes (CPT or ICD-10-PCS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-mcoa-midnight">
                    Procedure Codes (CPT / ICD-10-PCS)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddProcedure}
                    className="text-[11px] font-bold text-mcoa-amethyst hover:text-mcoa-midnight flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Procedure</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {procedureList.map((val, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleUpdateProcedure(idx, e.target.value)}
                        placeholder="e.g. 29881, 99214, 5A09457"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-mcoa-amethyst text-xs font-mono font-bold uppercase tracking-wider text-mcoa-midnight"
                      />
                      {procedureList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProcedure(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modifiers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-mcoa-midnight">
                    CPT / HCPCS Modifiers (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddModifier}
                    className="text-[11px] font-bold text-mcoa-amethyst hover:text-mcoa-midnight flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Modifier</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {modifierList.map((val, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleUpdateModifier(idx, e.target.value)}
                        placeholder="e.g. 25, 59, RT, LT, 50"
                        className="w-32 px-3 py-2 rounded-xl border border-gray-200 focus:border-mcoa-amethyst text-xs font-mono font-bold uppercase tracking-wider text-mcoa-midnight"
                      />
                      {modifierList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModifier(idx)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Clinical Rationale */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-mcoa-midnight">
                  Sequencing Rationale & Guideline Citation
                </label>
                <textarea
                  rows={3}
                  value={studentRationale}
                  onChange={(e) => setStudentRationale(e.target.value)}
                  placeholder="Explain why this diagnosis was sequenced first and reference applicable ICD-10 or CPT guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-mcoa-amethyst text-xs text-gray-800"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-mcoa-midnight border-t-transparent rounded-full animate-spin"></div>
                    <span>Auditing Solution...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Evaluate Solution & Check Guidelines</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Evaluation Results Section (Appears after submission) */}
        {result && (
          <div className="bg-white rounded-3xl border-2 border-mcoa-gold/50 shadow-royal p-6 sm:p-8 space-y-6 animate-fadeIn">
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center space-x-3">
                {result.isCorrect ? (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-montserrat font-bold text-lg text-mcoa-midnight">
                    {result.isCorrect
                      ? "Diagnosis Sequencing Correct! (Matched Faculty Answer Key)"
                      : "Coding Discrepancy Found — Review Guideline Sequence"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Audited against official ICD-10-CM OGCR & AMA CPT guidelines by MCOA faculty.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Time to Complete:</span>
                <span className="font-mono text-xs font-bold px-3 py-1 bg-gray-100 rounded-lg text-mcoa-midnight">
                  {formatTimer(result.attempt?.timeSpent || secondsElapsed)}
                </span>
              </div>
            </div>

            {/* Code Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-montserrat">
                    <th className="py-2.5 px-4 font-bold">Element</th>
                    <th className="py-2.5 px-4 font-bold">Your Submitted Code</th>
                    <th className="py-2.5 px-4 font-bold">Faculty Recommended Key</th>
                    <th className="py-2.5 px-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-mcoa-midnight">Primary Diagnosis</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-700">
                      {primaryDx.trim().toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-mcoa-amethyst">
                      {result.recommendedCodes?.primaryDiagnosis}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {result.isCorrect ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Exact Match</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Review Needed</span>
                        </span>
                      )}
                    </td>
                  </tr>

                  {result.recommendedCodes?.secondaryDiagnoses?.length > 0 && (
                    <tr>
                      <td className="py-3 px-4 font-bold text-mcoa-midnight">Secondary Diagnoses</td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        {secondaryDxList.filter(Boolean).join(", ") || "None entered"}
                      </td>
                      <td className="py-3 px-4 font-mono text-mcoa-amethyst">
                        {result.recommendedCodes?.secondaryDiagnoses.join(", ")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[11px] font-medium text-gray-500">
                          {result.recommendedCodes.secondaryDiagnoses.length} Expected
                        </span>
                      </td>
                    </tr>
                  )}

                  {result.recommendedCodes?.procedures?.length > 0 && (
                    <tr>
                      <td className="py-3 px-4 font-bold text-mcoa-midnight">Procedure(s)</td>
                      <td className="py-3 px-4 font-mono text-gray-700">
                        {procedureList.filter(Boolean).join(", ") || "None entered"}
                      </td>
                      <td className="py-3 px-4 font-mono text-mcoa-amethyst">
                        {result.recommendedCodes?.procedures.join(", ")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[11px] font-medium text-gray-500">
                          {result.recommendedCodes.procedures.length} Expected
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Step-by-Step Rationale */}
            <div className="bg-mcoa-pearl/50 rounded-2xl p-5 border border-mcoa-lavender/30 space-y-2">
              <div className="flex items-center space-x-2 text-mcoa-midnight font-montserrat font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-mcoa-gold" />
                <span>Instructor Guideline Rationale</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-mono">
                {result.rationale}
              </p>
            </div>

            {/* Common Pitfalls Box */}
            {result.commonPitfalls && (
              <div className="bg-red-50/70 rounded-2xl p-5 border border-red-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-red-900 font-montserrat font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Frequent Coding Pitfalls to Avoid</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  {result.commonPitfalls}
                </p>
              </div>
            )}

            {/* Guideline Citation Tag */}
            {result.guidelineRef && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-mcoa-amethyst" />
                  <span className="font-semibold text-mcoa-midnight">Official Citation:</span>
                  <span className="italic">{result.guidelineRef}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setResult(null);
                      setTimerRunning(true);
                    }}
                    className="text-xs font-bold text-gray-600 hover:text-mcoa-midnight underline"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/practice"
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition"
                  >
                    Next Case →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
