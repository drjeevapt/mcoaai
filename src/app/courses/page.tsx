"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES_DATA } from "@/data/courses";
import { CourseCategory } from "@/types";
import { Clock, Award, GraduationCap, ArrowRight, Search } from "lucide-react";

const CATEGORIES: ("All" | CourseCategory)[] = [
  "All",
  "Certification Prep",
  "Medical Coding",
  "Specialty Coding",
  "Billing & Compliance",
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | CourseCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.certificationTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-mcoa-pearl/30 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-mcoa-amethyst font-montserrat">
            Curriculum & Programs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-mcoa-midnight mt-1 font-montserrat">
            Comprehensive Course Catalog
          </h1>
          <p className="text-sm text-gray-600 mt-2 font-inter">
            Explore international medical coding, clinical auditing, and revenue cycle programs certified by AAPC and AHIMA standards.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-mcoa-midnight text-white"
                    : "text-gray-600 hover:bg-mcoa-pearl hover:text-mcoa-amethyst"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search courses or certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-mcoa-slate outline-none focus:bg-white focus:ring-2 focus:ring-mcoa-amethyst transition"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-200/80 hover:border-mcoa-gold/60 shadow-sm hover:shadow-royal transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-mcoa-pearl text-mcoa-amethyst border border-mcoa-lavender/30">
                    {course.category}
                  </span>
                  <span className="text-[11px] font-semibold text-mcoa-gold flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{course.certificationTrack}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-mcoa-midnight font-montserrat leading-snug">
                  {course.title}
                </h2>

                <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {course.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-mcoa-amethyst shrink-0" />
                    <span><strong>Duration:</strong> {course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-3.5 h-3.5 text-mcoa-gold shrink-0" />
                    <span><strong>Track:</strong> {course.certificationTrack}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {course.discountFeeInr && (
                    <div className="text-[10px] text-gray-400 line-through">
                      ₹{course.feeInr.toLocaleString("en-IN")}
                    </div>
                  )}
                  <div className="text-base font-bold text-mcoa-midnight font-montserrat">
                    ₹{(course.discountFeeInr || course.feeInr).toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold text-mcoa-midnight bg-white border border-gray-300 hover:border-mcoa-amethyst hover:text-mcoa-amethyst transition flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/apply?course=${course.slug}`}
                    className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-sm"
                  >
                    Enroll
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-500 font-medium">No courses found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-bold text-mcoa-amethyst hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
