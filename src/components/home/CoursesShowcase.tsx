"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES_DATA } from "@/data/courses";
import { CourseCategory } from "@/types";
import { GraduationCap, Clock, Award, ArrowRight, CheckCircle2 } from "lucide-react";

const CATEGORIES: ("All" | CourseCategory)[] = [
  "All",
  "Certification Prep",
  "Medical Coding",
  "Specialty Coding",
  "Billing & Compliance",
];

export function CoursesShowcase() {
  const [activeCategory, setActiveCategory] = useState<"All" | CourseCategory>("All");

  const filteredCourses =
    activeCategory === "All"
      ? COURSES_DATA
      : COURSES_DATA.filter((c) => c.category === activeCategory);

  return (
    <section className="py-20 bg-mcoa-pearl/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-mcoa-amethyst font-montserrat">
            Industry-Approved Curriculum
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mcoa-midnight mt-2 font-montserrat">
            International Certification & Career Programs
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 font-inter">
            Engineered strictly for life sciences and healthcare graduates. Every course combines theoretical guidelines, real chart auditing, and AAPC / AHIMA mock examinations.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-mcoa-midnight text-white shadow-md"
                    : "bg-white text-mcoa-slate border border-gray-200 hover:border-mcoa-amethyst hover:text-mcoa-amethyst"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-200/80 hover:border-mcoa-gold/60 shadow-sm hover:shadow-royal transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Badge */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-mcoa-pearl text-mcoa-amethyst border border-mcoa-lavender/30">
                    {course.category}
                  </span>
                  <span className="text-[11px] font-semibold text-mcoa-gold flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{course.certificationTrack}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-mcoa-midnight font-montserrat group-hover:text-mcoa-amethyst transition leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {course.summary}
                </p>

                {/* Key Course Attributes */}
                <div className="mt-5 space-y-2 border-t border-b border-gray-100 py-3 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-mcoa-amethyst shrink-0" />
                    <span>
                      <strong>Duration:</strong> {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-mcoa-gold shrink-0" />
                    <span>
                      <strong>Target:</strong> {course.certificationTrack}
                    </span>
                  </div>
                </div>

                {/* Key Outcomes Checklist */}
                <div className="mt-4 space-y-1.5 text-[11px] text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Original chart reviews & mock test bank</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% Placement assistance & interview drills</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Fees & Action Buttons */}
              <div className="p-6 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-gray-500 line-through">
                    ₹{course.feeInr.toLocaleString("en-IN")}
                  </div>
                  <div className="text-lg font-bold text-mcoa-midnight font-montserrat">
                    ₹{(course.discountFeeInr || course.feeInr).toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-4 py-2.5 rounded-lg text-xs font-bold text-mcoa-midnight bg-white border border-gray-300 hover:border-mcoa-amethyst hover:text-mcoa-amethyst transition flex items-center space-x-1"
                  >
                    <span>Syllabus</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/apply?course=${course.slug}`}
                    className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-sm"
                  >
                    Enroll
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-white rounded-2xl p-6 sm:p-8 border border-mcoa-gold/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold text-mcoa-midnight font-montserrat">
              Not sure which certification is best for your background?
            </h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Speak directly with our senior academic counselors for a free 1-on-1 profile evaluation.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="tel:+918072020716"
              className="px-5 py-3 rounded-lg text-xs font-bold border border-mcoa-midnight text-mcoa-midnight hover:bg-mcoa-pearl transition"
            >
              Call +91 8072020716
            </a>
            <Link
              href="/apply"
              className="px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold"
            >
              Get Free Counseling
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
