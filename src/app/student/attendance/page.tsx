"use client";

import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Video,
  PlayCircle,
  AlertCircle,
  Building2,
} from "lucide-react";

export default function StudentAttendancePage() {
  const sessions = [
    {
      id: "ses-1",
      title: "Module 1: Clinical Terminology & Anatomy Review",
      date: "Sunday, Oct 4, 2026",
      time: "10:00 AM - 01:00 PM",
      trainer: "Dr. Rajesh Kannan, CPC, CCS",
      mode: "Classroom (Chennai HQ) & Live Stream",
      status: "Present",
      recordingAvailable: true,
      recordingUrl: "https://player.vimeo.com/video/76979871",
    },
    {
      id: "ses-2",
      title: "Module 2: ICD-10-CM Official Coding Conventions & Neoplasms",
      date: "Sunday, Oct 11, 2026",
      time: "10:00 AM - 01:00 PM",
      trainer: "Dr. Rajesh Kannan, CPC, CCS",
      mode: "Classroom (Chennai HQ) & Live Stream",
      status: "Present",
      recordingAvailable: true,
      recordingUrl: "https://player.vimeo.com/video/76979871",
    },
    {
      id: "ses-3",
      title: "Module 2: Circulatory, Respiratory & Endocrine Manifestations",
      date: "Sunday, Oct 18, 2026",
      time: "10:00 AM - 01:00 PM",
      trainer: "Dr. Rajesh Kannan, CPC, CCS",
      mode: "Classroom (Chennai HQ) & Live Stream",
      status: "Scheduled",
      recordingAvailable: false,
      meetUrl: "https://meet.google.com/mcoa-amc-class",
    },
    {
      id: "ses-4",
      title: "Module 3: CPT Introduction & Surgical Integumentary Coding",
      date: "Sunday, Oct 25, 2026",
      time: "10:00 AM - 01:00 PM",
      trainer: "Dr. Rajesh Kannan, CPC, CCS",
      mode: "Classroom (Chennai HQ) & Live Stream",
      status: "Scheduled",
      recordingAvailable: false,
    },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
            Academic Attendance & Timetable
          </span>
          <h1 className="text-2xl font-bold font-montserrat text-mcoa-midnight mt-0.5">
            Class Attendance & Live Timetable
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Batch: <strong>CHN-AMC-OCT26-WE</strong> • Chennai Head Office Weekend Cohort
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl text-center min-w-[160px]">
          <span className="text-[10px] uppercase font-bold text-emerald-800">Attendance Rate</span>
          <div className="text-2xl font-extrabold font-montserrat text-emerald-950">100%</div>
          <span className="text-[10px] text-emerald-700">Placement Eligible (Req: &gt;85%)</span>
        </div>
      </div>

      {/* Session Timetable List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-montserrat text-mcoa-midnight">
          Cohort Sessions Schedule
        </h2>

        {sessions.map((ses) => (
          <div
            key={ses.id}
            className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-mcoa-amethyst/50 transition"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    ses.status === "Present"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {ses.status}
                </span>
                <span className="text-xs text-gray-500 font-medium">{ses.date}</span>
              </div>

              <h3 className="font-montserrat font-bold text-sm text-mcoa-midnight">
                {ses.title}
              </h3>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-mcoa-amethyst" />
                  <span>{ses.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-mcoa-gold" />
                  <span>{ses.mode}</span>
                </div>
                <div>Faculty: <strong>{ses.trainer}</strong></div>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {ses.status === "Scheduled" && ses.meetUrl ? (
                <a
                  href={ses.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition flex items-center space-x-2 shadow-sm"
                >
                  <Video className="w-3.5 h-3.5 text-mcoa-gold" />
                  <span>Join Live Stream</span>
                </a>
              ) : ses.recordingAvailable ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Opening past session recording player...");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-mcoa-amethyst text-mcoa-amethyst hover:bg-mcoa-pearl transition flex items-center space-x-1.5"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Watch Recording</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400">Class In Session Soon</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Policy Notice */}
      <div className="bg-mcoa-pearl/50 rounded-2xl p-5 border border-mcoa-lavender/40 text-xs text-gray-700 space-y-1.5 leading-relaxed">
        <div className="font-bold font-montserrat text-mcoa-midnight flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 text-mcoa-gold" />
          <span>MCOA Mandatory Academic Attendance Policy</span>
        </div>
        <p>
          Students must maintain at least <strong>85% attendance</strong> across live classroom/online lectures and complete all chart reviews to qualify for verified AAPC CPC® examination voucher assistance and academy recruitment drives with our healthcare IT hiring partners.
        </p>
      </div>
    </div>
  );
}
