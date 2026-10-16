"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { LeadCaptureForm } from "@/components/common/LeadCaptureForm";

export function LeadInquiryModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating CTA Trigger Pill on bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-mcoa-gold hover:bg-[#e0b760] text-mcoa-midnight font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-full shadow-gold flex items-center space-x-2 transition transform hover:scale-105"
        aria-label="Book Free Demo"
      >
        <Sparkles className="w-4 h-4" />
        <span>Book Free Demo</span>
      </button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl relative border border-mcoa-gold/50">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-mcoa-midnight hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
                Medical Coding Officers Academy
              </span>
              <h3 className="text-xl font-bold text-mcoa-midnight font-montserrat mt-1">
                Book Free Demo & Profile Evaluation
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Speak directly with Dr. Jeevanantham's academic counselors. Receive syllabus PDF, batch schedule, and fee options.
              </p>
            </div>

            <LeadCaptureForm
              compact
              sourceContext="Floating Lead Modal"
              onSuccess={() => {
                setTimeout(() => setIsOpen(false), 3000);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
