"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Info,
  Layers,
  Activity,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface SecondaryDx {
  id: string;
  code: string;
  description: string;
  severity: "MCC" | "CC" | "None";
  poa: "Y" | "N" | "U" | "W" | "1";
}

interface ProcedureItem {
  id: string;
  code: string;
  description: string;
  isSurgicalOR: boolean;
}

export default function DRGSimulatorPage() {
  // Principal Diagnosis
  const [principalDx, setPrincipalDx] = useState("J44.1");
  const [principalDesc, setPrincipalDesc] = useState("Chronic obstructive pulmonary disease with (acute) exacerbation");

  // Patient Demographics
  const [patientAge, setPatientAge] = useState(71);
  const [dischargeStatus, setDischargeStatus] = useState("Home / Self Care (01)");

  // Secondary Diagnoses
  const [secondaryList, setSecondaryList] = useState<SecondaryDx[]>([
    {
      id: "sec-1",
      code: "J96.02",
      description: "Acute respiratory failure with hypercapnia",
      severity: "MCC",
      poa: "Y",
    },
    {
      id: "sec-2",
      code: "J15.1",
      description: "Pneumonia due to Pseudomonas",
      severity: "CC",
      poa: "Y",
    },
  ]);

  // Procedures
  const [procedureList, setProcedureList] = useState<ProcedureItem[]>([
    {
      id: "proc-1",
      code: "5A09457",
      description: "Assistance with Respiratory Ventilation, Noninvasive, 24-96 Consecutive Hours",
      isSurgicalOR: false,
    },
  ]);

  // Preset loader
  const loadPreset = (preset: "copd" | "sepsis" | "appendix" | "chf") => {
    if (preset === "copd") {
      setPrincipalDx("J44.1");
      setPrincipalDesc("Chronic obstructive pulmonary disease with (acute) exacerbation");
      setSecondaryList([
        { id: "1", code: "J96.02", description: "Acute respiratory failure with hypercapnia", severity: "MCC", poa: "Y" },
        { id: "2", code: "J15.1", description: "Pneumonia due to Pseudomonas", severity: "CC", poa: "Y" },
      ]);
      setProcedureList([
        { id: "1", code: "5A09457", description: "Noninvasive Respiratory Ventilation, 24-96 Hours", isSurgicalOR: false },
      ]);
      setPatientAge(71);
    } else if (preset === "sepsis") {
      setPrincipalDx("A41.9");
      setPrincipalDesc("Sepsis, unspecified organism");
      setSecondaryList([
        { id: "1", code: "R65.21", description: "Severe sepsis with septic shock", severity: "MCC", poa: "Y" },
        { id: "2", code: "N17.9", description: "Acute kidney failure, unspecified", severity: "CC", poa: "Y" },
      ]);
      setProcedureList([
        { id: "1", code: "5A1955Z", description: "Extracorporeal Mechanical Ventilation, Greater than 96 Consecutive Hours", isSurgicalOR: false },
      ]);
      setPatientAge(66);
    } else if (preset === "appendix") {
      setPrincipalDx("K35.80");
      setPrincipalDesc("Unspecified acute appendicitis");
      setSecondaryList([
        { id: "1", code: "K65.0", description: "Generalized (acute) peritonitis", severity: "MCC", poa: "Y" },
      ]);
      setProcedureList([
        { id: "1", code: "0DTJ0ZZ", description: "Resection of Appendix, Percutaneous Endoscopic Approach (Laparoscopic)", isSurgicalOR: true },
      ]);
      setPatientAge(34);
    } else if (preset === "chf") {
      setPrincipalDx("I50.9");
      setPrincipalDesc("Heart failure, unspecified");
      setSecondaryList([
        { id: "1", code: "N17.0", description: "Acute kidney failure with tubular necrosis", severity: "MCC", poa: "Y" },
        { id: "2", code: "I10", description: "Essential (primary) hypertension", severity: "None", poa: "Y" },
      ]);
      setProcedureList([]);
      setPatientAge(78);
    }
  };

  // Grouping Engine Logic
  const calculateDRG = () => {
    // 1. Determine MDC (Major Diagnostic Category)
    let mdc = "MDC 04: Diseases and Disorders of the Respiratory System";
    let mdcNum = 4;
    let partition: "Medical" | "Surgical" = "Medical";

    const hasSurgicalOR = procedureList.some((p) => p.isSurgicalOR);
    if (hasSurgicalOR) {
      partition = "Surgical";
    }

    // Check MCC / CC severity among POA = 'Y' secondary diagnoses
    const validSecondaries = secondaryList.filter((s) => s.poa === "Y");
    const hasMCC = validSecondaries.some((s) => s.severity === "MCC");
    const hasCC = validSecondaries.some((s) => s.severity === "CC");

    let drgNumber = "190";
    let drgTitle = "Chronic Obstructive Pulmonary Disease with MCC";
    let relativeWeight = 1.1892;
    let gmlos = 4.3;

    // Logic trees by Principal Diagnosis
    if (principalDx.startsWith("J44")) {
      mdc = "MDC 04: Diseases and Disorders of the Respiratory System";
      mdcNum = 4;
      if (hasMCC) {
        drgNumber = "190";
        drgTitle = "Chronic Obstructive Pulmonary Disease with MCC";
        relativeWeight = 1.1892;
        gmlos = 4.3;
      } else if (hasCC) {
        drgNumber = "191";
        drgTitle = "Chronic Obstructive Pulmonary Disease with CC";
        relativeWeight = 0.8841;
        gmlos = 3.4;
      } else {
        drgNumber = "192";
        drgTitle = "Chronic Obstructive Pulmonary Disease without CC/MCC";
        relativeWeight = 0.6724;
        gmlos = 2.7;
      }
    } else if (principalDx.startsWith("A41")) {
      mdc = "MDC 18: Infectious and Parasitic Diseases, Systemic or Unspecified Sites";
      mdcNum = 18;
      if (hasMCC) {
        drgNumber = "871";
        drgTitle = "Septicemia or Severe Sepsis with MV >96 Hours or with MCC";
        relativeWeight = 1.8492;
        gmlos = 5.8;
      } else {
        drgNumber = "872";
        drgTitle = "Septicemia or Severe Sepsis without MCC";
        relativeWeight = 1.1045;
        gmlos = 3.9;
      }
    } else if (principalDx.startsWith("K35")) {
      mdc = "MDC 06: Diseases and Disorders of the Digestive System";
      mdcNum = 6;
      if (hasSurgicalOR) {
        if (hasMCC) {
          drgNumber = "341";
          drgTitle = "Appendectomy with Complicated Principal Dx with MCC";
          relativeWeight = 2.4518;
          gmlos = 6.2;
        } else if (hasCC) {
          drgNumber = "342";
          drgTitle = "Appendectomy with Complicated Principal Dx with CC";
          relativeWeight = 1.5432;
          gmlos = 4.1;
        } else {
          drgNumber = "343";
          drgTitle = "Appendectomy with Complicated Principal Dx without CC/MCC";
          relativeWeight = 1.1205;
          gmlos = 2.3;
        }
      } else {
        drgNumber = "395";
        drgTitle = "Other Digestive System Diagnoses without CC/MCC";
        relativeWeight = 0.7412;
        gmlos = 2.5;
      }
    } else if (principalDx.startsWith("I50")) {
      mdc = "MDC 05: Diseases and Disorders of the Circulatory System";
      mdcNum = 5;
      if (hasMCC) {
        drgNumber = "291";
        drgTitle = "Heart Failure and Shock with MCC";
        relativeWeight = 1.3921;
        gmlos = 4.6;
      } else if (hasCC) {
        drgNumber = "292";
        drgTitle = "Heart Failure and Shock with CC";
        relativeWeight = 0.9524;
        gmlos = 3.5;
      } else {
        drgNumber = "293";
        drgTitle = "Heart Failure and Shock without CC/MCC";
        relativeWeight = 0.6912;
        gmlos = 2.6;
      }
    }

    const estimatedHospitalPayment = Math.round(relativeWeight * 6850);

    return {
      drgNumber,
      drgTitle,
      mdc,
      partition,
      hasMCC,
      hasCC,
      relativeWeight,
      gmlos,
      estimatedHospitalPayment,
    };
  };

  const drgResult = calculateDRG();

  // Handlers for dynamic list
  const handleAddSecondary = () => {
    setSecondaryList([
      ...secondaryList,
      {
        id: `sec-${Date.now()}`,
        code: "E11.9",
        description: "Type 2 diabetes mellitus without complications",
        severity: "None",
        poa: "Y",
      },
    ]);
  };

  const handleRemoveSecondary = (id: string) => {
    setSecondaryList(secondaryList.filter((s) => s.id !== id));
  };

  const handleUpdateSecondary = (id: string, field: keyof SecondaryDx, val: any) => {
    setSecondaryList(
      secondaryList.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  return (
    <div className="bg-[#F8F9FC] min-h-screen py-10 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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
            CMS MS-DRG v41.0 / UHDDS INPATIENT GROUPING LOGIC
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 bg-purple-50 text-mcoa-amethyst border border-purple-200 px-3 py-1 rounded-full text-[11px] font-bold">
            <Building2 className="w-3.5 h-3.5 text-mcoa-gold" />
            <span>Inpatient Hospital Reimbursement Grouper</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-mcoa-midnight font-montserrat">
            MS-DRG Practice Simulator
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Master inpatient hospital coding under UHDDS rules. Understand how Principal Diagnosis sequencing, secondary CC/MCC designations, and surgical OR procedures determine MS-DRG assignment, relative weights, and geometric mean length of stay.
          </p>
        </div>

        {/* Preset Clinical Scenarios */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-mcoa-midnight font-bold">
            <Sparkles className="w-4 h-4 text-mcoa-gold" />
            <span>Load Authentic Inpatient Training Case:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset("copd")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              COPD with Acute Respiratory Failure (MS-DRG 190)
            </button>
            <button
              onClick={() => loadPreset("sepsis")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              Severe Sepsis with Septic Shock (MS-DRG 871)
            </button>
            <button
              onClick={() => loadPreset("appendix")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              Laparoscopic Appendectomy (MS-DRG 341)
            </button>
            <button
              onClick={() => loadPreset("chf")}
              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-mcoa-pearl border border-gray-200 text-gray-700 font-medium transition"
            >
              CHF with Acute Renal Failure (MS-DRG 291)
            </button>
          </div>
        </div>

        {/* Main 2-Column Interface: Inputs & Real-time Grouper Result */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: UHDDS Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-wider font-montserrat">
                Inpatient Encounter Parameters
              </span>
              <h2 className="font-montserrat font-bold text-lg text-mcoa-midnight">
                Uniform Hospital Discharge Data Set (UHDDS) Inputs
              </h2>
            </div>

            {/* Principal Diagnosis */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-mcoa-midnight flex items-center justify-between">
                <span>
                  Principal Diagnosis (Reason Established After Study) <span className="text-red-500">*</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">ICD-10-CM</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={principalDx}
                  onChange={(e) => setPrincipalDx(e.target.value.toUpperCase())}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-mcoa-amethyst font-mono font-bold text-xs uppercase tracking-wider"
                  placeholder="Code (e.g. J44.1)"
                />
                <input
                  type="text"
                  value={principalDesc}
                  onChange={(e) => setPrincipalDesc(e.target.value)}
                  className="col-span-2 px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-mcoa-amethyst text-xs text-gray-800"
                  placeholder="Clinical Diagnosis Description"
                />
              </div>
            </div>

            {/* Patient Demographics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-mcoa-midnight">
                  Patient Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono text-gray-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-mcoa-midnight">
                  Discharge Disposition
                </label>
                <select
                  value={dischargeStatus}
                  onChange={(e) => setDischargeStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                >
                  <option>Home / Self Care (01)</option>
                  <option>Skilled Nursing Facility (SNF) (03)</option>
                  <option>Home Health Care (06)</option>
                  <option>Hospice (40)</option>
                  <option>Expired (20)</option>
                </select>
              </div>
            </div>

            {/* Secondary Diagnoses with CC / MCC & POA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-mcoa-midnight block">
                    Secondary Diagnoses (Comorbidities & Complications)
                  </label>
                  <span className="text-[10px] text-gray-500">
                    POA = Present on Admission. (Only POA = 'Y' conditions elevate MS-DRG severity).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddSecondary}
                  className="text-[11px] font-bold text-mcoa-amethyst hover:text-mcoa-midnight flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Diagnosis</span>
                </button>
              </div>

              <div className="space-y-2">
                {secondaryList.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-12 gap-2 items-center text-xs"
                  >
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={sec.code}
                        onChange={(e) => handleUpdateSecondary(sec.id, "code", e.target.value.toUpperCase())}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 font-mono font-bold text-xs"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={sec.description}
                        onChange={(e) => handleUpdateSecondary(sec.id, "description", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={sec.severity}
                        onChange={(e) => handleUpdateSecondary(sec.id, "severity", e.target.value as any)}
                        className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-bold ${
                          sec.severity === "MCC"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : sec.severity === "CC"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        <option value="MCC">MCC</option>
                        <option value="CC">CC</option>
                        <option value="None">Non-CC</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <select
                        value={sec.poa}
                        onChange={(e) => handleUpdateSecondary(sec.id, "poa", e.target.value as any)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-[11px] font-semibold"
                        title="Present on Admission (Y, N, U, W, 1)"
                      >
                        <option value="Y">POA: Y</option>
                        <option value="N">POA: N (HAC)</option>
                        <option value="U">POA: U</option>
                        <option value="W">POA: W</option>
                      </select>
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveSecondary(sec.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inpatient Surgical Procedures (ICD-10-PCS) */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-mcoa-midnight block">
                Inpatient Surgical Procedures (ICD-10-PCS)
              </label>

              <div className="space-y-2">
                {procedureList.map((proc) => (
                  <div
                    key={proc.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-mcoa-midnight bg-white px-2.5 py-1 rounded border border-gray-200">
                        {proc.code}
                      </span>
                      <span className="text-gray-700 font-medium text-[11px]">
                        {proc.description}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          proc.isSurgicalOR
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {proc.isSurgicalOR ? "Operating Room (OR)" : "Non-OR Procedure"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculated MS-DRG Output (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-mcoa-midnight to-mcoa-amethyst text-white rounded-3xl p-6 sm:p-7 shadow-royal space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-gold font-montserrat">
                  Calculated Inpatient MS-DRG
                </span>
                <div className="text-3xl font-extrabold font-mono text-white mt-1">
                  MS-DRG {drgResult.drgNumber}
                </div>
                <div className="text-sm font-bold text-white/95 mt-1 leading-snug">
                  {drgResult.drgTitle}
                </div>
              </div>

              {/* Key Grouping Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/70 uppercase font-bold flex items-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-mcoa-gold" />
                    <span>Relative Weight (RW)</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-white mt-1">
                    {drgResult.relativeWeight.toFixed(4)}
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="text-[10px] text-white/70 uppercase font-bold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-mcoa-gold" />
                    <span>GMLOS (Days)</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-white mt-1">
                    {drgResult.gmlos} Days
                  </div>
                </div>
              </div>

              {/* Reimbursement Calculation Demonstration */}
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-mcoa-gold font-montserrat">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Estimated Hospital Payment:</span>
                  </div>
                  <span className="font-mono text-base text-white">
                    ${drgResult.estimatedHospitalPayment.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                  Calculation: ${6850} Base Rate × {drgResult.relativeWeight.toFixed(4)} RW = ${drgResult.estimatedHospitalPayment.toLocaleString()}
                </p>
              </div>

              {/* Grouping Logic Decision Tree */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-white font-montserrat text-xs flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-mcoa-gold" />
                  <span>UHDDS Grouping Tree Steps:</span>
                </div>
                <div className="bg-black/20 p-3.5 rounded-xl border border-white/10 space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">1. MDC Assigned:</span>
                    <span className="text-white font-bold">{drgResult.mdc.split(":")[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">2. Partition:</span>
                    <span className="text-white font-bold">{drgResult.partition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">3. Secondary Severity:</span>
                    <span className="text-white font-bold">
                      {drgResult.hasMCC ? "MCC Present (Tier 1)" : drgResult.hasCC ? "CC Present (Tier 2)" : "No CC/MCC"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">4. Final Assigned DRG:</span>
                    <span className="text-mcoa-gold font-bold">MS-DRG {drgResult.drgNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Disclaimer */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">Academic Notice:</span> This MS-DRG Practice Simulator is an instructional tool created by MCOA for CCS® exam prep candidates. It uses public CMS MS-DRG logic and does not replace official CMS Medicare Code Editor (MCE) software or proprietary 3M / Optum groupers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
