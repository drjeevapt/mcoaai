"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Calendar,
  Clock,
  Plus,
  Users,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Zoom");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [agenda, setAgenda] = useState("");

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sessions");
      const json = await res.json();
      if (json.success) {
        setSessions(json.sessions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !meetingUrl || !date) {
      alert("Please fill in title, date, and meeting URL");
      return;
    }

    try {
      setSubmitting(true);
      const scheduledStartTime = new Date(`${date}T${startTime}:00`);

      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          platform,
          meetingUrl,
          meetingId,
          passcode,
          scheduledStartTime,
          agenda,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Live Interactive Class Scheduled Successfully!");
        setShowModal(false);
        setTitle("");
        setMeetingUrl("");
        setAgenda("");
        loadSessions();
      } else {
        alert(json.error || "Failed to schedule session");
      }
    } catch (err) {
      console.error(err);
      alert("Error scheduling session");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] font-bold text-mcoa-amethyst uppercase tracking-widest font-montserrat">
            Academic Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-mcoa-midnight font-montserrat">
            Live Interactive Classes & Webinars
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Schedule Zoom and Google Meet lectures, assign faculty, distribute access links, and track student live attendance.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition shadow-gold flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((sess) => {
          const isCompleted = sess.status === "Completed";
          return (
            <div
              key={sess.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 hover:border-mcoa-amethyst/40 hover:shadow-royal transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      sess.platform === "Zoom"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {sess.platform} Meeting
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCompleted
                        ? "bg-gray-100 text-gray-600"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {sess.status}
                  </span>
                </div>

                <h3 className="font-montserrat font-bold text-base text-mcoa-midnight leading-snug">
                  {sess.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {sess.agenda || "Comprehensive medical coding live interactive session with clinical chart reviews."}
                </p>

                <div className="space-y-1.5 text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-mcoa-amethyst" />
                    <span>
                      {new Date(sess.scheduledStartTime).toLocaleDateString("en-IN", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-mcoa-gold" />
                    <span>
                      {new Date(sess.scheduledStartTime).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      IST (Asia/Kolkata)
                    </span>
                  </div>
                  {sess.meetingId && (
                    <div className="text-[11px] text-gray-400">
                      ID: {sess.meetingId} • Passcode: {sess.passcode || "MCOA"}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Users className="w-3.5 h-3.5 text-mcoa-amethyst" />
                  <span>{sess.attendanceCount || 28} Students</span>
                </div>

                <a
                  href={sess.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-midnight text-white hover:bg-mcoa-amethyst transition flex items-center space-x-1"
                >
                  <span>Launch Class</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-montserrat font-bold text-lg text-mcoa-midnight flex items-center space-x-2">
                <Video className="w-5 h-5 text-mcoa-gold" />
                <span>Schedule Live Online Session</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-mcoa-midnight block">Session Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cardiovascular CPT Surgery & NCCI Edits"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:border-mcoa-amethyst"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-mcoa-midnight block">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-semibold"
                  >
                    <option value="Zoom">Zoom Live Stream</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Classroom">Offline Campus Classroom</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-mcoa-midnight block">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-mcoa-midnight block">Meeting URL *</label>
                  <input
                    type="url"
                    required
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://zoom.us/j/8072020716"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-mcoa-midnight block">Start Time (IST)</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-mcoa-midnight block">Session Agenda / Description</label>
                <textarea
                  rows={3}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="Outline key coding principles and topics covered..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-mcoa-gold text-mcoa-midnight font-bold uppercase tracking-wider hover:bg-[#e0b760] transition shadow-gold disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
