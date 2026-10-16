"use client";

import { useState } from "react";
import { EDUCATION_BACKGROUNDS } from "@/types";
import { COURSES_DATA } from "@/data/courses";
import { BRANCHES_DATA } from "@/data/branches";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface LeadCaptureFormProps {
  defaultCourseSlug?: string;
  defaultBranchCode?: string;
  sourceContext?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export function LeadCaptureForm({
  defaultCourseSlug,
  defaultBranchCode,
  sourceContext = "Website Inquiry",
  compact = false,
  onSuccess,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    educationBackground: EDUCATION_BACKGROUNDS[0] as string,
    courseSlug: defaultCourseSlug || "advanced-medical-coding",
    branchCode: defaultBranchCode || "chennai-hq",
    mode: "Live Interactive Online",
    preferredBatch: "Weekend",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    // Simple client validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields (Name, Email, and Phone).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: sourceContext,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit inquiry. Please try again.");
      }

      setStatus("success");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please call +91 8072020716 directly.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 animate-fadeIn">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="font-montserrat font-bold text-lg text-emerald-900">
          Inquiry Successfully Received!
        </h3>
        <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
          Thank you, <strong>{formData.fullName}</strong>. An admissions counselor from our{" "}
          <strong>{BRANCHES_DATA.find((b) => b.id === formData.branchCode)?.name || "Academic"}</strong> team has been assigned and will call you within 2 business hours.
        </p>
        <div className="pt-2">
          <a
            href="tel:+918072020716"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-950 bg-emerald-200/80 hover:bg-emerald-300 px-4 py-2 rounded-lg transition"
          >
            <span>Need Urgent Assistance? Call: +91 8072020716</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-inter">
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-xs">{errorMessage}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Dr. Priya Rajan / Ramesh Kumar"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-sm text-mcoa-slate outline-none transition"
        />
      </div>

      {/* Grid: Email & Phone */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3`}>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="e.g. yourname@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-sm text-mcoa-slate outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Mobile / WhatsApp No. <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +91 98401 23456"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-sm text-mcoa-slate outline-none transition"
          />
        </div>
      </div>

      {/* Education Background */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Educational Background <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.educationBackground}
          onChange={(e) => setFormData({ ...formData, educationBackground: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-xs text-mcoa-slate outline-none transition"
        >
          {EDUCATION_BACKGROUNDS.map((edu) => (
            <option key={edu} value={edu}>
              {edu}
            </option>
          ))}
        </select>
      </div>

      {/* Course & Branch */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3`}>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Program of Interest</label>
          <select
            value={formData.courseSlug}
            onChange={(e) => setFormData({ ...formData, courseSlug: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-xs text-mcoa-slate outline-none transition"
          >
            {COURSES_DATA.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Preferred Academy Campus</label>
          <select
            value={formData.branchCode}
            onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-xs text-mcoa-slate outline-none transition"
          >
            {BRANCHES_DATA.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode & Batch Preference */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3`}>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Training Mode</label>
          <select
            value={formData.mode}
            onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-xs text-mcoa-slate outline-none transition"
          >
            <option value="Live Interactive Online">Live Interactive Online (Any Location)</option>
            <option value="Classroom Offline">Classroom Offline (At Chosen Campus)</option>
            <option value="Hybrid Flex">Hybrid Flex (Weekend Classroom + Online)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Preferred Batch Timing</label>
          <select
            value={formData.preferredBatch}
            onChange={(e) => setFormData({ ...formData, preferredBatch: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-mcoa-amethyst focus:border-mcoa-amethyst text-xs text-mcoa-slate outline-none transition"
          >
            <option value="Weekend (Saturday & Sunday)">Weekend (Saturday & Sunday)</option>
            <option value="Weekday Regular (Mon - Fri)">Weekday Regular (Mon - Fri)</option>
            <option value="Evening Fast-Track (Working Pros)">Evening Fast-Track (Working Pros)</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] shadow-gold flex items-center justify-center space-x-2 transition transform active:scale-[0.99] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting to Admissions Desk...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Book Free Demo & Get Syllabus PDF</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-500 text-center">
        🔒 Confidential. Your information is protected under MCOA privacy standards. No spam.
      </p>
    </form>
  );
}
