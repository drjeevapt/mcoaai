"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Award,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function StudentPlacementsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const loadPlacements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/placements");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const handleApply = async (jobId: string, companyName: string) => {
    try {
      setApplyingJobId(jobId);
      const res = await fetch("/api/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          notes: "Certified candidate application submitted via MCOA LMS Student Portal.",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAppliedMsg(`Application submitted to ${companyName}! Confirmation sent via WhatsApp.`);
        loadPlacements();
      } else {
        alert(json.error || "Failed to submit application");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    } finally {
      setApplyingJobId(null);
    }
  };

  const jobs = data?.jobs || [];
  const myApplications = data?.myApplications || [];

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center font-inter">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-mcoa-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-mcoa-midnight">Loading Placement Opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-widest font-montserrat">
            Career & Placement Assistance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-mcoa-midnight font-montserrat">
            Corporate Healthcare RCM Job Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Exclusive job vacancies for MCOA certified trainees with Omega, Access, Episource, and leading healthcare IT companies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/student/analytics"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Readiness Index: 82%
          </Link>
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono">
            Placement Rate: 94.2%
          </div>
        </div>
      </div>

      {appliedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{appliedMsg}</span>
          </div>
          <button onClick={() => setAppliedMsg(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Candidate Profile Summary Banner */}
      <div className="bg-gradient-to-br from-mcoa-midnight to-mcoa-amethyst rounded-3xl p-6 sm:p-7 text-white shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-mcoa-gold text-mcoa-midnight font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full font-montserrat">
              Verified Candidate
            </span>
            <span className="text-xs text-white/70 font-mono">ID: MCOA-2026-CHN-0082</span>
          </div>
          <h2 className="text-xl font-bold font-montserrat text-white">
            Sneha Ramachandran — Certified Coding Trainee
          </h2>
          <div className="flex flex-wrap gap-2 text-xs text-white/80">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">CPC® Preparation Verified</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Accuracy: 85%</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Attendance: 96%</span>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-[10px] uppercase text-mcoa-gold font-bold">Campus Hiring Status</div>
          <div className="text-base font-extrabold text-white mt-0.5">Active in Round 2</div>
          <div className="text-[11px] text-emerald-300 font-semibold mt-1">Omega Healthcare</div>
        </div>
      </div>

      {/* Active Interview Tracker */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-4">
        <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
            My Active Job Applications & Interview Schedule
          </h3>
          <span className="text-xs text-gray-400 font-mono">1 Application in Progress</span>
        </div>

        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-mcoa-midnight">
                Medical Coder — Outpatient E&M & Surgery
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Technical Interview Scheduled
              </span>
            </div>
            <div className="text-xs text-mcoa-amethyst font-semibold">
              Omega Healthcare Management Services (Chennai / Hybrid)
            </div>
            <p className="text-xs text-gray-600">
              Round 1 Anatomy assessment cleared with 94%. Client technical chart coding interview scheduled.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-center">
            <div className="text-right text-xs">
              <div className="font-bold text-gray-700">Interview Date:</div>
              <div className="font-mono text-mcoa-midnight font-bold">Oct 24, 2026 (2:00 PM IST)</div>
            </div>

            <a
              href="https://teams.microsoft.com/l/meetup-join/omega-interview-sneha"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition shadow-sm flex items-center space-x-1"
            >
              <span>Join Teams</span>
              <ExternalLink className="w-3.5 h-3.5 text-mcoa-gold" />
            </a>
          </div>
        </div>
      </div>

      {/* Corporate Openings Match */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-montserrat font-bold text-base text-mcoa-midnight">
            Matched Corporate Healthcare Openings
          </h3>
          <p className="text-xs text-gray-500">
            Submit your certified academic profile with 1-click. MCOA placement officers coordinate directly with hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job: any) => {
            const isApplied = job.title.includes("Outpatient E&M");
            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-gray-200 bg-gray-50/40 space-y-4 flex flex-col justify-between hover:border-mcoa-amethyst/40 hover:shadow-royal transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {job.vacancies} Seats Open
                    </span>
                    <span className="text-xs font-mono font-bold text-mcoa-midnight">
                      {job.salaryRange}
                    </span>
                  </div>

                  <h4 className="font-montserrat font-bold text-base text-mcoa-midnight leading-snug">
                    {job.title}
                  </h4>

                  <div className="text-xs font-bold text-mcoa-amethyst flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{job.companyName}</span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {job.jobDescription}
                  </p>

                  <div className="text-[11px] text-gray-500 font-mono space-y-1 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-mcoa-amethyst" />
                      <span>{job.location}</span>
                    </div>
                    <div>Required: {job.requiredCertifications}</div>
                  </div>
                </div>

                <div className="pt-2">
                  {isApplied ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center space-x-1 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Application Active</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id, job.companyName)}
                      disabled={applyingJobId === job.id}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center justify-center space-x-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{applyingJobId === job.id ? "Submitting..." : "Apply with MCOA Profile"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
