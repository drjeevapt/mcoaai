"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  ArrowLeft,
  Filter,
  Copy,
  Check,
  Bookmark,
  ShieldCheck,
  Info,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ReferenceEntry {
  code: string;
  category: "ICD-10-CM" | "CPT Ranges" | "HCPCS Level II" | "ICD-10-PCS" | "Modifiers";
  title: string;
  description: string;
  taxonomy: string;
  includesNotes?: string;
  excludesNotes?: string;
  facultyTip?: string;
}

const REFERENCE_DATA: ReferenceEntry[] = [
  // ICD-10-CM
  {
    code: "I21.4",
    category: "ICD-10-CM",
    title: "Non-ST elevation (NSTEMI) myocardial infarction",
    description: "Acute subendocardial myocardial infarction. Applies to initial acute MI within the 4-week window.",
    taxonomy: "Chapter 9: Diseases of the circulatory system (I00-I99) > Acute MI (I21)",
    includesNotes: "Includes non-Q wave MI, nontransmural MI, subendocardial infarction.",
    excludesNotes: "Excludes subsequent myocardial infarction within 4 weeks of initial MI (I22.-).",
    facultyTip: "Per OGCR I.C.9.e, if an NSTEMI evolves to a STEMI, assign STEMI code (I21.0-I21.3). If a STEMI converts to NSTEMI due to thrombolysis, still assign STEMI.",
  },
  {
    code: "E11.22",
    category: "ICD-10-CM",
    title: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    description: "Combination code capturing diabetes mellitus and renal manifestation.",
    taxonomy: "Chapter 4: Endocrine, nutritional and metabolic diseases (E00-E89)",
    includesNotes: "Code also stage of chronic kidney disease (N18.1-N18.6).",
    excludesNotes: "Type 1 diabetes with CKD (E10.22).",
    facultyTip: "Under ICD-10-CM guidelines, 'with' implies a causal relationship unless documentation explicitly states otherwise. Always sequence the diabetic CKD code before the CKD stage code.",
  },
  {
    code: "J44.1",
    category: "ICD-10-CM",
    title: "Chronic obstructive pulmonary disease with (acute) exacerbation",
    description: "Decompensated chronic obstructive pulmonary disease requiring acute medical intervention.",
    taxonomy: "Chapter 10: Diseases of the respiratory system (J00-J99)",
    includesNotes: "COPD with acute bronchitis.",
    excludesNotes: "COPD with acute lower respiratory infection (J44.0).",
    facultyTip: "If acute respiratory failure is also documented, verify whether acute respiratory failure or acute COPD exacerbation is sequenced as principal diagnosis based on UHDDS guidelines.",
  },
  {
    code: "M23.221",
    category: "ICD-10-CM",
    title: "Derangement of meniscus due to old tear or injury, right knee",
    description: "Chronic or non-traumatic derangement of the posterior horn of medial meniscus, right knee.",
    taxonomy: "Chapter 13: Diseases of the musculoskeletal system (M00-M99)",
    facultyTip: "Distinguish between acute traumatic meniscal tears (S83.2-) and chronic/degenerative derangements (M23.-).",
  },

  // CPT Ranges
  {
    code: "10004–10021",
    category: "CPT Ranges",
    title: "Fine Needle Aspiration (FNA) Biopsies",
    description: "Surgical excision and aspiration with or without ultrasound, fluoroscopic, CT, or MR imaging guidance.",
    taxonomy: "Integumentary System > General Surgical Procedures",
    facultyTip: "FNA codes are reported per lesion, not per pass. Select codes based on whether imaging guidance was utilized and documented in the operative record.",
  },
  {
    code: "29880–29881",
    category: "CPT Ranges",
    title: "Knee Arthroscopy with Meniscectomy",
    description: "Arthroscopic surgical excision of medial and/or lateral meniscus including any debridement/chondroplasty in the same compartment.",
    taxonomy: "Musculoskeletal System > Endoscopy/Arthroscopy",
    facultyTip: "Report 29881 for single compartment (medial or lateral) and 29880 for both medial AND lateral compartments. Always append anatomical modifier (RT, LT, or 50).",
  },
  {
    code: "99202–99215",
    category: "CPT Ranges",
    title: "Office or Other Outpatient E&M Services",
    description: "Evaluation and management of new (99202-05) and established (99211-15) patients.",
    taxonomy: "Evaluation & Management Services",
    facultyTip: "Effective 2021/2023, code selection is governed strictly by Medical Decision Making (MDM 2-of-3 rule) or total provider encounter time. History and physical exam do not determine level.",
  },

  // HCPCS Level II
  {
    code: "A4253",
    category: "HCPCS Level II",
    title: "Blood glucose test or reagent strips for home blood glucose monitor, per 50 strips",
    description: "Durable medical equipment supply for home diabetic monitoring.",
    taxonomy: "Medical and Surgical Supplies (A0000-A9999)",
    facultyTip: "Subject to CMS Medicare Part B medical necessity quantity limits (100 strips/3 months for non-insulin treated, 300 strips/3 months for insulin treated).",
  },
  {
    code: "J1745",
    category: "HCPCS Level II",
    title: "Injection, infliximab, excludes biosimilar, 10 mg",
    description: "Monoclonal antibody immunosuppressive medication administered by intravenous infusion.",
    taxonomy: "Drugs Administered Other Than Oral Method (J0000-J9999)",
    facultyTip: "Always bill in correct billing units. If 400 mg is administered, report 40 units (400 mg / 10 mg per unit). Check for biosimilar Q-codes (Q5102, Q5103).",
  },

  // ICD-10-PCS Root Operations
  {
    code: "0DTJ0ZZ",
    category: "ICD-10-PCS",
    title: "Resection of Appendix, Percutaneous Endoscopic Approach",
    description: "Complete excision or removal of the appendix using laparoscopic surgical access.",
    taxonomy: "Medical and Surgical (0) > Gastrointestinal (D) > Resection (T) > Appendix (J)",
    facultyTip: "In ICD-10-PCS, total removal of a body part is always Root Operation 'Resection' (T), whereas partial removal of a body part is 'Excision' (B).",
  },
  {
    code: "02HV33Z",
    category: "ICD-10-PCS",
    title: "Insertion of Infusion Device into Superior Vena Cava, Percutaneous",
    description: "Placement of central venous catheter or port into great vein.",
    taxonomy: "Medical and Surgical (0) > Heart and Great Vessels (2) > Insertion (H)",
    facultyTip: "Verify the precise catheter tip location (Superior Vena Cava vs Right Atrium) from post-procedure fluoroscopy or chest radiography.",
  },

  // Modifiers
  {
    code: "Modifier 25",
    category: "Modifiers",
    title: "Significant, Separately Identifiable E&M Service on Same Day of Procedure",
    description: "Appended to an E&M code when a patient requires a distinct E&M evaluation on the same date a minor surgical procedure or injection was performed.",
    taxonomy: "CPT Modifier > E&M Unbundling",
    facultyTip: "Documentation must clearly show clinical decision-making and work above and beyond the usual preoperative and postoperative care associated with the minor procedure.",
  },
  {
    code: "Modifier 59",
    category: "Modifiers",
    title: "Distinct Procedural Service",
    description: "Identifies a procedure or service that was distinct or independent from other non-E&M services performed on the same day.",
    taxonomy: "CPT Modifier > NCCI Bypass",
    facultyTip: "CMS prefers the more specific 'X{EPSU}' subset modifiers (XE: Separate Encounter, XS: Separate Structure, XP: Separate Practitioner, XU: Unusual Non-Overlapping Service) when applicable.",
  },
  {
    code: "Modifier RT / LT",
    category: "Modifiers",
    title: "Right Side / Left Side Anatomical Modifiers",
    description: "HCPCS Level II anatomical modifiers used to identify bilateral or paired organs/structures.",
    taxonomy: "HCPCS Level II Modifier > Anatomical",
    facultyTip: "Mandatory for orthopedic, ophthalmology, podiatry, and musculoskeletal coding to prevent duplicate claim rejections.",
  },
];

export default function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    "ALL",
    "ICD-10-CM",
    "CPT Ranges",
    "HCPCS Level II",
    "ICD-10-PCS",
    "Modifiers",
  ];

  const filteredEntries = REFERENCE_DATA.filter((entry) => {
    const matchesCategory =
      selectedCategory === "ALL" || entry.category === selectedCategory;
    const matchesSearch =
      entry.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.taxonomy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
            DIGITAL CODING REFERENCE MANUAL (FY 2026 / AMA 2023)
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-mcoa-amethyst font-montserrat">
            Codebook Taxonomy & Guidelines
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-mcoa-midnight font-montserrat">
            Searchable Medical Coding Reference Manual
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Search standard diagnosis and procedure code structures, NCCI modifier conventions, includes/excludes notes, and instructional tips authored by Dr. Jeevanantham's faculty.
          </p>
        </div>

        {/* Licensing & Intellectual Property Notice */}
        <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Licensing & Regulatory Compliance Notice:</span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This reference tool provides educational summaries, public government coding classifications (CMS / NCHS ICD-10-CM / PCS, HCPCS Level II), and academic instructional guidance. CPT® is a registered trademark of the American Medical Association. Official CPT® codes and descriptions require appropriate AMA licensing and are not redistributed herein.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code (e.g. I21.4, 29881, 25), diagnosis, surgical approach, or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:border-mcoa-amethyst focus:ring-2 focus:ring-mcoa-pearl text-sm text-mcoa-midnight"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 text-gray-500 mr-2">
              <Filter className="w-3.5 h-3.5 text-mcoa-amethyst" />
              <span>Filter System:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  selectedCategory === cat
                    ? "bg-mcoa-midnight text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-mcoa-pearl hover:text-mcoa-amethyst"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing <span className="font-bold text-mcoa-midnight">{filteredEntries.length}</span> reference entries
            </span>
            <span>Version: FY 2026 Codebook Edition</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEntries.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-mcoa-amethyst/40 hover:shadow-royal transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-base font-extrabold text-mcoa-midnight bg-mcoa-pearl px-3 py-1 rounded-xl border border-mcoa-lavender/40">
                      {item.code}
                    </span>
                    <div>
                      <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
                        {item.title}
                      </h3>
                      <div className="text-[11px] text-gray-500 font-mono">
                        {item.taxonomy}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 uppercase">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleCopy(item.code)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition"
                      title="Copy Code"
                    >
                      {copiedCode === item.code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  {item.description}
                </p>

                {(item.includesNotes || item.excludesNotes) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                    {item.includesNotes && (
                      <div>
                        <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block">
                          Includes Notes:
                        </span>
                        <span className="text-gray-600 text-[11px]">{item.includesNotes}</span>
                      </div>
                    )}
                    {item.excludesNotes && (
                      <div>
                        <span className="font-bold text-rose-800 text-[11px] uppercase tracking-wider block">
                          Excludes Notes:
                        </span>
                        <span className="text-gray-600 text-[11px]">{item.excludesNotes}</span>
                      </div>
                    )}
                  </div>
                )}

                {item.facultyTip && (
                  <div className="bg-mcoa-pearl/40 rounded-xl p-3 border border-mcoa-lavender/30 text-xs flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-mcoa-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-mcoa-midnight font-montserrat text-[11px] uppercase tracking-wider">
                        Dr. Jeevanantham's Faculty Coding Insight:
                      </span>
                      <p className="text-gray-700 text-[11px] leading-relaxed mt-0.5 font-sans">
                        {item.facultyTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredEntries.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-500 space-y-2">
                <Search className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-bold text-sm text-mcoa-midnight">No matching reference entries found</p>
                <p className="text-xs text-gray-400">Try searching by category, root operation, or general keyword.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
