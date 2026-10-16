"use client";

import Link from "next/link";
import { ShieldCheck, Award, Users, MapPin, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { LeadCaptureForm } from "@/components/common/LeadCaptureForm";

export function Hero() {
  return (
    <section className="relative overflow-hidden royal-gradient text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative background glow & mesh circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-mcoa-lavender/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-mcoa-gold/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition & Academy Positioning */}
          <div className="lg:col-span-7 space-y-6">
            {/* Super Header Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-mcoa-gold/40 px-3.5 py-1.5 rounded-full text-xs font-montserrat tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-mcoa-gold animate-pulse" />
              <span className="text-white font-medium">South India's Most Trusted Medical Coding Academy</span>
              <span className="bg-mcoa-gold text-mcoa-midnight font-bold px-1.5 py-0.2 rounded text-[10px]">
                Admissions Open
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-tight font-montserrat">
              Empowering Healthcare Professionals.{" "}
              <span className="block gold-gradient-text font-cinzel pt-2">
                Building Successful Careers.
              </span>
            </h1>

            {/* Subtitle with Founder Attribution */}
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-inter max-w-2xl">
              Transform your life sciences, nursing, pharmacy, or medical degree into a high-growth international healthcare IT career. Master AAPC CPC®, AHIMA CCS®, and CRC® with rigorous chart simulators guided personally by{" "}
              <strong className="text-mcoa-gold font-semibold">Dr. Jeevanantham Mariappan</strong>.
            </p>

            {/* Value Highlights Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15 flex items-center space-x-2.5">
                <Award className="w-5 h-5 text-mcoa-gold shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">94%+</div>
                  <div className="text-[11px] text-white/70">1st Attempt Pass Rate</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15 flex items-center space-x-2.5">
                <Users className="w-5 h-5 text-mcoa-lavender shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">100%</div>
                  <div className="text-[11px] text-white/70">Placement Assistance</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15 flex items-center space-x-2.5 col-span-2 sm:col-span-1">
                <MapPin className="w-5 h-5 text-mcoa-gold shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">4 Campuses</div>
                  <div className="text-[11px] text-white/70">Chennai, Perambalur, CBE, KKD</div>
                </div>
              </div>
            </div>

            {/* Key Assurance Checklist */}
            <div className="pt-2 flex flex-wrap gap-y-2 gap-x-4 text-xs text-white/80">
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-mcoa-gold" />
                <span>Original Synthetic Chart Practice</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-mcoa-gold" />
                <span>Live Interactive & Classroom Flex</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-mcoa-gold" />
                <span>Dedicated Mock Exam Engine</span>
              </span>
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center space-x-2"
              >
                <span>Explore All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/founder"
                className="px-6 py-3.5 rounded-xl text-xs font-bold tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center space-x-2"
              >
                <span>Meet Dr. Jeevanantham</span>
              </Link>
            </div>
          </div>

          {/* Right Column: High-Conversion Lead Capture Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border-2 border-mcoa-gold/30 relative text-mcoa-slate">
              <div className="absolute -top-3.5 left-6 bg-mcoa-midnight text-mcoa-gold text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-mcoa-gold/50 shadow-sm flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Priority Admissions Portal</span>
              </div>

              <div className="mb-4 pt-1">
                <h3 className="font-montserrat font-bold text-xl text-mcoa-midnight">
                  Book Free Demo & Counseling
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Get personalized eligibility evaluation, syllabus brochure, and schedule your live session with Dr. Jeevanantham's faculty.
                </p>
              </div>

              <LeadCaptureForm sourceContext="Homepage Hero Card" compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
