import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckCircle2, Star, ShieldCheck, Clock, Award, Users, ArrowRight, MapPin, PhoneCall, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import LandingPageForm from '@/components/marketing/LandingPageForm';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await prisma.landingPage.findUnique({
    where: { slug: params.slug }
  });

  if (!page) {
    return { title: 'Special Program | Medical Coding Officers Academy' };
  }

  return {
    title: `${page.title}`,
    description: page.metaDescription,
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      siteName: 'Medical Coding Officers Academy (MCOA)'
    }
  };
}

export default async function DynamicLandingPage({ params }: Props) {
  const page = await prisma.landingPage.findUnique({
    where: { slug: params.slug }
  });

  if (!page || page.status !== 'Published') {
    notFound();
  }

  // Increment views count silently
  try {
    await prisma.landingPage.update({
      where: { id: page.id },
      data: { viewsCount: { increment: 1 } }
    });
  } catch (e) {
    // ignore
  }

  let sections: any = {};
  try {
    sections = JSON.parse(page.sectionsJson || '{}');
  } catch (e) {
    sections = {};
  }

  const highlights = sections.highlights || [];
  const curriculum = sections.curriculumPreview || [];
  const stats = sections.stats || [];
  const testimonials = sections.testimonials || [];
  const faq = sections.faq || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Urgency Header */}
      <div className="bg-[#211747] border-b border-[#D8AC55]/30 text-white text-xs py-2.5 px-4 text-center font-montserrat font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D8AC55]" />
        <span>Limited Batch Enrollment Open • Next Cohort Commences Monday</span>
        <span className="hidden sm:inline-block bg-[#D8AC55] text-[#211747] text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
          Scholarship Seats Active
        </span>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#211747] via-[#33256A] to-[#50458F] text-white py-16 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#D8AC55]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#9B85D3]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headlines & Value Props */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8AC55]/20 border border-[#D8AC55]/40 text-[#D8AC55] text-xs font-montserrat font-bold tracking-wide">
              <Award className="w-4 h-4 text-[#D8AC55]" />
              <span>{page.heroBadge}</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              {page.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-purple-100 font-inter leading-relaxed">
              {page.heroSubheadline}
            </p>

            {/* Target Campus Tag if available */}
            {page.targetBranch && (
              <div className="flex items-center gap-2 text-sm text-[#D8AC55] font-medium">
                <MapPin className="w-4 h-4" />
                <span>Primary Campus: {page.targetBranch}</span>
              </div>
            )}

            {/* Highlights list */}
            {highlights.length > 0 && (
              <div className="space-y-3 pt-2">
                {highlights.map((h: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D8AC55] shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-slate-100">{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Key Stats Bar */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-purple-400/20">
                {stats.map((s: any, idx: number) => (
                  <div key={idx} className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="text-xl sm:text-2xl font-bold font-montserrat text-[#D8AC55]">{s.value}</div>
                    <div className="text-[11px] text-purple-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: High-Converting Lead Capture Form */}
          <div className="lg:col-span-5">
            <LandingPageForm
              landingPageId={page.id}
              landingSlug={page.slug}
              ctaText={page.ctaText}
              targetBranch={page.targetBranch || 'Chennai Head Office'}
            />
          </div>
        </div>
      </section>

      {/* Curriculum Preview Section */}
      {curriculum.length > 0 && (
        <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[#50458F] font-montserrat">
              Structured Clinical Learning
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#211747] mt-2">
              Syllabus & Core Coding Competencies
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Designed and updated strictly per the 2026 CMS & AAPC Examination Guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum.map((c: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <span className="inline-block bg-purple-50 text-[#50458F] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {c.module}
                </span>
                <h3 className="font-montserrat font-bold text-base text-slate-900 leading-snug">
                  {c.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified Student Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-purple-50/50 border-y border-purple-100 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-[#50458F] font-montserrat">
                Real Student Stories
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#211747] mt-2">
                Certified & Placed at Top RCMs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-amber-400 mb-3">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-sm italic leading-relaxed">
                      "{t.comment}"
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="font-montserrat font-bold text-sm text-[#211747]">{t.name}</div>
                    <div className="text-xs text-[#50458F] font-medium">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {faq.length > 0 && (
        <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#211747]">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Everything you need to know about joining MCOA.
            </p>
          </div>

          <div className="space-y-4">
            {faq.map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="font-montserrat font-bold text-base text-slate-900 mb-2">
                  {item.q}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Emergency Help Banner */}
      <div className="bg-[#211747] text-white py-8 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-3">
          <h3 className="font-montserrat font-bold text-lg text-white">Have specific questions before applying?</h3>
          <p className="text-xs text-purple-200">
            Speak directly with our senior counseling team at the Chennai Head Office.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href="tel:+918072020716"
              className="inline-flex items-center gap-2 bg-[#D8AC55] text-[#211747] px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> Call +91 8072020716
            </a>
            <a
              href="https://wa.me/918072020716?text=Hi%20MCOA,%20I%20am%20inquiring%20about%20admissions"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-500 transition-colors"
            >
              WhatsApp Direct
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
