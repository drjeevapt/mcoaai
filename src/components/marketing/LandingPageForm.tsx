'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  landingPageId: string;
  landingSlug: string;
  ctaText: string;
  targetBranch: string;
}

export default function LandingPageForm({ landingPageId, landingSlug, ctaText, targetBranch }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    education: 'Life Sciences',
    preferredMode: 'Online Live Interactive',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setError('Please fill all mandatory fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Submit lead to CRM API
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          education: formData.education,
          source: `landing_page_${landingSlug}`,
          notes: `Lead from landing page ${landingSlug} (Target Branch: ${targetBranch}, Mode: ${formData.preferredMode})`
        })
      });

      if (!res.ok) {
        throw new Error('Failed to register inquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please call +91 8072020716 directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#D8AC55] text-slate-800 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-cinzel text-2xl font-bold text-[#211747]">Inquiry Confirmed!</h3>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Thank you, <span className="font-semibold text-[#211747]">{formData.name}</span>. Your seat registration and 2026 syllabus package have been dispatched to your email & WhatsApp.
        </p>
        <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-[#211747] text-left space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D8AC55]" /> Priority Counselor Consultation
          </div>
          <p className="text-slate-600">
            A Senior Counselor from MCOA {targetBranch} will contact you shortly at <span className="font-semibold text-slate-900">{formData.phone}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800 relative">
      <div className="absolute -top-3.5 right-6 bg-[#D8AC55] text-[#211747] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
        Fast-Track Pass
      </div>

      <div className="mb-6">
        <h3 className="font-cinzel text-2xl font-bold text-[#211747]">Reserve Your Seat</h3>
        <p className="text-xs text-slate-500 mt-1">
          Download 2026 Syllabus & secure early-bird scholarship pricing.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Dr. Priya Rajan / Sneha R"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#50458F] focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Mobile *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9876543210"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#50458F] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#50458F] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Educational Background</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#50458F] focus:bg-white"
            >
              <option value="Life Sciences">B.Sc / M.Sc Life Sciences</option>
              <option value="Nursing">Nursing (B.Sc / GNM)</option>
              <option value="Pharmacy">Pharmacy (B.Pharm / D.Pharm)</option>
              <option value="Biotechnology">Biotechnology / Microbiology</option>
              <option value="Physiotherapy">Physiotherapy (BPT)</option>
              <option value="Dental">Dental (BDS)</option>
              <option value="Other">Other Degree / Working Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Training Mode</label>
            <select
              value={formData.preferredMode}
              onChange={(e) => setFormData({ ...formData, preferredMode: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#50458F] focus:bg-white"
            >
              <option value="Online Live Interactive">Online Live Interactive</option>
              <option value="Chennai Campus Classroom">Chennai Campus Classroom</option>
              <option value="Perambalur Campus">Perambalur Campus</option>
              <option value="Coimbatore Campus">Coimbatore Campus</option>
              <option value="Karaikudi Campus">Karaikudi Campus</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-[#211747] to-[#50458F] text-[#D8AC55] hover:text-white py-3.5 px-4 rounded-xl font-montserrat font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border border-[#D8AC55]/30 disabled:opacity-50"
        >
          {loading ? (
            <span>Processing Reservation...</span>
          ) : (
            <>
              <span>{ctaText}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strictly Zero Spam. 100% Privacy Protected.</span>
        </div>
      </form>
    </div>
  );
}
