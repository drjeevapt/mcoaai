"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Laptop,
  Calculator,
  Building2,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

const CATEGORIES = ["ALL", "ICD-10-CM", "CPT Surgery", "E&M", "MS-DRG"];

export default function PracticeSimulatorPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const url = selectedCategory === "ALL" ? "/api/practice/cases" : `/api/practice/cases?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setCases(data.cases);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, [selectedCategory]);

  return (
    <div className="bg-mcoa-pearl/30 min-h-screen py-12 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-mcoa-amethyst font-montserrat">
            Hands-on Chart Auditing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-mcoa-midnight font-montserrat">
            Medical Coding Practice Simulator
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Practice on authentic de-identified clinical charts authored by Dr. Jeevanantham's faculty. Master diagnosis sequencing, CPT modifier logic, E&M MDM calculations, and inpatient DRG grouping.
          </p>
        </div>

        {/* Specialized Coding Tools Suite Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/practice/em-calculator"
            className="bg-white p-5 rounded-2xl border border-mcoa-gold/50 hover:border-mcoa-gold hover:shadow-gold transition flex items-start space-x-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-mcoa-gold flex items-center justify-center shrink-0 group-hover:bg-mcoa-midnight transition">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-sm text-mcoa-midnight">
                E&M Calculator
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                MDM Grid & Time-based selection (AMA 2023).
              </div>
            </div>
          </Link>

          <Link
            href="/practice/drg-simulator"
            className="bg-white p-5 rounded-2xl border border-mcoa-amethyst/30 hover:border-mcoa-amethyst hover:shadow-royal transition flex items-start space-x-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-mcoa-pearl text-mcoa-amethyst flex items-center justify-center shrink-0 group-hover:bg-mcoa-midnight group-hover:text-mcoa-gold transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-sm text-mcoa-midnight">
                DRG Practice Grouper
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Principal Dx, CC/MCC logic & relative weights.
              </div>
            </div>
          </Link>

          <Link
            href="/practice/references"
            className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-mcoa-amethyst hover:shadow-sm transition flex items-start space-x-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-mcoa-midnight group-hover:text-white transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-sm text-mcoa-midnight">
                Coding Reference Tool
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                ICD-10-CM 2026, CPT range preview & modifiers.
              </div>
            </div>
          </Link>

          <Link
            href="/mock-exams"
            className="bg-gradient-to-br from-mcoa-midnight to-mcoa-amethyst text-white p-5 rounded-2xl shadow-royal transition flex items-start space-x-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 text-mcoa-gold flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-sm text-white flex items-center space-x-1">
                <span>AAPC Mock Exam</span>
                <Sparkles className="w-3.5 h-3.5 text-mcoa-gold" />
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                Timed 100-pt simulation with weak-area analysis.
              </div>
            </div>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-mcoa-amethyst" />
            <span className="text-xs font-bold text-mcoa-midnight font-montserrat uppercase tracking-wider">
              Filter By Discipline:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-mcoa-midnight text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-mcoa-pearl hover:text-mcoa-amethyst"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-gray-200/90 hover:border-mcoa-gold/60 shadow-sm hover:shadow-royal transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-mcoa-pearl text-mcoa-amethyst border border-mcoa-lavender/30">
                    {c.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {c.specialty}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.difficulty === "Beginner"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.difficulty === "Intermediate"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {c.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-montserrat font-bold text-base text-mcoa-midnight leading-snug">
                  {c.title}
                </h3>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-[11px] font-mono text-gray-700 line-clamp-3 leading-relaxed whitespace-pre-line">
                  {c.clinicalChart}
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Full Answer Key & Guideline Citation
                </span>

                <Link
                  href={`/practice/${c.slug}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center space-x-1.5"
                >
                  <span>Solve Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
