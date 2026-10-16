"use client";

import Image from "next/image";
import { Award, Printer, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

export default function StudentCertificatesPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
            Accreditation & Credentials
          </span>
          <h1 className="text-2xl font-bold font-montserrat text-mcoa-midnight mt-0.5">
            Verified Academy Completion Certificate
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Official certificate of competency issued by Medical Coding Officers Academy under Dr. Jeevanantham Mariappan.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition flex items-center space-x-2 shadow-gold"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download Certificate</span>
        </button>
      </div>

      {/* Official Certificate Presentation Canvas */}
      <div className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-mcoa-gold shadow-2xl max-w-4xl mx-auto relative overflow-hidden text-center space-y-6">
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Image
            src="/mcoa-logo.png"
            alt="Watermark"
            width={600}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Certificate Top Header */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <Image
              src="/mcoa-logo.png"
              alt="MCOA Official Logo"
              width={260}
              height={70}
              className="object-contain h-14 w-auto"
            />
          </div>

          <div className="text-[11px] font-bold uppercase tracking-widest text-mcoa-gold font-montserrat pt-2">
            Certificate of Professional Competency & Excellence
          </div>
        </div>

        {/* Recipient Statement */}
        <div className="space-y-3 pt-4">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-montserrat">
            This is to certify that
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-mcoa-midnight border-b-2 border-mcoa-gold/60 inline-block pb-1 px-8">
            Sneha Ramachandran
          </h2>

          <div className="text-xs text-gray-500 font-mono">
            Student Identification Number: <strong>MCOA-2026-CHN-0082</strong>
          </div>
        </div>

        {/* Achievement Text */}
        <div className="max-w-2xl mx-auto space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-inter">
          <p>
            has successfully completed the comprehensive professional curriculum in
          </p>

          <h3 className="text-lg sm:text-xl font-bold font-montserrat text-mcoa-midnight">
            Advanced Medical Coding Masterclass
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed max-w-xl mx-auto">
            demonstrating verified proficiency in Medical Terminology, Human Anatomy & Physiology, ICD-10-CM Diagnosis Coding, CPT Procedural Coding, HCPCS Level II, and Synthetic Clinical Chart Auditing aligned with international AAPC and AHIMA professional certification standards.
          </p>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-10 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          {/* Signature 1 */}
          <div className="space-y-1 text-center">
            <div className="font-cinzel font-bold text-xs text-mcoa-midnight border-b border-gray-400 pb-1 max-w-[180px] mx-auto">
              Dr. Rajesh Kannan, CPC
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              Senior Academic Instructor
            </div>
          </div>

          {/* Official Academy Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-double border-mcoa-gold bg-mcoa-pearl flex flex-col items-center justify-center text-mcoa-gold shadow-md">
              <Award className="w-8 h-8 text-mcoa-gold" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-mcoa-midnight mt-0.5">
                MCOA SEAL
              </span>
            </div>
            <div className="text-[9px] text-gray-400 mt-1 font-mono">
              VERIFIED ID: MCOA-CERT-2026-0082
            </div>
          </div>

          {/* Signature 2 */}
          <div className="space-y-1 text-center">
            <div className="font-cinzel font-bold text-xs text-mcoa-midnight border-b border-gray-400 pb-1 max-w-[180px] mx-auto">
              Dr. Jeevanantham Mariappan
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
              Founder & Chief Executive Officer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
