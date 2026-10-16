import { notFound } from "next/navigation";
import Link from "next/link";
import { COURSES_DATA } from "@/data/courses";
import { LeadCaptureForm } from "@/components/common/LeadCaptureForm";
import { Clock, Award, GraduationCap, CheckCircle2, ChevronRight, HelpCircle, Download } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return COURSES_DATA.map((course) => ({
    slug: course.slug,
  }));
}

export default function CourseDetailPage({ params }: PageProps) {
  const course = COURSES_DATA.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Course Hero Banner */}
      <section className="royal-gradient text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/courses" className="hover:text-white transition">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-mcoa-gold font-medium truncate">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-mcoa-gold border border-mcoa-gold/30">
                <Award className="w-3.5 h-3.5" />
                <span>{course.certificationTrack}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-montserrat leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-inter">
                {course.summary}
              </p>

              {/* Badges bar */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <div className="bg-white/10 px-3.5 py-2 rounded-lg flex items-center space-x-2 border border-white/10">
                  <Clock className="w-4 h-4 text-mcoa-gold" />
                  <span>Duration: <strong>{course.duration}</strong></span>
                </div>
                <div className="bg-white/10 px-3.5 py-2 rounded-lg flex items-center space-x-2 border border-white/10">
                  <GraduationCap className="w-4 h-4 text-mcoa-lavender" />
                  <span>Track: <strong>{course.certificationTrack}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Price Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white space-y-3">
              <span className="text-xs uppercase tracking-wider text-white/70">Academy Enrollment Fee</span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold font-montserrat text-mcoa-gold">
                  ₹{(course.discountFeeInr || course.feeInr).toLocaleString("en-IN")}
                </span>
                {course.discountFeeInr && (
                  <span className="text-sm text-white/60 line-through">
                    ₹{course.feeInr.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/80">
                * Includes original practice charts, mock test bank access, syllabus PDF, and placement assistance.
              </p>
              <a
                href="#enroll-card"
                className="block text-center w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold"
              >
                Inquire & Enroll
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Grid */}
      <section className="py-14 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Syllabus, Eligibility, Modes, FAQs */}
            <div className="lg:col-span-7 space-y-10">
              {/* About Course */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80 space-y-4">
                <h2 className="text-xl font-bold text-mcoa-midnight font-montserrat">
                  Program Overview
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed font-inter">
                  {course.description}
                </p>
              </div>

              {/* Complete Syllabus Modules */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-mcoa-midnight font-montserrat">
                    Curriculum & Syllabus Modules
                  </h2>
                  <span className="text-xs font-semibold text-mcoa-amethyst">
                    {course.syllabus.length} Core Modules
                  </span>
                </div>

                <div className="space-y-4">
                  {course.syllabus.map((mod, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl p-5 hover:border-mcoa-amethyst/50 transition bg-mcoa-pearl/20"
                    >
                      <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight mb-3">
                        {mod.moduleTitle}
                      </h3>
                      <ul className="space-y-2 text-xs text-gray-600">
                        {mod.topics.map((t, tIdx) => (
                          <li key={tIdx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility & Training Modes */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-mcoa-midnight font-montserrat mb-3">
                    Who Is Eligible?
                  </h2>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {course.eligibility.map((el, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-mcoa-gold shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight mb-2">
                    Available Learning Modes
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {course.trainingModes.map((mode, i) => (
                      <span
                        key={i}
                        className="bg-mcoa-pearl px-3 py-1.5 rounded-lg border border-mcoa-lavender/30 text-mcoa-amethyst font-semibold"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80 space-y-4">
                <h2 className="text-xl font-bold text-mcoa-midnight font-montserrat">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {course.faqs.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-start space-x-2 text-xs font-bold text-mcoa-midnight font-montserrat">
                        <HelpCircle className="w-4 h-4 text-mcoa-amethyst shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Lead Form & Counselor Contact */}
            <div id="enroll-card" className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl shadow-royal p-6 sm:p-7 border border-mcoa-gold/40">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
                    Fast Admissions Desk
                  </span>
                  <h3 className="text-lg font-bold text-mcoa-midnight font-montserrat mt-0.5">
                    Enroll or Request Detailed Syllabus PDF
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Fill the form below to receive the complete {course.title} prospectus and fee installment plan.
                  </p>
                </div>

                <LeadCaptureForm
                  defaultCourseSlug={course.slug}
                  sourceContext={`Course Page: ${course.title}`}
                  compact
                />
              </div>

              {/* Direct Branch Counselor Assist Card */}
              <div className="bg-mcoa-midnight text-white p-5 rounded-2xl border border-mcoa-amethyst/30 space-y-2 text-xs">
                <div className="font-bold font-montserrat text-mcoa-gold text-sm">
                  Speak Directly with Dr. Jeevanantham's Team
                </div>
                <p className="text-white/80">
                  Have questions about your qualification or batch schedules at Chennai, Perambalur, Coimbatore, or Karaikudi?
                </p>
                <div className="pt-2">
                  <a
                    href="tel:+918072020716"
                    className="inline-block text-xs font-bold text-mcoa-midnight bg-mcoa-gold px-4 py-2 rounded-lg hover:bg-[#e0b760] transition"
                  >
                    Direct Helpline: +91 8072020716
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
