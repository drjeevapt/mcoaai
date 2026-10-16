"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  Info,
  BookOpen,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

type SettingType =
  | "office-established"
  | "office-new"
  | "inpatient-initial"
  | "inpatient-subsequent"
  | "emergency-dept"
  | "consult-office";

type ComplexityLevel = "Minimal" | "Low" | "Moderate" | "High";

const LEVEL_WEIGHTS: Record<ComplexityLevel, number> = {
  Minimal: 1,
  Low: 2,
  Moderate: 3,
  High: 4,
};

export default function EMCalculatorPage() {
  const [setting, setSetting] = useState<SettingType>("office-established");
  const [selectionMode, setSelectionMode] = useState<"mdm" | "time">("mdm");

  // MDM Categories
  const [problemsLevel, setProblemsLevel] = useState<ComplexityLevel>("Moderate");
  const [dataLevel, setDataLevel] = useState<ComplexityLevel>("Moderate");
  const [riskLevel, setRiskLevel] = useState<ComplexityLevel>("Moderate");

  // Time in minutes
  const [minutes, setMinutes] = useState<number>(35);

  // 2 of 3 rule calculation
  const calculateMDM = (): { level: ComplexityLevel; matchedFactors: string[] } => {
    const scores = [
      { name: "Problems Addressed", level: problemsLevel, val: LEVEL_WEIGHTS[problemsLevel] },
      { name: "Data Analyzed", level: dataLevel, val: LEVEL_WEIGHTS[dataLevel] },
      { name: "Management Risk", level: riskLevel, val: LEVEL_WEIGHTS[riskLevel] },
    ];

    // Sort descending
    scores.sort((a, b) => b.val - a.val);

    // The second highest score is the qualifying 2-of-3 level
    const qualifyingScore = scores[1].val;
    const matched = [scores[0].name, scores[1].name];

    let overallLevel: ComplexityLevel = "Minimal";
    if (qualifyingScore === 4) overallLevel = "High";
    else if (qualifyingScore === 3) overallLevel = "Moderate";
    else if (qualifyingScore === 2) overallLevel = "Low";
    else overallLevel = "Minimal";

    return { level: overallLevel, matchedFactors: matched };
  };

  const mdmResult = calculateMDM();

  // Mapping to CPT Code based on setting & MDM
  const getCPTFromMDM = (sett: SettingType, mdm: ComplexityLevel) => {
    switch (sett) {
      case "office-established":
        if (mdm === "Minimal") return { code: "99212", desc: "Level 2 Established Office (Straightforward MDM)" };
        if (mdm === "Low") return { code: "99213", desc: "Level 3 Established Office (Low Complexity MDM)" };
        if (mdm === "Moderate") return { code: "99214", desc: "Level 4 Established Office (Moderate Complexity MDM)" };
        return { code: "99215", desc: "Level 5 Established Office (High Complexity MDM)" };

      case "office-new":
        if (mdm === "Minimal" || mdm === "Low") return { code: "99202", desc: "Level 2 New Patient Office (Straightforward MDM)" };
        if (mdm === "Moderate") return { code: "99204", desc: "Level 4 New Patient Office (Moderate Complexity MDM)" };
        return { code: "99205", desc: "Level 5 New Patient Office (High Complexity MDM)" };

      case "inpatient-initial":
        if (mdm === "Minimal" || mdm === "Low") return { code: "99221", desc: "Initial Hospital / Inpatient Care (Straightforward/Low MDM)" };
        if (mdm === "Moderate") return { code: "99222", desc: "Initial Hospital / Inpatient Care (Moderate MDM)" };
        return { code: "99223", desc: "Initial Hospital / Inpatient Care (High MDM)" };

      case "inpatient-subsequent":
        if (mdm === "Minimal" || mdm === "Low") return { code: "99231", desc: "Subsequent Hospital Care (Straightforward/Low MDM)" };
        if (mdm === "Moderate") return { code: "99232", desc: "Subsequent Hospital Care (Moderate MDM)" };
        return { code: "99233", desc: "Subsequent Hospital Care (High MDM)" };

      case "emergency-dept":
        if (mdm === "Minimal") return { code: "99282", desc: "Emergency Dept Care (Straightforward MDM)" };
        if (mdm === "Low") return { code: "99283", desc: "Emergency Dept Care (Low MDM)" };
        if (mdm === "Moderate") return { code: "99284", desc: "Emergency Dept Care (Moderate MDM)" };
        return { code: "99285", desc: "Emergency Dept Care (High MDM, Immediate threat)" };

      case "consult-office":
        if (mdm === "Minimal" || mdm === "Low") return { code: "99242", desc: "Office Consultation (Straightforward/Low MDM)" };
        if (mdm === "Moderate") return { code: "99244", desc: "Office Consultation (Moderate MDM)" };
        return { code: "99245", desc: "Office Consultation (High MDM)" };
    }
  };

  // Mapping to CPT Code based on Time
  const getCPTFromTime = (sett: SettingType, mins: number) => {
    if (sett === "emergency-dept") {
      return {
        code: "N/A",
        desc: "Per AMA/CPT Guidelines, Emergency Department codes (99281-99285) cannot be selected based on time. MDM must be used.",
        prolonged: false,
      };
    }

    if (sett === "office-established") {
      if (mins < 10) return { code: "99211", desc: "Minimal service (May not require provider presence)", prolonged: false };
      if (mins <= 19) return { code: "99212", desc: "10-19 minutes total provider time", prolonged: false };
      if (mins <= 29) return { code: "99213", desc: "20-29 minutes total provider time", prolonged: false };
      if (mins <= 39) return { code: "99214", desc: "30-39 minutes total provider time", prolonged: false };
      if (mins <= 54) return { code: "99215", desc: "40-54 minutes total provider time", prolonged: false };
      const extraMins = mins - 54;
      const prolongedUnits = Math.floor(extraMins / 15);
      return {
        code: `99215 + 99417 × ${prolongedUnits}`,
        desc: `55+ minutes (${prolongedUnits} prolonged unit${prolongedUnits > 1 ? "s" : ""} of +99417 for each 15 mins beyond 54 mins)`,
        prolonged: true,
      };
    }

    if (sett === "office-new") {
      if (mins <= 29) return { code: "99202", desc: "15-29 minutes total provider time", prolonged: false };
      if (mins <= 44) return { code: "99203", desc: "30-44 minutes total provider time", prolonged: false };
      if (mins <= 59) return { code: "99204", desc: "45-59 minutes total provider time", prolonged: false };
      if (mins <= 74) return { code: "99205", desc: "60-74 minutes total provider time", prolonged: false };
      const extraMins = mins - 74;
      const prolongedUnits = Math.floor(extraMins / 15);
      return {
        code: `99205 + 99417 × ${prolongedUnits}`,
        desc: `75+ minutes (${prolongedUnits} prolonged unit${prolongedUnits > 1 ? "s" : ""} of +99417)`,
        prolonged: true,
      };
    }

    if (sett === "inpatient-initial") {
      if (mins <= 40) return { code: "99221", desc: "40 minutes total provider time", prolonged: false };
      if (mins <= 55) return { code: "99222", desc: "55 minutes total provider time", prolonged: false };
      if (mins <= 75) return { code: "99223", desc: "75 minutes total provider time", prolonged: false };
      const extraMins = mins - 75;
      const prolongedUnits = Math.floor(extraMins / 15);
      return {
        code: `99223 + 99418 × ${prolongedUnits}`,
        desc: `90+ minutes inpatient (+99418 for each 15 mins)`,
        prolonged: true,
      };
    }

    if (sett === "inpatient-subsequent") {
      if (mins <= 25) return { code: "99231", desc: "25 minutes total provider time", prolonged: false };
      if (mins <= 35) return { code: "99232", desc: "35 minutes total provider time", prolonged: false };
      if (mins <= 50) return { code: "99233", desc: "50 minutes total provider time", prolonged: false };
      const extraMins = mins - 50;
      const prolongedUnits = Math.floor(extraMins / 15);
      return {
        code: `99233 + 99418 × ${prolongedUnits}`,
        desc: `65+ minutes subsequent inpatient (+99418)`,
        prolonged: true,
      };
    }

    return { code: "99244", desc: "Consultation time range", prolonged: false };
  };

  const finalCode =
    selectionMode === "mdm"
      ? getCPTFromMDM(setting, mdmResult.level)
      : getCPTFromTime(setting, minutes);

  // Scenario Presets
  const applyPreset = (type: "diabetes" | "diverticulitis" | "routine-htn") => {
    if (type === "diabetes") {
      setSetting("office-established");
      setSelectionMode("mdm");
      setProblemsLevel("Moderate");
      setDataLevel("Moderate");
      setRiskLevel("Moderate");
    } else if (type === "diverticulitis") {
      setSetting("office-established");
      setSelectionMode("mdm");
      setProblemsLevel("High");
      setDataLevel("Moderate");
      setRiskLevel("High");
    } else if (type === "routine-htn") {
      setSetting("office-established");
      setSelectionMode("mdm");
      setProblemsLevel("Low");
      setDataLevel("Low");
      setRiskLevel("Low");
    }
  };

  return (
    <div className="bg-[#F8F9FC] min-h-screen py-10 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <Link
            href="/practice"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-mcoa-amethyst hover:text-mcoa-midnight transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Practice Simulator</span>
          </Link>

          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">
            AMA CPT 2021/2023 REVISED E&M STANDARD
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-full text-[11px] font-bold">
            <Calculator className="w-3.5 h-3.5 text-mcoa-gold" />
            <span>MCOA Educational E&M Calculator Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-mcoa-midnight font-montserrat">
            Evaluation & Management (E&M) Calculator
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Determine compliant outpatient, inpatient, and emergency department CPT codes using the official AMA 2-of-3 Medical Decision Making (MDM) grid or total provider encounter time.
          </p>
        </div>

        {/* Clinical Scenario Quick Presets */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-mcoa-midnight font-bold">
            <Sparkles className="w-4 h-4 text-mcoa-gold" />
            <span>Load Quick Training Clinical Preset:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset("diabetes")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              Chronic DM Medication Titration (99214)
            </button>
            <button
              onClick={() => applyPreset("diverticulitis")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              Acute Diverticulitis with Urgent Consult (99215)
            </button>
            <button
              onClick={() => applyPreset("routine-htn")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              Stable HTN Routine Follow-Up (99213)
            </button>
          </div>
        </div>

        {/* Setting Selector Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-1 text-xs font-semibold">
          <button
            onClick={() => setSetting("office-established")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition text-center ${
              setting === "office-established"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Office Established (99211-15)
          </button>
          <button
            onClick={() => setSetting("office-new")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition text-center ${
              setting === "office-new"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Office New (99202-05)
          </button>
          <button
            onClick={() => setSetting("inpatient-initial")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition text-center ${
              setting === "inpatient-initial"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Inpatient Initial (99221-23)
          </button>
          <button
            onClick={() => setSetting("inpatient-subsequent")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition text-center ${
              setting === "inpatient-subsequent"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Inpatient Subsequent (99231-33)
          </button>
          <button
            onClick={() => setSetting("emergency-dept")}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition text-center ${
              setting === "emergency-dept"
                ? "bg-mcoa-midnight text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Emergency Dept (99281-85)
          </button>
        </div>

        {/* Mode Selector: MDM vs Total Time */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setSelectionMode("mdm")}
            className={`px-5 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition ${
              selectionMode === "mdm"
                ? "bg-mcoa-amethyst text-white shadow-royal"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Mode 1: Medical Decision Making (MDM 2-of-3 Grid)
          </button>
          <button
            onClick={() => setSelectionMode("time")}
            className={`px-5 py-2.5 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider transition ${
              selectionMode === "time"
                ? "bg-mcoa-amethyst text-white shadow-royal"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Mode 2: Total Clinician Encounter Time
          </button>
        </div>

        {/* Calculation Inputs Container */}
        {selectionMode === "mdm" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category 1: Problems Addressed */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-wider font-montserrat">
                  Category 1
                </div>
                <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
                  Number & Complexity of Problems
                </h3>
                <p className="text-[11px] text-gray-500">
                  Select the highest level of documented clinical condition addressed.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {(["Minimal", "Low", "Moderate", "High"] as ComplexityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProblemsLevel(lvl)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      problemsLevel === lvl
                        ? "border-mcoa-amethyst bg-mcoa-pearl/50 text-mcoa-midnight font-bold shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lvl}</span>
                      {problemsLevel === lvl && (
                        <CheckCircle2 className="w-4 h-4 text-mcoa-amethyst" />
                      )}
                    </div>
                    <div className="text-[10px] font-normal text-gray-500 mt-1">
                      {lvl === "Minimal" && "1 self-limited or minor problem"}
                      {lvl === "Low" && "2+ minor problems, or 1 stable chronic illness, or 1 acute uncomplicated"}
                      {lvl === "Moderate" && "1+ chronic with exacerbation, or 2+ stable chronic, or 1 acute illness w/ systemic symptoms"}
                      {lvl === "High" && "1+ chronic illness with severe exacerbation, or acute illness posing threat to life/function"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category 2: Data Analyzed */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-wider font-montserrat">
                  Category 2
                </div>
                <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
                  Amount & Complexity of Data
                </h3>
                <p className="text-[11px] text-gray-500">
                  Includes notes review, tests ordered/reviewed, independent interpretation.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {(["Minimal", "Low", "Moderate", "High"] as ComplexityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDataLevel(lvl)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      dataLevel === lvl
                        ? "border-mcoa-amethyst bg-mcoa-pearl/50 text-mcoa-midnight font-bold shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lvl}</span>
                      {dataLevel === lvl && (
                        <CheckCircle2 className="w-4 h-4 text-mcoa-amethyst" />
                      )}
                    </div>
                    <div className="text-[10px] font-normal text-gray-500 mt-1">
                      {lvl === "Minimal" && "Minimal or no test/record review"}
                      {lvl === "Low" && "Review/order 2 unique tests, or review prior notes, or independent historian"}
                      {lvl === "Moderate" && "Review/order 3 items, or independent interpretation of tests by performing MD"}
                      {lvl === "High" && "Extensive data: at least 2 of (Cat 1: 3 items, Cat 2: test interpretation, Cat 3: external MD discussion)"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category 3: Management Risk */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-wider font-montserrat">
                  Category 3
                </div>
                <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
                  Risk of Complications / Morbidity
                </h3>
                <p className="text-[11px] text-gray-500">
                  Risk associated with diagnostic procedures and therapeutic treatments.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {(["Minimal", "Low", "Moderate", "High"] as ComplexityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRiskLevel(lvl)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      riskLevel === lvl
                        ? "border-mcoa-amethyst bg-mcoa-pearl/50 text-mcoa-midnight font-bold shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lvl}</span>
                      {riskLevel === lvl && (
                        <CheckCircle2 className="w-4 h-4 text-mcoa-amethyst" />
                      )}
                    </div>
                    <div className="text-[10px] font-normal text-gray-500 mt-1">
                      {lvl === "Minimal" && "Rest, gargles, superficial wound care, OTC dressings"}
                      {lvl === "Low" && "OTC meds, minor surgery without identified patient risk"}
                      {lvl === "Moderate" && "Prescription drug management, minor surgery with risk, social determinants"}
                      {lvl === "High" && "Drug requiring intensive toxicity monitoring, emergency major surgery, decision for hospitalization / DNR"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Time Selection Panel */
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto space-y-6 text-center">
            <div className="space-y-1">
              <Clock className="w-8 h-8 text-mcoa-gold mx-auto" />
              <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
                Total Clinician Time on Encounter Date
              </h3>
              <p className="text-xs text-gray-500">
                Includes face-to-face and non-face-to-face time spent by the physician or QHP.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-4xl font-extrabold font-mono text-mcoa-midnight">
                {minutes} <span className="text-base font-normal text-gray-500">Minutes</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full accent-mcoa-amethyst cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>5 mins</span>
                <span>30 mins</span>
                <span>60 mins</span>
                <span>90 mins</span>
                <span>120 mins</span>
              </div>
            </div>
          </div>
        )}

        {/* Calculated Result Card */}
        <div className="bg-gradient-to-br from-mcoa-midnight to-[#31236B] rounded-3xl text-white p-7 sm:p-9 shadow-royal space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-gold font-montserrat">
                Recommended Procedure Code
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-1">
                CPT® {finalCode.code}
              </div>
              <p className="text-xs text-white/80 mt-1 max-w-xl">
                {finalCode.desc}
              </p>
            </div>

            <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/20 text-right">
              <div className="text-[10px] text-white/70 uppercase font-bold">
                {selectionMode === "mdm" ? "Calculated MDM Level" : "Selection Basis"}
              </div>
              <div className="text-lg font-bold text-mcoa-gold font-montserrat">
                {selectionMode === "mdm" ? `${mdmResult.level} MDM` : `${minutes} Minutes`}
              </div>
            </div>
          </div>

          {/* 2-of-3 Rule Logic Explanation */}
          {selectionMode === "mdm" && (
            <div className="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/10 text-xs space-y-2">
              <div className="font-bold text-mcoa-gold flex items-center space-x-1.5 font-montserrat">
                <Sparkles className="w-4 h-4" />
                <span>AMA 2-of-3 Rule Step-by-Step Logic:</span>
              </div>
              <p className="text-white/90 leading-relaxed">
                To qualify for a given level of MDM, <span className="font-bold underline">two out of the three</span> categories must meet or exceed that level.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className={`p-2.5 rounded-lg border ${problemsLevel === mdmResult.level ? "bg-emerald-500/20 border-emerald-400" : "bg-black/20 border-white/10"}`}>
                  Problems: <span className="font-bold">{problemsLevel}</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${dataLevel === mdmResult.level ? "bg-emerald-500/20 border-emerald-400" : "bg-black/20 border-white/10"}`}>
                  Data: <span className="font-bold">{dataLevel}</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${riskLevel === mdmResult.level ? "bg-emerald-500/20 border-emerald-400" : "bg-black/20 border-white/10"}`}>
                  Risk: <span className="font-bold">{riskLevel}</span>
                </div>
              </div>
            </div>
          )}

          {/* Educational Licensing Disclaimer */}
          <div className="flex items-start space-x-2 text-[11px] text-white/60 pt-2 border-t border-white/10">
            <Info className="w-4 h-4 shrink-0 text-mcoa-gold mt-0.5" />
            <p>
              Educational Simulation Notice: CPT® is a registered trademark of the American Medical Association (AMA). This calculator is an educational training tool created by Medical Coding Officers Academy for certification candidates and does not replace official AMA CPT® codebooks or formal clinical documentation audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
