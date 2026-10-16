"use client";

import { useState, useEffect } from "react";
import { BRANCHES_DATA } from "@/data/branches";
import { COURSES_DATA } from "@/data/courses";
import {
  Calendar,
  Users,
  Plus,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    mode: "Classroom",
    timing: "Weekend (Sat & Sun 10:00 AM - 1:00 PM)",
    startDate: "2026-11-01",
    capacity: "30",
    branchId: "chennai-hq",
    courseId: "advanced-medical-coding",
  });

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/batches");
      const data = await res.json();
      if (data.success) {
        setBatches(data.batches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchBatches();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst font-montserrat">
            Academic Operations
          </span>
          <h1 className="text-2xl font-bold font-montserrat text-mcoa-midnight mt-0.5">
            Cohort Batches & Scheduling
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage physical and virtual training cohorts across Chennai, Perambalur, Coimbatore, and Karaikudi.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-mcoa-gold text-mcoa-midnight hover:bg-[#e0b760] transition flex items-center space-x-1.5 shadow-gold"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Cohort</span>
        </button>
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-mcoa-amethyst" />
          <span className="text-xs text-gray-500">Loading Cohort Batches...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-4 hover:border-mcoa-amethyst/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-mcoa-amethyst bg-mcoa-pearl px-2.5 py-0.5 rounded">
                    {batch.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      batch.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <h3 className="font-montserrat font-bold text-base text-mcoa-midnight mt-3 leading-snug">
                  {batch.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-mcoa-amethyst shrink-0" />
                    <span>Campus: <strong>{batch.branch?.name || "Online"}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-mcoa-gold shrink-0" />
                    <span>Timing: {batch.timing}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Start: {new Date(batch.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>Faculty: <strong>{batch.trainer?.name || "Dr. Rajesh Kannan"}</strong></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Enrolled: <strong>{batch._count?.enrollments || 0} / {batch.capacity}</strong>
                </span>

                <div className="w-20 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-mcoa-amethyst h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((batch._count?.enrollments || 0) / batch.capacity) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Cohort Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-mcoa-midnight hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-mcoa-amethyst">
                Academic Timetable
              </span>
              <h3 className="text-lg font-bold font-montserrat text-mcoa-midnight mt-0.5">
                Schedule New Batch Cohort
              </h3>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs font-inter">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Cohort Batch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coimbatore CPC Weekend Batch Dec 2026"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-mcoa-amethyst"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Batch Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CBE-CPC-DEC26-WE"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-mcoa-amethyst font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Student Capacity</label>
                  <input
                    type="number"
                    required
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-mcoa-amethyst"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Training Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Live Interactive Online">Live Interactive Online</option>
                    <option value="Hybrid Flex">Hybrid Flex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Timing</label>
                  <select
                    value={form.timing}
                    onChange={(e) => setForm({ ...form, timing: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Weekend (Sat & Sun 10:00 AM - 1:00 PM)">Weekend (Sat & Sun 10 AM - 1 PM)</option>
                    <option value="Weekday Regular (Mon - Fri 10 AM - 2 PM)">Weekday Regular (10 AM - 2 PM)</option>
                    <option value="Evening Fast-Track (6:30 PM - 8:30 PM)">Evening Fast-Track (6:30 - 8:30 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Campus</label>
                  <select
                    value={form.branchId}
                    onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                  >
                    {BRANCHES_DATA.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg bg-mcoa-midnight text-white hover:bg-mcoa-amethyst font-semibold flex items-center space-x-1.5"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Cohort...</span>
                    </>
                  ) : (
                    <span>Create Batch Cohort</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
